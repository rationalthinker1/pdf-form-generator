import { resolve, dirname } from 'path'
import { writeFileSync, rmSync } from 'fs'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import { createServer, createConnection } from 'net'

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

export async function runDev(formFilePath: string): Promise<void> {
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
      stdio: 'inherit',
      env: { ...process.env, VITE_ENTRY: '/__dev_entry__.tsx' },
    }
  )

  await waitForPort(port)

  const url = `http://localhost:${port}`
  console.log(`\n  Local:   ${url}`)
  console.log(`  Watching: ${formAbsPath}\n`)
  console.log(`  Press Ctrl+C to stop.\n`)

  // Try to open in browser (best-effort)
  try {
    const { execSync } = await import('child_process')
    const opener =
      process.platform === 'darwin' ? 'open' :
      process.platform === 'win32' ? 'start' :
      'xdg-open'
    execSync(`${opener} "${url}"`)
  } catch {
    // Non-fatal
  }

  // Block until Ctrl+C
  await new Promise<void>((_res, reject) => {
    process.once('SIGINT', () => {
      proc.kill('SIGTERM')
      rmSync(entryFile, { force: true })
      reject(new Error('Interrupted'))
    })
  })
}
