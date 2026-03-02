"use client";

import { useState, useEffect } from "react";
import type { SajuChart } from "@/lib/saju/types";

interface Interpretation {
  overall: string;
  career: string;
  love: string;
  health: string;
  advice: string;
  luckyElement: string;
  luckyColor: string;
}

const CACHE_KEY = "saju_interpretation";

function getCachedInterpretation(): Interpretation | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (cached.date === today) return cached.data;
    return null;
  } catch {
    return null;
  }
}

function cacheInterpretation(data: Interpretation) {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, data }));
}

const SECTIONS: { key: keyof Interpretation; label: string; icon: string }[] = [
  { key: "overall", label: "Overall Fortune", icon: "✨" },
  { key: "career", label: "Career Outlook", icon: "💼" },
  { key: "love", label: "Love & Relationships", icon: "💕" },
  { key: "health", label: "Health", icon: "🌿" },
  { key: "advice", label: "Practical Advice", icon: "💡" },
];

interface Props {
  chart: SajuChart;
}

export default function SajuInterpretation({ chart }: Props) {
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getCachedInterpretation();
    if (cached) {
      setInterpretation(cached);
      return;
    }

    async function fetchInterpretation() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/saju-interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fourPillars: chart.fourPillars,
            fiveElements: chart.fiveElements,
            birthInfo: chart.birthInfo,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to get interpretation.");
        }

        const data = await res.json();
        setInterpretation(data);
        cacheInterpretation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchInterpretation();
  }, [chart]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">AI Interpretation</h3>
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
        <h3 className="mb-2 text-lg font-semibold text-gold">AI Interpretation</h3>
        <p className="text-sm text-foreground/40">
          {error}
        </p>
      </div>
    );
  }

  if (!interpretation) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="mb-4 text-lg font-semibold text-gold">AI Interpretation</h3>
      <div className="space-y-4">
        {SECTIONS.map(({ key, label, icon }) => {
          const text = interpretation[key];
          if (!text) return null;
          return (
            <div key={key} className="rounded-xl border border-border/20 bg-white/3 p-4">
              <div className="mb-1 text-sm font-medium text-gold/70">
                {icon} {label}
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
      {interpretation.luckyElement && (
        <p className="mt-4 text-center text-xs text-foreground/30">
          Lucky Element: <span className="capitalize text-gold/50">{interpretation.luckyElement}</span>
          {interpretation.luckyColor && (
            <> &middot; Lucky Color: <span className="text-gold/50">{interpretation.luckyColor}</span></>
          )}
        </p>
      )}
    </div>
  );
}
