import { PDFDocument, PDFString, PDFName } from 'pdf-lib'
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
        if (value) {
          tf.setText(value)
        } else {
          // pdf-lib setText('') leaves getValue() as undefined after save/load;
          // writing the V entry directly ensures getText() returns '' as expected.
          tf.acroField.dict.set(PDFName.of('V'), PDFString.of(''))
        }
        if (field.type === 'textarea') tf.enableMultiline()
        tf.addToPage(page, coords)
      }
    }
  }

  return pdfDoc.save()
}
