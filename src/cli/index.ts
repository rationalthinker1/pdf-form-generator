#!/usr/bin/env node
import { resolve, dirname } from 'path'
import { writeFileSync, readFileSync, rmSync } from 'fs'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import { createServer, createConnection } from 'net'
import { measureForm } from './measure'
import { generatePdf } from './generate'
import { runDev } from './dev'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const viteBin = resolve(repoRoot, 'node_modules', '.bin', 'vite')

function getFreePort(): Promise<number> {
  return new Promise((res, rej) => {
    const srv = createServer()
    srv.listen(0, '127.0.0.1', () => {
      const port = (srv.address() as { port: number }).port
      srv.close(() => res(port))
    })
    srv.on('error', rej)
  })
}

function waitForPort(port: number, timeoutMs = 20000): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs
    const attempt = () => {
      const sock = createConnection({ port, host: '127.0.0.1' })
      sock.on('connect', () => { sock.destroy(); resolve() })
      sock.on('error', () => {
        if (Date.now() > deadline) reject(new Error(`Timeout waiting for port ${port}`))
        else setTimeout(attempt, 250)
      })
    }
    attempt()
  })
}

async function spawnVite(formFilePath: string): Promise<{ url: string; cleanup: () => void }> {
  const formAbsPath = resolve(process.cwd(), formFilePath)
  const entryFile = resolve(repoRoot, '__dev_entry__.tsx')

  writeFileSync(
    entryFile,
    `import { createRoot } from 'react-dom/client'
import FormComponent from '${formAbsPath}'
createRoot(document.getElementById('root')!).render(<FormComponent />)
`
  )

  const port = await getFreePort()

  const proc = spawn(
    viteBin,
    ['--port', String(port), '--host', '::'],
    {
      cwd: repoRoot,
      stdio: 'ignore',
      env: { ...process.env, VITE_ENTRY: '/__dev_entry__.tsx' },
    }
  )

  await waitForPort(port)

  const cleanup = () => {
    proc.kill('SIGTERM')
    rmSync(entryFile, { force: true })
  }

  return { url: `http://localhost:${port}`, cleanup }
}

function parseArgs(argv: string[]) {
  const args = argv.slice(2)

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

  // Dev subcommand: generate-pdf dev <form.tsx>
  if (formFile === 'dev') {
    const args = process.argv.slice(3)
    const devFormFile = args.find(a => !a.startsWith('{') && !a.startsWith('@') && !a.startsWith('-'))
    if (!devFormFile) {
      console.error('Usage: generate-pdf dev <form.tsx>')
      process.exit(1)
    }
    try {
      await runDev(devFormFile)
    } catch (err) {
      if ((err as Error).message === 'Interrupted') process.exit(0)
      throw err
    }
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

  const { url, cleanup } = await spawnVite(formFile)

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
    cleanup()
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
