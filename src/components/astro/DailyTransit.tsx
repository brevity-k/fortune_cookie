"use client";

import { useState, useEffect } from "react";
import type { NatalChart } from "@/lib/astro/types";

interface DailyTransitData {
  energy: string;
  relationships: string;
  career: string;
  tip: string;
}

const CACHE_KEY = "astro_daily";

function getCached(): DailyTransitData | null {
  if (typeof window === "undefined") return null;
  const today = new Date().toISOString().slice(0, 10);
  const raw = localStorage.getItem(`${CACHE_KEY}_${today}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cache(data: DailyTransitData) {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(`${CACHE_KEY}_${today}`, JSON.stringify(data));
}

const SECTIONS: { key: keyof DailyTransitData; label: string; icon: string }[] = [
  { key: "energy", label: "Today's Energy", icon: "\u26A1" },
  { key: "relationships", label: "Relationships", icon: "\uD83D\uDC95" },
  { key: "career", label: "Work & Career", icon: "\uD83D\uDCBC" },
  { key: "tip", label: "Today's Tip", icon: "\uD83D\uDCA1" },
];

interface Props {
  chart: NatalChart;
}

export default function DailyTransit({ chart }: Props) {
  const [reading, setReading] = useState<DailyTransitData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setReading(cached);
      return;
    }

    async function fetchReading() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/astro/daily", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ chart }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to get daily transit reading.");
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
        <h3 className="mb-4 text-lg font-semibold text-gold">Daily Transit Reading</h3>
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
        <h3 className="mb-2 text-lg font-semibold text-gold">Daily Transit Reading</h3>
        <p className="text-sm text-foreground/40">{error}</p>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="rounded-2xl border border-gold/20 bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gold">Daily Transit Reading</h3>
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
    </div>
  );
}
