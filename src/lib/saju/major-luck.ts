import type { BirthInfo, FourPillars, MajorLuckCycle } from './types';
import { STEM_YINYANG } from './constants';
import { daysToNearestSolarTerm } from './solar-terms';

/**
 * Determine the direction of major luck cycles.
 * 양남음녀 (yang male / yin female) = forward
 * 음남양녀 (yin male / yang female) = backward
 */
export function getMajorLuckDirection(yearStem: number, gender: BirthInfo['gender']): 'forward' | 'backward' {
  const yinYang = STEM_YINYANG[yearStem];
  if ((yinYang === 'yang' && gender === 'male') || (yinYang === 'yin' && gender === 'female')) {
    return 'forward';
  }
  return 'backward';
}

/**
 * Calculate the starting age of the first major luck cycle.
 * Days from birth to nearest 절기 (in the direction) ÷ 3 = starting age.
 */
export function getMajorLuckStartAge(birth: BirthInfo, direction: 'forward' | 'backward'): number {
  const days = daysToNearestSolarTerm(birth.year, birth.month, birth.day, direction);
  return Math.round(days / 3);
}

/**
 * Calculate major luck cycles (대운).
 * Starting from the month pillar, progress stem and branch in the direction.
 * Each cycle lasts 10 years.
 */
export function calculateMajorLuckCycles(
  birth: BirthInfo,
  fourPillars: FourPillars,
  count: number = 8
): MajorLuckCycle[] {
  const direction = getMajorLuckDirection(fourPillars.year.stem, birth.gender);
  const startAge = getMajorLuckStartAge(birth, direction);
  const step = direction === 'forward' ? 1 : -1;

  const cycles: MajorLuckCycle[] = [];
  for (let i = 0; i < count; i++) {
    const offset = (i + 1) * step;
    cycles.push({
      startAge: startAge + i * 10,
      stem: ((fourPillars.month.stem + offset) % 10 + 10) % 10,
      branch: ((fourPillars.month.branch + offset) % 12 + 12) % 12,
    });
  }

  return cycles;
}
