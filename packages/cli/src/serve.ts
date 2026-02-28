import { createServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Use createRequire anchored to the CLI package root to resolve workspace packages
const cliRequire = createRequire(resolve(__dirname, '..', 'package.json'))

export interface ServeResult {
  url: string
  server: ViteDevServer
  cleanup: () => Promise<void>
}

export async function serveForm(
  formFilePath: string,
  data: Record<string, string> = {},
  logLevel: 'silent' | 'info' | 'warn' | 'error' = 'silent'
): Promise<ServeResult> {
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

  // Write temporary React entry that imports the user's form.
  // Note: StrictMode is intentionally omitted here because it double-invokes effects
  // in development, which would cause duplicate field/page registrations in the registry.
  writeFileSync(
    resolve(tmpDir, 'entry.tsx'),
    `import { createRoot } from 'react-dom/client'
import FormComponent from '${formAbsPath}'

window.__formData = ${JSON.stringify(data)}
createRoot(document.getElementById('root')!).render(<FormComponent />)
`
  )

  // Resolve key packages via the CLI's node_modules so Vite can find them
  // even though the temp dir has no node_modules of its own.
  // corePackageMain = .../packages/core/dist/index.js (React is external in this build)
  const corePackageMain = cliRequire.resolve('@pdf-form/core')

  // Resolve React from the workspace root so that all packages (core, react-hook-form, etc.)
  // share the exact same physical React files — preventing duplicate-React hook errors.
  const rootRequire = createRequire(resolve(process.cwd(), 'package.json'))
  const reactMain = rootRequire.resolve('react')
  const reactDomMain = rootRequire.resolve('react-dom')
  const reactJsxRuntime = rootRequire.resolve('react/jsx-runtime')
  const reactJsxDevRuntime = rootRequire.resolve('react/jsx-dev-runtime')

  const cliNodeModules = resolve(__dirname, '..', 'node_modules')
  const rootNodeModules = resolve(process.cwd(), 'node_modules')

  const server = await createServer({
    root: tmpDir,
    plugins: [react()],
    server: {
      port: 0,
      strictPort: false,
      host: '::',
      // Allow Vite to serve files from the form's directory and node_modules
      fs: {
        allow: [
          tmpDir,
          resolve(process.cwd()),
          cliNodeModules,
          rootNodeModules,
          resolve(dirname(reactMain), '..'),
        ],
        strict: false,
      },
    },
    logLevel,
    resolve: {
      // Explicit aliases so Vite can find all required packages from temp dir
      alias: [
        { find: '@pdf-form/core', replacement: corePackageMain },
        { find: 'react/jsx-runtime', replacement: reactJsxRuntime },
        { find: 'react/jsx-dev-runtime', replacement: reactJsxDevRuntime },
        { find: 'react-dom/client', replacement: resolve(dirname(reactDomMain), 'client.js') },
        { find: 'react-dom', replacement: reactDomMain },
        { find: 'react', replacement: reactMain },
      ],
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      // Bundle all CJS deps together in one esbuild pass so they share one
      // React instance. Splitting them into separate passes (e.g. exclude
      // react-hook-form) causes esbuild to inline React into each chunk.
      include: ['react', 'react-dom', 'react-dom/client', 'react-hook-form'],
      // Don't crawl the whole monorepo — only scan our temp entry
      entries: [resolve(tmpDir, 'entry.tsx')],
    },
    // Persist dep cache to a stable location so subsequent starts are fast
    cacheDir: resolve(__dirname, '..', 'node_modules', '.vite-dev-cache'),
  })

  await server.listen()
  const addressInfo = server.httpServer?.address()
  if (!addressInfo || typeof addressInfo === 'string') {
    throw new Error('Failed to get server port')
  }

  const url = `http://localhost:${addressInfo.port}`
  const cleanup = async () => {
    await server.close()
    rmSync(tmpDir, { recursive: true, force: true })
  }

  return { url, server, cleanup }
}
