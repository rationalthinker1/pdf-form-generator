# PDF Form Generator — Design Document

**Date:** 2026-02-26
**Status:** Approved
**Domain:** HVAC contracts (initial), generalized for open-source release

---

## Overview

A monorepo providing two publishable packages:

- **`@pdf-form/core`** — React component library for declaratively defining PDF form layouts
- **`@pdf-form/cli`** — CLI tool that renders the form in a headless browser, measures field positions, and generates a real interactive PDF with AcroForm fields via pdf-lib

The system is **not** a static PDF renderer, canvas exporter, or screenshot tool. It generates legitimate AcroForm fields embedded in the PDF binary.

---

## Usage

### Form definition (`form1.tsx`)

```tsx
import { Pdf } from '@pdf-form/core'

export default function HvacContract() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">
        <Pdf.TextField name="firstName" label="First Name" />
        <Pdf.TextField name="lastName"  label="Last Name"  />
      </Pdf.Page>
    </Pdf.Document>
  )
}
```

### CLI invocation

```bash
npx @pdf-form/cli form1.tsx '{"firstName":"Bob","lastName":"Smith"}' -o contract.pdf
```

### CLI flags

| Flag | Description | Default |
|------|-------------|---------|
| `<form>` | Path to `.tsx` form file | required |
| `[data]` | JSON string or `@file.json` | `{}` |
| `-o, --output` | Output PDF path | `./output.pdf` |
| `--size` | Page size override | `letter` |
| `--open` | Open PDF after generation | false |

---

## Architecture

### Approach

**Playwright + pdf-lib hybrid (Approach C):**

1. CLI starts a Vite dev server programmatically, serving the user's form file via a temporary entry point
2. Playwright opens `localhost:PORT` in headless Chromium
3. App signals readiness via `window.__ready = true`
4. CLI calls `window.__extractFieldData()` → structured field + page data
5. CLI shuts down Playwright and Vite
6. Coordinate conversion (px → pt, Y-axis flip)
7. pdf-lib generates AcroForm PDF
8. PDF written to output path

### Data flow

```
form1.tsx
    │
    ▼
CLI writes temp entry.tsx (imports form1.tsx, mounts it)
    │
    ▼
Vite dev server (programmatic, random port)
    │
    ▼
Playwright: chromium.launch() → page.goto(localhost:PORT)
    │
    ├─ page.waitForFunction(() => window.__ready)
    ├─ page.evaluate(() => window.__extractFieldData())
    │   └─ returns: { pages: [{ widthPx, heightPx, fields: [FieldData] }] }
    │
    ▼
coordinate conversion: px → pt, flip Y axis
    │
    ▼
pdf-lib: PDFDocument.create() → form.createTextField() → addToPage()
    │
    ▼
contract.pdf (AcroForm, not XFA)
```

---

## Package Structure

```
pdf-form-generator/
├── packages/
│   ├── core/                        # @pdf-form/core (published)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Document.tsx     # context provider + field registry
│   │   │   │   ├── Page.tsx         # fixed-size locked layout container
│   │   │   │   ├── TextField.tsx    # text field component
│   │   │   │   └── index.ts
│   │   │   ├── context/
│   │   │   │   └── DocumentContext.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts             # exports { Pdf }
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                         # @pdf-form/cli (published)
│       ├── src/
│       │   ├── serve.ts             # Vite dev server launcher
│       │   ├── measure.ts           # Playwright DOM extraction
│       │   ├── convert.ts           # px → pt coordinate conversion
│       │   ├── generate.ts          # pdf-lib AcroForm generation
│       │   └── index.ts             # CLI entry (bin)
│       ├── package.json
│       └── tsconfig.json
│
├── examples/
│   └── hvac-contract/
│       └── form.tsx
│
├── docs/
│   └── plans/
├── package.json                     # bun workspaces
├── eslint.config.ts
├── prettier.config.ts
└── tsconfig.base.json
```

---

## Tech Stack

| Role | Tool |
|------|------|
| Language | TypeScript |
| Runtime | Bun |
| Package manager | Bun workspaces |
| Build | `bun build` |
| Test runner | `bun test` |
| Framework | React 18 |
| Styling | Tailwind CSS |
| Dev server | Vite (programmatic) |
| Browser automation | Playwright (Chromium) |
| PDF generation | pdf-lib |
| Linting | ESLint + typescript-eslint + eslint-plugin-react |
| Formatting | Prettier + prettier-plugin-tailwindcss |

---

## Component API

### Namespace export

```ts
// packages/core/src/index.ts
export const Pdf = { Document, Page, TextField }
```

Single-word component names are used (`Document`, `Page`) exported under the `Pdf` namespace to avoid import collisions with other libraries (e.g. `react-pdf`).

