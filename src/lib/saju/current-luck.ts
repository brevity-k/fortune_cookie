import type { Pillar } from './types';
import { calculateYearPillar } from './year-pillar';
import { calculateMonthPillar } from './month-pillar';
import { calculateDayPillar } from './day-pillar';

/**
 * Get the year pillar for the current (or specified) date.
 * Represents 세운 (yearly fortune).
 */
export function getCurrentYearPillar(date?: Date): Pillar {
  const d = date ?? new Date();
  return calculateYearPillar(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * Get the month pillar for the current (or specified) date.
 * Represents 월운 (monthly fortune).
 */
export function getCurrentMonthPillar(date?: Date): Pillar {
  const d = date ?? new Date();
  const yearPillar = getCurrentYearPillar(d);
  return calculateMonthPillar(d.getFullYear(), d.getMonth() + 1, d.getDate(), yearPillar.stem);
}

/**
 * Get the day pillar for the current (or specified) date.
 * Represents 일운 (daily fortune).
 */
export function getCurrentDayPillar(date?: Date): Pillar {
  const d = date ?? new Date();
  return calculateDayPillar(d.getFullYear(), d.getMonth() + 1, d.getDate());
}
