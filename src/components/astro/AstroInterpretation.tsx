"use client";

import { useState } from "react";
import type { NatalChart } from "@/lib/astro/types";

interface Interpretation {
  personality: string;
  emotions: string;
  communication: string;
  love: string;
  ambition: string;
  career: string;
  balance: string;
}

function getCacheKey(birthInfo: { year: number; month: number; day: number; hour: number; minute: number }): string {
  return `astro_interpretation_${birthInfo.year}-${birthInfo.month}-${birthInfo.day}-${birthInfo.hour}-${birthInfo.minute}`;
}

function getCachedInterpretation(key: string): Interpretation | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cacheInterpretation(key: string, data: Interpretation) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

const SECTIONS: { key: keyof Interpretation; label: string; icon: string }[] = [
  { key: "personality", label: "Core Personality", icon: "\u2600\uFE0F" },
  { key: "emotions", label: "Emotional World", icon: "\uD83C\uDF19" },
  { key: "communication", label: "Communication Style", icon: "\uD83D\uDCAC" },
  { key: "love", label: "Love & Relationships", icon: "\uD83D\uDC95" },
  { key: "ambition", label: "Drive & Ambition", icon: "\uD83D\uDD25" },
  { key: "career", label: "Career & Purpose", icon: "\uD83C\uDFAF" },
  { key: "balance", label: "Elemental Balance", icon: "\u2696\uFE0F" },
];

interface Props {
  chart: NatalChart;
  birthInfo: { year: number; month: number; day: number; hour: number; minute: number };
}

export default function AstroInterpretation({ chart, birthInfo }: Props) {
  const [interpretation, setInterpretation] = useState<Interpretation | null>(() => {
    const key = getCacheKey(birthInfo);
    return getCachedInterpretation(key);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/astro/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to get interpretation.");
      }

      const data = await res.json();
      setInterpretation(data);
      cacheInterpretation(getCacheKey(birthInfo), data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">AI Natal Chart Reading</h3>
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
        <h3 className="mb-2 text-lg font-semibold text-gold">AI Natal Chart Reading</h3>
        <p className="text-sm text-foreground/40">
          {error}
        </p>
      </div>
    );
  }

  if (!interpretation && !loading && !error) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-gold">AI Natal Chart Reading</h3>
        <p className="mb-4 text-sm text-foreground/40">
          Get a personalized AI interpretation of your natal chart.
        </p>
        <button
          onClick={handleGenerate}
          className="rounded-full bg-gold px-6 py-2 text-sm font-medium text-background hover:bg-gold/90 transition"
        >
          Generate Interpretation
        </button>
      </div>
    );
  }

  if (!interpretation) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="mb-4 text-lg font-semibold text-gold">AI Natal Chart Reading</h3>
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
    </div>
  );
}