### `<Pdf.Document>`

- Provides `DocumentContext` (field registry)
- Exposes `window.__extractFieldData()` and sets `window.__ready = true` after all refs mount
- Validates field name uniqueness at registration time

### `<Pdf.Page>`

Props:
```ts
interface PageProps {
  size?: 'letter' | 'a4'   // default: 'letter'
  children: React.ReactNode
}
```

Renders a fixed-size locked layout container:

| Size | px dimensions | pt dimensions |
|------|--------------|---------------|
| letter | 816 × 1056 | 612 × 792 |
| a4 | 794 × 1123 | 595 × 842 |

Scale factor: `72 / 96 = 0.75` (1px = 0.75pt)

### `<Pdf.TextField>`

Props:
```ts
interface TextFieldProps {
  name: string              // unique AcroForm field name
  label?: string            // placeholder text shown in preview
  defaultValue?: string     // pre-filled value in generated PDF
}
```

Renders a styled `<div>` with a `ref`. Registers itself with `DocumentContext` on mount.

### Field registry entry

```ts
type FieldData = {
  name: string
  type: 'text' | 'checkbox' | 'dropdown' | 'textarea'
  ref: React.RefObject<HTMLDivElement>
  defaultValue?: string
}
```

### `window.__extractFieldData()` contract

```ts
type ExtractedData = {
  pages: Array<{
    widthPx: number
    heightPx: number
    fields: Array<{
      name: string
      type: string
      pageIndex: number
      x: number       // px from page container left
      y: number       // px from page container top
      width: number
      height: number
      defaultValue?: string
    }>
  }>
}
```

---

## Coordinate Conversion

**Formula:**

```ts
const SCALE = 72 / 96  // 0.75

function convertToPdfCoords(field, page) {
  return {
    x:      field.x * SCALE,
    y:      page.heightPt - (field.y + field.height) * SCALE,  // flip Y
    width:  field.width  * SCALE,
    height: field.height * SCALE,
  }
}
```

**Example** — field at DOM `{ x: 50, y: 100, width: 200, height: 24 }` on US Letter:

```
PDF x      = 50   × 0.75 = 37.5 pt
PDF y      = 792 − (100 + 24) × 0.75 = 792 − 93 = 699 pt
PDF width  = 200  × 0.75 = 150 pt
PDF height = 24   × 0.75 = 18 pt
```

Lives in `packages/cli/src/convert.ts` as a pure function. Unit tested independently.

---

## pdf-lib AcroForm Generation

```ts
async function generatePdf(pages: ExtractedPage[], data: Record<string, string>) {
  const pdfDoc = await PDFDocument.create()
  const form = pdfDoc.getForm()

  for (const pageData of pages) {
    const page = pdfDoc.addPage([pageData.widthPt, pageData.heightPt])

    for (const field of pageData.fields) {
      const coords = convertToPdfCoords(field, pageData)
      const value = data[field.name] ?? ''

      if (field.type === 'text') {
        const tf = form.createTextField(field.name)
        tf.setText(value)
        tf.addToPage(page, coords)
      }
      // checkbox, dropdown follow same pattern
    }
  }

  return pdfDoc.save()  // Uint8Array
}
```

**Output:** `AcroForm`, not `XFA`. Verified by pdf-lib's default behavior.

---

## Error Handling

### Schema errors (before Playwright launches)

- Duplicate field names → `Error: Duplicate field name "firstName" found on page 2`
- Unknown page size → `Error: Unknown size "A5". Supported sizes: letter, a4`

### Runtime errors (during Playwright)

- Form file missing default export → descriptive error pointing to the file
- Field ref not attached → warning logged, field skipped (no crash)

### pdf-lib errors

- Wrapped with field name context → `Error: Failed to create field "firstName": [pdf-lib message]`

All errors exit with non-zero code for CI compatibility.

---

## Field Types (Prioritized)

| Priority | Type | AcroForm method |
|----------|------|-----------------|
| 1 | TextField | `form.createTextField()` |
| 2 | TextArea | `form.createTextField()` (multiline) |
| 3 | CheckboxField | `form.createCheckBox()` |
| 4 | DropdownField | `form.createDropdown()` |
| 5 | RadioGroup | `form.createRadioGroup()` |
| 6 | SignatureField | `form.createSignature()` (future) |

---

## Open Questions (deferred)

1. Multi-page preview: pages stack vertically or paginated?
2. Custom fonts: embed via `pdfDoc.embedFont()` — API TBD
3. Existing PDF overlay: add AcroForm fields onto an uploaded base PDF (future feature)
4. Live preview app: `vite dev` for hot-reload during form development (future)
