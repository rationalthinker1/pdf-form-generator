import { PDFDocument, PDFName, StandardFonts, rgb } from 'pdf-lib';
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
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const form = pdfDoc.getForm();

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const FONT_SIZE = 10;

  for (const pageData of pages) {
    const page = pdfDoc.addPage([pageData.widthPt, pageData.heightPt]);

    // Draw static texts (labels, headings) BEFORE AcroForm annotations
    for (const text of pageData.texts ?? []) {
      const coords = convertToPdfCoords(text, pageData);
      const font = text.bold ? helveticaBold : helvetica;
      const size = text.fontSize * (72 / 96);
      page.drawText(text.text, {
        x: coords.x,
        y: coords.y + 2,
        size,
        font,
        color: hexToRgb(text.color),
      });
    }

    for (const field of pageData.fields) {
      const coords = convertToPdfCoords(field, pageData);

      if (field.type === 'text' || field.type === 'textarea') {
        // Draw pre-filled value as page text so it renders at the correct size
        const value = field.defaultValue ?? '';
        if (value) {
          const size = FONT_SIZE;
          const y = coords.y + (coords.height - size) / 2;
          page.drawText(value, {
            x: coords.x + 4,
            y,
            size,
            font: helvetica,
            color: rgb(0.094, 0.094, 0.094), // text-gray-800 ≈ #181818
          });
        }

        const tf = form.createTextField(field.name);
        if (field.type === 'textarea') tf.enableMultiline();
        // Transparent background, with border drawn by the widget itself
        // (widget annotations render on top of page content, so border must be on the widget)
        tf.addToPage(page, {
          ...coords,
          font: helvetica,
          backgroundColor: undefined,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.75,
        });
        tf.setFontSize(FONT_SIZE);
      }
    }

    for (const box of pageData.boxes ?? []) {
      const coords = convertToPdfCoords(box, pageData);
      page.drawRectangle({
        x: coords.x,
        y: coords.y,
        width: coords.width,
        height: coords.height,
        borderColor: rgb(0, 0, 0),
        borderWidth: box.borderWidth ?? 1.5,
      });
    }
  }

  // Remove AP streams so PDF viewers use DA (font size) for editing
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  const pdfDoc2 = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

  for (const field of pdfDoc2.getForm().getFields()) {
    for (const widget of field.acroField.getWidgets()) {
      widget.dict.delete(PDFName.of('AP'));
    }
  }

  return pdfDoc2.save({ useObjectStreams: false });
}
