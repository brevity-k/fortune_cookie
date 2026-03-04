import { describe, it, expect } from 'vitest';
import { angularDistance, detectAspects } from '../aspects';
import type { PlanetPosition } from '../types';

function makePlanet(planet: string, longitude: number): PlanetPosition {
  return {
    planet: planet as PlanetPosition['planet'],
    longitude,
    sign: 'Aries',
    degree: 0,
    house: 1,
    retrograde: false,
  };
}

describe('angularDistance', () => {
  it('0° and 90° → 90', () => {
    expect(angularDistance(0, 90)).toBe(90);
  });

  it('350° and 10° → 20 (wraps around)', () => {
    expect(angularDistance(350, 10)).toBe(20);
  });

  it('180° and 0° → 180', () => {
    expect(angularDistance(180, 0)).toBe(180);
  });
});

describe('detectAspects', () => {
  it('two planets at 0° and 0° → conjunction', () => {
    const planets = [makePlanet('Sun', 0), makePlanet('Moon', 0)];
    const aspects = detectAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('conjunction');
    expect(aspects[0].orb).toBe(0);
  });

  it('two planets at 0° and 90° → square', () => {
    const planets = [makePlanet('Sun', 0), makePlanet('Moon', 90)];
    const aspects = detectAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('square');
    expect(aspects[0].orb).toBe(0);
  });

  it('two planets at 0° and 120° → trine', () => {
    const planets = [makePlanet('Sun', 0), makePlanet('Moon', 120)];
    const aspects = detectAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('trine');
    expect(aspects[0].orb).toBe(0);
  });

  it('two planets at 0° and 180° → opposition', () => {
    const planets = [makePlanet('Sun', 0), makePlanet('Moon', 180)];
    const aspects = detectAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('opposition');
    expect(aspects[0].orb).toBe(0);
  });

  it('two planets at 0° and 60° → sextile', () => {
    const planets = [makePlanet('Sun', 0), makePlanet('Moon', 60)];
    const aspects = detectAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('sextile');
    expect(aspects[0].orb).toBe(0);
  });

  it('two planets at 0° and 45° → no aspect', () => {
    const planets = [makePlanet('Sun', 0), makePlanet('Moon', 45)];
    const aspects = detectAspects(planets);
    expect(aspects).toHaveLength(0);
  });

  it('no duplicate aspects (each pair appears once)', () => {
    const planets = [
      makePlanet('Sun', 0),
      makePlanet('Moon', 90),
      makePlanet('Mercury', 180),
    ];
    const aspects = detectAspects(planets);
    const pairs = aspects.map((a) => `${a.planet1}-${a.planet2}`);
    const uniquePairs = new Set(pairs);
    expect(pairs.length).toBe(uniquePairs.size);
  });
});
