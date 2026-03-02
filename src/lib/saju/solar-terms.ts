import { SOLAR_TERM_BOUNDARIES } from './constants';

interface SajuMonthResult {
  sajuMonth: number;
  branchIndex: number;
  termName: string;
}

/**
 * Build a chronologically ordered list of solar term boundaries for a year.
 * The raw SOLAR_TERM_BOUNDARIES are ordered Feb→Dec→Jan.
 * Chronologically for any year: 소한(Jan) comes first, then 입춘(Feb)→...→대설(Dec).
 */
function getChronologicalBoundaries() {
  // Last entry is 소한 (Jan), move it to front for chronological order
  const sohan = SOLAR_TERM_BOUNDARIES[SOLAR_TERM_BOUNDARIES.length - 1]; // Jan 소한
  const rest = SOLAR_TERM_BOUNDARIES.slice(0, -1); // Feb 입춘 → Dec 대설
  return [sohan, ...rest];
}

/**
 * Determine which saju month a given Gregorian date falls in.
 * Saju months are delimited by 절기 (solar terms), not calendar months.
 */
export function getSajuMonth(_year: number, month: number, day: number): SajuMonthResult {
  const chronological = getChronologicalBoundaries();

  // Find the last boundary the date is on or after
  let matched = chronological[0]; // default: 소한 (축월)
  for (const term of chronological) {
    if (month > term.month || (month === term.month && day >= term.day)) {
      matched = term;
    }
  }

  // Special case: dates before 소한 (first boundary, ~Jan 6) fall in 자월 (대설's month)
  const sohan = chronological[0];
  if (month < sohan.month || (month === sohan.month && day < sohan.day)) {
    // Before 소한 → still in 자월 (대설, month 11, branch 0)
    return {
      sajuMonth: 11,
      branchIndex: 0,
      termName: '대설',
    };
  }

  return {
    sajuMonth: matched.sajuMonth,
    branchIndex: matched.branchIndex,
    termName: matched.korean,
  };
}

/**
 * Check if a date is before 입춘 (~Feb 4), meaning it belongs to the previous saju year.
 */
export function isBeforeIpchun(month: number, day: number): boolean {
  const ipchun = SOLAR_TERM_BOUNDARIES[0]; // 입춘 is first in raw array
  if (month < ipchun.month) return true;
  if (month === ipchun.month && day < ipchun.day) return true;
  return false;
}

/**
 * Get the saju year, which starts at 입춘 (~Feb 4).
 * Dates before 입춘 belong to the previous year.
 */
export function getSajuYear(year: number, month: number, day: number): number {
  return isBeforeIpchun(month, day) ? year - 1 : year;
}

/**
 * Calculate days from a given date to the nearest solar term boundary.
 * Used for calculating 대운 starting age.
 * @param direction 'forward' = next term, 'backward' = previous term
 */
export function daysToNearestSolarTerm(
  year: number,
  month: number,
  day: number,
  direction: 'forward' | 'backward'
): number {
  const birthDate = new Date(year, month - 1, day);
  const chronological = getChronologicalBoundaries();

  // Build concrete dates for this year and adjacent years
  const termDates: Date[] = [];
  for (const offset of [-1, 0, 1]) {
    for (const term of chronological) {
      termDates.push(new Date(year + offset, term.month - 1, term.day));
    }
  }

  if (direction === 'forward') {
    let minDays = Infinity;
    for (const td of termDates) {
      if (td > birthDate) {
        const days = Math.round((td.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
        if (days < minDays) minDays = days;
      }
    }
    return minDays;
  } else {
    let minDays = Infinity;
    for (const td of termDates) {
      if (td < birthDate) {
        const days = Math.round((birthDate.getTime() - td.getTime()) / (1000 * 60 * 60 * 24));
        if (days < minDays) minDays = days;
      }
    }
    return minDays;
  }
}
