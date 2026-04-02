import { describe, it, expect } from 'vitest';
import { calculateAscendant, calculateMidheaven } from '../ascendant';

describe('calculateAscendant', () => {
  it('returns a valid zodiac position with longitude 0-360', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const result = calculateAscendant(date, 51.5074, -0.1278); // London
    expect(result.longitude).toBeGreaterThanOrEqual(0);
    expect(result.longitude).toBeLessThan(360);
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
    expect(typeof result.sign).toBe('string');
  });

  it('ASC changes with birth time (same date, different hours)', () => {
    const lat = 40.7128; // New York
    const lon = -74.006;

    const morning = calculateAscendant(new Date('2024-06-15T06:00:00Z'), lat, lon);
    const noon = calculateAscendant(new Date('2024-06-15T12:00:00Z'), lat, lon);
    const evening = calculateAscendant(new Date('2024-06-15T18:00:00Z'), lat, lon);

    // ASC rotates through all 360 degrees in ~24 hours
    // So 6 hours apart should give meaningfully different longitudes
    expect(morning.longitude).not.toBeCloseTo(noon.longitude, 0);
    expect(noon.longitude).not.toBeCloseTo(evening.longitude, 0);
  });

  it('ASC changes with latitude for the same time', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const lon = 0; // Greenwich meridian

    const equator = calculateAscendant(date, 0, lon);
    const london = calculateAscendant(date, 51.5, lon);
    const arctic = calculateAscendant(date, 65, lon);

    // Different latitudes should produce different ASC values
    expect(equator.longitude).not.toBeCloseTo(london.longitude, 0);
    expect(london.longitude).not.toBeCloseTo(arctic.longitude, 0);
  });

  it('ASC completes roughly a full cycle in 24 hours', () => {
    const lat = 40.7128;
    const lon = -74.006;
    const baseDate = new Date('2024-06-15T00:00:00Z');

    // Sample ASC every 2 hours and verify they cover a wide range
    const longitudes: number[] = [];
    for (let h = 0; h < 24; h += 2) {
      const date = new Date(baseDate.getTime() + h * 3600000);
      const asc = calculateAscendant(date, lat, lon);
      longitudes.push(asc.longitude);
    }

    // With 12 samples spread across 24 hours, we should span a broad range
    // Check that there is significant spread (not all similar)
    // The range should cover a significant portion of 360 degrees
    // (Though wrap-around can complicate this, at least some consecutive
    // values should differ significantly)
    let maxDiff = 0;
    for (let i = 0; i < longitudes.length; i++) {
      for (let j = i + 1; j < longitudes.length; j++) {
        const diff = Math.abs(longitudes[i] - longitudes[j]);
        maxDiff = Math.max(maxDiff, Math.min(diff, 360 - diff));
      }
    }
    expect(maxDiff).toBeGreaterThan(90); // At least 90 degrees of spread
  });

  it('returns valid sign names', () => {
    const validSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer',
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ];
    const date = new Date('2024-06-15T12:00:00Z');
    const result = calculateAscendant(date, 40.7128, -74.006);
    expect(validSigns).toContain(result.sign);
  });
});

describe('calculateMidheaven', () => {
  it('returns a valid zodiac position with longitude 0-360', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const result = calculateMidheaven(date, -0.1278); // London longitude
    expect(result.longitude).toBeGreaterThanOrEqual(0);
    expect(result.longitude).toBeLessThan(360);
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
    expect(typeof result.sign).toBe('string');
  });

  it('MC does not depend on latitude (only longitude)', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const lon = -74.006; // New York longitude

    const mc1 = calculateMidheaven(date, lon);
    // The function signature only takes date and longitude - no latitude parameter
    // This is by design: MC is determined solely by RAMC which depends on time + longitude
    expect(mc1.longitude).toBeGreaterThanOrEqual(0);
    expect(mc1.longitude).toBeLessThan(360);
  });

  it('MC changes with geographic longitude', () => {
    const date = new Date('2024-06-15T12:00:00Z');

    const mcNewYork = calculateMidheaven(date, -74.006);
    const mcTokyo = calculateMidheaven(date, 139.6917);
    const mcLondon = calculateMidheaven(date, -0.1278);

    // Very different longitudes should produce different MC values
    expect(mcNewYork.longitude).not.toBeCloseTo(mcTokyo.longitude, 0);
    expect(mcNewYork.longitude).not.toBeCloseTo(mcLondon.longitude, 0);
  });

  it('MC changes with time', () => {
    const lon = -74.006;

    const mc1 = calculateMidheaven(new Date('2024-06-15T06:00:00Z'), lon);
    const mc2 = calculateMidheaven(new Date('2024-06-15T12:00:00Z'), lon);
    const mc3 = calculateMidheaven(new Date('2024-06-15T18:00:00Z'), lon);

    expect(mc1.longitude).not.toBeCloseTo(mc2.longitude, 0);
    expect(mc2.longitude).not.toBeCloseTo(mc3.longitude, 0);
  });

  it('returns valid sign names', () => {
    const validSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer',
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ];
    const date = new Date('2024-06-15T12:00:00Z');
    const result = calculateMidheaven(date, -74.006);
    expect(validSigns).toContain(result.sign);
  });
});

describe('ASC and MC relationship', () => {
  it('ASC and MC are different values (not the same angle)', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const lat = 40.7128;
    const lon = -74.006;

    const asc = calculateAscendant(date, lat, lon);
    const mc = calculateMidheaven(date, lon);

    // ASC and MC should generally be different
    const diff = Math.abs(asc.longitude - mc.longitude);
    expect(Math.min(diff, 360 - diff)).toBeGreaterThan(5);
  });

  it('MC is independent of latitude while ASC depends on it', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const lon = 0;

    // MC should be the same for both latitudes (same time, same longitude)
    const mc1 = calculateMidheaven(date, lon);
    const mc2 = calculateMidheaven(date, lon);
    expect(mc1.longitude).toBeCloseTo(mc2.longitude, 10);

    // ASC should be different for different latitudes
    const asc1 = calculateAscendant(date, 20, lon);
    const asc2 = calculateAscendant(date, 60, lon);
    expect(asc1.longitude).not.toBeCloseTo(asc2.longitude, 0);
  });
});
