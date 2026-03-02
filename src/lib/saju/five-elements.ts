import type { FourPillars, ElementCount, FiveElementAnalysis, Element } from './types';
import { STEM_ELEMENTS, BRANCH_ELEMENTS, STEM_YINYANG, GENERATING_CYCLE, GENERATED_BY } from './constants';

/**
 * Count element occurrences across all pillars (stems + branches).
 * With hour pillar: 8 chars total. Without: 6 chars total.
 */
export function countElements(pillars: FourPillars): ElementCount {
  const counts: ElementCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const pillarList = [pillars.year, pillars.month, pillars.day];
  if (pillars.hour) pillarList.push(pillars.hour);

  for (const pillar of pillarList) {
    counts[STEM_ELEMENTS[pillar.stem]]++;
    counts[BRANCH_ELEMENTS[pillar.branch]]++;
  }

  return counts;
}

/**
 * Analyze five elements balance and determine favorable/unfavorable elements.
 * The day master (일간) is the day pillar's stem element.
 * Strong day master (own + generating element >= half of total): favorable = draining element.
 * Weak day master: favorable = generating element.
 */
export function analyzeFiveElements(pillars: FourPillars): FiveElementAnalysis {
  const counts = countElements(pillars);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const dayMaster = STEM_ELEMENTS[pillars.day.stem];
  const dayMasterYinYang = STEM_YINYANG[pillars.day.stem];

  // Element that generates the day master
  const generatingElement = GENERATED_BY[dayMaster];

  // Count support: own element + element that generates it
  const supportScore = counts[dayMaster] + counts[generatingElement];
  const isStrong = supportScore >= total / 2;

  // Favorable element (용신):
  // Strong → needs draining (the element the day master generates)
  // Weak → needs support (the element that generates the day master)
  const favorableElement: Element = isStrong
    ? GENERATING_CYCLE[dayMaster]  // drain: what day master produces
    : generatingElement;            // support: what produces day master

  // Unfavorable element (기신): opposite logic
  const unfavorableElement: Element = isStrong
    ? generatingElement             // too much support
    : GENERATING_CYCLE[dayMaster];  // too much draining

  return {
    counts,
    total,
    dayMaster,
    dayMasterYinYang,
    isStrong,
    favorableElement,
    unfavorableElement,
  };
}
