# PDF Form Generator

Generate real interactive AcroForm PDFs from declarative React components.

This is **not** a static PDF renderer, screenshot tool, or canvas rasterizer. It produces legitimate AcroForm fields embedded in the PDF binary via [pdf-lib](https://github.com/Hopding/pdf-lib).

## How It Works

1. You write a form using React components (`<Pdf.Document>`, `<Pdf.Page>`, `<Pdf.TextField>`, etc.)
2. The CLI starts a Vite dev server and opens your form in headless Chromium via Playwright
3. Field positions and dimensions are extracted from the DOM
4. Coordinates are converted from px to PDF points (Y-axis flip, scale 0.75)
5. pdf-lib generates an AcroForm PDF with real fillable fields

## Quick Start

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Generate a PDF from a form
generate-pdf form.tsx '{"firstName":"Bob"}' -o output.pdf
```

## Packages

```
packages/
├── core/   # @pdf-form/core — React component library
└── cli/    # @pdf-form/cli  — CLI tool (generate-pdf command)
examples/
├── hvac-contract/
└── chp-contract/
```

## Usage

### Define a form

```tsx
import { Pdf } from '@pdf-form/core'

export default function MyForm() {
  return (
    <Pdf.Document>
      <Pdf.Page size="letter">
        <Pdf.Text fontSize={24} bold>Service Agreement</Pdf.Text>
        <Pdf.TextField name="customerName" label="Customer Name" />
        <Pdf.TextField name="serviceDate" label="Date" />
      </Pdf.Page>
    </Pdf.Document>
  )
}
```

### Generate the PDF

```bash
# Basic usage
generate-pdf form.tsx -o contract.pdf

# Pre-fill fields with data
generate-pdf form.tsx '{"customerName":"Alice","serviceDate":"2026-01-15"}' -o contract.pdf

# Load data from a file
generate-pdf form.tsx @data.json -o contract.pdf

# Open the PDF after generating
generate-pdf form.tsx -o contract.pdf --open
```

## Components

| Component | Description |
|-----------|-------------|
| `Pdf.Document` | Root container for the PDF form |
| `Pdf.Page` | A page within the document (`size`: `"letter"` or `"a4"`) |
| `Pdf.TextField` | Single-line text input field |
| `Pdf.Text` | Static text (labels, headings) |

### `Pdf.TextField`

```tsx
<Pdf.TextField name="firstName" label="First Name" defaultValue="Bob" />
```

- `name` — unique field name across the document
- `label` — optional label displayed above the field
- `defaultValue` — optional pre-filled value

### `Pdf.Text`

```tsx
<Pdf.Text fontSize={12} bold color="#333">Section Title</Pdf.Text>
```

- `fontSize` — font size in points
- `bold` — optional bold styling
- `color` — optional text color

## Page Sizes

| Name | Preview (px) | PDF (pt) |
|------|-------------|----------|
| `letter` | 816 x 1056 | 612 x 792 |
| `a4` | 794 x 1123 | 595 x 842 |

## Development

```bash
# Run all tests
bun test

# Run tests for a single package
cd packages/core && bun test

# Lint
bun run lint

# Format
bun run format
```

## Tech Stack

| Role | Tool |
|------|------|
| Runtime + package manager | Bun |
| Language | TypeScript (strict) |
| Framework | React 18 |
| Styling | Tailwind CSS |
| Dev server | Vite |
| Browser automation | Playwright |
| PDF generation | pdf-lib |
| Testing | bun test |

## License

MIT
