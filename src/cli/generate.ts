import { PDFDocument, PDFName, PDFString, StandardFonts } from 'pdf-lib';
import type { ExtractedData } from '../index';

export async function generatePdf(
  playwrightPdf: Uint8Array,
  { pages, scripts }: ExtractedData,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(playwrightPdf, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const FONT_SIZE = 10;

  const pdfPages = pdfDoc.getPages();

  for (const pageData of pages) {
    for (const field of pageData.fields) {
      if (field.xPt === undefined || field.yTopPt === undefined || field.widthPt === undefined || field.heightPt === undefined) continue;

      const page = pdfPages[field.pageIndex];
      if (!page) continue;
      const { height: pageHeightPt } = page.getSize();

      const pageTopPt = field.pageIndex * pageHeightPt;
      const yPt = pageHeightPt - (field.yTopPt - pageTopPt) - field.heightPt;

      if (field.type === 'text' || field.type === 'textarea' || field.type === 'date') {
        const tf = form.createTextField(field.name);
        if (field.type === 'textarea') tf.enableMultiline();
        const PAD_LEFT = 2;
        const PAD_RIGHT = 2;
        tf.addToPage(page, {
          x: field.xPt + PAD_LEFT,
          y: yPt,
          width: field.widthPt - PAD_LEFT - PAD_RIGHT,
          height: field.heightPt,
          font: helvetica,
          backgroundColor: undefined,
          borderColor: undefined,
          borderWidth: 0,
        });
        tf.setFontSize(FONT_SIZE);

        if (field.type === 'date') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const aaDict: Record<string, any> = {
            K: pdfDoc.context.obj({ S: PDFName.of('JavaScript'), JS: PDFString.of('AFDate_KeystrokeEx("yyyy-mm-dd")') }),
            F: pdfDoc.context.obj({ S: PDFName.of('JavaScript'), JS: PDFString.of('AFDate_FormatEx("yyyy-mm-dd")') }),
          };
          tf.acroField.dict.set(PDFName.of('AA'), pdfDoc.context.obj(aaDict));
        }
      }
    }
  }

  // Embed document-level JavaScript from <Pdf.Script> blocks.
  // Each script runs when the PDF opens; `this` is the document object,
  // giving full access to all fields via this.getField("name").
  if (scripts.length > 0) {
    const combined = scripts.join('\n\n');
    const jsDict = pdfDoc.context.obj({
      S: PDFName.of('JavaScript'),
      JS: PDFString.of(combined),
    });
    const openAction = pdfDoc.context.obj({
      Type: PDFName.of('Action'),
      S: PDFName.of('JavaScript'),
      JS: PDFString.of(combined),
    });
    pdfDoc.catalog.set(PDFName.of('OpenAction'), openAction);
    // Also register in the Names tree so the script is a named JS action
    const namesDict = pdfDoc.context.obj({
      JavaScript: pdfDoc.context.obj({
        Names: pdfDoc.context.obj([PDFString.of('PdfFormScript'), jsDict]),
      }),
    });
    pdfDoc.catalog.set(PDFName.of('Names'), namesDict);
  }

  // Remove AP streams so viewers use DA font size when field is active
  for (const field of form.getFields()) {
    for (const widget of field.acroField.getWidgets()) {
      widget.dict.delete(PDFName.of('AP'));
    }
  }

  return pdfDoc.save({ useObjectStreams: false });
}
