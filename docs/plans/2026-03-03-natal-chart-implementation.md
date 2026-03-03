# Personalized Natal Chart — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full Western astrology natal chart engine with `astronomy-engine`, client-side chart calculations, free chart visualization, and premium AI transit/forecast readings — bundled into the existing $2.99/mo subscription.

**Architecture:** Pure TypeScript astrology engine in `src/lib/astro/` using `astronomy-engine` for planet positions + custom layer for zodiac signs, houses (Placidus), aspects, and transits. Client-side UI components for chart display. Premium AI readings via existing JWT infrastructure. All user state in localStorage.

**Tech Stack:** Next.js 16, TypeScript, Tailwind 4, Vitest (existing), `astronomy-engine` (new)

**Design Doc:** `docs/plans/2026-03-03-natal-chart-design.md`

---

## Phase 0: Setup

### Task 0.1: Install astronomy-engine and create city database

**Files:**
- Modify: `package.json`
- Create: `src/data/cities.json`

**Step 1:** Install `astronomy-engine`
```bash
npm install astronomy-engine
```

**Step 2:** Create city database at `src/data/cities.json`

A JSON array of ~15K cities with `name`, `country`, `lat`, `lng`. Include all world capitals, all US state capitals, all cities with population > 100K. Format:
```json
[
  { "name": "New York", "country": "US", "lat": 40.7128, "lng": -74.006 },
  { "name": "Seoul", "country": "KR", "lat": 37.5665, "lng": 126.978 }
]
```

Source the data from a public domain city database (e.g., SimpleMaps World Cities or GeoNames). Download it, filter to relevant cities, and format as JSON. If a bundled dataset is too large (>2MB), reduce to ~5K–10K most popular cities. Sort alphabetically by name for binary search.

**Step 3:** Verify `astronomy-engine` is importable:
```bash
node -e "const A = require('astronomy-engine'); console.log(typeof A.SunPosition)"
```
Expected: `function`

**Step 4:** Commit: `chore: add astronomy-engine and city database`

---

## Phase 1: Natal Chart Calculation Engine

All files in `src/lib/astro/`. Pure TypeScript, no React dependencies, fully testable.

### Task 1.1: Types

**Files:**
- Create: `src/lib/astro/types.ts`

```ts
export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Planet =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
  | 'NorthNode';

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

export type AstroElement = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

export interface ZodiacPosition {
  sign: ZodiacSign;
  degree: number;      // 0-30 within sign
  longitude: number;   // 0-360 ecliptic longitude
}

export interface PlanetPosition {
  planet: Planet;
  longitude: number;   // 0-360 ecliptic
  sign: ZodiacSign;
  degree: number;      // 0-30 within sign
  house: number;       // 1-12
  retrograde: boolean;
}

export interface HouseCusp {
  house: number;       // 1-12
  longitude: number;   // 0-360
  sign: ZodiacSign;
  degree: number;      // 0-30
}

export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  orb: number;         // actual deviation in degrees
  applying: boolean;   // approaching exact aspect
}

export interface ElementBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

export interface ModalityBalance {
  cardinal: number;
  fixed: number;
  mutable: number;
}

export interface NatalChart {
  planets: PlanetPosition[];
  ascendant: ZodiacPosition;
  midheaven: ZodiacPosition;
  houses: HouseCusp[];
  aspects: Aspect[];
  elements: ElementBalance;
  modalities: ModalityBalance;
}

export interface AstroBirthInfo {
  year: number;
  month: number;       // 1-12
  day: number;         // 1-31
  hour: number;        // 0-23
  minute: number;      // 0-59
  latitude: number;
  longitude: number;
  cityName: string;
}

export interface AstroProfile {
  birthInfo: AstroBirthInfo;
  chart: NatalChart;
  createdAt: string;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}
```

Commit: `feat(astro): add type definitions`

### Task 1.2: Constants

**Files:**
- Create: `src/lib/astro/constants.ts`
- Create: `src/lib/astro/__tests__/constants.test.ts`

```ts
import type { ZodiacSign, Planet, AspectType, AstroElement, Modality } from './types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const PLANET_SYMBOLS: Record<Planet, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  NorthNode: '☊',
};

// Maps each sign to its element (index = sign order)
export const SIGN_ELEMENTS: AstroElement[] = [
  'fire', 'earth', 'air', 'water',   // Aries-Cancer
  'fire', 'earth', 'air', 'water',   // Leo-Scorpio
  'fire', 'earth', 'air', 'water',   // Sag-Pisces
];

// Maps each sign to its modality
export const SIGN_MODALITIES: Modality[] = [
  'cardinal', 'fixed', 'mutable',    // Aries-Gemini
  'cardinal', 'fixed', 'mutable',    // Cancer-Virgo
  'cardinal', 'fixed', 'mutable',    // Libra-Sag
  'cardinal', 'fixed', 'mutable',    // Cap-Pisces
];

// Aspect definitions with ideal angle and max orb
export const ASPECT_CONFIGS: { type: AspectType; angle: number; orb: number }[] = [
  { type: 'conjunction', angle: 0, orb: 8 },
  { type: 'sextile', angle: 60, orb: 6 },
  { type: 'square', angle: 90, orb: 8 },
  { type: 'trine', angle: 120, orb: 8 },
  { type: 'opposition', angle: 180, orb: 8 },
];

// Planets to calculate (matches astronomy-engine Body names, except Sun/Moon/NorthNode)
export const PLANETS: Planet[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'NorthNode',
];

// Maps Planet names to astronomy-engine Body names
export const PLANET_TO_BODY: Record<Planet, string> = {
  Sun: 'Sun',
  Moon: 'Moon',
  Mercury: 'Mercury',
  Venus: 'Venus',
  Mars: 'Mars',
  Jupiter: 'Jupiter',
  Saturn: 'Saturn',
  Uranus: 'Uranus',
  Neptune: 'Neptune',
  Pluto: 'Pluto',
  NorthNode: 'NorthNode', // special handling
};
```

**Tests:**
- `ZODIAC_SIGNS` has 12 entries
- `SIGN_ELEMENTS` has 12 entries and repeats in groups of 4
- `SIGN_MODALITIES` has 12 entries and repeats in groups of 3
- `ASPECT_CONFIGS` has 5 entries
- `PLANETS` has 11 entries
- Spot-check: Aries → fire + cardinal, Taurus → earth + fixed, Gemini → air + mutable

Commit: `feat(astro): add constants and data tables`

### Task 1.3: Zodiac mapping

**Files:**
- Create: `src/lib/astro/zodiac.ts`
- Create: `src/lib/astro/__tests__/zodiac.test.ts`

```ts
import type { ZodiacSign, ZodiacPosition } from './types';
import { ZODIAC_SIGNS } from './constants';

/**
 * Convert ecliptic longitude (0-360°) to zodiac sign and degree.
 */
export function longitudeToZodiac(longitude: number): ZodiacPosition {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree,
    longitude: normalized,
  };
}

/**
 * Get the zodiac sign index (0-11) for a given sign.
 */
export function getSignIndex(sign: ZodiacSign): number {
  return ZODIAC_SIGNS.indexOf(sign);
}
```

**Test cases:**
- `longitudeToZodiac(0)` → Aries, 0°
- `longitudeToZodiac(15)` → Aries, 15°
- `longitudeToZodiac(30)` → Taurus, 0°
- `longitudeToZodiac(90)` → Cancer, 0°
- `longitudeToZodiac(180)` → Libra, 0°
- `longitudeToZodiac(270)` → Capricorn, 0°
- `longitudeToZodiac(359.9)` → Pisces, ~29.9°
- `longitudeToZodiac(360)` → Aries, 0° (wraps)
- `longitudeToZodiac(-30)` → Pisces, 0° (negative wraps)
- `getSignIndex('Aries')` → 0, `getSignIndex('Pisces')` → 11

