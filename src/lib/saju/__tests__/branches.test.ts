import { describe, it, expect } from 'vitest';
import { getBranchElement, getBranchHanja, getBranchKorean, getBranchAnimal } from '../branches';

describe('branches', () => {
  it('returns correct elements', () => {
    expect(getBranchElement(0)).toBe('water');  // 子
    expect(getBranchElement(2)).toBe('wood');   // 寅
    expect(getBranchElement(6)).toBe('fire');   // 午
    expect(getBranchElement(8)).toBe('metal');  // 申
  });

  it('returns correct hanja', () => {
    expect(getBranchHanja(0)).toBe('子');
    expect(getBranchHanja(11)).toBe('亥');
  });

  it('returns correct korean', () => {
    expect(getBranchKorean(0)).toBe('자');
    expect(getBranchKorean(11)).toBe('해');
  });

  it('returns correct animal', () => {
    expect(getBranchAnimal(0)).toBe('Rat');
    expect(getBranchAnimal(4)).toBe('Dragon');
    expect(getBranchAnimal(11)).toBe('Pig');
  });

  it('wraps with modulo for out-of-range indices', () => {
    expect(getBranchHanja(12)).toBe('子');
    expect(getBranchHanja(-1)).toBe('亥');
  });
});
