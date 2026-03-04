import { describe, it, expect } from 'vitest';
import { longitudeToZodiac, getSignIndex } from '../zodiac';

describe('longitudeToZodiac', () => {
  it('0° → Aries, 0°', () => {
    const pos = longitudeToZodiac(0);
    expect(pos.sign).toBe('Aries');
    expect(pos.degree).toBe(0);
    expect(pos.longitude).toBe(0);
  });

  it('15° → Aries, 15°', () => {
    const pos = longitudeToZodiac(15);
    expect(pos.sign).toBe('Aries');
    expect(pos.degree).toBe(15);
    expect(pos.longitude).toBe(15);
  });

  it('30° → Taurus, 0°', () => {
    const pos = longitudeToZodiac(30);
    expect(pos.sign).toBe('Taurus');
    expect(pos.degree).toBe(0);
    expect(pos.longitude).toBe(30);
  });

  it('90° → Cancer, 0°', () => {
    const pos = longitudeToZodiac(90);
    expect(pos.sign).toBe('Cancer');
    expect(pos.degree).toBe(0);
    expect(pos.longitude).toBe(90);
  });

  it('180° → Libra, 0°', () => {
    const pos = longitudeToZodiac(180);
    expect(pos.sign).toBe('Libra');
    expect(pos.degree).toBe(0);
    expect(pos.longitude).toBe(180);
  });

  it('270° → Capricorn, 0°', () => {
    const pos = longitudeToZodiac(270);
    expect(pos.sign).toBe('Capricorn');
    expect(pos.degree).toBe(0);
    expect(pos.longitude).toBe(270);
  });

  it('359.9° → Pisces, ~29.9°', () => {
    const pos = longitudeToZodiac(359.9);
    expect(pos.sign).toBe('Pisces');
    expect(pos.degree).toBeCloseTo(29.9, 1);
    expect(pos.longitude).toBeCloseTo(359.9, 1);
  });

  it('360° → Aries, 0° (wraps)', () => {
    const pos = longitudeToZodiac(360);
    expect(pos.sign).toBe('Aries');
    expect(pos.degree).toBe(0);
    expect(pos.longitude).toBe(0);
  });

  it('-30° → Pisces, 0° (negative wraps)', () => {
    const pos = longitudeToZodiac(-30);
    expect(pos.sign).toBe('Pisces');
    expect(pos.degree).toBe(0);
    expect(pos.longitude).toBe(330);
  });
});

describe('getSignIndex', () => {
  it('Aries → 0', () => {
    expect(getSignIndex('Aries')).toBe(0);
  });

  it('Pisces → 11', () => {
    expect(getSignIndex('Pisces')).toBe(11);
  });
});
