"use client";

import type { NatalChart, AspectType } from "@/lib/astro/types";
import { formatAspect } from "@/lib/astro/format";

const ASPECT_COLORS: Record<AspectType, string> = {
  conjunction: "#fbbf24", // yellow
  sextile: "#60a5fa",    // blue
  square: "#f87171",     // red
  trine: "#4ade80",      // green
  opposition: "#fb923c", // orange
};

interface Props {
  chart: NatalChart;
}

export default function AspectGrid({ chart }: Props) {
  const aspects = chart.aspects.map(formatAspect);

  if (aspects.length === 0) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gold">Aspects</h3>
        <p className="text-sm text-foreground/40">No major aspects detected.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gold">Aspects</h3>
      <div className="space-y-1.5">
        {aspects.map((a, i) => {
          const color = ASPECT_COLORS[a.type as AspectType] ?? "#888";
          return (
            <div
              key={`${a.planet1}-${a.type}-${a.planet2}-${i}`}
              className="flex items-center gap-2 rounded-lg border border-border/30 bg-white/3 px-3 py-2 text-sm"
            >
              {/* Planet 1 */}
              <span className="text-gold">{a.planet1Symbol}</span>
              <span className="text-foreground/70 min-w-[72px]">
                {a.planet1 === "NorthNode" ? "N.Node" : a.planet1}
              </span>

              {/* Aspect type */}
              <span className="text-lg" style={{ color }}>
                {a.typeSymbol}
              </span>
              <span className="text-xs capitalize min-w-[72px]" style={{ color }}>
                {a.type}
              </span>

              {/* Planet 2 */}
              <span className="text-gold">{a.planet2Symbol}</span>
              <span className="text-foreground/70 min-w-[72px]">
                {a.planet2 === "NorthNode" ? "N.Node" : a.planet2}
              </span>

              {/* Orb */}
              <span className="ml-auto font-mono text-xs text-foreground/40">
                {a.orb}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-foreground/40">
        {(Object.keys(ASPECT_COLORS) as AspectType[]).map((type) => (
          <span key={type} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: ASPECT_COLORS[type] }} />
            <span className="capitalize">{type}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
