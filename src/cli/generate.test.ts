import { describe, it, expect, beforeAll } from 'bun:test';
import { generatePdf } from './generate';
import { PDFDocument, PDFName } from 'pdf-lib';
import type { ExtractedPage } from '../../index';

let basePdf: Uint8Array;

beforeAll(async () => {
  // Create a minimal 1-page PDF to serve as the Playwright base PDF
  const doc = await PDFDocument.create();
  doc.addPage([612, 792]);
  basePdf = await doc.save();
});

function makePage(fields: ExtractedPage['fields'] = []): ExtractedPage {
  return {
    widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
    fields,
    texts: [],
    boxes: [],
  };
}

describe('generatePdf', () => {
  it('produces a valid PDF binary', async () => {
    const pages = [
      makePage([
        {
          name: 'firstName',
          type: 'text',
          pageIndex: 0,
          x: 50, y: 100, width: 200, height: 24,
          xPt: 37.5, yTopPt: 75, widthPt: 150, heightPt: 18,
        },
      ]),
    ];

    const result = await generatePdf(basePdf, pages);
    expect(result).toBeInstanceOf(Uint8Array);

    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(1);

    const form = doc.getForm();
    const field = form.getTextField('firstName');
    expect(field).toBeDefined();
  });

  it('generates a field with empty value when not in data', async () => {
    const pages = [
      makePage([
        {
          name: 'lastName',
          type: 'text',
          pageIndex: 0,
          x: 50, y: 50, width: 200, height: 24,
          xPt: 37.5, yTopPt: 37.5, widthPt: 150, heightPt: 18,
        },
      ]),
    ];

    const result = await generatePdf(basePdf, pages);
    const doc = await PDFDocument.load(result);
    const field = doc.getForm().getTextField('lastName');
    expect(field.getText() ?? '').toBe('');
  });

  it('generates multiple pages', async () => {
    // Create a 2-page base PDF
    const doc = await PDFDocument.create();
    doc.addPage([612, 792]);
    doc.addPage([612, 792]);
    const twoPagePdf = await doc.save();

    const pages = [
      makePage(),
      makePage(),
    ];

    const result = await generatePdf(twoPagePdf, pages);
    const loaded = await PDFDocument.load(result);
    expect(loaded.getPageCount()).toBe(2);
  });

  it('creates date fields with AA validation dict', async () => {
    const pages = [
      makePage([
        {
          name: 'dob',
          type: 'date',
          pageIndex: 0,
          x: 50, y: 100, width: 200, height: 24,
          xPt: 37.5, yTopPt: 75, widthPt: 150, heightPt: 18,
        },
      ]),
    ];

    const result = await generatePdf(basePdf, pages);
    const doc = await PDFDocument.load(result);
    const form = doc.getForm();
    const field = form.getTextField('dob');
    expect(field).toBeDefined();
    // AA dict should be present on the acroField
    const aaEntry = field.acroField.dict.lookup(PDFName.of('AA'));
    expect(aaEntry).toBeDefined();
  });

  it('skips fields without PDF-space coordinates', async () => {
    const pages = [
      makePage([
        {
          name: 'noCoords',
          type: 'text',
          pageIndex: 0,
          x: 50, y: 100, width: 200, height: 24,
          // xPt/yTopPt/widthPt/heightPt intentionally omitted
        },
      ]),
    ];

    const result = await generatePdf(basePdf, pages);
    const doc = await PDFDocument.load(result);
    const form = doc.getForm();
    expect(form.getFields()).toHaveLength(0);
  });
});
