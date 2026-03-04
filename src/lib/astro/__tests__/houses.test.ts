import { describe, it, expect } from 'vitest';
import { calculateHouseCusps, getHouseForLongitude } from '../houses';
import { calculateAscendant, calculateMidheaven } from '../ascendant';

// Test location: New York
const NY_LAT = 40.7128;
const NY_LON = -74.006;
const TEST_DATE = new Date('2024-06-15T12:00:00Z');

describe('calculateHouseCusps', () => {
  const cusps = calculateHouseCusps(TEST_DATE, NY_LAT, NY_LON);

  it('returns exactly 12 house cusps', () => {
    expect(cusps).toHaveLength(12);
  });

  it('houses are numbered 1-12', () => {
    const houseNumbers = cusps.map((c) => c.house);
    expect(houseNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('House 1 equals the Ascendant', () => {
    const asc = calculateAscendant(TEST_DATE, NY_LAT, NY_LON);
    expect(cusps[0].longitude).toBeCloseTo(asc.longitude, 5);
    expect(cusps[0].sign).toBe(asc.sign);
  });

  it('House 10 equals the Midheaven', () => {
    const mc = calculateMidheaven(TEST_DATE, NY_LON);
    expect(cusps[9].longitude).toBeCloseTo(mc.longitude, 5);
    expect(cusps[9].sign).toBe(mc.sign);
  });

  it('House 7 (DSC) is approximately ASC + 180 degrees', () => {
    const asc = cusps[0].longitude;
    const dsc = cusps[6].longitude;
    const expected = ((asc + 180) % 360 + 360) % 360;
    expect(dsc).toBeCloseTo(expected, 5);
  });

  it('House 4 (IC) is approximately MC + 180 degrees', () => {
    const mc = cusps[9].longitude;
    const ic = cusps[3].longitude;
    const expected = ((mc + 180) % 360 + 360) % 360;
    expect(ic).toBeCloseTo(expected, 5);
  });

  it('all cusps have longitude in 0-360 range', () => {
    for (const cusp of cusps) {
      expect(cusp.longitude).toBeGreaterThanOrEqual(0);
      expect(cusp.longitude).toBeLessThan(360);
    }
  });

  it('all cusps have degree in 0-30 range', () => {
    for (const cusp of cusps) {
      expect(cusp.degree).toBeGreaterThanOrEqual(0);
      expect(cusp.degree).toBeLessThan(30);
    }
  });

  it('all cusps have valid sign names', () => {
    const validSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer',
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ];
    for (const cusp of cusps) {
      expect(validSigns).toContain(cusp.sign);
    }
  });

  it('cusps produce different results for different locations', () => {
    const nyCusps = calculateHouseCusps(TEST_DATE, NY_LAT, NY_LON);
    const tokyoCusps = calculateHouseCusps(TEST_DATE, 35.6762, 139.6503);

    // Different locations should have different house 1 cusps
    expect(nyCusps[0].longitude).not.toBeCloseTo(tokyoCusps[0].longitude, 0);
  });

  it('cusps produce different results for different times', () => {
    const cusps1 = calculateHouseCusps(new Date('2024-06-15T06:00:00Z'), NY_LAT, NY_LON);
    const cusps2 = calculateHouseCusps(new Date('2024-06-15T18:00:00Z'), NY_LAT, NY_LON);

    expect(cusps1[0].longitude).not.toBeCloseTo(cusps2[0].longitude, 0);
  });
});

describe('getHouseForLongitude', () => {
  const cusps = calculateHouseCusps(TEST_DATE, NY_LAT, NY_LON);

  it('ASC longitude falls in house 1', () => {
    const ascLon = cusps[0].longitude;
    expect(getHouseForLongitude(ascLon, cusps)).toBe(1);
  });

  it('MC longitude falls in house 10', () => {
    const mcLon = cusps[9].longitude;
    expect(getHouseForLongitude(mcLon, cusps)).toBe(10);
  });

  it('DSC longitude falls in house 7', () => {
    const dscLon = cusps[6].longitude;
    expect(getHouseForLongitude(dscLon, cusps)).toBe(7);
  });

  it('IC longitude falls in house 4', () => {
    const icLon = cusps[3].longitude;
    expect(getHouseForLongitude(icLon, cusps)).toBe(4);
  });

  it('a longitude slightly past a cusp (clockwise) belongs to that house', () => {
    // Houses progress clockwise (decreasing longitude).
    // "Slightly past" H1 cusp means slightly lower longitude.
    let slightlyPastH1 = cusps[0].longitude - 1;
    if (slightlyPastH1 < 0) slightlyPastH1 += 360;
    expect(getHouseForLongitude(slightlyPastH1, cusps)).toBe(1);
  });

  it('a longitude just before a cusp (in clockwise direction) belongs to the previous house', () => {
    // "Just before" H2 cusp means slightly higher longitude (H1 side).
    let justBeforeH2 = cusps[1].longitude + 0.5;
    if (justBeforeH2 >= 360) justBeforeH2 -= 360;
    expect(getHouseForLongitude(justBeforeH2, cusps)).toBe(1);
  });

  it('returns a house number between 1 and 12 for any longitude', () => {
    for (let lon = 0; lon < 360; lon += 15) {
      const house = getHouseForLongitude(lon, cusps);
      expect(house).toBeGreaterThanOrEqual(1);
      expect(house).toBeLessThanOrEqual(12);
    }
  });

  it('every degree maps to exactly one house', () => {
    // Verify no gaps: all 360 integer degrees should map to a house
    const houseCounts = new Map<number, number>();
    for (let lon = 0; lon < 360; lon++) {
      const house = getHouseForLongitude(lon, cusps);
      houseCounts.set(house, (houseCounts.get(house) || 0) + 1);
    }
    // All 12 houses should have at least some degrees
    expect(houseCounts.size).toBe(12);
    // Total should be 360
    const total = Array.from(houseCounts.values()).reduce((a, b) => a + b, 0);
    expect(total).toBe(360);
  });
});
