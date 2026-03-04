import { describe, it, expect } from 'vitest';
import {
  ZODIAC_SIGNS, ZODIAC_SYMBOLS, PLANET_SYMBOLS,
  SIGN_ELEMENTS, SIGN_MODALITIES, ASPECT_CONFIGS, PLANETS,
} from '../constants';

describe('astro constants', () => {
  it('ZODIAC_SIGNS has 12 entries', () => {
    expect(ZODIAC_SIGNS).toHaveLength(12);
  });

  it('SIGN_ELEMENTS has 12 entries and repeats fire/earth/air/water', () => {
    expect(SIGN_ELEMENTS).toHaveLength(12);
    for (let i = 0; i < 12; i += 4) {
      expect(SIGN_ELEMENTS[i]).toBe('fire');
      expect(SIGN_ELEMENTS[i + 1]).toBe('earth');
      expect(SIGN_ELEMENTS[i + 2]).toBe('air');
      expect(SIGN_ELEMENTS[i + 3]).toBe('water');
    }
  });

  it('SIGN_MODALITIES has 12 entries and repeats cardinal/fixed/mutable', () => {
    expect(SIGN_MODALITIES).toHaveLength(12);
    for (let i = 0; i < 12; i += 3) {
      expect(SIGN_MODALITIES[i]).toBe('cardinal');
      expect(SIGN_MODALITIES[i + 1]).toBe('fixed');
      expect(SIGN_MODALITIES[i + 2]).toBe('mutable');
    }
  });

  it('ASPECT_CONFIGS has 5 entries', () => {
    expect(ASPECT_CONFIGS).toHaveLength(5);
  });

  it('PLANETS has 11 entries', () => {
    expect(PLANETS).toHaveLength(11);
  });

  it('Aries (index 0) is fire + cardinal', () => {
    const idx = ZODIAC_SIGNS.indexOf('Aries');
    expect(idx).toBe(0);
    expect(SIGN_ELEMENTS[idx]).toBe('fire');
    expect(SIGN_MODALITIES[idx]).toBe('cardinal');
  });

  it('Taurus (index 1) is earth + fixed', () => {
    const idx = ZODIAC_SIGNS.indexOf('Taurus');
    expect(idx).toBe(1);
    expect(SIGN_ELEMENTS[idx]).toBe('earth');
    expect(SIGN_MODALITIES[idx]).toBe('fixed');
  });

  it('Gemini (index 2) is air + mutable', () => {
    const idx = ZODIAC_SIGNS.indexOf('Gemini');
    expect(idx).toBe(2);
    expect(SIGN_ELEMENTS[idx]).toBe('air');
    expect(SIGN_MODALITIES[idx]).toBe('mutable');
  });

  it('ZODIAC_SYMBOLS has an entry for every sign', () => {
    for (const sign of ZODIAC_SIGNS) {
      expect(ZODIAC_SYMBOLS[sign]).toBeDefined();
      expect(typeof ZODIAC_SYMBOLS[sign]).toBe('string');
    }
  });

  it('PLANET_SYMBOLS has an entry for every planet', () => {
    for (const planet of PLANETS) {
      expect(PLANET_SYMBOLS[planet]).toBeDefined();
      expect(typeof PLANET_SYMBOLS[planet]).toBe('string');
    }
  });
});
