"use client";

import { useEffect, useState } from "react";
import { getDailyFortune, Fortune, getRarityColor } from "@/lib/fortuneEngine";

export default function FortuneOfTheDay() {
  const [fortune, setFortune] = useState<Fortune | null>(null);

  useEffect(() => {
    setFortune(getDailyFortune());
  }, []);

  if (!fortune) return null;

  const rarityColor = getRarityColor(fortune.rarity);

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <h2 className="text-golden-shimmer mb-2 text-2xl font-bold">Fortune of the Day</h2>
        <p className="mb-6 text-sm text-foreground/40">
          Everyone gets the same fortune today. Come back tomorrow for a new one!
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border p-8 text-center"
        style={{
          borderColor: rarityColor + "30",
          background: `radial-gradient(ellipse at center, ${rarityColor}08 0%, transparent 70%)`,
        }}
      >
        {/* Gold corner decorations */}
        <div className="absolute left-3 top-3 text-gold/30">✦</div>
        <div className="absolute right-3 top-3 text-gold/30">✦</div>
        <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
        <div className="absolute bottom-3 right-3 text-gold/30">✦</div>

        <p className="font-serif text-xl leading-relaxed text-cream">
          &ldquo;{fortune.text}&rdquo;
        </p>
        <p className="mt-4 text-xs capitalize text-foreground/30">
          {fortune.category} fortune
        </p>
      </div>
    </section>
  );
}
