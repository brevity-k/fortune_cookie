import type { PlanetPosition, ZodiacPosition, ElementBalance, ModalityBalance } from './types';
import { SIGN_ELEMENTS, SIGN_MODALITIES, ZODIAC_SIGNS } from './constants';
import type { ZodiacSign } from './types';

function getSignIndex(sign: ZodiacSign): number {
  return ZODIAC_SIGNS.indexOf(sign);
}

export function countElements(planets: PlanetPosition[], ascendant: ZodiacPosition, midheaven: ZodiacPosition): ElementBalance {
  const counts: ElementBalance = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const p of planets) {
    counts[SIGN_ELEMENTS[getSignIndex(p.sign)]]++;
  }
  counts[SIGN_ELEMENTS[getSignIndex(ascendant.sign)]]++;
  counts[SIGN_ELEMENTS[getSignIndex(midheaven.sign)]]++;
  return counts;
}

export function countModalities(planets: PlanetPosition[], ascendant: ZodiacPosition, midheaven: ZodiacPosition): ModalityBalance {
  const counts: ModalityBalance = { cardinal: 0, fixed: 0, mutable: 0 };
  for (const p of planets) {
    counts[SIGN_MODALITIES[getSignIndex(p.sign)]]++;
  }
  counts[SIGN_MODALITIES[getSignIndex(ascendant.sign)]]++;
  counts[SIGN_MODALITIES[getSignIndex(midheaven.sign)]]++;
  return counts;
}
