import { describe, it, expect } from 'vitest';
import { getStemElement, getStemYinYang, getStemHanja, getStemKorean } from '../stems';

describe('stems', () => {
  it('returns correct elements', () => {
    expect(getStemElement(0)).toBe('wood');  // 甲
    expect(getStemElement(2)).toBe('fire');  // 丙
    expect(getStemElement(6)).toBe('metal'); // 庚
    expect(getStemElement(9)).toBe('water'); // 癸
  });

  it('returns correct yin/yang', () => {
    expect(getStemYinYang(0)).toBe('yang');
    expect(getStemYinYang(1)).toBe('yin');
  });

  it('returns correct hanja', () => {
    expect(getStemHanja(0)).toBe('甲');
    expect(getStemHanja(9)).toBe('癸');
  });

  it('returns correct korean', () => {
    expect(getStemKorean(0)).toBe('갑');
    expect(getStemKorean(9)).toBe('계');
  });

  it('wraps with modulo for out-of-range indices', () => {
    expect(getStemHanja(10)).toBe('甲');
    expect(getStemHanja(-1)).toBe('癸');
  });
});
