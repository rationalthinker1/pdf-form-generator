import { PDFDocument, PDFString, PDFName, StandardFonts, rgb } from 'pdf-lib';
import { convertToPdfCoords } from './convert';
import type { ExtractedPage } from '../../index';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
}

export async function generatePdf(
  pages: ExtractedPage[],
  data: Record<string, string>
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const form = pdfDoc.getForm();

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const pageData of pages) {
    const page = pdfDoc.addPage([pageData.widthPt, pageData.heightPt]);

    for (const field of pageData.fields) {
      const coords = convertToPdfCoords(field, pageData);
      const value = data[field.name] ?? field.defaultValue ?? '';

      if (field.type === 'text' || field.type === 'textarea') {
        const tf = form.createTextField(field.name);
        if (value) {
          tf.setText(value);
        } else {
          // pdf-lib setText('') leaves getValue() as undefined after save/load;
          // writing the V entry directly ensures getText() returns '' as expected.
          tf.acroField.dict.set(PDFName.of('V'), PDFString.of(''));
        }
        if (field.type === 'textarea') tf.enableMultiline();
        tf.addToPage(page, coords);
      }
    }

    for (const text of pageData.texts ?? []) {
      const coords = convertToPdfCoords(text, pageData);
      const font = text.bold ? helveticaBold : helvetica;
      const size = text.fontSize * (72 / 96);
      page.drawText(text.text, {
        x: coords.x,
        y: coords.y,
        size,
        font,
        color: hexToRgb(text.color),
      });
    }
  }

  return pdfDoc.save({ useObjectStreams: false });
}
