# Dev Server Design

## Goal

Add a `bun dev <form.tsx>` command that starts a live-preview Vite server so
developers can design forms in the browser with hot reload.

## Invocation

```bash
bun dev examples/hvac-contract/form.tsx
bun dev examples/hvac-contract/form.tsx '{"customerName":"John Doe"}'
```

Data JSON is optional — defaults to `{}` (blank fields).

## Changes

### 1. Root `package.json`

Add:

```json
"dev": "generate-pdf dev"
```

`bun dev <form> [data]` forwards all args to the CLI's `dev` subcommand.

### 2. `packages/cli/src/index.ts`

Detect `dev` as the first positional arg and route to the dev handler before
the existing generate flow.

### 3. `packages/cli/src/dev.ts` (new, ~30 lines)

- Calls existing `serveForm(formFile, data)` from `serve.ts`
- Opens the browser at the returned URL (same platform opener as `--open`)
- Prints server URL and form path to stdout
- Blocks with `await new Promise(() => {})` until Ctrl+C

Vite HMR is already enabled by `serve.ts` — no extra wiring needed. Vite's
error overlay handles compile errors in-browser.

## Terminal Output

```
  Dev server: http://localhost:5173
  Watching: examples/hvac-contract/form.tsx

  Press Ctrl+C to stop.
```

## Non-Goals

- No visual drag-and-drop editor
- No rulers, grid, or field inspector
- No new packages
