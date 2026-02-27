# PDF Form Generator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a monorepo with two published packages — `@pdf-form/core` (React components) and `@pdf-form/cli` (CLI tool) — that together generate real interactive AcroForm PDF files from declarative React form definitions.

**Architecture:** Developer writes a `form.tsx` using `<Pdf.Document>`, `<Pdf.Page>`, and `<Pdf.TextField>` components. The CLI starts a Vite dev server, opens the form in Playwright's headless Chromium, extracts each field's DOM position via `getBoundingClientRect()`, converts px → PDF points (with Y-axis flip), then drives pdf-lib to create AcroForm fields in a real PDF.

**Tech Stack:** Bun (runtime + package manager), TypeScript, React 18, Vite, Playwright (Chromium), pdf-lib, Tailwind CSS, ESLint (typescript-eslint + eslint-plugin-react), Prettier (+ prettier-plugin-tailwindcss), bun test.

---

## Task 1: Monorepo Root Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `prettier.config.ts`
- Create: `eslint.config.ts`
- Create: `.gitignore`

**Step 1: Initialize bun workspace**

```bash
cd /home/raza/Projects/pdf-form-generator
bun init -y
```

**Step 2: Replace `package.json` with workspace config**

```json
{
  "name": "pdf-form-generator",
  "private": true,
  "workspaces": ["packages/*", "examples/*"],
  "scripts": {
    "build": "bun run --filter '*' build",
    "test": "bun test",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    "typescript": "^5.7.0"
  }
}
```

**Step 3: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**Step 4: Create `prettier.config.ts`**

```ts
import type { Config } from 'prettier'

const config: Config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
```

**Step 5: Create `eslint.config.ts`**

```ts
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
```

**Step 6: Create `.gitignore`**

```
node_modules/
dist/
.vite/
*.pdf
bun.lockb
```

**Step 7: Install root dependencies**

```bash
bun install
```

**Step 8: Commit**

```bash
git init
git add package.json tsconfig.base.json prettier.config.ts eslint.config.ts .gitignore
git commit -m "chore: initialize bun monorepo with eslint and prettier"
```

---

## Task 2: Core Package Scaffold

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/types.ts`

**Step 1: Create directory**

```bash
mkdir -p packages/core/src/components packages/core/src/context
```

**Step 2: Create `packages/core/package.json`**

```json
{
  "name": "@pdf-form/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "bun build ./src/index.ts --outdir ./dist --target browser",
    "test": "bun test"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "react": "^18.3.0",
    "tailwindcss": "^3.4.0"
  }
}
```

**Step 3: Create `packages/core/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

**Step 4: Create `packages/core/src/types.ts`**

```ts
export type PageSize = 'letter' | 'a4'

export type FieldType = 'text' | 'textarea' | 'checkbox' | 'dropdown'

export interface PageDimensions {
  widthPx: number
  heightPx: number
  widthPt: number
  heightPt: number
}

export const PAGE_SIZES: Record<PageSize, PageDimensions> = {
  letter: { widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792 },
  a4:     { widthPx: 794, heightPx: 1123, widthPt: 595, heightPt: 842 },
}

export interface FieldRegistration {
  name: string
  type: FieldType
  ref: React.RefObject<HTMLDivElement>
  defaultValue?: string
}

export interface PageRegistration {
  pageIndex: number
  size: PageSize
  ref: React.RefObject<HTMLDivElement>
}

export interface ExtractedField {
  name: string
  type: FieldType
  pageIndex: number
  x: number
  y: number
  width: number
  height: number
  defaultValue?: string
}

export interface ExtractedPage {
  widthPx: number
  heightPx: number
  widthPt: number
  heightPt: number
  fields: ExtractedField[]
}

export interface ExtractedData {
  pages: ExtractedPage[]
}
```

**Step 5: Commit**

```bash
git add packages/core/
git commit -m "chore: scaffold @pdf-form/core package"
```

---

## Task 3: DocumentContext (Field Registry)

**Files:**
- Create: `packages/core/src/context/DocumentContext.tsx`
- Create: `packages/core/src/context/DocumentContext.test.ts`

**Step 1: Write the failing test**

