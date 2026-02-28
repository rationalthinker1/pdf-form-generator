import { PDFDocument, PDFString, PDFName, StandardFonts, rgb } from 'pdf-lib';
import { convertToPdfCoords } from './convert';
import type { ExtractedPage } from '../index';

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
        tf.acroField.dict.set(PDFName.of('V'), PDFString.of(value));
        if (field.type === 'textarea') tf.enableMultiline();
        tf.addToPage(page, { ...coords, font: helvetica });
        // Draw pre-filled value as static page content so it renders at the correct
        // size regardless of how the PDF viewer handles AcroForm appearance streams.
        if (value) {
          const FONT_SIZE = 10;
          // coords.y = bottom of field in PDF pts (origin bottom-left)
          // drawText y = baseline position; center baseline in the field height
          const ascent = helvetica.heightAtSize(FONT_SIZE);
          const textY = coords.y + (coords.height - ascent) / 2;
          page.drawText(value, {
            x: coords.x + 3,
            y: textY,
            size: FONT_SIZE,
            font: helvetica,
            color: rgb(0, 0, 0),
          });
        }
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

  // Generate appearance streams with auto-sized font, then patch all DAs to 10pt
  // and remove the AP streams so viewers render from DA with the fixed font size.
  form.updateFieldAppearances(helvetica);

  const daKey = PDFName.of('DA');
  const apKey = PDFName.of('AP');
  for (const field of form.getFields()) {
    const da = field.acroField.dict.get(daKey);
    if (da instanceof PDFString) {
      field.acroField.dict.set(daKey, PDFString.of(da.decodeText().replace(/\d+(\.\d+)? Tf/, '10 Tf')));
    }
    // Remove cached AP streams — viewers will re-render from DA at the correct size
    field.acroField.dict.delete(apKey);
    for (const widget of field.acroField.getWidgets()) {
      widget.dict.delete(apKey);
    }
  }

  return pdfDoc.save({ useObjectStreams: false });
}
