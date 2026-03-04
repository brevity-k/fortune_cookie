import type { ZodiacSign, ZodiacPosition } from './types';
import { ZODIAC_SIGNS } from './constants';

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

export function getSignIndex(sign: ZodiacSign): number {
  return ZODIAC_SIGNS.indexOf(sign);
}
