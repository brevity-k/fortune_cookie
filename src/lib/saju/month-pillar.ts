import type { Pillar } from './types';
import { MONTH_STEM_START } from './constants';
import { getSajuMonth } from './solar-terms';

/**
 * Calculate the month pillar (월주).
 * Branch comes from the solar term month.
 * Stem is derived from the year stem via 오호둔 (Five Tiger Escape).
 */
export function calculateMonthPillar(
  year: number,
  month: number,
  day: number,
  yearStem: number
): Pillar {
  const { sajuMonth, branchIndex } = getSajuMonth(year, month, day);
  const stem = (MONTH_STEM_START[yearStem] + (sajuMonth - 1)) % 10;
  return { stem, branch: branchIndex };
}
