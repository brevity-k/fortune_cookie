import type { Pillar } from './types';
import KoreanLunarCalendar from 'korean-lunar-calendar';

/**
 * Calculate the day pillar (일주) using the korean-lunar-calendar library.
 * The library provides accurate 60-day sexagenary cycle data via getGapJaIndex().
 */
export function calculateDayPillar(year: number, month: number, day: number): Pillar {
  const cal = new KoreanLunarCalendar();
  cal.setSolarDate(year, month, day);
  const idx = cal.getGapJaIndex();
  return {
    stem: idx.cheongan.day,
    branch: idx.ganji.day,
  };
}
