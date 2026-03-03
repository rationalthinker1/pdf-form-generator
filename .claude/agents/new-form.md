# Agent: new-form

Scaffold a new form example under `src/examples/` with the correct boilerplate.

## Trigger

Use this agent when asked to create a new form, e.g. "create an hvac-inspection form" or "scaffold a new form for rental agreements".

## What This Agent Does

1. Creates `src/examples/<name>/form.tsx` with:
   - A `FormValues` type covering all fields
   - `useState` for local controlled state (matches the existing chp-contract pattern — NOT react-hook-form)
   - A `set()` helper for onChange handlers
   - All requested fields using `Pdf.InputField`, `Pdf.CheckboxField`, `Pdf.SignatureField` etc.
   - `<Pdf.Footer>` on every page
2. Verifies it renders by running the dev server briefly (optional, skip if not asked)

## Boilerplate Pattern

Look at `src/examples/chp-contract/form.tsx` as the canonical reference. Key conventions:

```tsx
import { useState } from 'react'
import { Pdf } from '../../index'

// 1. Type all field names with dot-notation prefix: 'p<pageIndex>.<fieldName>'
type FormValues = {
  'p0.first_name': string
  'p0.last_name': string
  // ...
}

export default function <FormName>() {
  // 2. useState with empty string defaults
  const [values, setValues] = useState<FormValues>({
    'p0.first_name': '',
    'p0.last_name': '',
    // ...
  })

  // 3. Generic setter
  const set = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(v => ({ ...v, [field]: e.target.value }))

  return (
    <Pdf.Document>
      <Pdf.Page size="letter" footer={<Pdf.Footer>...</Pdf.Footer>}>
        {/* page content */}
        <Pdf.InputField name="p0.first_name" label="First Name" type="text"
          value={values['p0.first_name']} onChange={set('p0.first_name')} />
      </Pdf.Page>
    </Pdf.Document>
  )
}
```

## Field Naming Convention

- Always prefix with `p<pageIndex>.` — e.g. `p0.company_name`, `p2.first_name`
- Use `snake_case` for the field name part
- Names must be unique across the entire document

## Layout Helpers

- `Pdf.InputField` — labeled text input, use `flex`, `width`, `borderRight` for multi-column rows
- `Pdf.CheckboxField` — 16×16 toggle, use `defaultChecked`
- `Pdf.SignatureField` — signature line with label
- `Pdf.Box` — bordered rectangle container, use `borderWidth`
- `Pdf.Text` — static text label (use `className` for Tailwind styling)

Multi-column row pattern:
```tsx
<div className="flex flex-row border border-gray-400">
  <Pdf.InputField name="p0.city"    label="City"    type="text" flex="1" borderRight />
  <Pdf.InputField name="p0.prov"    label="Province" type="text" width="16" borderRight />
  <Pdf.InputField name="p0.postal"  label="Postal Code" type="text" width="24" />
</div>
```

## After Creating

Tell the user:
```bash
bun dev src/examples/<name>/form.tsx
```
to preview it in the browser before generating a PDF.
