import type { Element, YinYang } from './types';
import { STEMS_HANJA, STEMS_KOREAN, STEM_ELEMENTS, STEM_YINYANG } from './constants';

export function getStemElement(index: number): Element {
  return STEM_ELEMENTS[((index % 10) + 10) % 10];
}

export function getStemYinYang(index: number): YinYang {
  return STEM_YINYANG[((index % 10) + 10) % 10];
}

export function getStemHanja(index: number): string {
  return STEMS_HANJA[((index % 10) + 10) % 10];
}

export function getStemKorean(index: number): string {
  return STEMS_KOREAN[((index % 10) + 10) % 10];
}
