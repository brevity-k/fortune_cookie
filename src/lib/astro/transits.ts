import type { Planet, PlanetPosition, Aspect } from './types';
import { getPlanetLongitude, isRetrograde } from './planets';
import { longitudeToZodiac } from './zodiac';
import { angularDistance } from './aspects';
import { PLANETS, ASPECT_CONFIGS } from './constants';

export interface TransitAspect {
  transitPlanet: Planet;
  natalPlanet: Planet;
  type: Aspect['type'];
  orb: number;
}

export function getCurrentPlanetPositions(date?: Date): PlanetPosition[] {
  const d = date ?? new Date();
  return PLANETS.map((planet) => {
    const longitude = getPlanetLongitude(planet, d);
    const zodiac = longitudeToZodiac(longitude);
    return {
      planet,
      longitude,
      sign: zodiac.sign,
      degree: zodiac.degree,
      house: 0,
      retrograde: isRetrograde(planet, d),
    };
  });
}

export function getTransitAspects(natalPlanets: PlanetPosition[], date?: Date): TransitAspect[] {
  const currentPositions = getCurrentPlanetPositions(date);
  const transitAspects: TransitAspect[] = [];

  for (const transit of currentPositions) {
    for (const natal of natalPlanets) {
      const distance = angularDistance(transit.longitude, natal.longitude);
      for (const config of ASPECT_CONFIGS) {
        const orb = Math.abs(distance - config.angle);
        if (orb <= config.orb) {
          transitAspects.push({
            transitPlanet: transit.planet,
            natalPlanet: natal.planet,
            type: config.type,
            orb: Math.round(orb * 100) / 100,
          });
          break;
        }
      }
    }
  }

  return transitAspects;
}
