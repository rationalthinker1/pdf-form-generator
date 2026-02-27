import { describe, it, expect } from 'bun:test'
import { generatePdf } from './generate'
import { PDFDocument } from 'pdf-lib'

describe('generatePdf', () => {
  it('produces a valid PDF binary', async () => {
    const pages = [
      {
        widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
        fields: [
          {
            name: 'firstName',
            type: 'text' as const,
            pageIndex: 0,
            x: 50, y: 100, width: 200, height: 24,
            defaultValue: 'Bob',
          },
        ],
      },
    ]

    const result = await generatePdf(pages, { firstName: 'Bob' })
    expect(result).toBeInstanceOf(Uint8Array)

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
          {
            name: 'lastName',
            type: 'text' as const,
            pageIndex: 0,
            x: 50, y: 50, width: 200, height: 24,
          },
        ],
      },
    ]

    const result = await generatePdf(pages, {})
    const doc = await PDFDocument.load(result)
    const field = doc.getForm().getTextField('lastName')
    expect(field.getText()).toBe('')
  })

  it('generates multiple pages', async () => {
    const pages = [
      {
        widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
        fields: [],
      },
      {
        widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
        fields: [],
      },
    ]

    const result = await generatePdf(pages, {})
    const doc = await PDFDocument.load(result)
    expect(doc.getPageCount()).toBe(2)
  })
})
