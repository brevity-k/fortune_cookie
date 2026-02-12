"use client";

import { useEffect, useState, useRef } from "react";
import { Fortune, getRarityColor, getRarityLabel } from "@/lib/fortuneEngine";

interface FortuneRevealProps {
  fortune: Fortune | null;
  visible: boolean;
}

export default function FortuneReveal({ fortune, visible }: FortuneRevealProps) {
  const [displayText, setDisplayText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const rafRef = useRef<number>(undefined);

  useEffect(() => {
    if (!fortune || !visible) {
      setDisplayText("");
      setTypingDone(false);
      return;
    }

    // Typewriter effect using requestAnimationFrame
    let index = 0;
    let lastTime = 0;
    setDisplayText("");
    setTypingDone(false);

    const step = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed >= 35) {
        lastTime = timestamp;
        index++;
        if (index <= fortune.text.length) {
          setDisplayText(fortune.text.slice(0, index));
        }
        if (index >= fortune.text.length) {
          setTypingDone(true);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fortune, visible]);

  if (!fortune || !visible) return null;

  const rarityColor = getRarityColor(fortune.rarity);
  const rarityLabel = getRarityLabel(fortune.rarity);

  return (
    <div className="mx-auto mt-8 w-full max-w-lg animate-float">
      <div className="paper-texture relative overflow-hidden rounded-xl px-8 py-6">
        {/* Rarity badge */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: rarityColor + "20",
              color: rarityColor,
              border: `1px solid ${rarityColor}40`,
            }}
          >
            {rarityLabel}
          </span>
          <span className="text-xs capitalize text-amber/60">{fortune.category}</span>
        </div>

        {/* Fortune text */}
        <p className="min-h-[2.5rem] font-serif text-xl leading-relaxed text-amber-900">
          {displayText}
          {!typingDone && <span className="typewriter-cursor">&nbsp;</span>}
        </p>

        {/* Decorative elements */}
        <div className="mt-4 flex items-center gap-2 opacity-30">
          <div className="h-px flex-1 bg-amber-800" />
          <span className="text-xs text-amber-800">🥠</span>
          <div className="h-px flex-1 bg-amber-800" />
        </div>
      </div>
    </div>
  );
}
