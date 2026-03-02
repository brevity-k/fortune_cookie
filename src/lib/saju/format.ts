import type { Pillar, FourPillars, Element, YinYang } from './types';
import { getStemElement, getStemYinYang, getStemHanja, getStemKorean } from './stems';
import { getBranchElement, getBranchHanja, getBranchKorean, getBranchAnimal } from './branches';

export interface FormattedPillar {
  stemHanja: string;
  stemKorean: string;
  branchHanja: string;
  branchKorean: string;
  branchAnimal: string;
  stemElement: Element;
  branchElement: Element;
  yinYang: YinYang;
  combined: string; // e.g. "甲子"
}

export function formatPillar(pillar: Pillar): FormattedPillar {
  return {
    stemHanja: getStemHanja(pillar.stem),
    stemKorean: getStemKorean(pillar.stem),
    branchHanja: getBranchHanja(pillar.branch),
    branchKorean: getBranchKorean(pillar.branch),
    branchAnimal: getBranchAnimal(pillar.branch),
    stemElement: getStemElement(pillar.stem),
    branchElement: getBranchElement(pillar.branch),
    yinYang: getStemYinYang(pillar.stem),
    combined: `${getStemHanja(pillar.stem)}${getBranchHanja(pillar.branch)}`,
  };
}

export interface FormattedFourPillars {
  year: FormattedPillar;
  month: FormattedPillar;
  day: FormattedPillar;
  hour: FormattedPillar | null;
}

export function formatFourPillars(pillars: FourPillars): FormattedFourPillars {
  return {
    year: formatPillar(pillars.year),
    month: formatPillar(pillars.month),
    day: formatPillar(pillars.day),
    hour: pillars.hour ? formatPillar(pillars.hour) : null,
  };
}
