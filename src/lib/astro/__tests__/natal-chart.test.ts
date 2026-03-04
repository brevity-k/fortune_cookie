import { describe, it, expect } from 'vitest';
import { calculateNatalChart } from '../natal-chart';
import type { AstroBirthInfo } from '../types';

// Seoul, 1990-08-15 14:00 UTC
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

describe('calculateNatalChart', () => {
  it('returns valid NatalChart with all fields', () => {
    const chart = calculateNatalChart(seoulBirth);
    expect(chart).toHaveProperty('planets');
    expect(chart).toHaveProperty('ascendant');
    expect(chart).toHaveProperty('midheaven');
    expect(chart).toHaveProperty('houses');
    expect(chart).toHaveProperty('aspects');
    expect(chart).toHaveProperty('elements');
    expect(chart).toHaveProperty('modalities');
  });

  it('planets has 11 entries', () => {
    const chart = calculateNatalChart(seoulBirth);
    expect(chart.planets).toHaveLength(11);
  });

  it('houses has 12 entries', () => {
    const chart = calculateNatalChart(seoulBirth);
    expect(chart.houses).toHaveLength(12);
  });

  it('ascendant and midheaven are valid zodiac positions', () => {
    const chart = calculateNatalChart(seoulBirth);
    expect(chart.ascendant.sign).toBeTruthy();
    expect(chart.ascendant.degree).toBeGreaterThanOrEqual(0);
    expect(chart.ascendant.degree).toBeLessThan(30);
    expect(chart.ascendant.longitude).toBeGreaterThanOrEqual(0);
    expect(chart.ascendant.longitude).toBeLessThan(360);

    expect(chart.midheaven.sign).toBeTruthy();
    expect(chart.midheaven.degree).toBeGreaterThanOrEqual(0);
    expect(chart.midheaven.degree).toBeLessThan(30);
    expect(chart.midheaven.longitude).toBeGreaterThanOrEqual(0);
    expect(chart.midheaven.longitude).toBeLessThan(360);
  });

  it('all planet houses are 1-12', () => {
    const chart = calculateNatalChart(seoulBirth);
    for (const planet of chart.planets) {
      expect(planet.house).toBeGreaterThanOrEqual(1);
      expect(planet.house).toBeLessThanOrEqual(12);
    }
  });

  it('all planet longitudes are 0-360', () => {
    const chart = calculateNatalChart(seoulBirth);
    for (const planet of chart.planets) {
      expect(planet.longitude).toBeGreaterThanOrEqual(0);
      expect(planet.longitude).toBeLessThan(360);
    }
  });

  it('elements sum to 13', () => {
    const chart = calculateNatalChart(seoulBirth);
    const total =
      chart.elements.fire +
      chart.elements.earth +
      chart.elements.air +
      chart.elements.water;
    expect(total).toBe(13);
  });

  it('modalities sum to 13', () => {
    const chart = calculateNatalChart(seoulBirth);
    const total =
      chart.modalities.cardinal +
      chart.modalities.fixed +
      chart.modalities.mutable;
    expect(total).toBe(13);
  });

  it('Sun is in Leo for 1990-08-15 14:00 UTC Seoul', () => {
    const chart = calculateNatalChart(seoulBirth);
    const sun = chart.planets.find((p) => p.planet === 'Sun');
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe('Leo');
  });

  it('same input always produces same output (deterministic)', () => {
    const chart1 = calculateNatalChart(seoulBirth);
    const chart2 = calculateNatalChart(seoulBirth);

    expect(chart1.planets.map((p) => p.longitude)).toEqual(
      chart2.planets.map((p) => p.longitude)
    );
    expect(chart1.ascendant.longitude).toBe(chart2.ascendant.longitude);
    expect(chart1.midheaven.longitude).toBe(chart2.midheaven.longitude);
    expect(chart1.elements).toEqual(chart2.elements);
    expect(chart1.modalities).toEqual(chart2.modalities);
    expect(chart1.aspects.length).toBe(chart2.aspects.length);
  });
});
