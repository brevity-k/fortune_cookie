import { describe, it, expect } from 'vitest';
import {
  STEMS_HANJA, STEMS_KOREAN, BRANCHES_HANJA, BRANCHES_KOREAN, BRANCHES_ANIMAL,
  STEM_ELEMENTS, STEM_YINYANG, BRANCH_ELEMENTS,
  MONTH_STEM_START, HOUR_STEM_START, SOLAR_TERM_BOUNDARIES,
  GENERATING_CYCLE, OVERCOMING_CYCLE,
} from '../constants';

describe('constants', () => {
  it('has 10 stems', () => {
    expect(STEMS_HANJA).toHaveLength(10);
    expect(STEMS_KOREAN).toHaveLength(10);
    expect(STEM_ELEMENTS).toHaveLength(10);
    expect(STEM_YINYANG).toHaveLength(10);
  });

  it('has 12 branches', () => {
    expect(BRANCHES_HANJA).toHaveLength(12);
    expect(BRANCHES_KOREAN).toHaveLength(12);
    expect(BRANCHES_ANIMAL).toHaveLength(12);
    expect(BRANCH_ELEMENTS).toHaveLength(12);
  });

  it('has 12 solar term boundaries', () => {
    expect(SOLAR_TERM_BOUNDARIES).toHaveLength(12);
  });

  it('maps stem elements correctly', () => {
    expect(STEM_ELEMENTS[0]).toBe('wood');  // 甲
    expect(STEM_ELEMENTS[1]).toBe('wood');  // 乙
    expect(STEM_ELEMENTS[2]).toBe('fire');  // 丙
    expect(STEM_ELEMENTS[3]).toBe('fire');  // 丁
    expect(STEM_ELEMENTS[4]).toBe('earth'); // 戊
    expect(STEM_ELEMENTS[8]).toBe('water'); // 壬
  });

  it('maps stem yin/yang correctly', () => {
    expect(STEM_YINYANG[0]).toBe('yang'); // 甲
    expect(STEM_YINYANG[1]).toBe('yin');  // 乙
    expect(STEM_YINYANG[2]).toBe('yang'); // 丙
    expect(STEM_YINYANG[9]).toBe('yin');  // 癸
  });

  it('maps branch elements correctly', () => {
    expect(BRANCH_ELEMENTS[0]).toBe('water');  // 子
    expect(BRANCH_ELEMENTS[2]).toBe('wood');   // 寅
    expect(BRANCH_ELEMENTS[5]).toBe('fire');   // 巳
    expect(BRANCH_ELEMENTS[6]).toBe('fire');   // 午
    expect(BRANCH_ELEMENTS[8]).toBe('metal');  // 申
    expect(BRANCH_ELEMENTS[11]).toBe('water'); // 亥
  });

  it('has correct 오호둔 values', () => {
    // 甲(0)→丙(2), 己(5)→丙(2)
    expect(MONTH_STEM_START[0]).toBe(2);
    expect(MONTH_STEM_START[5]).toBe(2);
    // 乙(1)→戊(4), 庚(6)→戊(4)
    expect(MONTH_STEM_START[1]).toBe(4);
    expect(MONTH_STEM_START[6]).toBe(4);
    // 戊(4)→甲(0), 癸(9)→甲(0)
    expect(MONTH_STEM_START[4]).toBe(0);
    expect(MONTH_STEM_START[9]).toBe(0);
  });

  it('has correct 오자둔 values', () => {
    // 甲(0)→甲(0), 己(5)→甲(0)
    expect(HOUR_STEM_START[0]).toBe(0);
    expect(HOUR_STEM_START[5]).toBe(0);
    // 乙(1)→丙(2), 庚(6)→丙(2)
    expect(HOUR_STEM_START[1]).toBe(2);
    expect(HOUR_STEM_START[6]).toBe(2);
  });

  it('generating cycle is complete', () => {
    expect(GENERATING_CYCLE.wood).toBe('fire');
    expect(GENERATING_CYCLE.fire).toBe('earth');
    expect(GENERATING_CYCLE.earth).toBe('metal');
    expect(GENERATING_CYCLE.metal).toBe('water');
    expect(GENERATING_CYCLE.water).toBe('wood');
  });

  it('overcoming cycle is complete', () => {
    expect(OVERCOMING_CYCLE.wood).toBe('earth');
    expect(OVERCOMING_CYCLE.fire).toBe('metal');
    expect(OVERCOMING_CYCLE.water).toBe('fire');
  });
});
