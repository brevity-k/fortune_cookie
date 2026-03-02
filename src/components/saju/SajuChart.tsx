"use client";

import type { FourPillars } from "@/lib/saju/types";
import { formatPillar, type FormattedPillar } from "@/lib/saju/format";
import type { Element } from "@/lib/saju/types";

const ELEMENT_COLORS: Record<Element, string> = {
  wood: "#4ade80",
  fire: "#f87171",
  earth: "#fbbf24",
  metal: "#e2e8f0",
  water: "#60a5fa",
};

const PILLAR_LABELS = [
  { ko: "시주(時)", en: "Hour", desc: "Future" },
  { ko: "일주(日)", en: "Day", desc: "Self" },
  { ko: "월주(月)", en: "Month", desc: "Career" },
  { ko: "년주(年)", en: "Year", desc: "Social" },
];

function PillarCell({ formatted, label, isDayMaster }: {
  formatted: FormattedPillar | null;
  label: typeof PILLAR_LABELS[number];
  isDayMaster: boolean;
}) {
  if (!formatted) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs text-foreground/40">{label.ko}</div>
        <div className="flex flex-col gap-1 rounded-xl border border-border/30 bg-white/3 p-3 sm:p-4 w-full min-w-[70px]">
          <div className="text-center text-foreground/20 text-lg">?</div>
          <div className="border-t border-border/20 my-1" />
          <div className="text-center text-foreground/20 text-lg">?</div>
        </div>
        <div className="text-xs text-foreground/30">{label.en}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-foreground/40">{label.ko}</div>
      <div
        className={`flex flex-col gap-1 rounded-xl border p-3 sm:p-4 w-full min-w-[70px] ${
          isDayMaster ? "border-gold/50 bg-gold/5" : "border-border/30 bg-white/3"
        }`}
      >
        {/* Stem */}
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold" style={{ color: ELEMENT_COLORS[formatted.stemElement] }}>
            {formatted.stemHanja}
          </div>
          <div className="text-xs text-foreground/40 capitalize">{formatted.stemElement}</div>
        </div>
        <div className="border-t border-border/20 my-1" />
        {/* Branch */}
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold" style={{ color: ELEMENT_COLORS[formatted.branchElement] }}>
            {formatted.branchHanja}
          </div>
          <div className="text-xs text-foreground/40">{formatted.branchAnimal}</div>
        </div>
      </div>
      <div className="text-xs text-foreground/30">{label.en}</div>
      <div className="text-xs text-foreground/20">({label.desc})</div>
    </div>
  );
}

interface Props {
  fourPillars: FourPillars;
}

export default function SajuChart({ fourPillars }: Props) {
  const formatted = {
    hour: fourPillars.hour ? formatPillar(fourPillars.hour) : null,
    day: formatPillar(fourPillars.day),
    month: formatPillar(fourPillars.month),
    year: formatPillar(fourPillars.year),
  };

  const pillars: [FormattedPillar | null, typeof PILLAR_LABELS[number], boolean][] = [
    [formatted.hour, PILLAR_LABELS[0], false],
    [formatted.day, PILLAR_LABELS[1], true],
    [formatted.month, PILLAR_LABELS[2], false],
    [formatted.year, PILLAR_LABELS[3], false],
  ];

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gold">
        Your Four Pillars (사주 四柱)
      </h3>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {pillars.map(([fp, label, isDayMaster]) => (
          <PillarCell key={label.en} formatted={fp} label={label} isDayMaster={isDayMaster} />
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-foreground/40">
        Day Master: <span className="font-semibold" style={{ color: ELEMENT_COLORS[formatted.day.stemElement] }}>
          {formatted.day.stemHanja} ({formatted.day.stemElement}, {formatted.day.yinYang})
        </span>
      </p>
    </div>
  );
}
