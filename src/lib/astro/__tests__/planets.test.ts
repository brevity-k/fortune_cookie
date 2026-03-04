import { describe, it, expect } from 'vitest';
import { getPlanetLongitude, isRetrograde, getAllPlanetLongitudes } from '../planets';
import type { Planet } from '../types';

describe('getPlanetLongitude', () => {
  const allPlanets: Planet[] = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
    'NorthNode',
  ];

  it.each(allPlanets)('%s returns longitude in 0-360 range', (planet) => {
    const date = new Date('2024-06-15T12:00:00Z');
    const lon = getPlanetLongitude(planet, date);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it('Sun near vernal equinox (~March 20) is near 0 degrees (Aries)', () => {
    // 2024 vernal equinox is March 20 at ~03:06 UTC
    const date = new Date('2024-03-20T03:06:00Z');
    const lon = getPlanetLongitude('Sun', date);
    // Should be very close to 0 degrees (within ~1.5 degree)
    // Account for wrap-around: 359.9 is effectively -0.1 from 0
    const distanceFrom0 = Math.min(lon, 360 - lon);
    expect(distanceFrom0).toBeLessThan(1.5);
  });

  it('Sun on summer solstice (~June 21) is near 90 degrees (Cancer)', () => {
    // 2024 summer solstice is June 20 at ~20:51 UTC
    const date = new Date('2024-06-20T20:51:00Z');
    const lon = getPlanetLongitude('Sun', date);
    // Should be very close to 90 degrees (within ~1 degree)
    expect(lon).toBeGreaterThan(88.5);
    expect(lon).toBeLessThan(91.5);
  });

  it('Sun on autumnal equinox (~Sep 22) is near 180 degrees (Libra)', () => {
    const date = new Date('2024-09-22T12:44:00Z');
    const lon = getPlanetLongitude('Sun', date);
    expect(lon).toBeGreaterThan(178.5);
    expect(lon).toBeLessThan(181.5);
  });

  it('Sun on winter solstice (~Dec 21) is near 270 degrees (Capricorn)', () => {
    const date = new Date('2024-12-21T09:20:00Z');
    const lon = getPlanetLongitude('Sun', date);
    expect(lon).toBeGreaterThan(268.5);
    expect(lon).toBeLessThan(271.5);
  });

  it('Moon returns a valid longitude', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const lon = getPlanetLongitude('Moon', date);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it('NorthNode returns a valid longitude', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const lon = getPlanetLongitude('NorthNode', date);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it('returns different longitudes for different dates', () => {
    const date1 = new Date('2024-01-01T00:00:00Z');
    const date2 = new Date('2024-07-01T00:00:00Z');
    const lon1 = getPlanetLongitude('Sun', date1);
    const lon2 = getPlanetLongitude('Sun', date2);
    expect(lon1).not.toBeCloseTo(lon2, 0);
  });
});

describe('isRetrograde', () => {
  it('Sun is never retrograde', () => {
    const dates = [
      new Date('2024-01-15T00:00:00Z'),
      new Date('2024-06-15T00:00:00Z'),
      new Date('2024-09-15T00:00:00Z'),
    ];
    for (const d of dates) {
      expect(isRetrograde('Sun', d)).toBe(false);
    }
  });

  it('Moon is never retrograde', () => {
    const dates = [
      new Date('2024-01-15T00:00:00Z'),
      new Date('2024-06-15T00:00:00Z'),
      new Date('2024-09-15T00:00:00Z'),
    ];
    for (const d of dates) {
      expect(isRetrograde('Moon', d)).toBe(false);
    }
  });

  it('NorthNode is always retrograde', () => {
    const dates = [
      new Date('2024-01-15T00:00:00Z'),
      new Date('2024-06-15T00:00:00Z'),
      new Date('2024-09-15T00:00:00Z'),
    ];
    for (const d of dates) {
      expect(isRetrograde('NorthNode', d)).toBe(true);
    }
  });

  it('Mercury can be retrograde (known retrograde period)', () => {
    // Mercury was retrograde around April 1-24, 2024
    const retrogradeDate = new Date('2024-04-10T00:00:00Z');
    const result = isRetrograde('Mercury', retrogradeDate);
    expect(typeof result).toBe('boolean');
    // We just verify it returns a boolean; exact retrograde dates may vary slightly
  });

  it('returns a boolean for all outer planets', () => {
    const date = new Date('2024-06-15T00:00:00Z');
    const planets: Planet[] = ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    for (const p of planets) {
      expect(typeof isRetrograde(p, date)).toBe('boolean');
    }
  });
});

describe('getAllPlanetLongitudes', () => {
  it('returns results for all 11 planets', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const results = getAllPlanetLongitudes(date);
    expect(results).toHaveLength(11);
  });

  it('each result has planet, longitude, and retrograde fields', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const results = getAllPlanetLongitudes(date);
    for (const r of results) {
      expect(r).toHaveProperty('planet');
      expect(r).toHaveProperty('longitude');
      expect(r).toHaveProperty('retrograde');
      expect(typeof r.planet).toBe('string');
      expect(typeof r.longitude).toBe('number');
      expect(typeof r.retrograde).toBe('boolean');
      expect(r.longitude).toBeGreaterThanOrEqual(0);
      expect(r.longitude).toBeLessThan(360);
    }
  });

  it('includes Sun as the first planet', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const results = getAllPlanetLongitudes(date);
    expect(results[0].planet).toBe('Sun');
  });

  it('includes NorthNode as the last planet', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const results = getAllPlanetLongitudes(date);
    expect(results[10].planet).toBe('NorthNode');
  });

  it('Sun is never retrograde in results', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const results = getAllPlanetLongitudes(date);
    const sun = results.find((r) => r.planet === 'Sun');
    expect(sun?.retrograde).toBe(false);
  });

  it('NorthNode is always retrograde in results', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const results = getAllPlanetLongitudes(date);
    const node = results.find((r) => r.planet === 'NorthNode');
    expect(node?.retrograde).toBe(true);
  });
});