```ts
// packages/core/src/context/DocumentContext.test.ts
import { describe, it, expect } from 'bun:test'
import { createRef } from 'react'
import { createFieldRegistry } from './DocumentContext'

describe('createFieldRegistry', () => {
  it('registers a field', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerField({ name: 'firstName', type: 'text', ref })
    expect(registry.getFields()).toHaveLength(1)
    expect(registry.getFields()[0].name).toBe('firstName')
  })

  it('throws on duplicate field name', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerField({ name: 'firstName', type: 'text', ref })
    expect(() =>
      registry.registerField({ name: 'firstName', type: 'text', ref })
    ).toThrow('Duplicate field name "firstName"')
  })

  it('unregisters a field', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerField({ name: 'firstName', type: 'text', ref })
    registry.unregisterField('firstName')
    expect(registry.getFields()).toHaveLength(0)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && bun test src/context/DocumentContext.test.ts
```

Expected: FAIL — `createFieldRegistry is not defined`

**Step 3: Implement `DocumentContext.tsx`**

```tsx
// packages/core/src/context/DocumentContext.tsx
import { createContext, useContext } from 'react'
import type { FieldRegistration, PageRegistration } from '../types'

// --- Registry factory (pure, testable) ---

export interface FieldRegistry {
  registerField: (field: FieldRegistration) => void
  unregisterField: (name: string) => void
  getFields: () => FieldRegistration[]
  registerPage: (page: PageRegistration) => void
  getPages: () => PageRegistration[]
}

export function createFieldRegistry(): FieldRegistry {
  const fields: FieldRegistration[] = []
  const pages: PageRegistration[] = []

  return {
    registerField(field) {
      const existing = fields.find(f => f.name === field.name)
      if (existing) throw new Error(`Duplicate field name "${field.name}"`)
      fields.push(field)
    },
    unregisterField(name) {
      const idx = fields.findIndex(f => f.name === name)
      if (idx !== -1) fields.splice(idx, 1)
    },
    getFields: () => fields,
    registerPage: (page) => pages.push(page),
    getPages: () => pages,
  }
}

// --- React context ---

const DocumentContext = createContext<FieldRegistry | null>(null)

export function useDocumentContext(): FieldRegistry {
  const ctx = useContext(DocumentContext)
  if (!ctx) throw new Error('useDocumentContext must be used inside <Pdf.Document>')
  return ctx
}

export { DocumentContext }
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && bun test src/context/DocumentContext.test.ts
```

Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add packages/core/src/context/
git commit -m "feat(core): add field registry with DocumentContext"
```

---

## Task 4: `<Document>` Component

**Files:**
- Create: `packages/core/src/components/Document.tsx`
- Create: `packages/core/src/components/Document.test.tsx`

**Step 1: Write the failing test**

```tsx
// packages/core/src/components/Document.test.tsx
import { describe, it, expect } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { Document } from './Document'

describe('Document', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      createElement(Document, null, createElement('div', { id: 'child' }))
    )
    expect(html).toContain('id="child"')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && bun test src/components/Document.test.tsx
```

Expected: FAIL — `Document is not defined`

**Step 3: Implement `Document.tsx`**

```tsx
// packages/core/src/components/Document.tsx
import { useEffect, useRef, useMemo } from 'react'
import { DocumentContext, createFieldRegistry } from '../context/DocumentContext'
import type { ExtractedData } from '../types'
import { PAGE_SIZES } from '../types'

declare global {
  interface Window {
    __ready: boolean
    __extractFieldData: () => ExtractedData
    __formData: Record<string, string>
  }
}

interface DocumentProps {
  children: React.ReactNode
}

