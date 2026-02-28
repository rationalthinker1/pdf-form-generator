import { chromium } from 'playwright';
import type { ExtractedData } from '../../index';

export async function measureForm(
  url: string,
  formData: Record<string, string> = {}
): Promise<ExtractedData> {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    // Inject form data before page loads
    await page.addInitScript((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__formData = data;
    }, formData);

    // Use 'commit' so goto returns immediately once the response is committed,
    // without waiting for scripts to finish. waitForFunction then handles
    // the actual React mount, including any Vite dep-optimizer reload that
    // may follow the initial navigation.
    await page.goto(url, { waitUntil: 'commit' });

    // Wait for React to mount and signal readiness
    await page.waitForFunction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => (window as any).__ready === true,
      { timeout: 30_000 }
    );

    const data = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = (window as any).__extractFieldData;
      if (typeof fn !== 'function') throw new Error('window.__extractFieldData not found');
      return fn() as ExtractedData;
    });

    return data;
  } finally {
    await browser.close();
  }
}
