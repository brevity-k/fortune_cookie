import { describe, it, expect } from 'vitest';
import { calculateMonthPillar } from '../month-pillar';

describe('calculateMonthPillar', () => {
  it('2024-02-05 → 丙寅 (stem 2, branch 2) — year 甲(0)', () => {
    // Year stem 甲(0), 오호둔→丙(2), saju month 1 → stem = (2 + 0) % 10 = 2
    const p = calculateMonthPillar(2024, 2, 5, 0);
    expect(p.stem).toBe(2);   // 丙
    expect(p.branch).toBe(2); // 寅
  });

  it('2024-03-10 → 丁卯 (stem 3, branch 3) — month 2', () => {
    // Year stem 甲(0), 오호둔→丙(2), saju month 2 → stem = (2 + 1) % 10 = 3
    const p = calculateMonthPillar(2024, 3, 10, 0);
    expect(p.stem).toBe(3);   // 丁
    expect(p.branch).toBe(3); // 卯
  });

  it('2025-07-10 → 癸未 (stem 9, branch 7) — year 乙(1)', () => {
    // Year stem 乙(1), 오호둔→戊(4), saju month 6 → stem = (4 + 5) % 10 = 9
    const p = calculateMonthPillar(2025, 7, 10, 1);
    expect(p.stem).toBe(9);   // 癸
    expect(p.branch).toBe(7); // 未
  });

  it('stems are always 0-9, branches are always 0-11', () => {
    for (let yearStem = 0; yearStem < 10; yearStem++) {
      const p = calculateMonthPillar(2024, 6, 15, yearStem);
      expect(p.stem).toBeGreaterThanOrEqual(0);
      expect(p.stem).toBeLessThan(10);
      expect(p.branch).toBeGreaterThanOrEqual(0);
      expect(p.branch).toBeLessThan(12);
    }
  });
});
