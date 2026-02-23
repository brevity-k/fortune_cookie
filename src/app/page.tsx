"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import FortuneReveal from "@/components/FortuneReveal";
import FortuneOfTheDay from "@/components/FortuneOfTheDay";
import ShareButtons from "@/components/ShareButtons";
import AdUnit from "@/components/AdUnit";
import {
  Fortune,
  getRandomFortune,
  getStreak,
  updateStreak,
  saveToJournal,
} from "@/lib/fortuneEngine";

const noopSubscribe = () => () => {};
const getIsMobile = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
const getServerIsMobile = () => false;
const getClientStreak = () => getStreak();
const getClientTotal = () => {
  try {
    return parseInt(localStorage.getItem("fortune_total") || "0", 10);
  } catch { return 0; }
};

// Cached initial fortune — generated once on first client access
let _initialFortune: Fortune | null = null;
const getInitialFortune = () => {
  if (!_initialFortune) _initialFortune = getRandomFortune(getStreak());
  return _initialFortune;
};

import { trackCookieBreak, trackFortuneReveal, trackNewCookie } from "@/lib/analytics";

// Dynamic import for CookieCanvas (needs browser APIs)
const CookieCanvas = dynamic(() => import("@/components/CookieCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[6/5] w-full max-w-[600px] mx-auto items-center justify-center rounded-2xl bg-background/50">
      <div className="text-center text-foreground/30">
        <div className="mb-2 text-4xl">🥠</div>
        <p className="text-sm">Loading your fortune cookie...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const isMobile = useSyncExternalStore(noopSubscribe, getIsMobile, getServerIsMobile);
  const clientStreak = useSyncExternalStore(noopSubscribe, getClientStreak, () => 0);
  const clientTotal = useSyncExternalStore(noopSubscribe, getClientTotal, () => 0);
  const initialFortune = useSyncExternalStore(noopSubscribe, getInitialFortune, () => null);

  // Session-level overrides (updated when user breaks cookies)
  const [streakOverride, setStreakOverride] = useState<number | null>(null);
  const [totalOverride, setTotalOverride] = useState<number | null>(null);
  const streak = streakOverride ?? clientStreak;
  const totalBroken = totalOverride ?? clientTotal;

  // Fortune state — initial value from useSyncExternalStore, overridden on break/new cookie
  const [fortuneOverride, setFortuneOverride] = useState<Fortune | null>(null);
  const fortune = fortuneOverride ?? initialFortune;
  const [showFortune, setShowFortune] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleBreak = useCallback(() => {
    trackCookieBreak("break");
    const newStreak = updateStreak();
    setStreakOverride(newStreak);

    // Generate new fortune with updated streak
    setFortuneOverride(getRandomFortune(newStreak));
    setShowFortune(false);
    setShowShare(false);

    // Increment total
    try {
      const count = parseInt(localStorage.getItem("fortune_total") || "0", 10) + 1;
      localStorage.setItem("fortune_total", count.toString());
      setTotalOverride(count);
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
    setFortuneOverride(getRandomFortune(streak));
    setShowFortune(false);
    setShowShare(false);
  }, [streak]);

  return (
    <div className="bg-warm-gradient">
      {/* Top Ad */}
      <div className="mx-auto max-w-4xl px-4 pt-4">
        <AdUnit slot="top-leaderboard" format="horizontal" />
      </div>

      {/* Hero Section */}
      <section className="px-4 pb-4 pt-6 sm:pt-10 text-center">
        <h1 className="text-golden-shimmer mb-2 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
          Break Your Fortune Cookie
        </h1>
        <p className="mx-auto max-w-md text-foreground/50">
          {isMobile
            ? "Tap, drag, shake your phone, or squeeze to reveal your destiny"
            : "Click, drag, shake, double-tap, or squeeze to reveal your destiny"}
        </p>

        {/* Stats */}
        {(streak > 0 || totalBroken > 0) && (
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-foreground/30">
            {streak > 0 && (
              <span>
                🔥 {streak}-day streak
              </span>
            )}
            {totalBroken > 0 && (
              <span>
                🥠 {totalBroken} cookies broken
              </span>
            )}
          </div>
        )}
      </section>

      {/* Cookie Canvas */}
      <section className="px-4 pb-8">
        <CookieCanvas
          fortune={fortune?.text || "Good things are coming your way."}
          onBreak={handleBreak}
          onFortuneReveal={handleFortuneReveal}
          onNewCookie={handleNewCookie}
        />
      </section>

      {/* Fortune Reveal */}
      <section className="px-4">
        <FortuneReveal fortune={fortune} visible={showFortune} />
        <ShareButtons fortune={fortune} visible={showShare} />
      </section>

      {/* Post-reveal Ad */}
      {showFortune && (
        <div className="mx-auto max-w-lg px-4 pt-8">
          <AdUnit slot="post-reveal-rectangle" format="rectangle" />
        </div>
      )}

      {/* Divider */}
      <div className="mx-auto my-12 max-w-xs border-t border-gold/10" />

      {/* Fortune of the Day */}
      <FortuneOfTheDay />

      {/* How to Play */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-golden-shimmer mb-8 text-center text-2xl font-bold">
          {isMobile ? "6" : "5"} Ways to Break Your Cookie
        </h2>
        <div className={`grid grid-cols-1 gap-4 ${isMobile ? "grid-cols-2 md:grid-cols-3" : "md:grid-cols-5"}`}>
          {[
            { icon: "👆", title: "Tap Smash", desc: isMobile ? "Tap 3 times to crack it open" : "Click 3 times for a quick break" },
            { icon: "👉", title: "Drag Crack", desc: "Drag across the cookie to throw it" },
            { icon: "👋", title: "Shake Break", desc: isMobile ? "Wiggle your finger over the cookie" : "Rapidly wiggle your mouse over it" },
            ...(isMobile ? [{ icon: "📱", title: "Phone Shake", desc: "Physically shake your phone to break" }] : []),
            { icon: "✌️", title: "Double Tap", desc: isMobile ? "Double-tap for an instant break" : "Double-click for a two-stage break" },
            { icon: "✊", title: "Squeeze", desc: "Press and hold for 2 seconds" },
          ].map((method) => (
            <div
              key={method.title}
              className="rounded-xl border border-gold/10 bg-gold/5 p-4 text-center transition hover:border-gold/20 hover:bg-gold/10"
            >
              <div className="mb-2 text-2xl">{method.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-gold">{method.title}</h3>
              <p className="text-xs text-foreground/40">{method.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Teaser / SEO Content */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-golden-shimmer mb-4 text-center text-2xl font-bold">
          The Magic of Fortune Cookies
        </h2>
        <div className="rounded-2xl border border-gold/10 bg-gold/5 p-8">
          <p className="mb-4 leading-relaxed text-foreground/60">
            Fortune cookies have been a beloved tradition for over a century, bringing moments of
            surprise and delight to millions around the world. Originally popularized in California
            in the early 1900s, these crispy treats with hidden messages have become a staple of
            dining culture and a symbol of hope and possibility.
          </p>
          <p className="leading-relaxed text-foreground/60">
            Our digital fortune cookie brings that same magic to your screen. With realistic
            physics-based breaking animations and over 1,000 unique fortunes, every visit is a
            new experience. Whether you prefer wisdom, humor, or mystery, there&apos;s a fortune
            waiting just for you.
          </p>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <AdUnit slot="bottom-leaderboard" format="horizontal" />
      </div>
    </div>
  );
}