Commit: `feat(astro): add zodiac longitude-to-sign mapping`

### Task 1.4: Planet position calculations

**Files:**
- Create: `src/lib/astro/planets.ts`
- Create: `src/lib/astro/__tests__/planets.test.ts`

```ts
import * as Astronomy from 'astronomy-engine';
import type { Planet } from './types';
import { PLANETS } from './constants';

/**
 * Get ecliptic longitude for a planet at a given date.
 * Returns 0-360 degrees.
 */
export function getPlanetLongitude(planet: Planet, date: Date): number {
  const astroDate = Astronomy.MakeTime(date);

  if (planet === 'Sun') {
    const sunPos = Astronomy.SunPosition(astroDate);
    return sunPos.elon;
  }

  if (planet === 'Moon') {
    const moonPos = Astronomy.EclipticGeoMoon(astroDate);
    return ((moonPos.lon % 360) + 360) % 360;
  }

  if (planet === 'NorthNode') {
    // Approximate mean North Node calculation
    // The mean ascending node regresses ~19.355° per year
    const J2000 = new Date('2000-01-01T12:00:00Z');
    const daysSinceJ2000 = (date.getTime() - J2000.getTime()) / 86400000;
    const nodeLon = 125.044522 - 0.0529539 * daysSinceJ2000;
    return ((nodeLon % 360) + 360) % 360;
  }

  // All other planets: use GeoVector + Ecliptic
  const body = planet as Astronomy.Body;
  const geo = Astronomy.GeoVector(body, astroDate, true);
  const ecl = Astronomy.Ecliptic(geo);
  return ((ecl.elon % 360) + 360) % 360;
}

/**
 * Detect if a planet is retrograde at the given date.
 * Compare longitude 1 day before and after — if moving backward, it's retrograde.
 * Sun and Moon are never retrograde. NorthNode is always retrograde (mean).
 */
export function isRetrograde(planet: Planet, date: Date): boolean {
  if (planet === 'Sun' || planet === 'Moon') return false;
  if (planet === 'NorthNode') return true; // mean node always retrogrades

  const before = new Date(date.getTime() - 86400000); // -1 day
  const after = new Date(date.getTime() + 86400000);  // +1 day

  const lonBefore = getPlanetLongitude(planet, before);
  const lonAfter = getPlanetLongitude(planet, after);

  // Handle wrapping around 360°/0°
  let diff = lonAfter - lonBefore;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff < 0;
}

/**
 * Get all planet longitudes for a date.
 */
export function getAllPlanetLongitudes(date: Date): { planet: Planet; longitude: number; retrograde: boolean }[] {
  return PLANETS.map((planet) => ({
    planet,
    longitude: getPlanetLongitude(planet, date),
    retrograde: isRetrograde(planet, date),
  }));
}
```

**Test cases:**
- All planet longitudes return values between 0-360
- Sun on vernal equinox (~March 20) should be near 0° (Aries)
- Sun on summer solstice (~June 21) should be near 90° (Cancer)
- Sun is never retrograde
- Moon is never retrograde
- NorthNode is always retrograde
- Verify at least one known retrograde period (e.g., Mercury retrograde)
- All 11 planets return valid results for a test date like 2024-01-01T00:00:00Z

**Important note on `astronomy-engine` imports:** The library exports `Body` as an enum. When passing planet names, cast to `Astronomy.Body` or use the string directly if the library supports string bodies. Verify the actual API at implementation time by checking `node -e "const A = require('astronomy-engine'); console.log(Object.keys(A.Body))"`.

Commit: `feat(astro): add planet position calculations via astronomy-engine`

### Task 1.5: Ascendant and Midheaven calculations

**Files:**
- Create: `src/lib/astro/ascendant.ts`
- Create: `src/lib/astro/__tests__/ascendant.test.ts`

```ts
import * as Astronomy from 'astronomy-engine';
import type { ZodiacPosition } from './types';
import { longitudeToZodiac } from './zodiac';

/**
 * Calculate the Ascendant (Rising Sign) from birth date/time and geographic coordinates.
 *
 * Formula:
 * 1. Get Greenwich Apparent Sidereal Time (GAST) via astronomy-engine
 * 2. Convert to Local Sidereal Time: LST = GAST + longitude/15 (in hours)
 * 3. Convert LST to radians: RAMC = LST * 15 * (π/180)
 * 4. Get true obliquity of ecliptic (ε) via astronomy-engine
 * 5. ASC = atan2(-cos(RAMC), sin(ε) * tan(lat) + cos(ε) * sin(RAMC))
 * 6. Convert from radians to degrees (0-360)
 */
export function calculateAscendant(date: Date, latitude: number, longitude: number): ZodiacPosition {
  const astroDate = Astronomy.MakeTime(date);

  // Step 1-2: Local Sidereal Time in hours
  const gast = Astronomy.SiderealTime(astroDate);
  const lst = ((gast + longitude / 15) % 24 + 24) % 24;

  // Step 3: Convert to radians (RAMC = Right Ascension of Medium Coeli)
  const ramcDeg = lst * 15;
  const ramcRad = ramcDeg * Math.PI / 180;

  // Step 4: True obliquity
  const tilt = Astronomy.e_tilt(astroDate);
  const oblRad = tilt.tobl * Math.PI / 180;

  // Step 5: Latitude in radians
  const latRad = latitude * Math.PI / 180;

  // Ascendant formula
  const ascRad = Math.atan2(
    -Math.cos(ramcRad),
    Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(ramcRad)
  );

  // Step 6: Convert to degrees (0-360)
  let ascDeg = ascRad * 180 / Math.PI;
  ascDeg = ((ascDeg % 360) + 360) % 360;

  return longitudeToZodiac(ascDeg);
}

/**
 * Calculate Midheaven (MC) — the cusp of the 10th house.
 *
 * Formula:
 * MC = atan(tan(RAMC) / cos(ε))
 * Adjust quadrant based on RAMC.
 */
export function calculateMidheaven(date: Date, longitude: number): ZodiacPosition {
  const astroDate = Astronomy.MakeTime(date);

  const gast = Astronomy.SiderealTime(astroDate);
  const lst = ((gast + longitude / 15) % 24 + 24) % 24;

  const ramcDeg = lst * 15;
  const ramcRad = ramcDeg * Math.PI / 180;

  const tilt = Astronomy.e_tilt(astroDate);
  const oblRad = tilt.tobl * Math.PI / 180;

  let mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(oblRad));
  let mcDeg = mcRad * 180 / Math.PI;
  mcDeg = ((mcDeg % 360) + 360) % 360;

  return longitudeToZodiac(mcDeg);
}
```

