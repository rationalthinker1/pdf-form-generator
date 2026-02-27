import { chromium } from 'playwright'
import type { ExtractedData } from '@pdf-form/core'

export async function measureForm(
  url: string,
  formData: Record<string, string> = {}
): Promise<ExtractedData> {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Inject form data before page loads
    await page.addInitScript((data) => {
      (window as any).__formData = data
    }, formData)

    await page.goto(url)

    // Wait for React to mount and signal readiness
    await page.waitForFunction(() => (window as any).__ready === true, {
      timeout: 15_000,
    })

    const data = await page.evaluate(() => {
      const fn = (window as any).__extractFieldData
      if (typeof fn !== 'function') throw new Error('window.__extractFieldData not found')
      return fn() as ExtractedData
    })

    return data
  } finally {
    await browser.close()
  }
}
