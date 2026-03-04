import { MakeTime, SiderealTime, e_tilt } from 'astronomy-engine';
import type { ZodiacPosition } from './types';
import { longitudeToZodiac } from './zodiac';

/**
 * Calculate the Local Sidereal Time in hours.
 * LST = GAST + longitude/15 (longitude in degrees, east positive)
 */
function getLocalSiderealTime(date: Date, longitude: number): number {
  const astroTime = MakeTime(date);
  const gast = SiderealTime(astroTime);
  let lst = gast + longitude / 15;
  // Normalize to 0-24 hours
  lst = ((lst % 24) + 24) % 24;
  return lst;
}

/**
 * Get the true obliquity of the ecliptic in degrees at a given date.
 */
function getObliquity(date: Date): number {
  const astroTime = MakeTime(date);
  const tilt = e_tilt(astroTime);
  return tilt.tobl;
}

/**
 * Calculate the Ascendant (ASC) for a given date and geographic location.
 *
 * The Ascendant is the zodiac degree rising on the eastern horizon
 * at a specific time and location. It defines the 1st house cusp.
 *
 * Formula:
 *   ASC = atan2(-cos(RAMC), sin(eps)*tan(lat) + cos(eps)*sin(RAMC))
 *
 * where:
 *   RAMC = Right Ascension of the Midheaven = LST * 15 (in degrees)
 *   eps  = obliquity of the ecliptic
 *   lat  = geographic latitude
 */
export function calculateAscendant(
  date: Date,
  latitude: number,
  longitude: number
): ZodiacPosition {
  const lst = getLocalSiderealTime(date, longitude);
  const ramc = lst * 15; // Convert hours to degrees

  const eps = getObliquity(date) * (Math.PI / 180);
  const ramcRad = ramc * (Math.PI / 180);
  const latRad = latitude * (Math.PI / 180);

  const y = -Math.cos(ramcRad);
  const x = Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(ramcRad);

  let ascDeg = Math.atan2(y, x) * (180 / Math.PI);
  ascDeg = ((ascDeg % 360) + 360) % 360;

  return longitudeToZodiac(ascDeg);
}

/**
 * Calculate the Midheaven (MC) for a given date and geographic longitude.
 *
 * The Midheaven is the zodiac degree at the highest point of the ecliptic
 * above the horizon. It defines the 10th house cusp.
 *
 * Note: MC depends only on time and geographic longitude, NOT latitude.
 *
 * Formula:
 *   MC = atan2(sin(RAMC), cos(RAMC)*cos(eps))
 */
export function calculateMidheaven(
  date: Date,
  longitude: number
): ZodiacPosition {
  const lst = getLocalSiderealTime(date, longitude);
  const ramc = lst * 15; // Convert hours to degrees

  const eps = getObliquity(date) * (Math.PI / 180);
  const ramcRad = ramc * (Math.PI / 180);

  const y = Math.sin(ramcRad);
  const x = Math.cos(ramcRad) * Math.cos(eps);

  let mcDeg = Math.atan2(y, x) * (180 / Math.PI);
  mcDeg = ((mcDeg % 360) + 360) % 360;

  return longitudeToZodiac(mcDeg);
}
