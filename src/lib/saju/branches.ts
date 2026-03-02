import type { Element } from './types';
import { BRANCHES_HANJA, BRANCHES_KOREAN, BRANCHES_ANIMAL, BRANCH_ELEMENTS } from './constants';

export function getBranchElement(index: number): Element {
  return BRANCH_ELEMENTS[((index % 12) + 12) % 12];
}

export function getBranchHanja(index: number): string {
  return BRANCHES_HANJA[((index % 12) + 12) % 12];
}

export function getBranchKorean(index: number): string {
  return BRANCHES_KOREAN[((index % 12) + 12) % 12];
}

export function getBranchAnimal(index: number): string {
  return BRANCHES_ANIMAL[((index % 12) + 12) % 12];
}
