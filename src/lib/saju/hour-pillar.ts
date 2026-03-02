import type { Pillar } from './types';
import { HOUR_STEM_START } from './constants';

/**
 * Get the earthly branch index for a given hour (0-23).
 * Each branch covers a 2-hour period. Hour 23 and 0 are both 子시 (branch 0).
 */
export function getHourBranch(hour: number): number {
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2);
}

/**
 * Calculate the hour pillar (시주).
 * Branch from the birth hour, stem from 오자둔 (Five Rat Escape) using the day stem.
 * Uses 야자시 convention: hour 23 uses the current day's day pillar.
 */
export function calculateHourPillar(hour: number, dayStem: number): Pillar {
  const branch = getHourBranch(hour);
  const stem = (HOUR_STEM_START[dayStem] + branch) % 10;
  return { stem, branch };
}
