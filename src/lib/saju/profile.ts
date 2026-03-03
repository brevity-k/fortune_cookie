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

// Cache for useSyncExternalStore — must return the same reference when data hasn't changed
let cachedRaw: string | null = null;
let cachedProfile: SajuProfile | null = null;

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
    const json = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, json);
    cachedRaw = json;
    cachedProfile = profile;
  }

  return profile;
}

export function getSajuProfile(): SajuProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
  if (raw === cachedRaw) return cachedProfile;
  try {
    cachedRaw = raw;
    cachedProfile = JSON.parse(raw) as SajuProfile;
    return cachedProfile;
  } catch {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
}

export function clearSajuProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedProfile = null;
  }
}
