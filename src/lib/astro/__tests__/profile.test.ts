import { describe, it, expect } from 'vitest';
import { saveAstroProfile } from '../profile';
import type { AstroBirthInfo } from '../types';

const seoulBirth: AstroBirthInfo = {
  year: 1990,
  month: 8,
  day: 15,
  hour: 14,
  minute: 0,
  latitude: 37.5665,
  longitude: 126.978,
  cityName: 'Seoul',
};

describe('saveAstroProfile', () => {
  it('returns valid AstroProfile with chart', () => {
    const profile = saveAstroProfile(seoulBirth);
    expect(profile).toHaveProperty('birthInfo');
    expect(profile).toHaveProperty('chart');
    expect(profile).toHaveProperty('createdAt');
  });

  it('profile has correct birthInfo', () => {
    const profile = saveAstroProfile(seoulBirth);
    expect(profile.birthInfo).toEqual(seoulBirth);
  });

  it('profile chart has planets, ascendant, midheaven', () => {
    const profile = saveAstroProfile(seoulBirth);
    expect(profile.chart.planets).toHaveLength(11);
    expect(profile.chart.ascendant.sign).toBeTruthy();
    expect(profile.chart.midheaven.sign).toBeTruthy();
  });

  it('createdAt is a valid ISO date string', () => {
    const profile = saveAstroProfile(seoulBirth);
    const parsed = new Date(profile.createdAt);
    expect(parsed.getTime()).not.toBeNaN();
  });
});
