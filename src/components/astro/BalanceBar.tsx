"use client";

import type { ElementBalance, ModalityBalance, AstroElement, Modality } from "@/lib/astro/types";

const ELEMENT_CONFIG: { key: AstroElement; label: string; color: string }[] = [
  { key: "fire", label: "Fire", color: "#f87171" },
  { key: "earth", label: "Earth", color: "#fbbf24" },
  { key: "air", label: "Air", color: "#60a5fa" },
  { key: "water", label: "Water", color: "#4ade80" },
];

const MODALITY_CONFIG: { key: Modality; label: string; color: string }[] = [
  { key: "cardinal", label: "Cardinal", color: "#fb923c" },
  { key: "fixed", label: "Fixed", color: "#a78bfa" },
  { key: "mutable", label: "Mutable", color: "#22d3ee" },
];

interface Props {
  elements: ElementBalance;
  modalities: ModalityBalance;
}

export default function BalanceBar({ elements, modalities }: Props) {
  const elementTotal = ELEMENT_CONFIG.reduce((sum, { key }) => sum + elements[key], 0);
  const modalityTotal = MODALITY_CONFIG.reduce((sum, { key }) => sum + modalities[key], 0);

  return (
    <div className="space-y-6">
      {/* Element Balance */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gold">Element Balance</h3>
        <div className="flex h-8 overflow-hidden rounded-lg">
          {ELEMENT_CONFIG.map(({ key, color }) => {
            const count = elements[key];
            if (count === 0) return null;
            const pct = (count / elementTotal) * 100;
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
        <div className="mt-3 grid grid-cols-4 gap-1 text-center">
          {ELEMENT_CONFIG.map(({ key, label, color }) => (
            <div key={key} className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-foreground/50">{label}</span>
              <span className="text-sm font-semibold" style={{ color }}>
                {elements[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modality Balance */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gold">Modality Balance</h3>
        <div className="flex h-8 overflow-hidden rounded-lg">
          {MODALITY_CONFIG.map(({ key, color }) => {
            const count = modalities[key];
            if (count === 0) return null;
            const pct = (count / modalityTotal) * 100;
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
        <div className="mt-3 grid grid-cols-3 gap-1 text-center">
          {MODALITY_CONFIG.map(({ key, label, color }) => (
            <div key={key} className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-foreground/50">{label}</span>
              <span className="text-sm font-semibold" style={{ color }}>
                {modalities[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
