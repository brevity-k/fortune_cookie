import type { AstroBirthInfo, NatalChart } from './types';
import { getAllPlanetLongitudes } from './planets';
import { longitudeToZodiac } from './zodiac';
import { calculateAscendant, calculateMidheaven } from './ascendant';
import { calculateHouseCusps, getHouseForLongitude } from './houses';
import { detectAspects } from './aspects';
import { countElements, countModalities } from './balance';

export function calculateNatalChart(birthInfo: AstroBirthInfo): NatalChart {
  const birthDate = new Date(
    Date.UTC(birthInfo.year, birthInfo.month - 1, birthInfo.day, birthInfo.hour, birthInfo.minute)
  );

  const rawPlanets = getAllPlanetLongitudes(birthDate);
  const ascendant = calculateAscendant(birthDate, birthInfo.latitude, birthInfo.longitude);
  const midheaven = calculateMidheaven(birthDate, birthInfo.longitude);
  const houses = calculateHouseCusps(birthDate, birthInfo.latitude, birthInfo.longitude);

  const planets = rawPlanets.map((rp) => {
    const zodiac = longitudeToZodiac(rp.longitude);
    return {
      planet: rp.planet,
      longitude: rp.longitude,
      sign: zodiac.sign,
      degree: zodiac.degree,
      house: getHouseForLongitude(rp.longitude, houses),
      retrograde: rp.retrograde,
    };
  });

  const aspects = detectAspects(planets);
  const elements = countElements(planets, ascendant, midheaven);
  const modalities = countModalities(planets, ascendant, midheaven);

  return { planets, ascendant, midheaven, houses, aspects, elements, modalities };
}
