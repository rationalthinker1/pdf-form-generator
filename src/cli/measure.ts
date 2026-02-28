import { chromium } from 'playwright';
import type { ExtractedData } from '../index';

export async function measureForm(
  url: string,
  formData: Record<string, string> = {}
): Promise<ExtractedData> {
  console.log(`  Launching Chromium → ${url}`)
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  // Emulate print media so Tailwind's print: variants apply during measurement.
  // Form authors can use print:hidden, print:bg-white, etc. to control PDF output.
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
    // Use 'commit' — don't wait for networkidle here.
    // Vite may trigger a dep-optimization reload after first load;
    // waitForFunction below handles readiness across any reloads.
    await page.goto(url, { waitUntil: 'commit' });
    console.log('  Waiting for React mount...')

    // Wait up to 60s — covers initial load + any Vite dep-optimization reload
    await page.waitForFunction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => (window as any).__ready === true,
      { timeout: 60_000 }
    );
    console.log('  React mounted (window.__ready = true)')

    const data = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = (window as any).__extractFieldData;
      if (typeof fn !== 'function') throw new Error('window.__extractFieldData not found');
      return fn() as ExtractedData;
    });

    const totalFields = data.pages.reduce((n: number, p: { fields: unknown[] }) => n + p.fields.length, 0)
    console.log(`  Extracted ${totalFields} field(s) across ${data.pages.length} page(s)`)
    data.pages[0]?.fields.slice(0, 3).forEach((f: any) => console.log(`  field: ${f.name} = ${JSON.stringify(f.defaultValue)}`))

    return data;
  } finally {
    await browser.close();
  }
}
