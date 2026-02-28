import type { PageDimensions } from '@pdf-form/core';

const SCALE = 72 / 96; // 1px = 0.75pt

interface PixelRect {
  x: number
  y: number
  width: number
  height: number
}

export interface PdfRect {
  x: number
  y: number
  width: number
  height: number
}

export function convertToPdfCoords(rect: PixelRect, page: PageDimensions): PdfRect {
  return {
    x:      rect.x * SCALE,
    y:      page.heightPt - (rect.y + rect.height) * SCALE,
    width:  rect.width  * SCALE,
    height: rect.height * SCALE,
  };
}
