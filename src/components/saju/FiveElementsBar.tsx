"use client";

import type { FiveElementAnalysis, Element } from "@/lib/saju/types";

const ELEMENT_CONFIG: { key: Element; label: string; hanja: string; color: string }[] = [
  { key: "wood", label: "Wood", hanja: "木", color: "#4ade80" },
  { key: "fire", label: "Fire", hanja: "火", color: "#f87171" },
  { key: "earth", label: "Earth", hanja: "土", color: "#fbbf24" },
  { key: "metal", label: "Metal", hanja: "金", color: "#e2e8f0" },
  { key: "water", label: "Water", hanja: "水", color: "#60a5fa" },
];

interface Props {
  analysis: FiveElementAnalysis;
}

export default function FiveElementsBar({ analysis }: Props) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gold">
        Five Elements Balance (오행)
      </h3>

      {/* Proportional bar */}
      <div className="flex h-8 overflow-hidden rounded-lg">
        {ELEMENT_CONFIG.map(({ key, color }) => {
          const count = analysis.counts[key];
          if (count === 0) return null;
          const pct = (count / analysis.total) * 100;
          return (
            <div
              key={key}
              style={{ width: `${pct}%`, backgroundColor: color }}
              className="flex items-center justify-center text-xs font-bold text-background transition-all"
            >
              {count}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="mt-3 grid grid-cols-5 gap-1 text-center">
        {ELEMENT_CONFIG.map(({ key, label, hanja, color }) => {
          const count = analysis.counts[key];
          const isFavorable = key === analysis.favorableElement;
          return (
            <div key={key} className="flex flex-col items-center gap-0.5">
              <span className="text-lg" style={{ color }}>{hanja}</span>
              <span className="text-xs text-foreground/50">{label}</span>
              <span className="text-xs font-semibold" style={{ color }}>
                {count}
              </span>
              {isFavorable && (
                <span className="text-xs text-gold">★ Favorable</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-sm text-foreground/40">
        Day Master: <span className="capitalize font-medium">{analysis.dayMaster}</span>
        {" "}&middot;{" "}
        {analysis.isStrong ? "Strong" : "Weak"}
        {" "}&middot;{" "}
        Favorable: <span className="capitalize">{analysis.favorableElement}</span>
      </p>
    </div>
  );
}
