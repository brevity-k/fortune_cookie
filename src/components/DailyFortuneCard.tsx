"use client";

import { useSyncExternalStore } from "react";
import {
  getDailyFortune,
  getDailyFortuneNumber,
  getRarityColor,
  getRarityLabel,
  type Fortune,
} from "@/lib/fortuneEngine";

/**
 * Client-side daily fortune card that uses the user's local timezone.
 *
 * Because getDailyFortune() calls dateSeed() which uses `new Date()`,
 * running on the client means the fortune is seeded from the user's local
 * date — not UTC. A user in Tokyo sees tomorrow's fortune before New York.
 */

const noop = () => () => {};

interface DailyFortuneData {
  fortune: Fortune;
  number: number;
}

let _cached: DailyFortuneData | null = null;
function getCached(): DailyFortuneData {
  if (!_cached) {
    const fortune = getDailyFortune();
    _cached = { fortune, number: getDailyFortuneNumber() };
  }
  return _cached;
}

interface Props {
  /** Server-rendered fallback shown during SSR/hydration */
  fallback: {
    text: string;
    category: string;
    rarity: string;
    number: number;
  };
}

export default function DailyFortuneCard({ fallback }: Props) {
  const data = useSyncExternalStore(
    noop,
    getCached,
    // Server snapshot: return null to use fallback during SSR
    () => null,
  );

  const text = data?.fortune.text ?? fallback.text;
  const category = data?.fortune.category ?? fallback.category;
  const rarity = (data?.fortune.rarity ?? fallback.rarity) as Fortune["rarity"];
  const number = data?.number ?? fallback.number;

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">&#x1F960;</span>
        <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
          Daily Fortune #{number.toLocaleString()}
        </span>
      </div>
      <p
        className="text-sm text-foreground/80 line-clamp-2 mb-2"
        style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
      >
        &ldquo;{text}&rdquo;
      </p>
      <span
        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
        style={{ backgroundColor: getRarityColor(rarity) }}
      >
        {getRarityLabel(rarity)} &middot; {category}
      </span>
    </div>
  );
}
