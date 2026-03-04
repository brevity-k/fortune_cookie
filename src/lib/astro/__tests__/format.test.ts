import { describe, it, expect } from 'vitest';
import { formatDegree, formatPlanet, formatAspect, formatChart } from '../format';
import { calculateNatalChart } from '../natal-chart';
import type { PlanetPosition, Aspect, AstroBirthInfo } from '../types';

describe('formatDegree', () => {
  it('formats 15.5 as 15\u00B030\'', () => {
    expect(formatDegree(15.5)).toBe("15\u00B030'");
  });

  it('formats 0 as 0\u00B000\'', () => {
    expect(formatDegree(0)).toBe("0\u00B000'");
  });

  it('formats 29.99 as 29\u00B059\'', () => {
    expect(formatDegree(29.99)).toBe("29\u00B059'");
  });

  it('formats integer degrees with 00 minutes', () => {
    expect(formatDegree(10)).toBe("10\u00B000'");
  });

  it('pads single-digit minutes with leading zero', () => {
    expect(formatDegree(5.05)).toBe("5\u00B003'");
  });
});

describe('formatPlanet', () => {
  const sunPosition: PlanetPosition = {
    planet: 'Sun',
    longitude: 142.5,
    sign: 'Leo',
    degree: 22.5,
    house: 5,
    retrograde: false,
  };

  it('returns correct symbol for Sun (\u2609)', () => {
    const formatted = formatPlanet(sunPosition);
    expect(formatted.symbol).toBe('\u2609');
  });

  it('returns correct sign symbol for Leo (\u264C)', () => {
    const formatted = formatPlanet(sunPosition);
    expect(formatted.signSymbol).toBe('\u264C');
  });

  it('returns formatted degree string', () => {
    const formatted = formatPlanet(sunPosition);
    expect(formatted.degree).toBe("22\u00B030'");
  });

  it('preserves house and retrograde values', () => {
    const formatted = formatPlanet(sunPosition);
    expect(formatted.house).toBe(5);
    expect(formatted.retrograde).toBe(false);
  });

  it('returns planet and sign names', () => {
    const formatted = formatPlanet(sunPosition);
    expect(formatted.planet).toBe('Sun');
    expect(formatted.sign).toBe('Leo');
  });
});

describe('formatAspect', () => {
  const conjunctionAspect: Aspect = {
    planet1: 'Sun',
    planet2: 'Moon',
    type: 'conjunction',
    orb: 3.5,
    applying: true,
  };

  const trineAspect: Aspect = {
    planet1: 'Venus',
    planet2: 'Jupiter',
    type: 'trine',
    orb: 1.25,
    applying: false,
  };

  it('returns correct typeSymbol for conjunction (\u260C)', () => {
    const formatted = formatAspect(conjunctionAspect);
    expect(formatted.typeSymbol).toBe('\u260C');
  });

  it('returns correct typeSymbol for trine (\u25B3)', () => {
    const formatted = formatAspect(trineAspect);
    expect(formatted.typeSymbol).toBe('\u25B3');
  });

  it('formats orb as degree string', () => {
    const formatted = formatAspect(conjunctionAspect);
    expect(formatted.orb).toBe("3\u00B030'");
  });

  it('returns planet symbols', () => {
    const formatted = formatAspect(conjunctionAspect);
    expect(formatted.planet1Symbol).toBe('\u2609');
    expect(formatted.planet2Symbol).toBe('\u263D');
  });

  it('returns planet names and type', () => {
    const formatted = formatAspect(trineAspect);
    expect(formatted.planet1).toBe('Venus');
    expect(formatted.planet2).toBe('Jupiter');
    expect(formatted.type).toBe('trine');
  });
});

describe('formatChart', () => {
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

  it('produces all expected fields', () => {
    const chart = calculateNatalChart(seoulBirth);
    const formatted = formatChart(chart);

    expect(formatted).toHaveProperty('planets');
    expect(formatted).toHaveProperty('ascendant');
    expect(formatted).toHaveProperty('midheaven');
    expect(formatted).toHaveProperty('aspects');
    expect(formatted).toHaveProperty('elements');
    expect(formatted).toHaveProperty('modalities');
  });

  it('formats all 11 planets', () => {
    const chart = calculateNatalChart(seoulBirth);
    const formatted = formatChart(chart);
    expect(formatted.planets).toHaveLength(11);
  });

  it('ascendant has sign, signSymbol, and degree', () => {
    const chart = calculateNatalChart(seoulBirth);
    const formatted = formatChart(chart);
    expect(formatted.ascendant.sign).toBeTruthy();
    expect(formatted.ascendant.signSymbol).toBeTruthy();
    expect(formatted.ascendant.degree).toMatch(/^\d+\u00B0\d{2}'$/);
  });

  it('midheaven has sign, signSymbol, and degree', () => {
    const chart = calculateNatalChart(seoulBirth);
    const formatted = formatChart(chart);
    expect(formatted.midheaven.sign).toBeTruthy();
    expect(formatted.midheaven.signSymbol).toBeTruthy();
    expect(formatted.midheaven.degree).toMatch(/^\d+\u00B0\d{2}'$/);
  });

  it('preserves elements and modalities', () => {
    const chart = calculateNatalChart(seoulBirth);
    const formatted = formatChart(chart);
    expect(formatted.elements).toEqual(chart.elements);
    expect(formatted.modalities).toEqual(chart.modalities);
  });
});
