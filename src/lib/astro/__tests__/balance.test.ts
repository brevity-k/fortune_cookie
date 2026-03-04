import { describe, it, expect } from 'vitest';
import { countElements, countModalities } from '../balance';
import type { PlanetPosition, ZodiacPosition } from '../types';

function makePlanet(sign: PlanetPosition['sign']): PlanetPosition {
  return {
    planet: 'Sun',
    longitude: 0,
    sign,
    degree: 0,
    house: 1,
    retrograde: false,
  };
}

function makeZodiac(sign: ZodiacPosition['sign']): ZodiacPosition {
  return { sign, degree: 0, longitude: 0 };
}

describe('countElements', () => {
  it('sum of elements = 13 (11 planets + ASC + MC)', () => {
    const planets: PlanetPosition[] = [
      makePlanet('Aries'),   // fire
      makePlanet('Taurus'),  // earth
      makePlanet('Gemini'),  // air
      makePlanet('Cancer'),  // water
      makePlanet('Leo'),     // fire
      makePlanet('Virgo'),   // earth
      makePlanet('Libra'),   // air
      makePlanet('Scorpio'), // water
      makePlanet('Sagittarius'), // fire
      makePlanet('Capricorn'),   // earth
      makePlanet('Aquarius'),    // air
    ];
    const asc = makeZodiac('Aries');  // fire
    const mc = makeZodiac('Taurus');  // earth

    const elements = countElements(planets, asc, mc);
    const total = elements.fire + elements.earth + elements.air + elements.water;
    expect(total).toBe(13);
  });

  it('all fire signs → fire count matches', () => {
    const planets: PlanetPosition[] = Array.from({ length: 11 }, () => makePlanet('Aries'));
    const asc = makeZodiac('Leo');
    const mc = makeZodiac('Sagittarius');

    const elements = countElements(planets, asc, mc);
    expect(elements.fire).toBe(13);
    expect(elements.earth).toBe(0);
    expect(elements.air).toBe(0);
    expect(elements.water).toBe(0);
  });

  it('spot-check: Cancer is water, Gemini is air', () => {
    const planets: PlanetPosition[] = [
      makePlanet('Cancer'),
      makePlanet('Gemini'),
      ...Array.from({ length: 9 }, () => makePlanet('Aries')),
    ];
    const asc = makeZodiac('Aries');
    const mc = makeZodiac('Aries');

    const elements = countElements(planets, asc, mc);
    expect(elements.water).toBe(1);
    expect(elements.air).toBe(1);
    expect(elements.fire).toBe(11);
  });
});

describe('countModalities', () => {
  it('sum of modalities = 13 (11 planets + ASC + MC)', () => {
    const planets: PlanetPosition[] = [
      makePlanet('Aries'),       // cardinal
      makePlanet('Taurus'),      // fixed
      makePlanet('Gemini'),      // mutable
      makePlanet('Cancer'),      // cardinal
      makePlanet('Leo'),         // fixed
      makePlanet('Virgo'),       // mutable
      makePlanet('Libra'),       // cardinal
      makePlanet('Scorpio'),     // fixed
      makePlanet('Sagittarius'), // mutable
      makePlanet('Capricorn'),   // cardinal
      makePlanet('Aquarius'),    // fixed
    ];
    const asc = makeZodiac('Aries');    // cardinal
    const mc = makeZodiac('Taurus');    // fixed

    const modalities = countModalities(planets, asc, mc);
    const total = modalities.cardinal + modalities.fixed + modalities.mutable;
    expect(total).toBe(13);
  });

  it('spot-check: Aries is cardinal, Leo is fixed, Gemini is mutable', () => {
    const planets: PlanetPosition[] = [
      makePlanet('Aries'),
      makePlanet('Leo'),
      makePlanet('Gemini'),
      ...Array.from({ length: 8 }, () => makePlanet('Aries')),
    ];
    const asc = makeZodiac('Aries');
    const mc = makeZodiac('Aries');

    const modalities = countModalities(planets, asc, mc);
    expect(modalities.cardinal).toBe(11);
    expect(modalities.fixed).toBe(1);
    expect(modalities.mutable).toBe(1);
  });
});
