# Agent: new-field

Add a new AcroForm field type to the project following the mandatory TDD cycle.

## Trigger

Use this agent when asked to add a new field component such as `DropdownField`, `RadioGroup`, `TextArea`, or any other pending type from the Field Types table in CLAUDE.md.

## What This Agent Does

Implements a new field type end-to-end across all five required touch points, in strict TDD order. Never writes implementation before a failing test exists.

## Touch Points (always in this order)

1. **Test file** — `src/components/<ComponentName>.test.tsx`
2. **Component file** — `src/components/<ComponentName>.tsx`
3. **Barrel export** — `src/components/index.ts`
4. **Namespace registration** — `src/index.ts` (import + add to `Pdf` object)
5. **PDF generation** — `src/cli/generate.ts` (handle the new `FieldType` in the `if/else` chain)
6. **CLAUDE.md** — update the Field Types table status to ✅ Done

## TDD Cycle

For each touch point that has testable behaviour:

1. Write the failing test
2. Run `bun test src/components/<ComponentName>.test.tsx` — confirm RED
3. Write minimal implementation to pass
4. Run `bun test src/components/<ComponentName>.test.tsx` — confirm GREEN
5. Commit with `/commit`

**Never skip the RED step. Never write implementation before seeing a failure.**

## Component Conventions

- Props interface named `<ComponentName>Props`
- Always accepts `name: string` and optional `className?: string`, `style?: React.CSSProperties`
- Render a `div` with `data-field-name={name}` and `data-field-type="<type>"` attributes
- The `data-field-type` value must match a `FieldType` in `src/types.ts` — add new values there if needed
- Export as a named export (not default)

### Example skeleton

```tsx
interface DropdownFieldProps {
  name: string
  options: string[]
  defaultValue?: string
  className?: string
  style?: React.CSSProperties
}

export function DropdownField({ name, options, defaultValue, className, style }: DropdownFieldProps) {
  return (
    <div
      data-field-name={name}
      data-field-type="dropdown"
      data-field-default-value={defaultValue ?? ''}
      data-field-options={JSON.stringify(options)}
      className={...}
      style={style}
    >
      ...
    </div>
  )
}
```

## Test Conventions

Use `renderToStaticMarkup` + `createElement` (no JSX in test files unless the project already uses it there):

```ts
import { describe, it, expect } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { DropdownField } from './DropdownField'

describe('DropdownField', () => {
  it('renders with data-field-name', () => {
    const html = renderToStaticMarkup(createElement(DropdownField, { name: 'status', options: ['A', 'B'] }))
    expect(html).toContain('data-field-name="status"')
  })

  it('renders with data-field-type="dropdown"', () => {
    const html = renderToStaticMarkup(createElement(DropdownField, { name: 'status', options: ['A', 'B'] }))
    expect(html).toContain('data-field-type="dropdown"')
  })
})
```

## generate.ts Conventions

The field type is handled inside the `for (const field of pageData.fields)` loop in `generatePdf()`. Match the existing pattern:

```ts
} else if (field.type === 'dropdown') {
  const dd = form.createDropdown(field.name)
  // parse options from field.defaultValue or a dedicated prop if ExtractedField is extended
  dd.addToPage(page, { x: field.xPt, y: yPt, width: field.widthPt, height: field.heightPt, ... })
}
```

If new data needs to flow from the component to generate.ts, extend `ExtractedField` in `src/types.ts` and update `Document.tsx`'s `__extractFieldData` to read the new `data-*` attribute.

## FieldType enum

`src/types.ts` defines `FieldType`. Add the new value there before writing the component:

```ts
export type FieldType = 'text' | 'textarea' | 'date' | 'checkbox' | 'dropdown' | 'radio'
```

## After All Steps Pass

1. Run the full test suite: `bun test`
2. Run the CLI smoke test: `bun src/cli/index.ts src/examples/chp-contract/form.tsx '{}' -o output.pdf`
3. Update CLAUDE.md Field Types table: change status from `pending` to `✅ Done`
4. Final commit with `/commit`
