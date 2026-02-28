import { describe, it, expect } from 'bun:test';
import { convertToPdfCoords } from './convert';
import { PAGE_SIZES } from '../index';

const letterPage = PAGE_SIZES.letter;

describe('convertToPdfCoords', () => {
  it('converts x correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    );
    expect(result.x).toBeCloseTo(37.5);
  });

  it('flips Y axis correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    );
    // 792 - (100 + 24) * 0.75 = 792 - 93 = 699
    expect(result.y).toBeCloseTo(699);
  });

  it('converts width correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    );
    expect(result.width).toBeCloseTo(150);
  });

  it('converts height correctly', () => {
    const result = convertToPdfCoords(
      { x: 50, y: 100, width: 200, height: 24 },
      letterPage
    );
    expect(result.height).toBeCloseTo(18);
  });

  it('handles field at top-left origin', () => {
    const result = convertToPdfCoords(
      { x: 0, y: 0, width: 100, height: 20 },
      letterPage
    );
    expect(result.x).toBe(0);
    // y = 792 - (0 + 20) * 0.75 = 792 - 15 = 777
    expect(result.y).toBeCloseTo(777);
  });
});
