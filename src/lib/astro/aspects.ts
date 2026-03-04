import type { Aspect, PlanetPosition } from './types';
import { ASPECT_CONFIGS } from './constants';

export function angularDistance(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

export function detectAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const distance = angularDistance(planets[i].longitude, planets[j].longitude);
      for (const config of ASPECT_CONFIGS) {
        const orb = Math.abs(distance - config.angle);
        if (orb <= config.orb) {
          aspects.push({
            planet1: planets[i].planet,
            planet2: planets[j].planet,
            type: config.type,
            orb: Math.round(orb * 100) / 100,
            applying: false,
          });
          break;
        }
      }
    }
  }
  return aspects;
}
