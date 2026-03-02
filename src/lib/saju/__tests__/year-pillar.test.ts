import { describe, it, expect } from 'vitest';
import { calculateYearPillar } from '../year-pillar';

describe('calculateYearPillar', () => {
  it('2024-03-01 → 甲辰 (stem 0, branch 4) — Year of the Dragon', () => {
    const p = calculateYearPillar(2024, 3, 1);
    expect(p.stem).toBe(0);   // 甲
    expect(p.branch).toBe(4); // 辰 (Dragon)
  });

  it('2025-06-15 → 乙巳 (stem 1, branch 5)', () => {
    const p = calculateYearPillar(2025, 6, 15);
    expect(p.stem).toBe(1);   // 乙
    expect(p.branch).toBe(5); // 巳
  });

  it('2025-01-15 (before 입춘) → 甲辰 (uses 2024)', () => {
    const p = calculateYearPillar(2025, 1, 15);
    expect(p.stem).toBe(0);   // 甲 (2024's year)
    expect(p.branch).toBe(4); // 辰
  });

  it('1990-08-15 → 庚午 (stem 6, branch 6)', () => {
    const p = calculateYearPillar(1990, 8, 15);
    expect(p.stem).toBe(6);   // 庚
    expect(p.branch).toBe(6); // 午
  });

  it('1984-05-01 → 甲子 (stem 0, branch 0) — the base year', () => {
    const p = calculateYearPillar(1984, 5, 1);
    expect(p.stem).toBe(0);   // 甲
    expect(p.branch).toBe(0); // 子
  });

  it('stems are always 0-9, branches are always 0-11', () => {
    for (const year of [1940, 1960, 1980, 2000, 2020, 2040]) {
      const p = calculateYearPillar(year, 6, 15);
      expect(p.stem).toBeGreaterThanOrEqual(0);
      expect(p.stem).toBeLessThan(10);
      expect(p.branch).toBeGreaterThanOrEqual(0);
      expect(p.branch).toBeLessThan(12);
    }
  });
});
