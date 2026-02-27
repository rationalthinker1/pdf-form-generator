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
└── hvac-contract/
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
        <Pdf.TextField name="firstName" label="First Name" />
      </Pdf.Page>
    </Pdf.Document>
  )
}
```

```bash
generate-pdf form.tsx '{"firstName":"Bob"}' -o output.pdf
```

## Namespace Export Convention

Components use single-word names (`Document`, `Page`, `TextField`) exported under the `Pdf` namespace to avoid import collisions with other libraries (e.g. `react-pdf`).

```ts
export const Pdf = { Document, Page, TextField } as const
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

## Field Types (implementation order)

1. `TextField` — `form.createTextField()` ← **start here**
2. `TextArea` — `form.createTextField()` + `enableMultiline()`
3. `CheckboxField` — `form.createCheckBox()`
4. `DropdownField` — `form.createDropdown()`
5. `RadioGroup` — `form.createRadioGroup()`

## Non-Negotiable Constraints

- AcroForm only (never XFA)
- Field names must be unique across the entire document
- Locked layout: `<Page>` container has fixed pixel dimensions — never fluid
- No screenshotting, no canvas rasterization, no html-to-image

## Implementation Plan

See [docs/plans/2026-02-26-pdf-form-generator-implementation.md](docs/plans/2026-02-26-pdf-form-generator-implementation.md)
