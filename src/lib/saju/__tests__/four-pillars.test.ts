import { describe, it, expect } from 'vitest';
import { calculateFourPillars } from '../four-pillars';
import type { BirthInfo } from '../types';

describe('calculateFourPillars', () => {
  it('1990-08-15 14:00 male → year stem 6 (庚), branch 6 (午)', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const pillars = calculateFourPillars(birth);
    expect(pillars.year.stem).toBe(6);   // 庚
    expect(pillars.year.branch).toBe(6); // 午
  });

  it('all stems are 0-9, all branches are 0-11', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const pillars = calculateFourPillars(birth);

    for (const pillar of [pillars.year, pillars.month, pillars.day]) {
      expect(pillar.stem).toBeGreaterThanOrEqual(0);
      expect(pillar.stem).toBeLessThan(10);
      expect(pillar.branch).toBeGreaterThanOrEqual(0);
      expect(pillar.branch).toBeLessThan(12);
    }
    if (pillars.hour) {
      expect(pillars.hour.stem).toBeGreaterThanOrEqual(0);
      expect(pillars.hour.stem).toBeLessThan(10);
      expect(pillars.hour.branch).toBeGreaterThanOrEqual(0);
      expect(pillars.hour.branch).toBeLessThan(12);
    }
  });

  it('before-입춘 date adjusts year pillar', () => {
    const birth: BirthInfo = { year: 2025, month: 1, day: 15, hour: 10, gender: 'female' };
    const pillars = calculateFourPillars(birth);
    // 2025 Jan 15 is before 입춘, so saju year = 2024 → 甲辰
    expect(pillars.year.stem).toBe(0);   // 甲
    expect(pillars.year.branch).toBe(4); // 辰
  });

  it('hour pillar is null when hour is null', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: null, gender: 'male' };
    const pillars = calculateFourPillars(birth);
    expect(pillars.hour).toBeNull();
    expect(pillars.year).toBeDefined();
    expect(pillars.month).toBeDefined();
    expect(pillars.day).toBeDefined();
  });

  it('different birth hours give different hour pillars', () => {
    const birth1: BirthInfo = { year: 1990, month: 8, day: 15, hour: 3, gender: 'male' };
    const birth2: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const p1 = calculateFourPillars(birth1);
    const p2 = calculateFourPillars(birth2);
    // Same day, different hours → same year/month/day, different hour
    expect(p1.year).toEqual(p2.year);
    expect(p1.month).toEqual(p2.month);
    expect(p1.day).toEqual(p2.day);
    expect(p1.hour).not.toEqual(p2.hour);
  });
});
