import { describe, it, expect } from 'bun:test';
import { generatePdf } from './generate';
import { PDFDocument } from 'pdf-lib';
import type { ExtractedPage } from '../../index';
import { inflateSync } from 'node:zlib';

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
    ];

    const result = await generatePdf(pages, { firstName: 'Bob' });
    expect(result).toBeInstanceOf(Uint8Array);

    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(1);

    const form = doc.getForm();
    const field = form.getTextField('firstName');
    expect(field.getText()).toBe('Bob');
  });

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
    ];

    const result = await generatePdf(pages, {});
    const doc = await PDFDocument.load(result);
    const field = doc.getForm().getTextField('lastName');
    expect(field.getText()).toBe('');
  });

  it('generates multiple pages', async () => {
    const pages = [
      {
        widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
        fields: [],
        texts: [],
      },
      {
        widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
        fields: [],
        texts: [],
      },
    ];

    const result = await generatePdf(pages, {});
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(2);
  });
});

describe('generatePdf - text', () => {
  it('draws static text onto the page', async () => {
    const page: ExtractedPage = {
      widthPx: 816, heightPx: 1056, widthPt: 612, heightPt: 792,
      fields: [],
      texts: [
        { text: 'Hello World', pageIndex: 0, x: 10, y: 10, width: 200, height: 20, fontSize: 12, bold: false, color: '#000000' }
      ],
    };
    const result = await generatePdf([page], {});
    // pdf-lib compresses content streams with FlateDecode and encodes text as
    // hex (e.g. <48656C6C6F20576F726C64> for "Hello World"). Decompress each
    // stream and verify the hex-encoded text is present.
    const buf = Buffer.from(result);
    const streamMarker = Buffer.from('stream\n');
    const endStreamMarker = Buffer.from('\nendstream');
    let found = false;
    let offset = 0;
    const helloWorldHex = Buffer.from('Hello World').toString('hex').toUpperCase();
    while (offset < buf.length) {
      const streamStart = buf.indexOf(streamMarker, offset);
      if (streamStart === -1) break;
      const contentStart = streamStart + streamMarker.length;
      const streamEnd = buf.indexOf(endStreamMarker, contentStart);
      if (streamEnd === -1) break;
      const streamBytes = buf.slice(contentStart, streamEnd);
      try {
        const decompressed = inflateSync(streamBytes).toString('ascii');
        if (decompressed.toUpperCase().includes(helloWorldHex)) {
          found = true;
          break;
        }
      } catch {
        // not a deflate stream, skip
      }
      offset = contentStart;
    }
    expect(found).toBe(true);
  });
});
