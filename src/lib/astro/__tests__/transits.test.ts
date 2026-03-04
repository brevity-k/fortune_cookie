import { describe, it, expect } from 'vitest';
import { getCurrentPlanetPositions, getTransitAspects } from '../transits';
import type { PlanetPosition } from '../types';

describe('getCurrentPlanetPositions', () => {
  it('returns 11 entries', () => {
    const positions = getCurrentPlanetPositions(new Date('2024-06-15T12:00:00Z'));
    expect(positions).toHaveLength(11);
  });

  it('all longitudes are between 0 and 360', () => {
    const positions = getCurrentPlanetPositions(new Date('2024-06-15T12:00:00Z'));
    for (const p of positions) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
    }
  });

  it('each position has valid sign and degree', () => {
    const positions = getCurrentPlanetPositions(new Date('2024-06-15T12:00:00Z'));
    for (const p of positions) {
      expect(p.sign).toBeTruthy();
      expect(p.degree).toBeGreaterThanOrEqual(0);
      expect(p.degree).toBeLessThan(30);
    }
  });

  it('all house values are 0 (transit positions have no house)', () => {
    const positions = getCurrentPlanetPositions(new Date('2024-06-15T12:00:00Z'));
    for (const p of positions) {
      expect(p.house).toBe(0);
    }
  });
});

describe('getTransitAspects', () => {
  it('returns valid transit aspects', () => {
    const natalPlanets: PlanetPosition[] = [
      {
        planet: 'Sun',
        longitude: 142.5, // ~Leo 22°
        sign: 'Leo',
        degree: 22.5,
        house: 10,
        retrograde: false,
      },
      {
        planet: 'Moon',
        longitude: 45, // ~Taurus 15°
        sign: 'Taurus',
        degree: 15,
        house: 7,
        retrograde: false,
      },
    ];

    const aspects = getTransitAspects(natalPlanets, new Date('2024-06-15T12:00:00Z'));
    expect(Array.isArray(aspects)).toBe(true);
  });

  it('each transit aspect has a transitPlanet and natalPlanet', () => {
    const natalPlanets: PlanetPosition[] = [
      {
        planet: 'Sun',
        longitude: 0,
        sign: 'Aries',
        degree: 0,
        house: 1,
        retrograde: false,
      },
      {
        planet: 'Moon',
        longitude: 90,
        sign: 'Cancer',
        degree: 0,
        house: 4,
        retrograde: false,
      },
      {
        planet: 'Mercury',
        longitude: 180,
        sign: 'Libra',
        degree: 0,
        house: 7,
        retrograde: false,
      },
    ];

    const aspects = getTransitAspects(natalPlanets, new Date('2024-06-15T12:00:00Z'));
    for (const a of aspects) {
      expect(a.transitPlanet).toBeTruthy();
      expect(a.natalPlanet).toBeTruthy();
      expect(a.type).toBeTruthy();
      expect(typeof a.orb).toBe('number');
    }
  });
});
