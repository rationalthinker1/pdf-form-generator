import { resolve } from 'path'
import { serveForm } from './serve'

export async function runDev(formFilePath: string, data: Record<string, string>): Promise<void> {
  const absPath = resolve(process.cwd(), formFilePath)
  console.log(`  Dev server starting...`)

  const { url, cleanup } = await serveForm(formFilePath, data)

  console.log(`\n  Dev server: ${url}`)
  console.log(`  Watching:   ${absPath}\n`)
  console.log(`  Press Ctrl+C to stop.\n`)

  // Open browser
  const { execSync } = await import('child_process')
  const opener =
    process.platform === 'darwin' ? 'open' :
    process.platform === 'win32' ? 'start' :
    'xdg-open'
  try {
    execSync(`${opener} "${url}"`)
  } catch {
    // Non-fatal — browser open is best-effort
  }

  // Block until Ctrl+C
  await new Promise<void>((_resolve, reject) => {
    process.on('SIGINT', async () => {
      await cleanup()
      reject(new Error('Interrupted'))
    })
  })
}
