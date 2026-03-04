"use client";

import { useState, useSyncExternalStore } from "react";
import { getSajuProfile, clearSajuProfile, type SajuProfile } from "@/lib/saju/profile";
import SajuOnboarding from "@/components/saju/SajuOnboarding";
import SajuChart from "@/components/saju/SajuChart";
import FiveElementsBar from "@/components/saju/FiveElementsBar";
import MajorLuckTimeline from "@/components/saju/MajorLuckTimeline";
import SajuInterpretation from "@/components/saju/SajuInterpretation";
import { formatPillar } from "@/lib/saju/format";
import { getCurrentDayPillar, getCurrentMonthPillar, getCurrentYearPillar } from "@/lib/saju/current-luck";

const noop = () => () => {};
const getProfile = () => getSajuProfile();
const getServerProfile = () => null;

export default function SajuDashboard() {
  const storedProfile = useSyncExternalStore(noop, getProfile, getServerProfile);
  const [profile, setProfile] = useState<SajuProfile | null>(storedProfile);

  function handleComplete(p: SajuProfile) {
    setProfile(p);
  }

  function handleReset() {
    clearSajuProfile();
    setProfile(null);
  }

  if (!profile) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-golden-shimmer text-3xl font-bold sm:text-4xl">
            Four Pillars of Destiny (사주)
          </h1>
          <p className="mt-3 text-foreground/50">
            Discover your personalized fortune based on the ancient Korean Four Pillars system.
            Enter your birth details below.
          </p>
        </div>
        <SajuOnboarding onComplete={handleComplete} />
      </div>
    );
  }

  const { chart } = profile;
  const dayMasterFormatted = formatPillar(chart.fourPillars.day);

  // Current luck
  const todayPillar = formatPillar(getCurrentDayPillar());
  const monthPillar = formatPillar(getCurrentMonthPillar());
  const yearPillar = formatPillar(getCurrentYearPillar());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-golden-shimmer text-3xl font-bold sm:text-4xl">
          Your Four Pillars (사주)
        </h1>
        <p className="mt-2 text-foreground/50">
          Born {profile.birthInfo.year}-{String(profile.birthInfo.month).padStart(2, "0")}-{String(profile.birthInfo.day).padStart(2, "0")}
          {profile.birthInfo.hour !== null && ` at ${String(profile.birthInfo.hour).padStart(2, "0")}:00`}
          {" "}&middot;{" "}
          <span className="capitalize">{dayMasterFormatted.stemElement}</span> Day Master ({dayMasterFormatted.stemHanja})
        </p>
      </div>

      {/* Four Pillars Chart */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <SajuChart fourPillars={chart.fourPillars} />
      </div>

      {/* Five Elements */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <FiveElementsBar analysis={chart.fiveElements} />
      </div>

      {/* Major Luck Timeline */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <MajorLuckTimeline cycles={chart.majorLuckCycles} birthInfo={chart.birthInfo} />
      </div>

      {/* Current Luck */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">
          Current Fortune (운세)
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/30 bg-white/3 p-4 text-center">
            <div className="text-xs text-foreground/40 mb-1">Year (세운)</div>
            <div className="text-2xl font-bold text-gold">{yearPillar.combined}</div>
            <div className="text-xs text-foreground/40 capitalize mt-1">{yearPillar.stemElement} {yearPillar.branchAnimal}</div>
          </div>
          <div className="rounded-xl border border-border/30 bg-white/3 p-4 text-center">
            <div className="text-xs text-foreground/40 mb-1">Month (월운)</div>
            <div className="text-2xl font-bold text-gold">{monthPillar.combined}</div>
            <div className="text-xs text-foreground/40 capitalize mt-1">{monthPillar.stemElement} {monthPillar.branchAnimal}</div>
          </div>
          <div className="rounded-xl border border-border/30 bg-white/3 p-4 text-center">
            <div className="text-xs text-foreground/40 mb-1">Today (일운)</div>
            <div className="text-2xl font-bold text-gold">{todayPillar.combined}</div>
            <div className="text-xs text-foreground/40 capitalize mt-1">{todayPillar.stemElement} {todayPillar.branchAnimal}</div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <SajuInterpretation chart={chart} />

      {/* Reset */}
      <div className="text-center">
        <button
          onClick={handleReset}
          className="text-sm text-foreground/30 underline underline-offset-2 hover:text-foreground/50 transition"
        >
          Reset profile and enter new birth data
        </button>
      </div>
    </div>
  );
}
