import { describe, it, expect } from 'vitest';
import { getMajorLuckDirection, getMajorLuckStartAge, calculateMajorLuckCycles } from '../major-luck';
import { calculateFourPillars } from '../four-pillars';
import type { BirthInfo } from '../types';

describe('getMajorLuckDirection', () => {
  it('yang year + male → forward', () => {
    expect(getMajorLuckDirection(0, 'male')).toBe('forward');  // 甲 is yang
  });

  it('yang year + female → backward', () => {
    expect(getMajorLuckDirection(0, 'female')).toBe('backward');
  });

  it('yin year + male → backward', () => {
    expect(getMajorLuckDirection(1, 'male')).toBe('backward');  // 乙 is yin
  });

  it('yin year + female → forward', () => {
    expect(getMajorLuckDirection(1, 'female')).toBe('forward');
  });
});

describe('getMajorLuckStartAge', () => {
  it('returns a reasonable starting age (0-10)', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const age = getMajorLuckStartAge(birth, 'forward');
    expect(age).toBeGreaterThanOrEqual(0);
    expect(age).toBeLessThanOrEqual(10);
  });
});

describe('calculateMajorLuckCycles', () => {
  it('returns 8 cycles by default', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const pillars = calculateFourPillars(birth);
    const cycles = calculateMajorLuckCycles(birth, pillars);
    expect(cycles).toHaveLength(8);
  });

  it('each cycle is 10 years apart', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const pillars = calculateFourPillars(birth);
    const cycles = calculateMajorLuckCycles(birth, pillars);
    for (let i = 1; i < cycles.length; i++) {
      expect(cycles[i].startAge - cycles[i - 1].startAge).toBe(10);
    }
  });

  it('all stems (0-9) and branches (0-11) are valid', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const pillars = calculateFourPillars(birth);
    const cycles = calculateMajorLuckCycles(birth, pillars);
    for (const cycle of cycles) {
      expect(cycle.stem).toBeGreaterThanOrEqual(0);
      expect(cycle.stem).toBeLessThan(10);
      expect(cycle.branch).toBeGreaterThanOrEqual(0);
      expect(cycle.branch).toBeLessThan(12);
    }
  });

  it('respects custom count', () => {
    const birth: BirthInfo = { year: 1990, month: 8, day: 15, hour: 14, gender: 'male' };
    const pillars = calculateFourPillars(birth);
    const cycles = calculateMajorLuckCycles(birth, pillars, 5);
    expect(cycles).toHaveLength(5);
  });
});
