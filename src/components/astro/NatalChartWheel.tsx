"use client";

import type { NatalChart, AspectType, Planet } from "@/lib/astro/types";
import { ZODIAC_SIGNS, ZODIAC_SYMBOLS, PLANET_SYMBOLS } from "@/lib/astro/constants";

const SIZE = 600;
const CENTER = SIZE / 2;
const OUTER_R = 270;
const MID_R = 220;
const INNER_R = 170;
const PLANET_R = 195;

const SIGN_COLORS: Record<string, string> = {
  fire: "#f87171",
  earth: "#fbbf24",
  air: "#60a5fa",
  water: "#4ade80",
};

const SIGN_ELEMENT_MAP: string[] = [
  "fire", "earth", "air", "water",
  "fire", "earth", "air", "water",
  "fire", "earth", "air", "water",
];

const ASPECT_COLORS: Record<AspectType, string> = {
  conjunction: "#fbbf24",
  sextile: "#60a5fa",
  square: "#f87171",
  trine: "#4ade80",
  opposition: "#fb923c",
};

function polarToXY(angleDeg: number, radius: number): [number, number] {
  const rad = ((180 - angleDeg) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER - radius * Math.sin(rad)];
}

function arcPath(startAngle: number, endAngle: number, outerR: number, innerR: number): string {
  const [ox1, oy1] = polarToXY(startAngle, outerR);
  const [ox2, oy2] = polarToXY(endAngle, outerR);
  const [ix2, iy2] = polarToXY(endAngle, innerR);
  const [ix1, iy1] = polarToXY(startAngle, innerR);

  // Determine sweep: we go from startAngle to endAngle counter-clockwise on ecliptic
  // In our coordinate system the arc sweeps in a specific direction
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  return [
    `M ${ox1} ${oy1}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2}`,
    `L ${ix2} ${iy2}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
    `Z`,
  ].join(" ");
}

interface Props {
  chart: NatalChart;
}

export default function NatalChartWheel({ chart }: Props) {
  const ascLon = chart.ascendant.longitude;
  const mcLon = chart.midheaven.longitude;

  // Convert ecliptic longitude to chart angle (ASC at 9 o'clock = 180 degrees)
  function toChartAngle(lon: number): number {
    return (lon - ascLon + 360) % 360;
  }

  // Resolve planet crowding by nudging overlapping glyphs
  function resolveCollisions(
    items: { planet: Planet; angle: number }[],
    minGap: number,
  ): { planet: Planet; angle: number; displayAngle: number }[] {
    const sorted = [...items].sort((a, b) => a.angle - b.angle);
    const result = sorted.map((it) => ({ ...it, displayAngle: it.angle }));

    // Simple iterative nudge pass
    for (let pass = 0; pass < 5; pass++) {
      for (let i = 1; i < result.length; i++) {
        const gap = result[i].displayAngle - result[i - 1].displayAngle;
        if (gap < minGap) {
          const nudge = (minGap - gap) / 2;
          result[i - 1].displayAngle -= nudge;
          result[i].displayAngle += nudge;
        }
      }
    }
    return result;
  }

  // Zodiac sign segments
  const signSegments = ZODIAC_SIGNS.map((sign, i) => {
    const signStartLon = i * 30;
    const signEndLon = (i + 1) * 30;
    const startAngle = toChartAngle(signStartLon);
    const endAngle = toChartAngle(signEndLon);
    const midAngle = toChartAngle(signStartLon + 15);
    const element = SIGN_ELEMENT_MAP[i];
    const color = SIGN_COLORS[element];
    const [sx, sy] = polarToXY(midAngle, (OUTER_R + MID_R) / 2);

    return { sign, startAngle, endAngle, midAngle, color, sx, sy };
  });

  // House cusps
  const houseLines = chart.houses.map((h) => {
    const angle = toChartAngle(h.longitude);
    const [x1, y1] = polarToXY(angle, MID_R);
    const [x2, y2] = polarToXY(angle, INNER_R);
    return { house: h.house, angle, x1, y1, x2, y2 };
  });

  // House number labels (midpoint between consecutive cusps)
  const houseLabels = chart.houses.map((h, i) => {
    const nextI = (i + 1) % 12;
    let a1 = toChartAngle(h.longitude);
    let a2 = toChartAngle(chart.houses[nextI].longitude);
    if (a2 < a1) a2 += 360;
    const midA = ((a1 + a2) / 2) % 360;
    const [lx, ly] = polarToXY(midA, (MID_R + INNER_R) / 2);
    return { house: h.house, lx, ly };
  });

  // Planets
  const planetItems = chart.planets.map((p) => ({
    planet: p.planet,
    angle: toChartAngle(p.longitude),
  }));
  const resolvedPlanets = resolveCollisions(planetItems, 12);

  // Aspect lines
  const aspectLines = chart.aspects.map((a, i) => {
    const p1 = chart.planets.find((p) => p.planet === a.planet1);
    const p2 = chart.planets.find((p) => p.planet === a.planet2);
    if (!p1 || !p2) return null;
    const [x1, y1] = polarToXY(toChartAngle(p1.longitude), INNER_R - 5);
    const [x2, y2] = polarToXY(toChartAngle(p2.longitude), INNER_R - 5);
    const color = ASPECT_COLORS[a.type] ?? "#666";
    return { key: `${a.planet1}-${a.planet2}-${i}`, x1, y1, x2, y2, color };
  }).filter(Boolean) as { key: string; x1: number; y1: number; x2: number; y2: number; color: string }[];

  // ASC / MC markers
  const ascAngle = toChartAngle(ascLon); // should be 0
  const mcAngle = toChartAngle(mcLon);
  const [ascX, ascY] = polarToXY(ascAngle, OUTER_R + 18);
  const [mcX, mcY] = polarToXY(mcAngle, OUTER_R + 18);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gold">Natal Chart Wheel</h3>
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[600px]"
          role="img"
          aria-label="Natal chart wheel showing zodiac signs, houses, and planet positions"
        >
          {/* Background */}
          <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
          <circle cx={CENTER} cy={CENTER} r={MID_R} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
          <circle cx={CENTER} cy={CENTER} r={INNER_R} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />

          {/* Zodiac sign segments */}
          {signSegments.map(({ sign, startAngle, endAngle, color, sx, sy }) => (
            <g key={sign}>
              <path
                d={arcPath(startAngle, endAngle, OUTER_R, MID_R)}
                fill={color}
                fillOpacity={0.08}
                stroke={color}
                strokeOpacity={0.25}
                strokeWidth={0.5}
              />
              <text
                x={sx}
                y={sy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontSize={14}
              >
                {ZODIAC_SYMBOLS[sign]}
              </text>
            </g>
          ))}

          {/* Zodiac sign boundary lines */}
          {signSegments.map(({ sign, startAngle }) => {
            const [lx1, ly1] = polarToXY(startAngle, OUTER_R);
            const [lx2, ly2] = polarToXY(startAngle, MID_R);
            return (
              <line
                key={`line-${sign}`}
                x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5}
              />
            );
          })}

          {/* House cusp lines */}
          {houseLines.map(({ house, x1, y1, x2, y2 }) => (
            <line
              key={`house-${house}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="currentColor"
              strokeOpacity={house === 1 || house === 4 || house === 7 || house === 10 ? 0.5 : 0.2}
              strokeWidth={house === 1 || house === 4 || house === 7 || house === 10 ? 1.5 : 0.5}
            />
          ))}

          {/* House number labels */}
          {houseLabels.map(({ house, lx, ly }) => (
            <text
              key={`hlabel-${house}`}
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fillOpacity={0.25}
              fontSize={10}
            >
              {house}
            </text>
          ))}

          {/* Aspect lines */}
          {aspectLines.map(({ key, x1, y1, x2, y2, color }) => (
            <line
              key={key}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeOpacity={0.25}
              strokeWidth={0.75}
            />
          ))}

          {/* Planet glyphs */}
          {resolvedPlanets.map(({ planet, displayAngle }) => {
            const [px, py] = polarToXY(displayAngle, PLANET_R);
            return (
              <text
                key={planet}
                x={px}
                y={py}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fbbf24"
                fontSize={13}
                fontWeight="bold"
              >
                {PLANET_SYMBOLS[planet]}
              </text>
            );
          })}

          {/* ASC marker */}
          <text
            x={ascX} y={ascY}
            textAnchor="middle" dominantBaseline="central"
            fill="#fbbf24" fontSize={11} fontWeight="bold"
          >
            ASC
          </text>

          {/* MC marker */}
          <text
            x={mcX} y={mcY}
            textAnchor="middle" dominantBaseline="central"
            fill="#fbbf24" fontSize={11} fontWeight="bold"
          >
            MC
          </text>
        </svg>
      </div>
    </div>
  );
}
