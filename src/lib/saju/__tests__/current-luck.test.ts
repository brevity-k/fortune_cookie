import { describe, it, expect } from 'vitest';
import { getCurrentYearPillar, getCurrentMonthPillar, getCurrentDayPillar } from '../current-luck';

describe('getCurrentYearPillar', () => {
  it('2026-03-01 → stem 2 (丙), branch 6 (午)', () => {
    const p = getCurrentYearPillar(new Date(2026, 2, 1)); // month is 0-indexed
    expect(p.stem).toBe(2);   // 丙
    expect(p.branch).toBe(6); // 午
  });

  it('returns valid ranges', () => {
    const p = getCurrentYearPillar();
    expect(p.stem).toBeGreaterThanOrEqual(0);
    expect(p.stem).toBeLessThan(10);
    expect(p.branch).toBeGreaterThanOrEqual(0);
    expect(p.branch).toBeLessThan(12);
  });
});

describe('getCurrentMonthPillar', () => {
  it('returns valid ranges', () => {
    const p = getCurrentMonthPillar();
    expect(p.stem).toBeGreaterThanOrEqual(0);
    expect(p.stem).toBeLessThan(10);
    expect(p.branch).toBeGreaterThanOrEqual(0);
    expect(p.branch).toBeLessThan(12);
  });
});

describe('getCurrentDayPillar', () => {
  it('returns valid ranges', () => {
    const p = getCurrentDayPillar();
    expect(p.stem).toBeGreaterThanOrEqual(0);
    expect(p.stem).toBeLessThan(10);
    expect(p.branch).toBeGreaterThanOrEqual(0);
    expect(p.branch).toBeLessThan(12);
  });
});
