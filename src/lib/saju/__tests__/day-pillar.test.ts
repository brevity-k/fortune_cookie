import { describe, it, expect } from 'vitest';
import { calculateDayPillar } from '../day-pillar';

describe('calculateDayPillar', () => {
  it('returns valid stem (0-9) and branch (0-11)', () => {
    const p = calculateDayPillar(2024, 1, 1);
    expect(p.stem).toBeGreaterThanOrEqual(0);
    expect(p.stem).toBeLessThan(10);
    expect(p.branch).toBeGreaterThanOrEqual(0);
    expect(p.branch).toBeLessThan(12);
  });

  it('consecutive days differ by exactly 1 in stem and branch', () => {
    const p1 = calculateDayPillar(2024, 1, 1);
    const p2 = calculateDayPillar(2024, 1, 2);
    expect((p2.stem - p1.stem + 10) % 10).toBe(1);
    expect((p2.branch - p1.branch + 12) % 12).toBe(1);
  });

  it('60 days apart returns same pillar (sexagenary cycle)', () => {
    const p1 = calculateDayPillar(2024, 1, 1);
    const p2 = calculateDayPillar(2024, 3, 1); // 60 days later
    expect(p1.stem).toBe(p2.stem);
    expect(p1.branch).toBe(p2.branch);
  });

  it('2024-01-01 → 甲子 (stem 0, branch 0)', () => {
    const p = calculateDayPillar(2024, 1, 1);
    expect(p.stem).toBe(0);
    expect(p.branch).toBe(0);
  });

  it('1990-08-15 → 壬子 (stem 8, branch 0)', () => {
    const p = calculateDayPillar(1990, 8, 15);
    expect(p.stem).toBe(8);
    expect(p.branch).toBe(0);
  });
});
