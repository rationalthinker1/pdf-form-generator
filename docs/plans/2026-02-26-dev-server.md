# Dev Server Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `bun dev examples/hvac-contract/form.tsx` — a live-preview Vite dev server with hot reload that opens the browser automatically.

**Architecture:** Add a `dev` subcommand to the existing CLI. It reuses `serveForm()` from `serve.ts`, injects optional form data into `entry.tsx`, opens the browser, then blocks until Ctrl+C. Three files change; one new file is created.

**Tech Stack:** Bun, TypeScript, Vite (already used by CLI), Node `child_process` (already used for `--open`)

---

### Task 1: Add optional `data` param to `serveForm()`

`serveForm()` currently writes `entry.tsx` without any data injection. For dev mode, form data should be pre-filled in the browser by setting `window.__formData` before React renders.

**Files:**
- Modify: `packages/cli/src/serve.ts`

**Step 1: Open `packages/cli/src/serve.ts` and read the current signature**

Current: `export async function serveForm(formFilePath: string): Promise<ServeResult>`

**Step 2: Add the optional `data` parameter and inject into `entry.tsx`**

Change line 22 signature to:
```ts
export async function serveForm(
  formFilePath: string,
  data: Record<string, string> = {}
): Promise<ServeResult>
```

Then update the `entry.tsx` template (lines 44–49) to inject `window.__formData` before the React render. Replace the `writeFileSync` for `entry.tsx` with:

```ts
  writeFileSync(
    resolve(tmpDir, 'entry.tsx'),
    `window.__formData = ${JSON.stringify(data)}
import { createRoot } from 'react-dom/client'
import FormComponent from '${formAbsPath}'

createRoot(document.getElementById('root')!).render(<FormComponent />)
`
  )
```

Note: the `window.__formData` assignment must be at the top of the file, before any imports, so it is set synchronously before React renders. In a `type="module"` script, top-level statements run before module evaluation in most bundlers — Vite handles this correctly.

**Step 3: Verify the existing generate flow still works**

The call in `index.ts` line 57 is `serveForm(formFile)` — this still compiles because `data` defaults to `{}`. No change needed there (though Playwright will still override `window.__formData` via `addInitScript` before the form loads, so the injected value is a safe fallback).

**Step 4: Commit**

```bash
git add packages/cli/src/serve.ts
git commit -m "feat(cli): inject form data into entry.tsx via serveForm param"
```

---

### Task 2: Create `packages/cli/src/dev.ts`

This module contains the `runDev()` function called when the user runs `generate-pdf dev <form> [data]`.

**Files:**
- Create: `packages/cli/src/dev.ts`

**Step 1: Create the file**

```ts
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
```

**Step 2: Verify it compiles**

```bash
cd packages/cli && bun build src/index.ts --target node --outdir dist 2>&1 | head -20
```

Expected: no TypeScript errors.

**Step 3: Commit**

```bash
git add packages/cli/src/dev.ts
git commit -m "feat(cli): add runDev for live-preview dev server"
```

---

### Task 3: Route `dev` subcommand in `index.ts`

**Files:**
- Modify: `packages/cli/src/index.ts`

**Step 1: Add the import at the top (after existing imports)**

```ts
import { runDev } from './dev'
```

**Step 2: Add dev routing at the start of `main()`, before the existing `formFile` check**

Insert after line 41 (`const { formFile, dataArg, output, open } = parseArgs(process.argv)`):

```ts
  // Dev subcommand: generate-pdf dev <form.tsx> [data]
  if (formFile === 'dev') {
    const devForm = parseArgs(['', '', ...process.argv.slice(3)]).formFile
    const devData = parseData(parseArgs(['', '', ...process.argv.slice(3)]).dataArg)
    if (!devForm) {
      console.error('Usage: generate-pdf dev <form.tsx> [data]')
      process.exit(1)
    }
    await runDev(devForm, devData)
    return
  }
```

Wait — this re-parses argv awkwardly. Instead, parse more cleanly. Replace the above with a simpler approach that reads `process.argv` directly for the dev case:

```ts
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
```

**Step 3: Build to verify no errors**

```bash
cd packages/cli && bun build src/index.ts --target node --outdir dist 2>&1 | head -20
```

Expected: clean build, `dist/index.js` updated.

**Step 4: Smoke-test manually**

```bash
bun packages/cli/dist/index.js dev examples/hvac-contract/form.tsx
```

Expected: browser opens showing the HVAC contract form. Editing `examples/hvac-contract/form.tsx` hot-reloads the browser. Ctrl+C stops the server.

**Step 5: Commit**

```bash
git add packages/cli/src/index.ts
git commit -m "feat(cli): route dev subcommand to runDev"
```

---

### Task 4: Add `dev` script to root `package.json`

**Files:**
- Modify: `package.json` (root)

**Step 1: Add the script**

In `package.json` scripts, add:

```json
"dev": "generate-pdf dev"
```

So the full scripts block becomes:

```json
"scripts": {
  "build": "bun run --filter '*' build",
  "test": "bun test",
  "lint": "eslint .",
  "format": "prettier --write .",
  "dev": "generate-pdf dev"
}
```

**Step 2: Smoke-test end-to-end**

```bash
bun dev examples/hvac-contract/form.tsx
bun dev examples/hvac-contract/form.tsx '{"customerName":"John Doe"}'
```

Expected: browser opens at `http://localhost:<port>`, form renders. Second invocation pre-fills customerName field.

**Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add bun dev script for live form preview"
```
