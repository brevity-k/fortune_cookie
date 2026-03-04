import type { PlanetPosition, Aspect, NatalChart } from './types';
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from './constants';

export interface FormattedPlanet {
  planet: string;
  symbol: string;
  sign: string;
  signSymbol: string;
  degree: string;
  house: number;
  retrograde: boolean;
}

export interface FormattedAspect {
  planet1: string;
  planet1Symbol: string;
  planet2: string;
  planet2Symbol: string;
  type: string;
  typeSymbol: string;
  orb: string;
}

const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: '\u260C',
  sextile: '\u26B9',
  square: '\u25A1',
  trine: '\u25B3',
  opposition: '\u260D',
};

export function formatDegree(degree: number): string {
  const deg = Math.floor(degree);
  const min = Math.round((degree - deg) * 60);
  return `${deg}\u00B0${min.toString().padStart(2, '0')}'`;
}

export function formatPlanet(pp: PlanetPosition): FormattedPlanet {
  return {
    planet: pp.planet,
    symbol: PLANET_SYMBOLS[pp.planet],
    sign: pp.sign,
    signSymbol: ZODIAC_SYMBOLS[pp.sign],
    degree: formatDegree(pp.degree),
    house: pp.house,
    retrograde: pp.retrograde,
  };
}

export function formatAspect(a: Aspect): FormattedAspect {
  return {
    planet1: a.planet1,
    planet1Symbol: PLANET_SYMBOLS[a.planet1],
    planet2: a.planet2,
    planet2Symbol: PLANET_SYMBOLS[a.planet2],
    type: a.type,
    typeSymbol: ASPECT_SYMBOLS[a.type] ?? '',
    orb: formatDegree(a.orb),
  };
}

export function formatChart(chart: NatalChart) {
  return {
    planets: chart.planets.map(formatPlanet),
    ascendant: {
      sign: chart.ascendant.sign,
      signSymbol: ZODIAC_SYMBOLS[chart.ascendant.sign],
      degree: formatDegree(chart.ascendant.degree),
    },
    midheaven: {
      sign: chart.midheaven.sign,
      signSymbol: ZODIAC_SYMBOLS[chart.midheaven.sign],
      degree: formatDegree(chart.midheaven.degree),
    },
    aspects: chart.aspects.map(formatAspect),
    elements: chart.elements,
    modalities: chart.modalities,
  };
}
