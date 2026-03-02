"use client";

import type { MajorLuckCycle, BirthInfo } from "@/lib/saju/types";
import { formatPillar } from "@/lib/saju/format";
import type { Element } from "@/lib/saju/types";

const ELEMENT_COLORS: Record<Element, string> = {
  wood: "#4ade80",
  fire: "#f87171",
  earth: "#fbbf24",
  metal: "#e2e8f0",
  water: "#60a5fa",
};

interface Props {
  cycles: MajorLuckCycle[];
  birthInfo: BirthInfo;
}

export default function MajorLuckTimeline({ cycles, birthInfo }: Props) {
  const currentAge = new Date().getFullYear() - birthInfo.year;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gold">
        Life Fortune Cycles (대운)
      </h3>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {cycles.map((cycle, i) => {
            const formatted = formatPillar(cycle);
            const endAge = i < cycles.length - 1 ? cycles[i + 1].startAge - 1 : cycle.startAge + 9;
            const isCurrent = currentAge >= cycle.startAge && currentAge <= endAge;

            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 rounded-xl border p-3 min-w-[80px] ${
                  isCurrent ? "border-gold/50 bg-gold/5" : "border-border/30 bg-white/3"
                }`}
              >
                {isCurrent && (
                  <span className="text-xs font-semibold text-gold">Current</span>
                )}
                <div className="flex gap-1">
                  <span className="text-lg font-bold" style={{ color: ELEMENT_COLORS[formatted.stemElement] }}>
                    {formatted.stemHanja}
                  </span>
                  <span className="text-lg font-bold" style={{ color: ELEMENT_COLORS[formatted.branchElement] }}>
                    {formatted.branchHanja}
                  </span>
                </div>
                <div className="text-xs text-foreground/40">
                  {cycle.startAge}-{endAge}
                </div>
                <div className="text-xs text-foreground/30 capitalize">
                  {formatted.stemElement}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
