#!/usr/bin/env node
import { resolve } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { serveForm } from './serve'
import { measureForm } from './measure'
import { generatePdf } from './generate'
import { runDev } from './dev'

function parseArgs(argv: string[]) {
  const args = argv.slice(2)

  // Find positional args (not flags, not flag values)
  const positional: string[] = []
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' || args[i] === '--output') {
      i++ // skip next (it's the output value)
    } else if (!args[i].startsWith('-')) {
      positional.push(args[i])
    }
  }

  const formFile = positional[0]
  const dataArg = positional[1]

  const outputIdx = args.findIndex(a => a === '-o' || a === '--output')
  const output = outputIdx !== -1 ? args[outputIdx + 1] : './output.pdf'
  const open = args.includes('--open')

  return { formFile, dataArg, output, open }
}

function parseData(dataArg?: string): Record<string, string> {
  if (!dataArg) return {}
  if (dataArg.startsWith('@')) {
    const filePath = resolve(process.cwd(), dataArg.slice(1))
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  }
  return JSON.parse(dataArg)
}

async function main() {
  const { formFile, dataArg, output, open } = parseArgs(process.argv)

  // Dev subcommand: generate-pdf dev <form.tsx> [data]
  if (formFile === 'dev') {
    const args = process.argv.slice(3) // everything after "dev"
    const devFormFile = args.find(a => !a.startsWith('{') && !a.startsWith('@') && !a.startsWith('-'))
    const devDataArg = args.find(a => a.startsWith('{') || a.startsWith('@'))
    if (!devFormFile) {
      console.error('Usage: generate-pdf dev <form.tsx> [data]')
      process.exit(1)
    }
    const devData = parseData(devDataArg)
    await runDev(devFormFile, devData)
    return
  }

  if (!formFile) {
    console.error('Usage: generate-pdf <form.tsx> [data] [-o output.pdf] [--open]')
    process.exit(1)
  }

  if (!formFile.endsWith('.tsx') && !formFile.endsWith('.jsx')) {
    console.error('Error: Form file must be a .tsx or .jsx file')
    process.exit(1)
  }

  const data = parseData(dataArg)

  console.log(`Generating PDF from ${formFile}...`)

  const { url, cleanup } = await serveForm(formFile)

  try {
    console.log('Measuring fields via Playwright...')
    const extracted = await measureForm(url, data)

    const totalFields = extracted.pages.reduce((n, p) => n + p.fields.length, 0)
    console.log(`Found ${totalFields} field(s) across ${extracted.pages.length} page(s)`)

    console.log('Generating AcroForm PDF...')
    const pdfBytes = await generatePdf(extracted.pages, data)

    const outputPath = resolve(process.cwd(), output)
    writeFileSync(outputPath, pdfBytes)
    console.log(`PDF saved to ${outputPath}`)

    if (open) {
      const { execSync } = await import('child_process')
      const opener =
        process.platform === 'darwin' ? 'open' :
        process.platform === 'win32' ? 'start' :
        'xdg-open'
      execSync(`${opener} "${outputPath}"`)
    }
  } finally {
    await cleanup()
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
