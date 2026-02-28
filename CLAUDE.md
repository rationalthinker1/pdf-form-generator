# PDF Form Generator — Project Intelligence

## What This Project Is

A monorepo that generates **real interactive AcroForm PDF files** from declarative React components.

- NOT a static PDF renderer
- NOT a browser-to-image export
- NOT canvas rasterization
- Generates legitimate AcroForm fields embedded in the PDF binary via pdf-lib

## Architecture

```
packages/
├── core/    # @pdf-form/core — React component library (published)
└── cli/     # @pdf-form/cli  — CLI tool (published)
examples/
├── hvac-contract/
└── chp-contract/
```

**Data flow:**
1. Developer writes `form.tsx` using `<Pdf.Document>`, `<Pdf.Page>`, `<Pdf.TextField>`
2. CLI starts Vite dev server programmatically
3. Playwright (headless Chromium) opens the form, calls `window.__extractFieldData()`
4. CLI converts px → PDF points (Y-axis flip, scale 0.75)
5. pdf-lib generates AcroForm PDF

## Component API

```tsx
import { Pdf } from '@pdf-form/core'

export default function MyForm() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">
        <Pdf.Text>FIRST NAME</Pdf.Text>
        <Pdf.TextField name="firstName" label="First Name" />
      </Pdf.Page>
    </Pdf.Document>
  )
}
```

```bash
# Generate fillable PDF
generate-pdf form.tsx '{"firstName":"Bob"}' -o output.pdf

# Live dev preview (opens browser, hot-reloads)
generate-pdf dev form.tsx
```

## Dev Command

The `dev` subcommand starts a Vite server and opens the form in a browser for layout design and preview. It does **not** generate a PDF.

```bash
bun packages/cli/src/index.ts dev examples/chp-contract/form.tsx
# or via root script:
bun dev examples/chp-contract/form.tsx
```

On WSL, it prints both a `Local` and `Network` URL — use the Network URL in the Windows browser.

## Dev Preview Pattern (react-hook-form)

To test forms with sample data during `dev`, use `react-hook-form`'s `useForm` + `watch()` to flow values into `defaultValue` props. **This is purely for dev-time preview** — Playwright reads `data-field-*` DOM attributes directly and ignores the React form wrapper entirely when generating PDFs.

```tsx
import { useForm } from 'react-hook-form'
import { Pdf } from '@pdf-form/core'

interface FormValues { firstName: string; lastName: string }

export default function MyForm() {
  const { watch } = useForm<FormValues>({
    defaultValues: { firstName: 'John', lastName: 'Doe' },
  })
  const v = watch()

  return (
    <Pdf.Document>
      <Pdf.Page size="letter">
        <Pdf.TextField name="firstName" label="First Name" defaultValue={v.firstName} />
        <Pdf.TextField name="lastName" label="Last Name" defaultValue={v.lastName} />
      </Pdf.Page>
    </Pdf.Document>
  )
}
```

- `useForm({ defaultValues })` — seed sample data for preview
- `watch()` — live values flow into `defaultValue` on each re-render
- `handleSubmit` — optional, not used during PDF generation
- `react-hook-form` is a root workspace dependency (`package.json`)

## Namespace Export Convention

Components use single-word names (`Document`, `Page`, `TextField`) exported under the `Pdf` namespace to avoid import collisions with other libraries (e.g. `react-pdf`).

```ts
export const Pdf = { Document, Page, TextField, Text } as const
```

## Tech Stack

| Role | Tool |
|------|------|
| Runtime + package manager | Bun |
| Language | TypeScript (strict) |
| Framework | React 18 |
| Styling | Tailwind CSS |
| Dev server | Vite (programmatic) |
| Browser automation | Playwright (Chromium) |
| PDF generation | pdf-lib |
| Test runner | `bun test` (Jest-compatible) |
| Dev preview forms | react-hook-form (`useForm` + `watch`) |
| Linting | ESLint + typescript-eslint + eslint-plugin-react |
| Formatting | Prettier + prettier-plugin-tailwindcss |

## Development Rules

### TDD is mandatory
Every feature follows this exact order:
1. Write the failing test
2. Run it — confirm it FAILS
3. Write minimal implementation to pass
4. Run it — confirm it PASSES
5. Commit

**Never write implementation before a failing test exists.**

### Test files live next to source
```
src/context/DocumentContext.tsx
src/context/DocumentContext.test.ts   ← same directory
```

### Run tests
```bash
# Single file
bun test src/convert.test.ts

# All tests in a package
cd packages/core && bun test

# All tests in monorepo
bun test
```

### Commits are frequent and small
One logical change per commit. Commit after every passing test cycle.

## Coordinate Conversion

PDF origin is bottom-left. DOM origin is top-left. Scale factor: `72/96 = 0.75`.

```ts
const SCALE = 72 / 96
{
  x:      rect.x * SCALE,
  y:      page.heightPt - (rect.y + rect.height) * SCALE,  // Y flip
  width:  rect.width  * SCALE,
  height: rect.height * SCALE,
}
```

US Letter: 816×1056px preview → 612×792pt PDF.

## Page Sizes

| Name | px | pt |
|------|----|----|
| letter | 816×1056 | 612×792 |
| a4 | 794×1123 | 595×842 |

## window Contract (set by `<Document>`)

```ts
window.__ready = true                     // set after all refs mount
window.__formData = { firstName: 'Bob' } // injected by CLI before page load
window.__extractFieldData()               // returns ExtractedData
```

## Field Types

| Component | Status | pdf-lib API |
|-----------|--------|-------------|
| `TextField` | ✅ Done | `form.createTextField()` |
| `TextArea` | pending | `form.createTextField()` + `enableMultiline()` |
| `CheckboxField` | pending | `form.createCheckBox()` |
| `DropdownField` | pending | `form.createDropdown()` |
| `RadioGroup` | pending | `form.createRadioGroup()` |

## Non-Negotiable Constraints

- AcroForm only (never XFA)
- Field names must be unique across the entire document
- Locked layout: `<Page>` container has fixed pixel dimensions — never fluid
- No screenshotting, no canvas rasterization, no html-to-image

## Implementation Plan

See [docs/plans/2026-02-26-pdf-form-generator-implementation.md](docs/plans/2026-02-26-pdf-form-generator-implementation.md)
