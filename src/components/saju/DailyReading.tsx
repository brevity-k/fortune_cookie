"use client";

import { useState, useEffect } from "react";
import type { SajuChart } from "@/lib/saju/types";
import { getPremiumToken } from "@/lib/saju/premium";

interface DailyReadingData {
  energy: string;
  career: string;
  relationships: string;
  tip: string;
  favorableTime: string;
}

const CACHE_KEY = "saju_daily_reading";

function getCached(): DailyReadingData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    if (cached.date === new Date().toISOString().slice(0, 10)) return cached.data;
    return null;
  } catch { return null; }
}

function cache(data: DailyReadingData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    date: new Date().toISOString().slice(0, 10),
    data,
  }));
}

const SECTIONS: { key: keyof DailyReadingData; label: string; icon: string }[] = [
  { key: "energy", label: "Today's Energy", icon: "\u26A1" },
  { key: "career", label: "Work & Career", icon: "\uD83D\uDCBC" },
  { key: "relationships", label: "Relationships", icon: "\uD83D\uDC95" },
  { key: "tip", label: "Today's Tip", icon: "\uD83D\uDCA1" },
];

interface Props {
  chart: SajuChart;
}

export default function DailyReading({ chart }: Props) {
  const [reading, setReading] = useState<DailyReadingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getCached();
    if (cached) { setReading(cached); return; }

    async function fetchReading() {
      setLoading(true);
      setError("");
      const token = getPremiumToken();
      try {
        const res = await fetch("/api/saju/daily", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chart }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to get daily reading.");
        }
        const data = await res.json();
        setReading(data);
        cache(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchReading();
  }, [chart]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gold/20 bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">Daily Personalized Reading</h3>
        <div className="space-y-4">
          {SECTIONS.map(({ key }) => (
            <div key={key} className="animate-pulse">
              <div className="h-4 w-32 rounded bg-white/5 mb-2" />
              <div className="h-3 w-full rounded bg-white/5 mb-1" />
              <div className="h-3 w-3/4 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-2 text-lg font-semibold text-gold">Daily Reading</h3>
        <p className="text-sm text-foreground/40">{error}</p>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="rounded-2xl border border-gold/20 bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gold">Daily Personalized Reading</h3>
        <span className="text-xs text-gold/40 bg-gold/10 px-2 py-1 rounded-full">Premium</span>
      </div>
      <div className="space-y-4">
        {SECTIONS.map(({ key, label, icon }) => {
          const text = reading[key];
          if (!text) return null;
          return (
            <div key={key} className="rounded-xl border border-border/20 bg-white/3 p-4">
              <div className="mb-1 text-sm font-medium text-gold/70">{icon} {label}</div>
              <p className="text-sm text-foreground/60 leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
      {reading.favorableTime && (
        <p className="mt-4 text-center text-xs text-foreground/30">
          Best time of day: <span className="capitalize text-gold/50">{reading.favorableTime}</span>
        </p>
      )}
    </div>
  );
}
