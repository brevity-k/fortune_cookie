import type { HouseCusp } from './types';
import { longitudeToZodiac } from './zodiac';
import { calculateAscendant, calculateMidheaven } from './ascendant';

/**
 * Normalize a degree value to 0-360 range.
 */
function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Calculate the arc from `from` to `to` going in the direction of
 * decreasing ecliptic longitude (clockwise on chart = house order direction).
 * The result is always positive and in (0, 360].
 */
function clockwiseArc(from: number, to: number): number {
  let arc = from - to;
  if (arc <= 0) arc += 360;
  return arc;
}

/**
 * Trisect the arc from `from` to `to` in the clockwise (decreasing longitude)
 * direction, returning the intermediate point at position step/3.
 */
function trisectClockwise(from: number, to: number, step: number): number {
  const arc = clockwiseArc(from, to);
  return normalizeDegrees(from - (arc * step) / 3);
}

/**
 * Calculate the 12 house cusps using the Porphyry house system.
 *
 * The four angles are:
 *   House 1  = ASC (Ascendant)
 *   House 4  = IC  (Imum Coeli, opposite of MC)
 *   House 7  = DSC (Descendant, opposite of ASC)
 *   House 10 = MC  (Midheaven)
 *
 * Houses progress clockwise on the chart (decreasing ecliptic longitude).
 * Each quadrant between adjacent angles is trisected:
 *   ASC -> IC  (clockwise): Houses 2, 3 cusps
 *   IC  -> DSC (clockwise): Houses 5, 6 cusps
 *   DSC -> MC  (clockwise): Houses 8, 9 cusps
 *   MC  -> ASC (clockwise): Houses 11, 12 cusps
 *
 * @param date      Birth date/time
 * @param latitude  Geographic latitude
 * @param longitude Geographic longitude
 * @returns Array of 12 HouseCusp objects (houses 1-12)
 */
export function calculateHouseCusps(
  date: Date,
  latitude: number,
  longitude: number
): HouseCusp[] {
  const ascPos = calculateAscendant(date, latitude, longitude);
  const mcPos = calculateMidheaven(date, longitude);

  const asc = ascPos.longitude; // House 1
  const mc = mcPos.longitude;   // House 10
  const dsc = normalizeDegrees(asc + 180); // House 7
  const ic = normalizeDegrees(mc + 180);   // House 4

  // Trisect each quadrant (clockwise = decreasing longitude)
  // Q1: ASC -> IC => H2, H3
  const h2 = trisectClockwise(asc, ic, 1);
  const h3 = trisectClockwise(asc, ic, 2);

  // Q2: IC -> DSC => H5, H6
  const h5 = trisectClockwise(ic, dsc, 1);
  const h6 = trisectClockwise(ic, dsc, 2);

  // Q3: DSC -> MC => H8, H9
  const h8 = trisectClockwise(dsc, mc, 1);
  const h9 = trisectClockwise(dsc, mc, 2);

  // Q4: MC -> ASC => H11, H12
  const h11 = trisectClockwise(mc, asc, 1);
  const h12 = trisectClockwise(mc, asc, 2);

  const longitudes = [asc, h2, h3, ic, h5, h6, dsc, h8, h9, mc, h11, h12];

  return longitudes.map((lon, i) => {
    const zodiac = longitudeToZodiac(lon);
    return {
      house: i + 1,
      longitude: zodiac.longitude,
      sign: zodiac.sign,
      degree: zodiac.degree,
    };
  });
}

/**
 * Determine which house (1-12) a given ecliptic longitude falls in.
 *
 * A planet is in a house if its longitude falls between that house's
 * cusp and the next house's cusp. Since houses progress in the clockwise
 * direction (decreasing ecliptic longitude), a longitude is in house N
 * if it falls in the clockwise arc from cusp N to cusp N+1.
 *
 * @param longitude Ecliptic longitude (0-360)
 * @param cusps     Array of 12 HouseCusp objects from calculateHouseCusps
 * @returns House number (1-12)
 */
export function getHouseForLongitude(longitude: number, cusps: HouseCusp[]): number {
  const normalizedLon = normalizeDegrees(longitude);

  for (let i = 0; i < 12; i++) {
    const currentCusp = cusps[i].longitude;
    const nextCusp = cusps[(i + 1) % 12].longitude;

    // Check if longitude is at this cusp exactly
    if (Math.abs(normalizedLon - currentCusp) < 1e-9) {
      return cusps[i].house;
    }

    // Check if longitude is in the clockwise arc from currentCusp to nextCusp.
    // Clockwise = decreasing longitude direction.
    // A point is in this arc if:
    //   clockwiseArc(currentCusp, point) < clockwiseArc(currentCusp, nextCusp)
    const arcToNext = clockwiseArc(currentCusp, nextCusp);
    const arcToPoint = clockwiseArc(currentCusp, normalizedLon);

    if (arcToPoint < arcToNext) {
      return cusps[i].house;
    }
  }

  // Fallback: return house 1 (should not normally reach here)
  return 1;
}
