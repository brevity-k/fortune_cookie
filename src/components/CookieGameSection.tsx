"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import FortuneReveal from "@/components/FortuneReveal";
import FortuneCard from "@/components/FortuneCard";
import ShareButtons from "@/components/ShareButtons";
import {
  Fortune,
  getRandomFortune,
  getStreak,
  updateStreak,
  saveToJournal,
} from "@/lib/fortuneEngine";
import { trackCookieBreak, trackFortuneReveal, trackNewCookie } from "@/lib/analytics";

const noopSubscribe = () => () => {};
const getIsMobile = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
const getServerIsMobile = () => false;
const getClientStreak = () => getStreak();

let _initialFortune: Fortune | null = null;
const getInitialFortune = () => {
  if (!_initialFortune) _initialFortune = getRandomFortune(getStreak());
  return _initialFortune;
};

const CookieCanvas = dynamic(() => import("@/components/CookieCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[6/5] w-full max-w-[600px] mx-auto items-center justify-center rounded-2xl border border-border">
      <div className="text-center text-muted">
        <div className="mb-2 text-4xl">🥠</div>
        <p className="text-sm">Loading your fortune cookie...</p>
      </div>
    </div>
  ),
});

export default function CookieGameSection() {
  const isMobile = useSyncExternalStore(noopSubscribe, getIsMobile, getServerIsMobile);
  const initialFortune = useSyncExternalStore(noopSubscribe, getInitialFortune, () => null);

  const [fortuneOverride, setFortuneOverride] = useState<Fortune | null>(null);
  const fortune = fortuneOverride ?? initialFortune;
  const [showFortune, setShowFortune] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleBreak = useCallback(() => {
    trackCookieBreak("break");
    const newStreak = updateStreak();
    setFortuneOverride(getRandomFortune(newStreak));
    setShowFortune(false);
    setShowShare(false);

    try {
      const count = parseInt(localStorage.getItem("fortune_total") || "0", 10) + 1;
      localStorage.setItem("fortune_total", count.toString());
    } catch { /* empty */ }
  }, []);

  const handleFortuneReveal = useCallback(() => {
    setShowFortune(true);
    setShowShare(true);
    if (fortune) {
      trackFortuneReveal(fortune.category, fortune.rarity);
      saveToJournal(fortune);
    }
  }, [fortune]);

  const handleNewCookie = useCallback(() => {
    trackNewCookie();
    const streak = getStreak();
    setFortuneOverride(getRandomFortune(streak));
    setShowFortune(false);
    setShowShare(false);
  }, []);

  return (
    <section className="px-4 pb-8">
      <div className="text-center mb-4">
        <p className="text-sm text-muted">
          {isMobile
            ? "Tap, drag, shake your phone, or squeeze to crack"
            : "Click, drag, shake, double-tap, or squeeze to crack"}
        </p>
      </div>

      <CookieCanvas
        fortune={fortune?.text || "Good things are coming your way."}
        onBreak={handleBreak}
        onFortuneReveal={handleFortuneReveal}
        onNewCookie={handleNewCookie}
      />

      {/* Fortune reveal as text (for typewriter effect) */}
      <FortuneReveal fortune={fortune} visible={showFortune} />

      {/* Fortune card (beautiful, shareable) */}
      {showFortune && fortune && (
        <div className="mx-auto max-w-lg mt-6">
          <FortuneCard fortune={fortune} />
        </div>
      )}

      {/* Share buttons */}
      <ShareButtons fortune={fortune} visible={showShare} />

      {showShare && (
        <div className="text-center mt-4">
          <button
            onClick={handleNewCookie}
            className="text-sm text-muted underline underline-offset-4 hover:text-gold transition"
          >
            Break another cookie
          </button>
        </div>
      )}
    </section>
  );
}
