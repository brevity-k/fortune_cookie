import { describe, it, expect } from 'vitest';
import { countElements, analyzeFiveElements } from '../five-elements';
import { calculateFourPillars } from '../four-pillars';
import type { FourPillars } from '../types';

describe('countElements', () => {
  it('counts sum to 8 when hour pillar present', () => {
    const pillars = calculateFourPillars({ year: 1990, month: 8, day: 15, hour: 14, gender: 'male' });
    const counts = countElements(pillars);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(8);
  });

  it('counts sum to 6 when hour pillar absent', () => {
    const pillars = calculateFourPillars({ year: 1990, month: 8, day: 15, hour: null, gender: 'male' });
    const counts = countElements(pillars);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(6);
  });

  it('all counts are non-negative', () => {
    const pillars = calculateFourPillars({ year: 2000, month: 6, day: 15, hour: 10, gender: 'female' });
    const counts = countElements(pillars);
    for (const v of Object.values(counts)) {
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('analyzeFiveElements', () => {
  it('returns valid day master element', () => {
    const pillars = calculateFourPillars({ year: 1990, month: 8, day: 15, hour: 14, gender: 'male' });
    const analysis = analyzeFiveElements(pillars);
    expect(['wood', 'fire', 'earth', 'metal', 'water']).toContain(analysis.dayMaster);
  });

  it('favorable and unfavorable elements are different', () => {
    const pillars = calculateFourPillars({ year: 1990, month: 8, day: 15, hour: 14, gender: 'male' });
    const analysis = analyzeFiveElements(pillars);
    expect(analysis.favorableElement).not.toBe(analysis.unfavorableElement);
  });

  it('total matches element count sum', () => {
    const pillars = calculateFourPillars({ year: 1985, month: 3, day: 20, hour: 8, gender: 'female' });
    const analysis = analyzeFiveElements(pillars);
    const sum = Object.values(analysis.counts).reduce((a, b) => a + b, 0);
    expect(analysis.total).toBe(sum);
  });

  it('dayMasterYinYang is yang or yin', () => {
    const pillars = calculateFourPillars({ year: 1990, month: 8, day: 15, hour: 14, gender: 'male' });
    const analysis = analyzeFiveElements(pillars);
    expect(['yang', 'yin']).toContain(analysis.dayMasterYinYang);
  });

  it('strong day master gets draining favorable element', () => {
    // Create a synthetic pillar set that's clearly strong in one element
    const strongPillars: FourPillars = {
      year: { stem: 0, branch: 2 },   // 甲(wood) + 寅(wood)
      month: { stem: 1, branch: 3 },  // 乙(wood) + 卯(wood)
      day: { stem: 0, branch: 2 },    // 甲(wood) + 寅(wood) — day master = wood
      hour: { stem: 8, branch: 0 },   // 壬(water) + 子(water) — water generates wood
    };
    const analysis = analyzeFiveElements(strongPillars);
    expect(analysis.dayMaster).toBe('wood');
    expect(analysis.isStrong).toBe(true);
    expect(analysis.favorableElement).toBe('fire'); // wood generates fire (draining)
  });
});
