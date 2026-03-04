import type { ZodiacSign, Planet, AspectType, AstroElement, Modality } from './types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '\u2648', Taurus: '\u2649', Gemini: '\u264A', Cancer: '\u264B',
  Leo: '\u264C', Virgo: '\u264D', Libra: '\u264E', Scorpio: '\u264F',
  Sagittarius: '\u2650', Capricorn: '\u2651', Aquarius: '\u2652', Pisces: '\u2653',
};

export const PLANET_SYMBOLS: Record<Planet, string> = {
  Sun: '\u2609', Moon: '\u263D', Mercury: '\u263F', Venus: '\u2640', Mars: '\u2642',
  Jupiter: '\u2643', Saturn: '\u2644', Uranus: '\u2645', Neptune: '\u2646', Pluto: '\u2647',
  NorthNode: '\u260A',
};

export const SIGN_ELEMENTS: AstroElement[] = [
  'fire', 'earth', 'air', 'water',
  'fire', 'earth', 'air', 'water',
  'fire', 'earth', 'air', 'water',
];

export const SIGN_MODALITIES: Modality[] = [
  'cardinal', 'fixed', 'mutable',
  'cardinal', 'fixed', 'mutable',
  'cardinal', 'fixed', 'mutable',
  'cardinal', 'fixed', 'mutable',
];

export const ASPECT_CONFIGS: { type: AspectType; angle: number; orb: number }[] = [
  { type: 'conjunction', angle: 0, orb: 8 },
  { type: 'sextile', angle: 60, orb: 6 },
  { type: 'square', angle: 90, orb: 8 },
  { type: 'trine', angle: 120, orb: 8 },
  { type: 'opposition', angle: 180, orb: 8 },
];

export const PLANETS: Planet[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'NorthNode',
];
