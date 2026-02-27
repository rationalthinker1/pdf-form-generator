import { createServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'

export interface ServeResult {
  url: string
  server: ViteDevServer
  cleanup: () => Promise<void>
}

export async function serveForm(formFilePath: string): Promise<ServeResult> {
  const formAbsPath = resolve(process.cwd(), formFilePath)
  const tmpDir = resolve(tmpdir(), `pdf-form-${randomBytes(4).toString('hex')}`)
  mkdirSync(tmpDir, { recursive: true })

  // Write temporary entry HTML
  writeFileSync(
    resolve(tmpDir, 'index.html'),
    `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <div id="root"></div>
    <script type="module" src="/entry.tsx"></script>
  </body>
</html>`
  )

  // Write temporary React entry that imports the user's form
  writeFileSync(
    resolve(tmpDir, 'entry.tsx'),
    `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FormComponent from '${formAbsPath}'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FormComponent />
  </StrictMode>
)
`
  )

  const server = await createServer({
    root: tmpDir,
    plugins: [react()],
    server: { port: 0, strictPort: false },
    logLevel: 'silent',
  })

  await server.listen()
  const addressInfo = server.httpServer?.address()
  if (!addressInfo || typeof addressInfo === 'string') {
    throw new Error('Failed to get server port')
  }

  const url = `http://localhost:${addressInfo.port}`
  const cleanup = async () => { await server.close() }

  return { url, server, cleanup }
}
