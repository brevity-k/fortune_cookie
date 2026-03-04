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
