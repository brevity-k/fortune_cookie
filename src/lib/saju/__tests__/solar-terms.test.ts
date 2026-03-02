import { describe, it, expect } from 'vitest';
import { getSajuMonth, isBeforeIpchun, getSajuYear, daysToNearestSolarTerm } from '../solar-terms';

describe('getSajuMonth', () => {
  it('Feb 5 → 인월 (month 1, branch 2)', () => {
    const result = getSajuMonth(2026, 2, 5);
    expect(result.sajuMonth).toBe(1);
    expect(result.branchIndex).toBe(2);
  });

  it('Mar 10 → 묘월 (month 2, branch 3)', () => {
    const result = getSajuMonth(2026, 3, 10);
    expect(result.sajuMonth).toBe(2);
    expect(result.branchIndex).toBe(3);
  });

  it('Jan 3 (before 소한) → 자월 (month 11, branch 0)', () => {
    const result = getSajuMonth(2026, 1, 3);
    expect(result.sajuMonth).toBe(11);
    expect(result.branchIndex).toBe(0);
  });

  it('Jan 10 → 축월 (month 12, branch 1)', () => {
    const result = getSajuMonth(2026, 1, 10);
    expect(result.sajuMonth).toBe(12);
    expect(result.branchIndex).toBe(1);
  });

  it('Dec 10 → 자월 (month 11, branch 0)', () => {
    const result = getSajuMonth(2026, 12, 10);
    expect(result.sajuMonth).toBe(11);
    expect(result.branchIndex).toBe(0);
  });

  it('Aug 15 → 신월 (month 7, branch 8)', () => {
    const result = getSajuMonth(2026, 8, 15);
    expect(result.sajuMonth).toBe(7);
    expect(result.branchIndex).toBe(8);
  });
});

describe('isBeforeIpchun', () => {
  it('Jan 15 → true', () => {
    expect(isBeforeIpchun(1, 15)).toBe(true);
  });

  it('Feb 3 → true', () => {
    expect(isBeforeIpchun(2, 3)).toBe(true);
  });

  it('Feb 4 → false (입춘 day itself)', () => {
    expect(isBeforeIpchun(2, 4)).toBe(false);
  });

  it('Mar 1 → false', () => {
    expect(isBeforeIpchun(3, 1)).toBe(false);
  });
});

describe('getSajuYear', () => {
  it('2026-01-01 → 2025 (before 입춘)', () => {
    expect(getSajuYear(2026, 1, 1)).toBe(2025);
  });

  it('2026-02-05 → 2026 (after 입춘)', () => {
    expect(getSajuYear(2026, 2, 5)).toBe(2026);
  });

  it('2025-02-03 → 2024 (before 입춘)', () => {
    expect(getSajuYear(2025, 2, 3)).toBe(2024);
  });
});

describe('daysToNearestSolarTerm', () => {
  it('returns positive days forward', () => {
    const days = daysToNearestSolarTerm(2026, 3, 1, 'forward');
    expect(days).toBeGreaterThan(0);
    // Next term after Mar 1 is 청명 (~Apr 5) = ~35 days
    expect(days).toBeLessThan(40);
  });

  it('returns positive days backward', () => {
    const days = daysToNearestSolarTerm(2026, 3, 1, 'backward');
    expect(days).toBeGreaterThan(0);
    // Previous term before Mar 1 is 입춘 (~Feb 4) = ~25 days
    expect(days).toBeLessThan(30);
  });
});