**Test cases:**
- Ascendant and MC return valid zodiac positions (0-360° longitude)
- Known reference: 1990-01-01 12:00 UTC at London (51.5°N, 0°W) → verify ASC is roughly Aries/Taurus region (cross-check with an online natal chart calculator)
- Ascendant changes significantly with birth time (test same date, different hours)
- Ascendant changes with latitude (equator vs polar)
- MC should be approximately 90° ahead of ASC (in most cases)
- MC depends on longitude but not latitude (formula doesn't use lat)

Commit: `feat(astro): add ascendant and midheaven calculations`

### Task 1.6: House cusp calculations (Placidus)

**Files:**
- Create: `src/lib/astro/houses.ts`
- Create: `src/lib/astro/__tests__/houses.test.ts`

```ts
import type { HouseCusp, ZodiacPosition } from './types';
import { longitudeToZodiac } from './zodiac';
import { calculateAscendant, calculateMidheaven } from './ascendant';

/**
 * Calculate Placidus house cusps.
 *
 * Placidus divides the diurnal/nocturnal arcs into equal time segments.
 * For intermediate cusps (2,3,5,6,8,9,11,12), we use the
 * semi-arc trisection method.
 *
 * Simplified approach: use the Ascendant (house 1), MC (house 10),
 * and interpolate intermediate cusps.
 *
 * For exact Placidus, iterative methods are needed. Here we use an
 * approximation that equally divides the ecliptic arcs between
 * the four angles (ASC, IC, DSC, MC).
 */
export function calculateHouseCusps(
  date: Date,
  latitude: number,
  longitude: number
): HouseCusp[] {
  const asc = calculateAscendant(date, latitude, longitude);
  const mc = calculateMidheaven(date, longitude);

  // The four angles
  const ascLon = asc.longitude;
  const mcLon = mc.longitude;
  const dscLon = (ascLon + 180) % 360; // Descendant = opposite ASC
  const icLon = (mcLon + 180) % 360;   // Imum Coeli = opposite MC

  // Interpolate cusps between angles
  // Houses: 1(ASC) → 2 → 3 → 4(IC) → 5 → 6 → 7(DSC) → 8 → 9 → 10(MC) → 11 → 12
  const cusps: number[] = new Array(12);
  cusps[0] = ascLon;   // House 1 = ASC
  cusps[3] = icLon;    // House 4 = IC
  cusps[6] = dscLon;   // House 7 = DSC
  cusps[9] = mcLon;    // House 10 = MC

  // Interpolate between angles (trisect each quadrant)
  cusps[1] = interpolateArc(ascLon, icLon, 1 / 3);
  cusps[2] = interpolateArc(ascLon, icLon, 2 / 3);
  cusps[4] = interpolateArc(icLon, dscLon, 1 / 3);
  cusps[5] = interpolateArc(icLon, dscLon, 2 / 3);
  cusps[7] = interpolateArc(dscLon, mcLon, 1 / 3);
  cusps[8] = interpolateArc(dscLon, mcLon, 2 / 3);
  cusps[10] = interpolateArc(mcLon, ascLon, 1 / 3);
  cusps[11] = interpolateArc(mcLon, ascLon, 2 / 3);

  return cusps.map((lon, i) => {
    const pos = longitudeToZodiac(lon);
    return {
      house: i + 1,
      longitude: pos.longitude,
      sign: pos.sign,
      degree: pos.degree,
    };
  });
}

/**
 * Interpolate along an ecliptic arc from start to end.
 * Handles wrapping around 360°.
 */
function interpolateArc(startLon: number, endLon: number, fraction: number): number {
  let arc = endLon - startLon;
  if (arc < 0) arc += 360;
  return (startLon + arc * fraction) % 360;
}

/**
 * Determine which house (1-12) a planet falls in given house cusps.
 */
export function getHouseForLongitude(longitude: number, cusps: HouseCusp[]): number {
  const lon = ((longitude % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const nextIndex = (i + 1) % 12;
    const cuspStart = cusps[i].longitude;
    const cuspEnd = cusps[nextIndex].longitude;

    if (cuspEnd > cuspStart) {
      // Normal case
      if (lon >= cuspStart && lon < cuspEnd) return i + 1;
    } else {
      // Wraps around 360°
      if (lon >= cuspStart || lon < cuspEnd) return i + 1;
    }
  }

  return 1; // fallback
}
```

**Test cases:**
- Returns exactly 12 house cusps
- House 1 longitude matches Ascendant
- House 10 longitude matches MC
- House 7 is ~180° from House 1 (Descendant)
- House 4 is ~180° from House 10 (IC)
- All cusps have valid zodiac positions (sign + degree)
- `getHouseForLongitude`: planet at ASC longitude → house 1
- `getHouseForLongitude`: planet at MC longitude → house 10
- Houses proceed in order around the ecliptic

**Note:** This uses equal-arc interpolation (Porphyry-like) as a Placidus approximation. True Placidus requires iterative calculations involving diurnal arcs. This approximation is acceptable for v1 — the visual chart and house placements will be close. A future upgrade could replace with exact Placidus.

Commit: `feat(astro): add Placidus house cusp calculations`

### Task 1.7: Aspect detection

**Files:**
- Create: `src/lib/astro/aspects.ts`
- Create: `src/lib/astro/__tests__/aspects.test.ts`

```ts
import type { Aspect, Planet, PlanetPosition } from './types';
import { ASPECT_CONFIGS } from './constants';

/**
 * Calculate the shortest angular distance between two longitudes.
 * Always returns 0-180.
 */
export function angularDistance(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Detect all major aspects between planet positions.
 */
export function detectAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const distance = angularDistance(p1.longitude, p2.longitude);

      for (const config of ASPECT_CONFIGS) {
        const orb = Math.abs(distance - config.angle);
        if (orb <= config.orb) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            type: config.type,
            orb: Math.round(orb * 100) / 100,
            applying: false, // simplified — set to false for natal chart
          });
          break; // only one aspect per planet pair
        }
      }
    }
  }

  return aspects;
}
```

**Test cases:**
- `angularDistance(0, 90)` → 90
- `angularDistance(350, 10)` → 20 (wraps)
- `angularDistance(180, 0)` → 180
- Two planets at 0° and 0° → conjunction with orb 0
- Two planets at 0° and 90° → square
- Two planets at 0° and 120° → trine
- Two planets at 0° and 180° → opposition
- Two planets at 0° and 60° → sextile
- Two planets at 0° and 45° → no aspect (45° not a major aspect)
- Planets at 0° and 95° → not square (outside 8° orb, since 95-90=5 which IS within orb, so this IS a square)
- Planets at 0° and 99° → not square (outside 8° orb, since 99-90=9)
- No duplicate aspects (each pair appears once)

Commit: `feat(astro): add aspect detection between planets`

### Task 1.8: Element and modality balance

**Files:**
- Create: `src/lib/astro/balance.ts`
- Create: `src/lib/astro/__tests__/balance.test.ts`

```ts
import type { PlanetPosition, ZodiacPosition, ElementBalance, ModalityBalance } from './types';
import { SIGN_ELEMENTS, SIGN_MODALITIES, ZODIAC_SIGNS } from './constants';
import type { ZodiacSign } from './types';

function getSignIndex(sign: ZodiacSign): number {
  return ZODIAC_SIGNS.indexOf(sign);
}

/**
 * Count elements across planet placements + ASC + MC.
 */
export function countElements(planets: PlanetPosition[], ascendant: ZodiacPosition, midheaven: ZodiacPosition): ElementBalance {
  const counts: ElementBalance = { fire: 0, earth: 0, air: 0, water: 0 };

  for (const p of planets) {
    const element = SIGN_ELEMENTS[getSignIndex(p.sign)];
    counts[element]++;
  }

  // Include ASC and MC
  counts[SIGN_ELEMENTS[getSignIndex(ascendant.sign)]]++;
  counts[SIGN_ELEMENTS[getSignIndex(midheaven.sign)]]++;

  return counts;
}

/**
 * Count modalities across planet placements + ASC + MC.
 */
export function countModalities(planets: PlanetPosition[], ascendant: ZodiacPosition, midheaven: ZodiacPosition): ModalityBalance {
  const counts: ModalityBalance = { cardinal: 0, fixed: 0, mutable: 0 };

  for (const p of planets) {
    const modality = SIGN_MODALITIES[getSignIndex(p.sign)];
    counts[modality]++;
  }

  counts[SIGN_MODALITIES[getSignIndex(ascendant.sign)]]++;
  counts[SIGN_MODALITIES[getSignIndex(midheaven.sign)]]++;

  return counts;
}
```

**Test cases:**
- All planets in fire signs → fire = 11 (+ possible ASC/MC), others = 0
- Balanced chart → each element approximately equal
- Sum of all elements = number of planets + 2 (ASC + MC) = 13
- Sum of all modalities = 13
- Spot-check: Sun in Aries (fire, cardinal) → fire++ and cardinal++

Commit: `feat(astro): add element and modality balance counting`

### Task 1.9: Transit calculations

**Files:**
- Create: `src/lib/astro/transits.ts`
- Create: `src/lib/astro/__tests__/transits.test.ts`

```ts
import type { Planet, PlanetPosition, Aspect } from './types';
import { getPlanetLongitude, isRetrograde } from './planets';
import { longitudeToZodiac } from './zodiac';
import { detectAspects } from './aspects';
import { PLANETS } from './constants';

export interface TransitAspect extends Aspect {
  transitPlanet: Planet;
  natalPlanet: Planet;
}

/**
 * Get current planet positions as PlanetPosition[] (without house placement).
 */
export function getCurrentPlanetPositions(date?: Date): PlanetPosition[] {
  const d = date ?? new Date();
  return PLANETS.map((planet) => {
    const longitude = getPlanetLongitude(planet, d);
    const zodiac = longitudeToZodiac(longitude);
    return {
      planet,
      longitude,
      sign: zodiac.sign,
      degree: zodiac.degree,
      house: 0, // transit planets don't have natal house placement
      retrograde: isRetrograde(planet, d),
    };
  });
}

/**
 * Find aspects between current transiting planets and natal planet positions.
 */
export function getTransitAspects(natalPlanets: PlanetPosition[], date?: Date): TransitAspect[] {
  const currentPositions = getCurrentPlanetPositions(date);
  const allPositions = [
    ...natalPlanets.map((p) => ({ ...p, planet: `natal_${p.planet}` as Planet })),
    ...currentPositions.map((p) => ({ ...p, planet: `transit_${p.planet}` as Planet })),
  ];

  // Detect aspects only between transit and natal (not transit-transit or natal-natal)
  const aspects = detectAspects(allPositions);
  return aspects
    .filter((a) => {
      const p1Transit = String(a.planet1).startsWith('transit_');
      const p2Transit = String(a.planet2).startsWith('transit_');
      return (p1Transit && !p2Transit) || (!p1Transit && p2Transit);
    })
    .map((a) => {
      const isP1Transit = String(a.planet1).startsWith('transit_');
      return {
        ...a,
        planet1: String(a.planet1).replace(/^(natal_|transit_)/, '') as Planet,
        planet2: String(a.planet2).replace(/^(natal_|transit_)/, '') as Planet,
        transitPlanet: (isP1Transit
          ? String(a.planet1).replace('transit_', '')
          : String(a.planet2).replace('transit_', '')) as Planet,
        natalPlanet: (isP1Transit
          ? String(a.planet2).replace('natal_', '')
          : String(a.planet1).replace('natal_', '')) as Planet,
      };
    });
}
```

**Test cases:**
- `getCurrentPlanetPositions` returns 11 entries (one per planet)
- All longitudes between 0-360
- Transit aspects between natal and current planets are valid
- No aspect has both planets from natal or both from transit

**Note:** The transit prefix approach is a practical workaround. A cleaner implementation could use separate arrays, but this reuses the existing `detectAspects` function without modification.

Commit: `feat(astro): add transit calculations`

### Task 1.10: Natal chart orchestrator

**Files:**
- Create: `src/lib/astro/natal-chart.ts`
- Create: `src/lib/astro/__tests__/natal-chart.test.ts`

```ts
import type { AstroBirthInfo, NatalChart } from './types';
import { getAllPlanetLongitudes } from './planets';
import { longitudeToZodiac } from './zodiac';
import { calculateAscendant, calculateMidheaven } from './ascendant';
import { calculateHouseCusps, getHouseForLongitude } from './houses';
import { detectAspects } from './aspects';
import { countElements, countModalities } from './balance';

/**
 * Calculate a complete natal chart from birth information.
 */
export function calculateNatalChart(birthInfo: AstroBirthInfo): NatalChart {
  const birthDate = new Date(
    Date.UTC(birthInfo.year, birthInfo.month - 1, birthInfo.day, birthInfo.hour, birthInfo.minute)
  );

  // 1. Planet positions
  const rawPlanets = getAllPlanetLongitudes(birthDate);

  // 2. Ascendant and Midheaven
  const ascendant = calculateAscendant(birthDate, birthInfo.latitude, birthInfo.longitude);
  const midheaven = calculateMidheaven(birthDate, birthInfo.longitude);

  // 3. House cusps
  const houses = calculateHouseCusps(birthDate, birthInfo.latitude, birthInfo.longitude);

  // 4. Map planets to zodiac positions and house placements
  const planets = rawPlanets.map((rp) => {
    const zodiac = longitudeToZodiac(rp.longitude);
    return {
      planet: rp.planet,
      longitude: rp.longitude,
      sign: zodiac.sign,
      degree: zodiac.degree,
      house: getHouseForLongitude(rp.longitude, houses),
      retrograde: rp.retrograde,
    };
  });

  // 5. Aspects
  const aspects = detectAspects(planets);

  // 6. Element and modality balance
  const elements = countElements(planets, ascendant, midheaven);
  const modalities = countModalities(planets, ascendant, midheaven);

  return {
    planets,
    ascendant,
    midheaven,
    houses,
    aspects,
    elements,
    modalities,
  };
}
```

**Test cases:**
- Returns valid `NatalChart` with all fields populated
- `planets` array has 11 entries
- `houses` array has 12 entries
- `ascendant` and `midheaven` have valid zodiac positions
- All planet house numbers are 1-12
- All planet longitudes are 0-360
- Elements sum to 13 (11 planets + ASC + MC)
- Modalities sum to 13
- Test with known birth data: 1990-08-15 14:00 UTC, Seoul (37.5665, 126.978) — verify Sun is in Leo (~142° longitude)
- Same input always produces same output (deterministic)

Commit: `feat(astro): add natal chart orchestrator`

### Task 1.11: Display formatting

**Files:**
- Create: `src/lib/astro/format.ts`
- Create: `src/lib/astro/__tests__/format.test.ts`

```ts
import type { PlanetPosition, ZodiacPosition, NatalChart, Aspect } from './types';
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from './constants';

export interface FormattedPlanet {
  planet: string;
  symbol: string;
  sign: string;
  signSymbol: string;
  degree: string;        // e.g., "15°22'"
  house: number;
  retrograde: boolean;
}

export interface FormattedAspect {
  planet1: string;
  planet1Symbol: string;
  planet2: string;
  planet2Symbol: string;
  type: string;
  typeSymbol: string;
  orb: string;
}

const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
};

export function formatDegree(degree: number): string {
  const deg = Math.floor(degree);
  const min = Math.round((degree - deg) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
}

export function formatPlanet(pp: PlanetPosition): FormattedPlanet {
  return {
    planet: pp.planet,
    symbol: PLANET_SYMBOLS[pp.planet],
    sign: pp.sign,
    signSymbol: ZODIAC_SYMBOLS[pp.sign],
    degree: formatDegree(pp.degree),
    house: pp.house,
    retrograde: pp.retrograde,
  };
}

export function formatAspect(a: Aspect): FormattedAspect {
  return {
    planet1: a.planet1,
    planet1Symbol: PLANET_SYMBOLS[a.planet1],
    planet2: a.planet2,
    planet2Symbol: PLANET_SYMBOLS[a.planet2],
    type: a.type,
    typeSymbol: ASPECT_SYMBOLS[a.type] ?? '',
    orb: formatDegree(a.orb),
  };
}

export function formatChart(chart: NatalChart) {
  return {
    planets: chart.planets.map(formatPlanet),
    ascendant: {
      sign: chart.ascendant.sign,
      signSymbol: ZODIAC_SYMBOLS[chart.ascendant.sign],
      degree: formatDegree(chart.ascendant.degree),
    },
    midheaven: {
      sign: chart.midheaven.sign,
      signSymbol: ZODIAC_SYMBOLS[chart.midheaven.sign],
      degree: formatDegree(chart.midheaven.degree),
    },
    aspects: chart.aspects.map(formatAspect),
    elements: chart.elements,
    modalities: chart.modalities,
  };
}
```

**Test cases:**
- `formatDegree(15.5)` → `"15°30'"`
- `formatDegree(0)` → `"0°00'"`
- `formatDegree(29.99)` → `"29°59'"`
- `formatPlanet` returns correct symbol for Sun (☉), Moon (☽), etc.
- `formatAspect` returns correct type symbol (☌ for conjunction, etc.)
- `formatChart` has all fields populated

Commit: `feat(astro): add display formatting utilities`

### Task 1.12: Profile localStorage manager

**Files:**
- Create: `src/lib/astro/profile.ts`
- Create: `src/lib/astro/__tests__/profile.test.ts`

Follow the same pattern as `src/lib/saju/profile.ts`:

```ts
import type { AstroBirthInfo, AstroProfile } from './types';
import { calculateNatalChart } from './natal-chart';

const STORAGE_KEY = 'astro_profile';

let cachedRaw: string | null = null;
let cachedProfile: AstroProfile | null = null;

export function saveAstroProfile(birthInfo: AstroBirthInfo): AstroProfile {
  const chart = calculateNatalChart(birthInfo);
  const profile: AstroProfile = {
    birthInfo,
    chart,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const json = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, json);
    cachedRaw = json;
    cachedProfile = profile;
  }

  return profile;
}

export function getAstroProfile(): AstroProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
  if (raw === cachedRaw) return cachedProfile;
  try {
    cachedRaw = raw;
    cachedProfile = JSON.parse(raw) as AstroProfile;
    return cachedProfile;
  } catch {
    cachedRaw = null;
    cachedProfile = null;
    return null;
  }
}

export function clearAstroProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedProfile = null;
  }
}
```

**Test cases (using jsdom mocks or simple logic tests):**
- `saveAstroProfile` returns a valid `AstroProfile` with chart populated
- Profile contains `birthInfo`, `chart`, and `createdAt`
- `clearAstroProfile` sets cached values to null

Commit: `feat(astro): add profile localStorage manager`

### Task 1.13: Barrel exports

**Files:**
- Create: `src/lib/astro/index.ts`

```ts
// Types
export type {
  ZodiacSign,
  Planet,
  AspectType,
  AstroElement,
  Modality,
  ZodiacPosition,
  PlanetPosition,
  HouseCusp,
  Aspect,
  ElementBalance,
  ModalityBalance,
  NatalChart,
  AstroBirthInfo,
  AstroProfile,
  City,
} from './types';

// Constants
export {
  ZODIAC_SIGNS,
  ZODIAC_SYMBOLS,
  PLANET_SYMBOLS,
  SIGN_ELEMENTS,
  SIGN_MODALITIES,
  ASPECT_CONFIGS,
  PLANETS,
} from './constants';

// Core calculations
export { longitudeToZodiac, getSignIndex } from './zodiac';
export { getPlanetLongitude, isRetrograde, getAllPlanetLongitudes } from './planets';
export { calculateAscendant, calculateMidheaven } from './ascendant';
export { calculateHouseCusps, getHouseForLongitude } from './houses';
export { detectAspects, angularDistance } from './aspects';
export { countElements, countModalities } from './balance';
export { getCurrentPlanetPositions, getTransitAspects } from './transits';
export { calculateNatalChart } from './natal-chart';

// Profile
export { saveAstroProfile, getAstroProfile, clearAstroProfile } from './profile';

// Formatting
export { formatDegree, formatPlanet, formatAspect, formatChart } from './format';
export type { FormattedPlanet, FormattedAspect } from './format';
```

Commit: `feat(astro): add barrel exports`

---

## Phase 2: UI Components

### Task 2.1: City autocomplete component

**Files:**
- Create: `src/components/astro/CityAutocomplete.tsx`

`"use client"` component. Loads city data from `src/data/cities.json`. Text input that filters cities by prefix match. Shows dropdown of up to 8 matching cities. When a city is selected, calls `onSelect(city: City)` callback.

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import type { City } from "@/lib/astro/types";
import citiesData from "@/data/cities.json";

const cities = citiesData as City[];

interface Props {
  value: string;
  onSelect: (city: City) => void;
}

export default function CityAutocomplete({ value, onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const lower = q.toLowerCase();
    const matches = cities
      .filter((c) => c.name.toLowerCase().startsWith(lower))
      .slice(0, 8);
    setResults(matches);
    setIsOpen(matches.length > 0);
  }

  function handleSelect(city: City) {
    setQuery(`${city.name}, ${city.country}`);
    setIsOpen(false);
    onSelect(city);
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search city..."
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-gold/50"
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-background shadow-lg max-h-48 overflow-y-auto">
          {results.map((city, i) => (
            <li key={`${city.name}-${city.country}-${i}`}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-3 py-2 text-left text-sm text-foreground/70 hover:bg-gold/10 hover:text-foreground"
              >
                {city.name}, {city.country}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Commit: `feat(astro): add city autocomplete component`

### Task 2.2: Astro onboarding form

**Files:**
- Create: `src/components/astro/AstroOnboarding.tsx`

`"use client"` component. Form with: date input (required), time input (required, HH:MM), city autocomplete (required). Gold CTA button. Calls `saveAstroProfile()` on submit. Callback prop `onComplete(profile)`.

Follow existing form pattern from `SajuOnboarding.tsx`. Use site's dark indigo/gold styling.

```tsx
"use client";

import { useState } from "react";
import { saveAstroProfile } from "@/lib/astro/profile";
import type { AstroProfile, City } from "@/lib/astro/types";
import CityAutocomplete from "./CityAutocomplete";

interface Props {
  onComplete: (profile: AstroProfile) => void;
}

export default function AstroOnboarding({ onComplete }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!date || !time || !city) {
      setError("Please fill in all fields.");
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    if (year < 1900 || year > 2100) {
      setError("Please enter a year between 1900 and 2100.");
      return;
    }

    const profile = saveAstroProfile({
      year,
      month,
      day,
      hour,
      minute,
      latitude: city.lat,
      longitude: city.lng,
      cityName: `${city.name}, ${city.country}`,
    });

    onComplete(profile);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-background p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gold">Enter Your Birth Details</h3>

      <div>
        <label className="block text-sm text-foreground/60 mb-1">Date of Birth</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
        />
      </div>

      <div>
        <label className="block text-sm text-foreground/60 mb-1">Time of Birth</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
        />
      </div>

      <div>
        <label className="block text-sm text-foreground/60 mb-1">City of Birth</label>
        <CityAutocomplete value="" onSelect={(c) => setCity(c)} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-background hover:bg-gold/90 transition"
      >
        Calculate My Natal Chart
      </button>
    </form>
  );
}
```

Commit: `feat(astro): add birth data onboarding component`

### Task 2.3: Planet positions table

**Files:**
- Create: `src/components/astro/PlanetTable.tsx`

`"use client"` component. Displays a table of planet positions: planet name (with symbol), sign (with symbol), degree, house, retrograde indicator.

```tsx
"use client";

import type { NatalChart } from "@/lib/astro/types";
import { formatPlanet } from "@/lib/astro/format";
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from "@/lib/astro/constants";

interface Props {
  chart: NatalChart;
}

export default function PlanetTable({ chart }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gold mb-3">Planet Positions</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/30 text-foreground/50">
            <th className="py-2 text-left">Planet</th>
            <th className="py-2 text-left">Sign</th>
            <th className="py-2 text-left">Degree</th>
            <th className="py-2 text-center">House</th>
            <th className="py-2 text-center">Rx</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {chart.planets.map((p) => {
            const fp = formatPlanet(p);
            return (
              <tr key={p.planet} className="text-foreground/70">
                <td className="py-2">
                  <span className="mr-2">{fp.symbol}</span>{fp.planet}
                </td>
                <td className="py-2">
                  <span className="mr-1">{fp.signSymbol}</span>{fp.sign}
                </td>
                <td className="py-2">{fp.degree}</td>
                <td className="py-2 text-center">{fp.house}</td>
                <td className="py-2 text-center">{p.retrograde ? "℞" : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

Commit: `feat(astro): add planet positions table component`

### Task 2.4: Aspect grid

**Files:**
- Create: `src/components/astro/AspectGrid.tsx`

`"use client"` component. Displays major aspects as a list with planet pair, aspect type symbol, and orb.

```tsx
"use client";

import type { NatalChart } from "@/lib/astro/types";
import { formatAspect } from "@/lib/astro/format";

const ASPECT_COLORS: Record<string, string> = {
  conjunction: "text-yellow-400",
  sextile: "text-blue-400",
  square: "text-red-400",
  trine: "text-green-400",
  opposition: "text-orange-400",
};

interface Props {
  chart: NatalChart;
}

export default function AspectGrid({ chart }: Props) {
  if (chart.aspects.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <h3 className="text-lg font-semibold text-gold mb-3">Major Aspects</h3>
      <div className="space-y-1">
        {chart.aspects.map((a, i) => {
          const fa = formatAspect(a);
          return (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground/70 py-1">
              <span>{fa.planet1Symbol} {fa.planet1}</span>
              <span className={ASPECT_COLORS[a.type] ?? ""}>{fa.typeSymbol}</span>
              <span>{fa.planet2Symbol} {fa.planet2}</span>
              <span className="text-foreground/30 ml-auto">{fa.orb}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

Commit: `feat(astro): add aspect grid component`

### Task 2.5: Element and modality balance bars

**Files:**
- Create: `src/components/astro/BalanceBar.tsx`

`"use client"` component. Horizontal bar segments for element balance and modality balance, similar to `FiveElementsBar` from saju.

```tsx
"use client";

import type { ElementBalance, ModalityBalance } from "@/lib/astro/types";

const ELEMENT_COLORS: Record<string, string> = {
  fire: "#f87171",
  earth: "#fbbf24",
  air: "#60a5fa",
  water: "#34d399",
};

const MODALITY_COLORS: Record<string, string> = {
  cardinal: "#f97316",
  fixed: "#a78bfa",
  mutable: "#22d3ee",
};

interface Props {
  elements: ElementBalance;
  modalities: ModalityBalance;
}

export default function BalanceBar({ elements, modalities }: Props) {
  const totalE = elements.fire + elements.earth + elements.air + elements.water;
  const totalM = modalities.cardinal + modalities.fixed + modalities.mutable;

  return (
    <div className="rounded-2xl border border-border bg-background p-4 space-y-4">
      <div>
        <h4 className="text-sm font-medium text-foreground/60 mb-2">Elements</h4>
        <div className="flex h-6 rounded-full overflow-hidden">
          {(Object.entries(elements) as [string, number][]).map(([el, count]) => (
            <div
              key={el}
              style={{
                width: `${(count / totalE) * 100}%`,
                backgroundColor: ELEMENT_COLORS[el],
              }}
              className="flex items-center justify-center text-xs font-bold text-background"
              title={`${el}: ${count}`}
            >
              {count > 0 && count}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-foreground/40 mt-1">
          {Object.entries(elements).map(([el, count]) => (
            <span key={el} style={{ color: ELEMENT_COLORS[el] }}>
              {el} {count}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-foreground/60 mb-2">Modalities</h4>
        <div className="flex h-6 rounded-full overflow-hidden">
          {(Object.entries(modalities) as [string, number][]).map(([mod, count]) => (
            <div
              key={mod}
              style={{
                width: `${(count / totalM) * 100}%`,
                backgroundColor: MODALITY_COLORS[mod],
              }}
              className="flex items-center justify-center text-xs font-bold text-background"
              title={`${mod}: ${count}`}
            >
              {count > 0 && count}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-foreground/40 mt-1">
          {Object.entries(modalities).map(([mod, count]) => (
            <span key={mod} style={{ color: MODALITY_COLORS[mod] }}>
              {mod} {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Commit: `feat(astro): add element and modality balance bars`

### Task 2.6: Natal chart wheel visualization

**Files:**
- Create: `src/components/astro/NatalChartWheel.tsx`

`"use client"` component. SVG-based natal chart wheel showing:
- 12 zodiac sign segments around the outer ring
- 12 house divisions as inner lines
- Planet glyphs positioned at their zodiac longitude
- ASC and MC markers
- Aspect lines between planets (colored by aspect type)

This is the most complex UI component. Use SVG with a 600x600 viewBox, centered origin. Draw:
1. Outer circle with 12 sign segments (30° each), labeled with zodiac symbols
2. Inner circle for house divisions
3. Planet symbols placed on the mid-ring at their ecliptic longitude
4. ASC arrow at the left (rising) and MC at the top

```tsx
"use client";

import type { NatalChart } from "@/lib/astro/types";
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from "@/lib/astro/constants";

interface Props {
  chart: NatalChart;
}

const SIZE = 600;
const CENTER = SIZE / 2;
const OUTER_R = 270;
const MID_R = 220;
const INNER_R = 170;
const PLANET_R = 195;

function polarToXY(angleDeg: number, radius: number): [number, number] {
  // Astro chart: 0° Aries at left (9 o'clock), counter-clockwise
  // Adjust so ASC is at left: angle measured from ASC
  const rad = ((180 - angleDeg) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER - radius * Math.sin(rad)];
}

export default function NatalChartWheel({ chart }: Props) {
  const ascLon = chart.ascendant.longitude;

  // Convert ecliptic longitude to chart angle (relative to ASC)
  function toChartAngle(lon: number): number {
    return ((lon - ascLon + 360) % 360);
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <h3 className="text-lg font-semibold text-gold mb-3 text-center">Natal Chart</h3>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-lg mx-auto">
        {/* Outer circle */}
        <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
        <circle cx={CENTER} cy={CENTER} r={MID_R} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        <circle cx={CENTER} cy={CENTER} r={INNER_R} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />

        {/* Zodiac sign segments */}
        {Array.from({ length: 12 }).map((_, i) => {
          const startAngle = toChartAngle(i * 30);
          const midAngle = toChartAngle(i * 30 + 15);
          const [sx, sy] = polarToXY(startAngle, MID_R);
          const [ex, ey] = polarToXY(startAngle, OUTER_R);
          const [tx, ty] = polarToXY(midAngle, (MID_R + OUTER_R) / 2);
          const signs = Object.values(ZODIAC_SYMBOLS);
          return (
            <g key={i}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} />
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" className="text-foreground/50" fontSize={14}>
                {signs[i]}
              </text>
            </g>
          );
        })}

        {/* House lines */}
        {chart.houses.map((h) => {
          const angle = toChartAngle(h.longitude);
          const [ix, iy] = polarToXY(angle, 40);
          const [ox, oy] = polarToXY(angle, MID_R);
          return (
            <line key={h.house} x1={ix} y1={iy} x2={ox} y2={oy} stroke="currentColor" strokeOpacity={0.1} strokeWidth={0.5} strokeDasharray="4 4" />
          );
        })}

        {/* Aspect lines */}
        {chart.aspects.map((a, i) => {
          const p1 = chart.planets.find((p) => p.planet === a.planet1);
          const p2 = chart.planets.find((p) => p.planet === a.planet2);
          if (!p1 || !p2) return null;
          const [x1, y1] = polarToXY(toChartAngle(p1.longitude), INNER_R - 10);
          const [x2, y2] = polarToXY(toChartAngle(p2.longitude), INNER_R - 10);
          const colors: Record<string, string> = {
            conjunction: "#fbbf24", sextile: "#60a5fa",
            square: "#f87171", trine: "#34d399", opposition: "#f97316",
          };
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[a.type] ?? "#888"} strokeOpacity={0.3} strokeWidth={0.5} />
          );
        })}

        {/* Planet glyphs */}
        {chart.planets.map((p) => {
          const angle = toChartAngle(p.longitude);
          const [px, py] = polarToXY(angle, PLANET_R);
          return (
            <text key={p.planet} x={px} y={py} textAnchor="middle" dominantBaseline="central" className="fill-foreground" fontSize={12}>
              {PLANET_SYMBOLS[p.planet]}
            </text>
          );
        })}

        {/* ASC marker */}
        <text x={CENTER - OUTER_R - 15} y={CENTER} textAnchor="middle" dominantBaseline="central" className="fill-gold font-bold" fontSize={10}>
          ASC
        </text>

        {/* MC marker */}
        {(() => {
          const mcAngle = toChartAngle(chart.midheaven.longitude);
          const [mx, my] = polarToXY(mcAngle, OUTER_R + 15);
          return (
            <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" className="fill-gold font-bold" fontSize={10}>
              MC
            </text>
          );
        })()}
      </svg>
    </div>
  );
}
```

**Note:** This is a simplified wheel. Planet glyph collision avoidance is not implemented — if two planets are very close, their symbols may overlap. This is acceptable for v1.

Commit: `feat(astro): add natal chart wheel SVG visualization`

### Task 2.7: Free interpretation component

**Files:**
- Create: `src/lib/astro/prompts.ts`
- Create: `src/components/astro/AstroInterpretation.tsx`

**Prompts file** (`src/lib/astro/prompts.ts`):

```ts
import type { NatalChart } from './types';
import { formatChart } from './format';

export function buildInterpretationPrompt(chart: NatalChart): string {
  const formatted = formatChart(chart);
  return `You are a warm, knowledgeable Western astrologer. The user has just generated their natal chart. Write a one-time personality reading based on their chart.

Chart data:
- Sun: ${formatted.planets.find(p => p.planet === 'Sun')?.sign} ${formatted.planets.find(p => p.planet === 'Sun')?.degree} (House ${formatted.planets.find(p => p.planet === 'Sun')?.house})
- Moon: ${formatted.planets.find(p => p.planet === 'Moon')?.sign} ${formatted.planets.find(p => p.planet === 'Moon')?.degree} (House ${formatted.planets.find(p => p.planet === 'Moon')?.house})
- Ascendant: ${formatted.ascendant.sign} ${formatted.ascendant.degree}
- Mercury: ${formatted.planets.find(p => p.planet === 'Mercury')?.sign}
- Venus: ${formatted.planets.find(p => p.planet === 'Venus')?.sign}
- Mars: ${formatted.planets.find(p => p.planet === 'Mars')?.sign}
- Midheaven: ${formatted.midheaven.sign}
- Element balance: Fire ${chart.elements.fire}, Earth ${chart.elements.earth}, Air ${chart.elements.air}, Water ${chart.elements.water}
- Modality balance: Cardinal ${chart.modalities.cardinal}, Fixed ${chart.modalities.fixed}, Mutable ${chart.modalities.mutable}

Write a warm, accessible interpretation covering:
1. Core personality (Sun + Ascendant)
2. Emotional world (Moon sign + house)
3. Communication style (Mercury)
4. Love and values (Venus)
5. Drive and ambition (Mars)
6. Career direction (Midheaven)
7. Overall elemental and modal balance

3-4 sentences per section. Reference specific placements. No jargon.

Respond in JSON:
{
  "personality": "...",
  "emotions": "...",
  "communication": "...",
  "love": "...",
  "ambition": "...",
  "career": "...",
  "balance": "..."
}`;
}

export function buildDailyTransitPrompt(chart: NatalChart, transitData: string): string {
  const formatted = formatChart(chart);
  return `You are a Western astrologer providing a daily transit reading. The user's natal chart and today's transiting planets are provided.

Natal Sun: ${formatted.planets.find(p => p.planet === 'Sun')?.sign}
Natal Moon: ${formatted.planets.find(p => p.planet === 'Moon')?.sign}
Ascendant: ${formatted.ascendant.sign}

Today's transits:
${transitData}

Write a personalized daily reading covering:
1. Overall energy today (2-3 sentences)
2. Relationships (1-2 sentences)
3. Work/career (1-2 sentences)
4. One actionable tip

Respond in JSON:
{
  "energy": "...",
  "relationships": "...",
  "career": "...",
  "tip": "..."
}`;
}

export function buildMonthlyForecastPrompt(chart: NatalChart, transitData: string): string {
  const formatted = formatChart(chart);
  return `You are a Western astrologer writing a monthly forecast. The user's natal chart and this month's major transits are provided.

Natal Sun: ${formatted.planets.find(p => p.planet === 'Sun')?.sign}
Ascendant: ${formatted.ascendant.sign}
Midheaven: ${formatted.midheaven.sign}

This month's transits:
${transitData}

Write a detailed monthly forecast covering:
1. Overall theme (2-3 sentences)
2. Career and finances (2-3 sentences)
3. Love and relationships (2-3 sentences)
4. Health and wellness (1-2 sentences)
5. Key dates to watch (1-2 sentences)
6. Monthly advice (1-2 sentences)

Respond in JSON:
{
  "theme": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "keyDates": "...",
  "advice": "..."
}`;
}

export function buildCompatibilityPrompt(chartA: NatalChart, chartB: NatalChart): string {
  const fmtA = formatChart(chartA);
  const fmtB = formatChart(chartB);
  return `You are a Western astrologer analyzing synastry (compatibility) between two natal charts.

Person A:
- Sun: ${fmtA.planets.find(p => p.planet === 'Sun')?.sign}, Moon: ${fmtA.planets.find(p => p.planet === 'Moon')?.sign}
- Venus: ${fmtA.planets.find(p => p.planet === 'Venus')?.sign}, Mars: ${fmtA.planets.find(p => p.planet === 'Mars')?.sign}
- Ascendant: ${fmtA.ascendant.sign}

Person B:
- Sun: ${fmtB.planets.find(p => p.planet === 'Sun')?.sign}, Moon: ${fmtB.planets.find(p => p.planet === 'Moon')?.sign}
- Venus: ${fmtB.planets.find(p => p.planet === 'Venus')?.sign}, Mars: ${fmtB.planets.find(p => p.planet === 'Mars')?.sign}
- Ascendant: ${fmtB.ascendant.sign}

Analyze their compatibility:
1. Overall harmony (2-3 sentences)
2. Communication match (2-3 sentences)
3. Emotional compatibility (2-3 sentences)
4. Physical chemistry (2-3 sentences)
5. Challenges (2-3 sentences)
6. Advice (2-3 sentences)

Provide a score from 1-100.

Respond in JSON:
{
  "harmony": "...",
  "communication": "...",
  "emotional": "...",
  "chemistry": "...",
  "challenges": "...",
  "advice": "...",
  "score": 75
}`;
}
```

**Interpretation component** (`src/components/astro/AstroInterpretation.tsx`):

`"use client"` component. On mount, checks localStorage for cached interpretation (keyed by birth data hash). If not cached, fetches from `/api/astro/interpret`. Shows loading skeleton. Displays sections in styled cards. Caches result forever (one-time free reading).

Follow the same pattern as `SajuInterpretation.tsx`.

Commit: `feat(astro): add interpretation prompts and component`

### Task 2.8: Premium reading components

**Files:**
- Create: `src/components/astro/DailyTransit.tsx`
- Create: `src/components/astro/MonthlyForecast.tsx`
- Create: `src/components/astro/AstroCompatibility.tsx`

Follow the same patterns as the saju premium components (`DailyReading.tsx`, `MonthlyOutlook.tsx`, `CompatibilityCheck.tsx`). Each:
- Requires premium JWT token (via `usePremium` hook)
- Fetches from its API route with Authorization header
- Caches in localStorage with appropriate TTL
- Shows loading state and error handling

**DailyTransit.tsx:** Fetches from `POST /api/astro/daily`, caches 24h, displays energy/relationships/career/tip sections.

**MonthlyForecast.tsx:** Fetches from `POST /api/astro/monthly`, caches by `YYYY-MM`, displays theme/career/love/health/keyDates/advice.

**AstroCompatibility.tsx:** Mini birth data form for second person → `POST /api/astro/compatibility`, caches by birth data pair.

Commit: `feat(astro): add premium reading components`

---

## Phase 3: API Routes

### Task 3.1: Free interpretation API route

**Files:**
- Create: `src/app/api/astro/interpret/route.ts`

Follow the pattern from `src/app/api/saju/daily/route.ts`:
- `POST` endpoint
- Takes `{ chart: NatalChart }` body
- Rate limited: 5/hour per IP (in-memory)
- CSRF origin check
- Calls Claude API with `buildInterpretationPrompt(chart)`
- Returns parsed JSON response
- Uses `claude-sonnet-4-5-20250929` model

**No premium check** — this is the free one-time reading.

Commit: `feat(astro): add free interpretation API route`

### Task 3.2: Premium API routes

**Files:**
- Create: `src/app/api/astro/daily/route.ts`
- Create: `src/app/api/astro/monthly/route.ts`
- Create: `src/app/api/astro/compatibility/route.ts`

Follow the exact pattern from the saju premium routes (`src/app/api/saju/daily/route.ts`):
- `POST` endpoints
- Premium JWT verification via `verifyPremiumToken`
- CSRF origin check
- Claude API calls with astro prompts
- JSON parsing of response

**Daily route:**
- Takes `{ chart: NatalChart }`
- Gets current transit positions via `getCurrentPlanetPositions()` and `getTransitAspects()`
- Builds transit data string, passes to `buildDailyTransitPrompt()`

**Monthly route:**
- Takes `{ chart: NatalChart }`
- Gets current month's transit positions
- Passes to `buildMonthlyForecastPrompt()`

**Compatibility route:**
- Takes `{ chartA: NatalChart, chartB: NatalChart }`
- Passes to `buildCompatibilityPrompt()`

Commit: `feat(astro): add premium API routes (daily, monthly, compatibility)`

---

## Phase 4: Page & Navigation

### Task 4.1: Birth chart dashboard page

**Files:**
- Create: `src/app/horoscope/birth-chart/page.tsx`
- Create: `src/app/horoscope/birth-chart/AstroDashboard.tsx`
- Create: `src/app/horoscope/birth-chart/opengraph-image.tsx`

**`page.tsx`** — Server component shell. Follow the exact pattern from `src/app/saju/page.tsx`:
- Metadata with SEO keywords (natal chart, birth chart, astrology)
- BreadcrumbJsonLd, FAQPageJsonLd
- `revalidate = 43200`
- Suspense-wrapped `AstroDashboard` client component
- Educational content sections (what is a natal chart, what planets mean, etc.)

**`AstroDashboard.tsx`** — Client component. Follow `SajuDashboard.tsx` pattern:
- `useSyncExternalStore` for SSR-safe profile access
- If no profile → educational intro + `AstroOnboarding`
- If profile → `NatalChartWheel` + `PlanetTable` + `BalanceBar` + `AspectGrid` + `AstroInterpretation`
- Premium section: `PremiumGate` wrapping `DailyTransit` + `MonthlyForecast` + `AstroCompatibility`
- Uses existing `usePremium` hook and `PremiumGate` component (shared with saju)
- Stripe checkout redirect handling (same as saju)

**`opengraph-image.tsx`** — 1200x630 OG image with dark indigo gradient, zodiac wheel graphic, "Personalized Natal Chart" text. Follow pattern from `src/app/horoscope/opengraph-image.tsx`.

Commit: `feat(astro): add birth chart page with dashboard and OG image`

### Task 4.2: Navigation and sitemap updates

**Files:**
- Modify: `src/components/Header.tsx` — add "Birth Chart" link under horoscope section
- Modify: `src/components/Footer.tsx` — add "Birth Chart" to Explore section
- Modify: `src/app/sitemap.ts` — add `/horoscope/birth-chart` entry with priority 0.7

Commit: `feat(astro): add birth chart to navigation and sitemap`

---

## Verification

After all phases:

1. **Run tests:** `npm test` — all astro tests pass
2. **Build:** `npm run build` — no type errors, no build failures
3. **Manual test flow:**
   - Visit `/horoscope/birth-chart` — see educational intro + onboarding form
   - Enter birth data (e.g., 1990-08-15, 14:00, Seoul) — chart appears
   - Verify Sun is in Leo (~142° longitude)
   - Verify chart wheel displays correctly
   - Verify planet table shows all 11 planets
   - Verify element and modality balance bars sum correctly
   - Verify aspects list shows reasonable aspects
   - Check AI interpretation loads (requires ANTHROPIC_API_KEY in .env.local)
   - Refresh page — profile persists from localStorage
   - Check responsive layout on mobile
4. **Cross-reference:** Verify at least 2 charts against an established natal chart calculator (e.g., astro.com)
5. **Lint:** `npm run lint` — no new warnings
6. **OG Image:** Visit `/horoscope/birth-chart` and check meta tags

---

## Key Decisions

| Decision | Rationale |
|---|---|
| `astronomy-engine` for planet positions | Zero deps, TypeScript, actively maintained, proven accuracy |
| Porphyry-like house interpolation | True Placidus requires iterative trig — this approximation is close enough for v1 |
| Mean North Node (not true) | Simpler calculation, most astrology sites use mean node |
| Bundle city DB (not external API) | No network dependency, fast autocomplete, matches project pattern |
| Reuse existing JWT/Stripe infrastructure | Premium already works for saju — just add astro as another premium feature |
| Client-side chart calculation | Same pattern as saju, no server cost |
| Free one-time interpretation | Drives engagement and viral sharing |

## Existing Code to Reuse

| Pattern | Source File | Reuse For |
|---|---|---|
| SSR-safe localStorage | `src/lib/saju/profile.ts` | AstroProfile |
| Premium JWT auth | `src/lib/saju/premium.ts` | Astro premium routes |
| Premium hook | `src/lib/saju/use-premium.ts` | Astro premium components |
| PremiumGate component | `src/components/saju/PremiumGate.tsx` | Astro paywall |
| API route pattern | `src/app/api/saju/daily/route.ts` | Astro API routes |
| Dashboard pattern | `src/app/saju/SajuDashboard.tsx` | AstroDashboard |
| Page metadata | `src/app/saju/page.tsx` | Birth chart page SEO |
| OG image | `src/app/horoscope/opengraph-image.tsx` | Birth chart OG image |
