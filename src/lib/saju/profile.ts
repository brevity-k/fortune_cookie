import type { BirthInfo, SajuChart } from './types';
import { calculateFourPillars } from './four-pillars';
import { analyzeFiveElements } from './five-elements';
import { calculateMajorLuckCycles } from './major-luck';

export interface SajuProfile {
  birthInfo: BirthInfo;
  chart: SajuChart;
  createdAt: string;
}

const STORAGE_KEY = 'saju_profile';

export function saveSajuProfile(birthInfo: BirthInfo): SajuProfile {
  const fourPillars = calculateFourPillars(birthInfo);
  const fiveElements = analyzeFiveElements(fourPillars);
  const majorLuckCycles = calculateMajorLuckCycles(birthInfo, fourPillars);

  const profile: SajuProfile = {
    birthInfo,
    chart: { birthInfo, fourPillars, fiveElements, majorLuckCycles },
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  return profile;
}

export function getSajuProfile(): SajuProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SajuProfile;
  } catch {
    return null;
  }
}

export function clearSajuProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
