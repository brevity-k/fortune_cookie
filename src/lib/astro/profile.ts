import type { AstroBirthInfo, AstroProfile } from './types';
import { calculateNatalChart } from './natal-chart';

const STORAGE_KEY = 'astro_profile';

let cachedRaw: string | null = null;
let cachedProfile: AstroProfile | null = null;

export function saveAstroProfile(birthInfo: AstroBirthInfo): AstroProfile {
  const chart = calculateNatalChart(birthInfo);
  const profile: AstroProfile = {
    birthInfo,
    chart,
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

export function getAstroProfile(): AstroProfile | null {
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
    cachedProfile = JSON.parse(raw) as AstroProfile;
    return cachedProfile;
  } catch {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
}

export function clearAstroProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedProfile = null;
  }
}
