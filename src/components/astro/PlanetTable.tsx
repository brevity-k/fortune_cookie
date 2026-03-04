"use client";

import type { NatalChart } from "@/lib/astro/types";
import { formatPlanet } from "@/lib/astro/format";

interface Props {
  chart: NatalChart;
}

export default function PlanetTable({ chart }: Props) {
  const planets = chart.planets.map(formatPlanet);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gold">
        Planetary Positions
      </h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-white/3">
              <th className="px-3 py-2.5 text-left font-medium text-foreground/50">Planet</th>
              <th className="px-3 py-2.5 text-left font-medium text-foreground/50">Sign</th>
              <th className="px-3 py-2.5 text-right font-medium text-foreground/50">Degree</th>
              <th className="px-3 py-2.5 text-center font-medium text-foreground/50">House</th>
              <th className="px-3 py-2.5 text-center font-medium text-foreground/50">Rx</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => (
              <tr key={p.planet} className="border-b border-border/30 transition hover:bg-white/3">
                <td className="px-3 py-2.5 text-foreground">
                  <span className="mr-1.5 text-gold">{p.symbol}</span>
                  {p.planet === "NorthNode" ? "North Node" : p.planet}
                </td>
                <td className="px-3 py-2.5 text-foreground/70">
                  <span className="mr-1.5">{p.signSymbol}</span>
                  {p.sign}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-foreground/70">
                  {p.degree}
                </td>
                <td className="px-3 py-2.5 text-center text-foreground/70">
                  {p.house}
                </td>
                <td className="px-3 py-2.5 text-center text-red-400">
                  {p.retrograde ? "\u212E" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
