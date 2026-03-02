import type { BirthInfo, FourPillars } from './types';
import { calculateYearPillar } from './year-pillar';
import { calculateMonthPillar } from './month-pillar';
import { calculateDayPillar } from './day-pillar';
import { calculateHourPillar } from './hour-pillar';

/**
 * Calculate all four pillars (사주 四柱) from birth information.
 * Uses 야자시 convention: hour 23 uses current day's day pillar.
 */
export function calculateFourPillars(birthInfo: BirthInfo): FourPillars {
  const { year, month, day, hour } = birthInfo;

  const yearPillar = calculateYearPillar(year, month, day);
  const monthPillar = calculateMonthPillar(year, month, day, yearPillar.stem);
  const dayPillar = calculateDayPillar(year, month, day);
  const hourPillar = hour !== null ? calculateHourPillar(hour, dayPillar.stem) : null;

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
}
