"use client";

import { useState, useEffect } from "react";
import type { SajuChart } from "@/lib/saju/types";
import { getPremiumToken } from "@/lib/saju/premium";

interface DayEntry {
  date: string;
  dayOfWeek: string;
  stemBranch: string;
  element: string;
  rating: "favorable" | "neutral" | "challenging";
}

type LuckyDaysData = DayEntry[];

const CACHE_KEY = "saju_lucky_days";

function getWeekNumber(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return `${now.getFullYear()}-W${Math.ceil(diff / oneWeek)}`;
}

function getCached(): LuckyDaysData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    if (cached.week === getWeekNumber()) return cached.data;
    return null;
  } catch { return null; }
}

function cache(data: LuckyDaysData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    week: getWeekNumber(),
    data,
  }));
}

const RATING_STYLES: Record<string, { text: string; border: string; icon: string }> = {
  favorable: { text: "text-emerald-400", border: "border-emerald-500/30", icon: "\u2714\uFE0F" },
  neutral: { text: "text-amber-400", border: "border-amber-500/30", icon: "\u25CF" },
  challenging: { text: "text-red-400", border: "border-red-500/30", icon: "\u26A0\uFE0F" },
};

interface Props {
  chart: SajuChart;
}

export default function LuckyDayCalendar({ chart }: Props) {
  const [days, setDays] = useState<LuckyDaysData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getCached();
    if (cached) { setDays(cached); return; }

    async function fetchDays() {
      setLoading(true);
      setError("");
      const token = getPremiumToken();
      try {
        const res = await fetch("/api/saju/lucky-days", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chart }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to get lucky days.");
        }
        const data = await res.json();
        setDays(data);
        cache(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchDays();
  }, [chart]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gold/20 bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">Lucky Day Calendar</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white/5 h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-2 text-lg font-semibold text-gold">Lucky Day Calendar</h3>
        <p className="text-sm text-foreground/40">{error}</p>
      </div>
    );
  }

  if (!days) return null;

  return (
    <div className="rounded-2xl border border-gold/20 bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gold">Lucky Day Calendar</h3>
        <span className="text-xs text-gold/40 bg-gold/10 px-2 py-1 rounded-full">Premium</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const style = RATING_STYLES[day.rating] || RATING_STYLES.neutral;
          return (
            <div
              key={day.date}
              className={`rounded-xl border ${style.border} bg-white/3 p-3 text-center`}
            >
              <div className="text-xs text-foreground/40 mb-1">{day.dayOfWeek}</div>
              <div className={`text-lg font-bold ${style.text}`}>
                {new Date(day.date + "T00:00:00").getDate()}
              </div>
              <div className="text-xs text-foreground/30 mt-1">{day.stemBranch}</div>
              <div className="text-xs text-foreground/20 capitalize">{day.element}</div>
              <div className="mt-1 text-xs">{style.icon}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center gap-4 text-xs text-foreground/30">
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-emerald-400" /> Favorable</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> Neutral</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-400" /> Challenging</span>
      </div>
    </div>
  );
}
