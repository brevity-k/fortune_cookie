import { describe, it, expect } from 'vitest';
import { getHourBranch, calculateHourPillar } from '../hour-pillar';

describe('getHourBranch', () => {
  it('hour 23 → 子(0)', () => expect(getHourBranch(23)).toBe(0));
  it('hour 0 → 子(0)', () => expect(getHourBranch(0)).toBe(0));
  it('hour 1 → 丑(1)', () => expect(getHourBranch(1)).toBe(1));
  it('hour 2 → 丑(1)', () => expect(getHourBranch(2)).toBe(1));
  it('hour 3 → 寅(2)', () => expect(getHourBranch(3)).toBe(2));
  it('hour 4 → 寅(2)', () => expect(getHourBranch(4)).toBe(2));
  it('hour 11 → 午(6)', () => expect(getHourBranch(11)).toBe(6));
  it('hour 12 → 午(6)', () => expect(getHourBranch(12)).toBe(6));
  it('hour 21 → 亥(11)', () => expect(getHourBranch(21)).toBe(11));
  it('hour 22 → 亥(11)', () => expect(getHourBranch(22)).toBe(11));
});

describe('calculateHourPillar', () => {
  it('甲 day + 子시 → 甲子 (stem 0, branch 0)', () => {
    const p = calculateHourPillar(0, 0);
    expect(p.stem).toBe(0);
    expect(p.branch).toBe(0);
  });

  it('甲 day + 寅시(hour 3) → 丙寅 (stem 2, branch 2)', () => {
    const p = calculateHourPillar(3, 0);
    expect(p.stem).toBe(2);
    expect(p.branch).toBe(2);
  });

  it('乙 day + 子시 → 丙子 (stem 2, branch 0)', () => {
    // Day stem 乙(1), 오자둔→丙(2), branch 0 → stem = (2+0)%10 = 2
    const p = calculateHourPillar(0, 1);
    expect(p.stem).toBe(2);
    expect(p.branch).toBe(0);
  });

  it('hour 23 uses 야자시 (same day, branch 0)', () => {
    const p = calculateHourPillar(23, 0);
    expect(p.branch).toBe(0);
    expect(p.stem).toBe(0); // 甲 day → 甲子
  });

  it('all results have valid stem and branch ranges', () => {
    for (let dayStem = 0; dayStem < 10; dayStem++) {
      for (let hour = 0; hour < 24; hour++) {
        const p = calculateHourPillar(hour, dayStem);
        expect(p.stem).toBeGreaterThanOrEqual(0);
        expect(p.stem).toBeLessThan(10);
        expect(p.branch).toBeGreaterThanOrEqual(0);
        expect(p.branch).toBeLessThan(12);
      }
    }
  });
});
