export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yang' | 'yin';
export type Gender = 'male' | 'female';

export interface Pillar {
  stem: number;   // 0-9 index into STEMS arrays
  branch: number; // 0-11 index into BRANCHES arrays
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null; // null if birth hour not provided
}

export interface BirthInfo {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
  hour: number | null; // 0-23, null if unknown
  gender: Gender;
}

export interface ElementCount {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface FiveElementAnalysis {
  counts: ElementCount;
  total: number;
  dayMaster: Element;
  dayMasterYinYang: YinYang;
  isStrong: boolean;
  favorableElement: Element;
  unfavorableElement: Element;
}

export interface MajorLuckCycle {
  startAge: number;
  stem: number;
  branch: number;
}

export interface SajuChart {
  birthInfo: BirthInfo;
  fourPillars: FourPillars;
  fiveElements: FiveElementAnalysis;
  majorLuckCycles: MajorLuckCycle[];
}
