import { PDFDocument, PDFName, PDFString, StandardFonts } from 'pdf-lib';
import type { ExtractedPage } from '../index';

export async function generatePdf(
  playwrightPdf: Uint8Array,
  pages: ExtractedPage[],
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(playwrightPdf, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const FONT_SIZE = 10;

  const pdfPages = pdfDoc.getPages();

  for (const pageData of pages) {
    for (const field of pageData.fields) {
      if (field.xPt === undefined || field.yTopPt === undefined || field.widthPt === undefined || field.heightPt === undefined) continue;

      // Playwright PDF Y-axis: origin is top-left of the whole document.
      // pdf-lib Y-axis: origin is bottom-left of each page.
      // Each PDF page is 792pt tall (letter). Find which page this field lands on.
      const page = pdfPages[field.pageIndex];
      if (!page) continue;
      const { height: pageHeightPt } = page.getSize();

      // yTopPt is distance from document top; convert to pdf-lib bottom-origin within the page
      // For single-page: pdfY = pageHeight - yTopPt - heightPt
      // For multi-page: need page offset. Playwright stacks pages vertically in the PDF.
      // Page N starts at N * pageHeightPt from document top.
      const pageTopPt = field.pageIndex * pageHeightPt;
      const yPt = pageHeightPt - (field.yTopPt - pageTopPt) - field.heightPt;

      if (field.type === 'text' || field.type === 'textarea' || field.type === 'date') {
        const tf = form.createTextField(field.name);
        if (field.type === 'textarea') tf.enableMultiline();
        const PAD_LEFT = 4;
        tf.addToPage(page, {
          x: field.xPt + PAD_LEFT,
          y: yPt,
          width: field.widthPt - PAD_LEFT,
          height: field.heightPt,
          font: helvetica,
          backgroundColor: undefined,
          borderColor: undefined,
          borderWidth: 0,
        });
        tf.setFontSize(FONT_SIZE);

        if (field.type === 'date') {
          const aaDict = pdfDoc.context.obj({
            K: pdfDoc.context.obj({
              S: PDFName.of('JavaScript'),
              JS: PDFString.of('AFDate_KeystrokeEx("yyyy-mm-dd")'),
            }),
            F: pdfDoc.context.obj({
              S: PDFName.of('JavaScript'),
              JS: PDFString.of('AFDate_FormatEx("yyyy-mm-dd")'),
            }),
          });
          tf.acroField.dict.set(PDFName.of('AA'), aaDict);
        }
      }
    }
  }

  // Remove AP streams so viewers use DA font size when field is active
  for (const field of form.getFields()) {
    for (const widget of field.acroField.getWidgets()) {
      widget.dict.delete(PDFName.of('AP'));
    }
  }

  return pdfDoc.save({ useObjectStreams: false });
}