export function Document({ children }: DocumentProps) {
  const registry = useMemo(() => createFieldRegistry(), [])
  const mountedRef = useRef(false)

  useEffect(() => {
    // Expose extraction function for CLI/Playwright
    window.__extractFieldData = (): ExtractedData => {
      const pages = registry.getPages()
      const fields = registry.getFields()

      return {
        pages: pages.map((page, pageIndex) => {
          const pageEl = page.ref.current
          if (!pageEl) throw new Error(`Page ${pageIndex} ref not attached`)
          const pageRect = pageEl.getBoundingClientRect()
          const dims = PAGE_SIZES[page.size]

          return {
            ...dims,
            fields: fields
              .filter(f => {
                const el = f.ref.current
                if (!el) return false
                const rect = el.getBoundingClientRect()
                // field is on this page if it overlaps the page container
                return (
                  rect.top >= pageRect.top - 1 &&
                  rect.bottom <= pageRect.bottom + 1
                )
              })
              .map(f => {
                const el = f.ref.current!
                const rect = el.getBoundingClientRect()
                return {
                  name: f.name,
                  type: f.type,
                  pageIndex,
                  x: rect.left - pageRect.left,
                  y: rect.top - pageRect.top,
                  width: rect.width,
                  height: rect.height,
                  defaultValue: f.defaultValue ?? window.__formData?.[f.name],
                }
              }),
          }
        }),
      }
    }

    window.__ready = true
    mountedRef.current = true
  }, [registry])

  return (
    <DocumentContext.Provider value={registry}>
      <div className="flex flex-col items-center gap-8 bg-gray-100 p-8">
        {children}
      </div>
    </DocumentContext.Provider>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && bun test src/components/Document.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/components/Document.tsx packages/core/src/components/Document.test.tsx
git commit -m "feat(core): add Document component with field extraction"
```

---

## Task 5: `<Page>` Component

**Files:**
- Create: `packages/core/src/components/Page.tsx`
- Create: `packages/core/src/components/Page.test.tsx`

**Step 1: Write the failing test**

```tsx
// packages/core/src/components/Page.test.tsx
import { describe, it, expect } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { Page } from './Page'

// We test the rendered dimensions directly via data attributes
describe('Page', () => {
  it('renders with letter dimensions data attribute', () => {
    const html = renderToStaticMarkup(
      createElement(Page, { size: 'letter' }, null)
    )
    expect(html).toContain('data-size="letter"')
  })

  it('renders with a4 dimensions data attribute', () => {
    const html = renderToStaticMarkup(
      createElement(Page, { size: 'a4' }, null)
    )
    expect(html).toContain('data-size="a4"')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && bun test src/components/Page.test.tsx
```

Expected: FAIL — `Page is not defined`

**Step 3: Implement `Page.tsx`**

```tsx
// packages/core/src/components/Page.tsx
import { useRef, useEffect } from 'react'
import { useDocumentContext } from '../context/DocumentContext'
import { PAGE_SIZES } from '../types'
import type { PageSize } from '../types'

interface PageProps {
  size?: PageSize
  children?: React.ReactNode
}

export function Page({ size = 'letter', children }: PageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { registerPage, getPages } = useDocumentContext()
  const dims = PAGE_SIZES[size]

  useEffect(() => {
    const pageIndex = getPages().length
    registerPage({ pageIndex, size, ref })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      data-size={size}
      className="relative bg-white shadow-lg"
      style={{
        width: dims.widthPx,
        height: dims.heightPx,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && bun test src/components/Page.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/components/Page.tsx packages/core/src/components/Page.test.tsx
git commit -m "feat(core): add Page component with locked layout container"
```

---

## Task 6: `<TextField>` Component

**Files:**
- Create: `packages/core/src/components/TextField.tsx`
- Create: `packages/core/src/components/TextField.test.tsx`

**Step 1: Write the failing test**

```tsx
// packages/core/src/components/TextField.test.tsx
import { describe, it, expect } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { TextField } from './TextField'

// TextField must render a data-field-name attribute for identification
describe('TextField', () => {
  it('renders with data-field-name attribute', () => {
    const html = renderToStaticMarkup(
      createElement(TextField, { name: 'firstName', label: 'First Name' })
    )
    expect(html).toContain('data-field-name="firstName"')
  })

  it('renders default value when provided', () => {
    const html = renderToStaticMarkup(
      createElement(TextField, { name: 'city', defaultValue: 'Austin' })
    )
    expect(html).toContain('Austin')
  })

  it('renders label as placeholder when no default value', () => {
    const html = renderToStaticMarkup(
      createElement(TextField, { name: 'city', label: 'City' })
    )
    expect(html).toContain('City')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/core && bun test src/components/TextField.test.tsx
```

Expected: FAIL — `TextField is not defined`

**Step 3: Implement `TextField.tsx`**

```tsx
// packages/core/src/components/TextField.tsx
import { useRef, useEffect } from 'react'
import { useDocumentContext } from '../context/DocumentContext'

interface TextFieldProps {
  name: string
  label?: string
  defaultValue?: string
}

export function TextField({ name, label, defaultValue }: TextFieldProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { registerField, unregisterField } = useDocumentContext()

  useEffect(() => {
    registerField({ name, type: 'text', ref, defaultValue })
    return () => unregisterField(name)
  }, [name, defaultValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      data-field-name={name}
      data-field-type="text"
      className="min-h-[24px] border border-gray-400 bg-white px-2 py-1 text-sm text-gray-800"
    >
      {defaultValue ?? (
        <span className="text-gray-400 italic">{label ?? name}</span>
      )}
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/core && bun test src/components/TextField.test.tsx
```

Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add packages/core/src/components/TextField.tsx packages/core/src/components/TextField.test.tsx
git commit -m "feat(core): add TextField component"
```

---

## Task 7: Core Package Exports

**Files:**
- Create: `packages/core/src/components/index.ts`
- Create: `packages/core/src/index.ts`

**Step 1: Create `packages/core/src/components/index.ts`**

```ts
export { Document } from './Document'
export { Page } from './Page'
export { TextField } from './TextField'
```

**Step 2: Create `packages/core/src/index.ts`**

```ts
export type {
  PageSize,
  FieldType,
  PageDimensions,
  ExtractedField,
  ExtractedPage,
  ExtractedData,
} from './types'

export { PAGE_SIZES } from './types'
export { useDocumentContext } from './context/DocumentContext'

import { Document } from './components/Document'
import { Page } from './components/Page'
import { TextField } from './components/TextField'

export const Pdf = {
  Document,
  Page,
  TextField,
} as const
```

**Step 3: Build core package**

```bash
cd packages/core && bun run build
```

Expected: `dist/` created with `index.js` and `index.d.ts`

**Step 4: Commit**

```bash
git add packages/core/src/components/index.ts packages/core/src/index.ts packages/core/dist/
git commit -m "feat(core): export Pdf namespace from @pdf-form/core"
```

---

## Task 8: CLI Package Scaffold

**Files:**
- Create: `packages/cli/package.json`
- Create: `packages/cli/tsconfig.json`

**Step 1: Create directory**

```bash
mkdir -p packages/cli/src
```

**Step 2: Create `packages/cli/package.json`**

```json
{
  "name": "@pdf-form/cli",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "generate-pdf": "./dist/index.js"
  },
  "scripts": {
    "build": "bun build ./src/index.ts --outdir ./dist --target node",
    "test": "bun test"
  },
  "dependencies": {
    "@pdf-form/core": "workspace:*",
    "pdf-lib": "^1.17.1",
    "playwright": "^1.50.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

**Step 3: Create `packages/cli/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["src"]
}
```

**Step 4: Install CLI dependencies**

```bash
cd packages/cli && bun install
bunx playwright install chromium
```

**Step 5: Commit**

```bash
git add packages/cli/
git commit -m "chore: scaffold @pdf-form/cli package"
```

---

## Task 9: Coordinate Conversion (Pure Function)

**Files:**
- Create: `packages/cli/src/convert.ts`
- Create: `packages/cli/src/convert.test.ts`

**Step 1: Write the failing test**

```ts
// packages/cli/src/convert.test.ts
import { describe, it, expect } from 'bun:test'
import { convertToPdfCoords } from './convert'
import { PAGE_SIZES } from '@pdf-form/core'

const letterPage = PAGE_SIZES.letter

describe('convertToPdfCoords', () => {
  it('converts x correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    )
    expect(result.x).toBeCloseTo(37.5)
  })

  it('flips Y axis correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    )
    // 792 - (100 + 24) * 0.75 = 792 - 93 = 699
    expect(result.y).toBeCloseTo(699)
  })

  it('converts width correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    )
    expect(result.width).toBeCloseTo(150)
  })

  it('converts height correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    )
    expect(result.height).toBeCloseTo(18)
  })

  it('handles field at top-left origin', () => {
    const result = convertToPdfCoords(
      { x: 0, y: 0, width: 100, height: 20 },
      letterPage
    )
    expect(result.x).toBe(0)
    // y = 792 - (0 + 20) * 0.75 = 792 - 15 = 777
    expect(result.y).toBeCloseTo(777)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/cli && bun test src/convert.test.ts
```

Expected: FAIL — `convertToPdfCoords is not defined`

**Step 3: Implement `convert.ts`**

```ts
// packages/cli/src/convert.ts
import type { PageDimensions } from '@pdf-form/core'

const SCALE = 72 / 96 // 1px = 0.75pt

interface PixelRect {
  x: number
  y: number
  width: number
  height: number
}

interface PdfRect {
  x: number
  y: number
  width: number
  height: number
}

export function convertToPdfCoords(rect: PixelRect, page: PageDimensions): PdfRect {
  return {
    x:      rect.x * SCALE,
    y:      page.heightPt - (rect.y + rect.height) * SCALE,
    width:  rect.width  * SCALE,
    height: rect.height * SCALE,
  }
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/cli && bun test src/convert.test.ts
```

Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add packages/cli/src/convert.ts packages/cli/src/convert.test.ts
git commit -m "feat(cli): add coordinate conversion px→pt with Y-axis flip"
```

---

## Task 10: Vite Server Launcher

**Files:**
- Create: `packages/cli/src/serve.ts`

**Step 1: Implement `serve.ts`**

No test for this module — it is integration-level (requires file system + Vite). Tested end-to-end in Task 13.

```ts
// packages/cli/src/serve.ts
import { createServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'

export interface ServeResult {
  url: string
  server: ViteDevServer
  cleanup: () => void
}

export async function serveForm(formFilePath: string): Promise<ServeResult> {
  const formAbsPath = resolve(process.cwd(), formFilePath)
  const tmpDir = resolve(tmpdir(), `pdf-form-${randomBytes(4).toString('hex')}`)
  mkdirSync(tmpDir, { recursive: true })

  // Write temporary entry HTML
  const htmlPath = resolve(tmpDir, 'index.html')
  writeFileSync(
    htmlPath,
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
  const entryPath = resolve(tmpDir, 'entry.tsx')
  writeFileSync(
    entryPath,
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
    server: { port: 0 }, // random available port
    logLevel: 'silent',
  })

  await server.listen()
  const port = server.httpServer?.address()
  if (!port || typeof port === 'string') throw new Error('Failed to get server port')

  const url = `http://localhost:${port.port}`

  const cleanup = () => {
    server.close()
  }

  return { url, server, cleanup }
}
```

**Step 2: Commit**

```bash
git add packages/cli/src/serve.ts
git commit -m "feat(cli): add Vite dev server launcher for form files"
```

---

## Task 11: Playwright DOM Measurement

**Files:**
- Create: `packages/cli/src/measure.ts`

**Step 1: Implement `measure.ts`**

No unit test — integration-level. Tested end-to-end in Task 13.

```ts
// packages/cli/src/measure.ts
import { chromium } from 'playwright'
import type { ExtractedData } from '@pdf-form/core'

export async function measureForm(
  url: string,
  formData: Record<string, string> = {}
): Promise<ExtractedData> {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Inject form data before page loads
    await page.addInitScript((data) => {
      (window as any).__formData = data
    }, formData)

    await page.goto(url)

    // Wait for React to mount and signal readiness
    await page.waitForFunction(() => (window as any).__ready === true, {
      timeout: 10_000,
    })

    const data = await page.evaluate(() => {
      const fn = (window as any).__extractFieldData
      if (typeof fn !== 'function') throw new Error('window.__extractFieldData not found')
      return fn() as ExtractedData
    })

    return data
  } finally {
    await browser.close()
  }
}
```

**Step 2: Commit**

```bash
git add packages/cli/src/measure.ts
git commit -m "feat(cli): add Playwright DOM measurement"
```

---

## Task 12: pdf-lib AcroForm Generation

**Files:**
- Create: `packages/cli/src/generate.ts`
- Create: `packages/cli/src/generate.test.ts`

**Step 1: Write the failing test**

```ts
// packages/cli/src/generate.test.ts
import { describe, it, expect } from 'bun:test'
import { generatePdf } from './generate'
import { PDFDocument } from 'pdf-lib'

describe('generatePdf', () => {
  it('produces a valid PDF binary', async () => {
    const pages = [
      {
        widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
        fields: [
          { name: 'firstName', type: 'text' as const, pageIndex: 0,
            x: 50, y: 100, width: 200, height: 24, defaultValue: 'Bob' },
        ],
      },
    ]

    const result = await generatePdf(pages, { firstName: 'Bob' })
    expect(result).toBeInstanceOf(Uint8Array)

    // Verify it's a real PDF
    const doc = await PDFDocument.load(result)
    expect(doc.getPageCount()).toBe(1)

    const form = doc.getForm()
    const field = form.getTextField('firstName')
    expect(field.getText()).toBe('Bob')
  })

  it('generates a field with empty value when not in data', async () => {
    const pages = [
      {
        widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
        fields: [
          { name: 'lastName', type: 'text' as const, pageIndex: 0,
            x: 50, y: 50, width: 200, height: 24 },
        ],
      },
    ]

    const result = await generatePdf(pages, {})
    const doc = await PDFDocument.load(result)
    const field = doc.getForm().getTextField('lastName')
    expect(field.getText()).toBe('')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/cli && bun test src/generate.test.ts
```

Expected: FAIL — `generatePdf is not defined`

**Step 3: Implement `generate.ts`**

```ts
// packages/cli/src/generate.ts
import { PDFDocument } from 'pdf-lib'
import { convertToPdfCoords } from './convert'
import type { ExtractedPage } from '@pdf-form/core'

export async function generatePdf(
  pages: ExtractedPage[],
  data: Record<string, string>
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const form = pdfDoc.getForm()

  for (const pageData of pages) {
    const page = pdfDoc.addPage([pageData.widthPt, pageData.heightPt])

    for (const field of pageData.fields) {
      const coords = convertToPdfCoords(field, pageData)
      const value = data[field.name] ?? field.defaultValue ?? ''

      if (field.type === 'text' || field.type === 'textarea') {
        const tf = form.createTextField(field.name)
        tf.setText(value)
        if (field.type === 'textarea') tf.enableMultiline()
        tf.addToPage(page, coords)
      }
      // Additional field types added here as the library grows
    }
  }

  return pdfDoc.save()
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/cli && bun test src/generate.test.ts
```

Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add packages/cli/src/generate.ts packages/cli/src/generate.test.ts
git commit -m "feat(cli): add pdf-lib AcroForm generation"
```

---

## Task 13: CLI Entry Point

**Files:**
- Create: `packages/cli/src/index.ts`

**Step 1: Implement `index.ts`**

```ts
#!/usr/bin/env node
// packages/cli/src/index.ts
import { resolve, extname } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { serveForm } from './serve'
import { measureForm } from './measure'
import { generatePdf } from './generate'

function parseArgs(argv: string[]) {
  const args = argv.slice(2)
  const formFile = args.find(a => !a.startsWith('-'))
  const dataArg = args.find((a, i) => !a.startsWith('-') && i > 0 && args[i - 1] !== '-o' && args[i - 1] !== '--output')
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

  if (!formFile) {
    console.error('Usage: generate-pdf <form.tsx> [data] [-o output.pdf]')
    process.exit(1)
  }

  if (!formFile.endsWith('.tsx') && !formFile.endsWith('.jsx')) {
    console.error('Form file must be a .tsx or .jsx file')
    process.exit(1)
  }

  const data = parseData(dataArg)

  console.log(`📄 Generating PDF from ${formFile}...`)

  const { url, cleanup } = await serveForm(formFile)

  try {
    console.log(`🌐 Measuring fields via Playwright...`)
    const extracted = await measureForm(url, data)

    const totalFields = extracted.pages.reduce((n, p) => n + p.fields.length, 0)
    console.log(`✅ Found ${totalFields} field(s) across ${extracted.pages.length} page(s)`)

    console.log(`🔧 Generating AcroForm PDF...`)
    const pdfBytes = await generatePdf(extracted.pages, data)

    const outputPath = resolve(process.cwd(), output)
    writeFileSync(outputPath, pdfBytes)
    console.log(`✅ PDF saved to ${outputPath}`)

    if (open) {
      const { execSync } = await import('child_process')
      const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
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
```

**Step 2: Build the CLI**

```bash
cd packages/cli && bun run build
```

Expected: `dist/index.js` created

**Step 3: Commit**

```bash
git add packages/cli/src/index.ts packages/cli/dist/
git commit -m "feat(cli): add CLI entry point with arg parsing"
```

---

## Task 14: HVAC Contract Example

**Files:**
- Create: `examples/hvac-contract/package.json`
- Create: `examples/hvac-contract/form.tsx`

**Step 1: Create `examples/hvac-contract/package.json`**

```json
{
  "name": "hvac-contract-example",
  "private": true,
  "dependencies": {
    "@pdf-form/core": "workspace:*"
  }
}
```

**Step 2: Create `examples/hvac-contract/form.tsx`**

```tsx
import { Pdf } from '@pdf-form/core'

export default function HvacContract() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">
        {/* Header */}
        <div className="absolute left-[48px] top-[48px] text-xl font-bold text-gray-800">
          HVAC Service Contract
        </div>

        {/* Customer Info */}
        <div className="absolute left-[48px] top-[100px] text-xs uppercase tracking-wide text-gray-500">
          Customer Name
        </div>
        <div className="absolute left-[48px] top-[116px] w-[300px]">
          <Pdf.TextField name="customerName" label="Full Name" />
        </div>

        <div className="absolute left-[380px] top-[100px] text-xs uppercase tracking-wide text-gray-500">
          Date
        </div>
        <div className="absolute left-[380px] top-[116px] w-[180px]">
          <Pdf.TextField name="serviceDate" label="MM/DD/YYYY" />
        </div>

        {/* Address */}
        <div className="absolute left-[48px] top-[168px] text-xs uppercase tracking-wide text-gray-500">
          Service Address
        </div>
        <div className="absolute left-[48px] top-[184px] w-[512px]">
          <Pdf.TextField name="serviceAddress" label="Street Address" />
        </div>

        {/* Technician */}
        <div className="absolute left-[48px] top-[236px] text-xs uppercase tracking-wide text-gray-500">
          Technician
        </div>
        <div className="absolute left-[48px] top-[252px] w-[240px]">
          <Pdf.TextField name="technicianName" label="Technician Name" />
        </div>

        {/* Work Description */}
        <div className="absolute left-[48px] top-[316px] text-xs uppercase tracking-wide text-gray-500">
          Work Description
        </div>
        <div className="absolute left-[48px] top-[332px] h-[120px] w-[512px]">
          <Pdf.TextField name="workDescription" label="Describe work performed..." />
        </div>

        {/* Total */}
        <div className="absolute left-[380px] top-[480px] text-xs uppercase tracking-wide text-gray-500">
          Total Amount
        </div>
        <div className="absolute left-[380px] top-[496px] w-[180px]">
          <Pdf.TextField name="totalAmount" label="$0.00" />
        </div>
      </Pdf.Page>
    </Pdf.Document>
  )
}
```

**Step 3: Install example dependencies**

```bash
cd examples/hvac-contract && bun install
```

**Step 4: Run the CLI against the example**

```bash
cd /home/raza/Projects/pdf-form-generator
bun run packages/cli/dist/index.js examples/hvac-contract/form.tsx \
  '{"customerName":"Bob Smith","serviceDate":"02/26/2026","technicianName":"Jane Doe","totalAmount":"$350.00"}' \
  -o examples/hvac-contract/output.pdf
```

Expected output:
```
📄 Generating PDF from examples/hvac-contract/form.tsx...
🌐 Measuring fields via Playwright...
✅ Found 6 field(s) across 1 page(s)
🔧 Generating AcroForm PDF...
✅ PDF saved to .../examples/hvac-contract/output.pdf
```

**Step 5: Open `output.pdf` and verify:**
- Fields are interactive (click to type)
- Pre-filled values appear
- No rasterization — this is a real AcroForm

**Step 6: Commit**

```bash
git add examples/
git commit -m "feat(examples): add HVAC contract example form"
```

---

## Task 15: Run All Tests

**Step 1: Run tests from root**

```bash
cd /home/raza/Projects/pdf-form-generator && bun test
```

Expected: All tests PASS across both packages

**Step 2: Run lint**

```bash
bun run lint
```

Fix any warnings before continuing.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: all tests passing, lint clean"
```

---

## Summary

| Package | Key files | Tests |
|---------|-----------|-------|
| `@pdf-form/core` | `DocumentContext`, `Document`, `Page`, `TextField` | Unit tests per component |
| `@pdf-form/cli` | `convert`, `generate`, `serve`, `measure`, `index` | Unit tests for pure functions |
| `examples` | `hvac-contract/form.tsx` | Manual end-to-end verification |

**Field types to add next** (same pattern as TextField):
1. `TextArea` — multiline TextField
2. `CheckboxField` — `form.createCheckBox()`
3. `DropdownField` — `form.createDropdown()`
