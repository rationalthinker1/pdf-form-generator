# PDF Form Generator — Requirements

## Summary

A CLI + React component library for generating real interactive PDF files with AcroForm fields via pdf-lib.

## Non-Negotiable Constraints

- Must generate true AcroForm fields (NOT XFA, NOT static PDF, NOT canvas rasterization)
- Must support multiple field types: text, checkbox, dropdown, textarea (start with text)
- Must support multiple pages
- Must support deterministic coordinate conversion (browser px → PDF points, bottom-left origin)
- Must support locked layout mode (fixed-size preview container)
- Must be architecturally clean, modular, and production-safe
- Must be open-source and developer-friendly

## Usage Model

```bash
npx generate-pdf-form form1.tsx '{"name": "Bob"}'
```

- Developer defines form layout in a `.tsx` file using React components
- CLI accepts the form file + JSON data object
- Output: a legitimate interactive PDF file with AcroForm fields and pre-filled values

## Form Definition API (Target)

```tsx
<PdfPage>
  <TextField name="firstName" />
  <TextField name="lastName" />
  <CheckboxField name="agree" />
</PdfPage>
```

- Field positions come from CSS/DOM layout (getBoundingClientRect)
- Positioning uses standard CSS (absolute, flex, etc.) — no explicit x/y props required

## Field Types (Prioritized)

1. TextField (start here)
2. TextArea
3. CheckboxField
4. DropdownField (combo box)
5. RadioGroup
6. SignatureField (future)

## Tech Stack

- TypeScript
- React 18+
- Vite (for dev/build)
- Tailwind CSS (styling of form components and preview)
- pdf-lib (AcroForm generation)
- ESLint + Prettier
- Puppeteer (headless Chrome for DOM measurement)

## Initial Domain

HVAC contracts — but architecture must be fully generalized.

## Open Questions (to address in design)

1. How does Puppeteer receive the TSX form file? Options:
   - a) CLI compiles TSX on-the-fly (esbuild/tsx) and serves it via a local dev server, Puppeteer visits it
   - b) CLI uses a Vite plugin to bundle the form, serves it, Puppeteer visits
   - c) CLI renders via a custom Puppeteer page that injects the compiled component

2. What is the locked layout container size? (e.g., 816×1056px = US Letter at 96 DPI)

3. Multi-page: does `<PdfPage pageNumber={2}>` stack vertically in preview, or are they separate?

4. Should the library eventually support existing PDF overlays (adding AcroForm fields onto an existing PDF template)?

5. Package structure: monorepo (core library + CLI package) or single package?
