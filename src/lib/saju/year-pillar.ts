import type { Pillar } from './types';
import { getSajuYear } from './solar-terms';

/**
 * Calculate the year pillar (년주).
 * Uses the 60-year sexagenary cycle (육십갑자).
 * Year 4 CE = 甲子 (stem 0, branch 0), the base of the cycle.
 * The saju year starts at 입춘 (~Feb 4), not Jan 1.
 */
export function calculateYearPillar(year: number, month: number, day: number): Pillar {
  const sajuYear = getSajuYear(year, month, day);
  const stem = ((sajuYear - 4) % 10 + 10) % 10;
  const branch = ((sajuYear - 4) % 12 + 12) % 12;
  return { stem, branch };
}
