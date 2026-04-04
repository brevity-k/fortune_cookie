"use client";

import { useState } from "react";
import type { SajuChart, Gender } from "@/lib/saju/types";
import { calculateFourPillars } from "@/lib/saju/four-pillars";
import { analyzeFiveElements } from "@/lib/saju/five-elements";
import { calculateMajorLuckCycles } from "@/lib/saju/major-luck";

interface CompatibilityData {
  score: number;
  summary: string;
  strengths: string;
  challenges: string;
  communication: string;
  advice: string;
}

interface PartnerForm {
  year: string;
  month: string;
  day: string;
  gender: Gender;
}

const SECTIONS: { key: keyof Omit<CompatibilityData, "score">; label: string; icon: string }[] = [
  { key: "summary", label: "Overall Compatibility", icon: "\uD83D\uDC91" },
  { key: "strengths", label: "Strengths", icon: "\u2728" },
  { key: "challenges", label: "Challenges", icon: "\u26A0\uFE0F" },
  { key: "communication", label: "Communication", icon: "\uD83D\uDCAC" },
  { key: "advice", label: "Relationship Advice", icon: "\uD83D\uDCA1" },
];

function getCacheKey(chartA: SajuChart, form: PartnerForm): string {
  const a = `${chartA.birthInfo.year}-${chartA.birthInfo.month}-${chartA.birthInfo.day}-${chartA.birthInfo.gender}`;
  const b = `${form.year}-${form.month}-${form.day}-${form.gender}`;
  return `saju_compat_${a}_${b}`;
}

function getCached(key: string): CompatibilityData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function cache(key: string, data: CompatibilityData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

interface Props {
  chart: SajuChart;
}

export default function CompatibilityCheck({ chart }: Props) {
  const [partner, setPartner] = useState<PartnerForm>({
    year: "",
    month: "",
    day: "",
    gender: "female",
  });
  const [result, setResult] = useState<CompatibilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function isFormValid(): boolean {
    const y = parseInt(partner.year);
    const m = parseInt(partner.month);
    const d = parseInt(partner.day);
    return y >= 1920 && y <= 2030 && m >= 1 && m <= 12 && d >= 1 && d <= 31;
  }

  async function handleCheck() {
    if (!isFormValid()) return;

    const cacheKey = getCacheKey(chart, partner);
    const cached = getCached(cacheKey);
    if (cached) { setResult(cached); return; }

    setLoading(true);
    setError("");

    try {
      const birthInfoB = {
        year: parseInt(partner.year),
        month: parseInt(partner.month),
        day: parseInt(partner.day),
        hour: null as number | null,
        gender: partner.gender,
      };
      const fourPillarsB = calculateFourPillars(birthInfoB);
      const fiveElementsB = analyzeFiveElements(fourPillarsB);
      const majorLuckCyclesB = calculateMajorLuckCycles(birthInfoB, fourPillarsB);
      const chartB: SajuChart = { birthInfo: birthInfoB, fourPillars: fourPillarsB, fiveElements: fiveElementsB, majorLuckCycles: majorLuckCyclesB };

      const res = await fetch("/api/saju/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ chartA: chart, chartB }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to check compatibility.");
      }
      const data = await res.json();
      setResult(data);
      cache(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function scoreColor(score: number): string {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  }

  return (
    <div className="rounded-2xl border border-gold/20 bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gold">Compatibility Check</h3>
        <span className="text-xs text-gold/40 bg-gold/10 px-2 py-1 rounded-full">Premium</span>
      </div>

      {!result && (
        <div className="space-y-4">
          <p className="text-sm text-foreground/50">
            Enter the other person&apos;s birth information to check your compatibility.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-foreground/40 mb-1">Year</label>
              <input
                type="number"
                value={partner.year}
                onChange={(e) => setPartner({ ...partner, year: e.target.value })}
                placeholder="1990"
                min={1920}
                max={2030}
                className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/20 focus:border-gold/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/40 mb-1">Month</label>
              <input
                type="number"
                value={partner.month}
                onChange={(e) => setPartner({ ...partner, month: e.target.value })}
                placeholder="6"
                min={1}
                max={12}
                className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/20 focus:border-gold/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/40 mb-1">Day</label>
              <input
                type="number"
                value={partner.day}
                onChange={(e) => setPartner({ ...partner, day: e.target.value })}
                placeholder="15"
                min={1}
                max={31}
                className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/20 focus:border-gold/40 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-foreground/40 mb-1">Gender</label>
            <select
              value={partner.gender}
              onChange={(e) => setPartner({ ...partner, gender: e.target.value as Gender })}
              className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-foreground focus:border-gold/40 focus:outline-none"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            onClick={handleCheck}
            disabled={loading || !isFormValid()}
            className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-background transition hover:bg-gold-light disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Check Compatibility"}
          </button>
        </div>
      )}

      {loading && (
        <div className="space-y-4 mt-4">
          {SECTIONS.map(({ key }) => (
            <div key={key} className="animate-pulse">
              <div className="h-4 w-32 rounded bg-white/5 mb-2" />
              <div className="h-3 w-full rounded bg-white/5 mb-1" />
              <div className="h-3 w-3/4 rounded bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className={`text-5xl font-bold ${scoreColor(result.score)}`}>
              {result.score}<span className="text-lg text-foreground/30">/100</span>
            </div>
            <p className="text-sm text-foreground/40 mt-1">Compatibility Score</p>
          </div>
          <div className="space-y-4">
            {SECTIONS.map(({ key, label, icon }) => {
              const text = result[key];
              if (!text) return null;
              return (
                <div key={key} className="rounded-xl border border-border/20 bg-white/3 p-4">
                  <div className="mb-1 text-sm font-medium text-gold/70">{icon} {label}</div>
                  <p className="text-sm text-foreground/60 leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setResult(null)}
            className="w-full text-xs text-foreground/30 underline underline-offset-2 hover:text-foreground/50 transition mt-2"
          >
            Check another person
          </button>
        </div>
      )}
    </div>
  );
}
