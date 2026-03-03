"use client";

import { useState, useEffect } from "react";
import type { SajuChart } from "@/lib/saju/types";
import { getPremiumToken } from "@/lib/saju/premium";

interface YearlyForecastData {
  overview: string;
  career: string;
  love: string;
  health: string;
  timing: string;
  strategy: string;
}

const CACHE_KEY = "saju_yearly_forecast";

function getCached(): YearlyForecastData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    const currentYear = new Date().getFullYear().toString();
    if (cached.year === currentYear) return cached.data;
    return null;
  } catch { return null; }
}

function cache(data: YearlyForecastData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    year: new Date().getFullYear().toString(),
    data,
  }));
}

const SECTIONS: { key: keyof YearlyForecastData; label: string; icon: string }[] = [
  { key: "overview", label: "Year Overview", icon: "\u2728" },
  { key: "career", label: "Career & Finance", icon: "\uD83D\uDCBC" },
  { key: "love", label: "Love & Relationships", icon: "\uD83D\uDC96" },
  { key: "health", label: "Health & Wellness", icon: "\uD83C\uDF3F" },
  { key: "timing", label: "Key Timing", icon: "\u23F0" },
  { key: "strategy", label: "Strategic Advice", icon: "\uD83C\uDFAF" },
];

interface Props {
  chart: SajuChart;
}

export default function YearlyForecast({ chart }: Props) {
  const [forecast, setForecast] = useState<YearlyForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getCached();
    if (cached) { setForecast(cached); return; }

    async function fetchForecast() {
      setLoading(true);
      setError("");
      const token = getPremiumToken();
      try {
        const res = await fetch("/api/saju/yearly", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chart }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to get yearly forecast.");
        }
        const data = await res.json();
        setForecast(data);
        cache(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, [chart]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gold/20 bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">Yearly Forecast</h3>
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
        <h3 className="mb-2 text-lg font-semibold text-gold">Yearly Forecast</h3>
        <p className="text-sm text-foreground/40">{error}</p>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="rounded-2xl border border-gold/20 bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gold">Yearly Forecast</h3>
        <span className="text-xs text-gold/40 bg-gold/10 px-2 py-1 rounded-full">Premium</span>
      </div>
      <div className="space-y-4">
        {SECTIONS.map(({ key, label, icon }) => {
          const text = forecast[key];
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
