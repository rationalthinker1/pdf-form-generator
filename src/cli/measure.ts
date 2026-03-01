import { chromium } from 'playwright';
import type { ExtractedData } from '../index';

export async function measureForm(
  url: string,
  formData: Record<string, string> = {}
): Promise<{ data: ExtractedData; pdfBytes: Uint8Array }> {
  console.log(`  Launching Chromium → ${url}`)
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  // Match the letter page width (816px) plus Document padding (p-8 = 32px each side)
  await page.setViewportSize({ width: 880, height: 1056 });
  await page.emulateMedia({ media: 'print' });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`  [browser] ${msg.text()}`)
  })
  page.on('pageerror', err => console.log(`  [browser error] ${err.message}`))
  page.on('response', res => {
    if (res.status() >= 400) console.log(`  [${res.status()}] ${res.url()}`)
  })

  try {
    await page.addInitScript((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__formData = data;
    }, formData);

    console.log('  Navigating...')
    await page.goto(url, { waitUntil: 'commit' });
    console.log('  Waiting for React mount...')

    await page.waitForFunction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => (window as any).__ready === true,
      { timeout: 60_000 }
    );
    console.log('  React mounted (window.__ready = true)')

    // Wait for fonts (e.g. Inter from Google Fonts) to finish loading
    await page.evaluate(() => document.fonts.ready);
    console.log('  Fonts ready')

    const data = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = (window as any).__extractFieldData;
      if (typeof fn !== 'function') throw new Error('window.__extractFieldData not found');
      return fn() as ExtractedData;
    });

    const totalFields = data.pages.reduce((n: number, p: { fields: unknown[] }) => n + p.fields.length, 0)
    console.log(`  Extracted ${totalFields} field(s) across ${data.pages.length} page(s)`)

    // Generate PDF via Playwright — captures all CSS, Tailwind, fonts exactly as rendered
    console.log('  Printing to PDF...')
    const pdfBytes = await page.pdf({
      printBackground: true,
      width: '8.5in',
      height: '11in',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })
    console.log('  PDF printed')

    // Re-extract field positions relative to each Page element's top-left corner,
    // converted to PDF points. Playwright prints each [data-pdf-page] as a separate page.
    const SCALE = 72 / 96;
    // Playwright pdf() breaks pages every viewport-height (1056px). To find a field's
    // position within its PDF page, compute (field absolute doc top - pageIndex * 1056).
    const PAGE_HEIGHT_PX = 1056;
    const fields = await page.evaluate(({ scale, pageHeightPx }) => {
      const pageEls = Array.from(document.querySelectorAll<HTMLElement>('[data-pdf-page]'));
      return Array.from(document.querySelectorAll<HTMLElement>('[data-field-name]')).map(el => {
        const fieldRect = el.getBoundingClientRect();
        const pageEl = el.closest<HTMLElement>('[data-pdf-page]');
        const pageRect = pageEl ? pageEl.getBoundingClientRect() : { left: 0, top: 0 };
        const pageIndex = pageEl ? pageEls.indexOf(pageEl) : 0;
        // Field's absolute top in document (scrollY=0 in headless)
        const fieldDocTop = fieldRect.top + window.scrollY;
        // Subtract where Playwright's PDF page N starts (pageIndex * pageHeightPx)
        const yWithinPdfPage = fieldDocTop - pageIndex * pageHeightPx;
        return {
          name: el.dataset.fieldName!,
          xPt: (fieldRect.left - pageRect.left) * scale,
          yTopPt: yWithinPdfPage * scale,
          widthPt: fieldRect.width * scale,
          heightPt: fieldRect.height * scale,
        };
      });
    }, { scale: SCALE, pageHeightPx: PAGE_HEIGHT_PX });

    // Attach PDF-space coords to each field in extracted data
    const fieldMap = new Map(fields.map(f => [f.name, f]));
    for (const p of data.pages) {
      for (const field of p.fields) {
        const f = fieldMap.get(field.name);
        if (f) {
          Object.assign(field, { xPt: f.xPt, yTopPt: f.yTopPt, widthPt: f.widthPt, heightPt: f.heightPt });
        }
      }
    }

    return { data, pdfBytes };
  } finally {
    await browser.close();
  }
}
