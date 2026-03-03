"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { getSajuProfile, clearSajuProfile, type SajuProfile } from "@/lib/saju/profile";
import { usePremium } from "@/lib/saju/use-premium";
import { savePremiumToken } from "@/lib/saju/premium";
import SajuOnboarding from "@/components/saju/SajuOnboarding";
import SajuChart from "@/components/saju/SajuChart";
import FiveElementsBar from "@/components/saju/FiveElementsBar";
import MajorLuckTimeline from "@/components/saju/MajorLuckTimeline";
import SajuInterpretation from "@/components/saju/SajuInterpretation";
import PremiumGate from "@/components/saju/PremiumGate";
import DailyReading from "@/components/saju/DailyReading";
import MonthlyOutlook from "@/components/saju/MonthlyOutlook";
import YearlyForecast from "@/components/saju/YearlyForecast";
import CompatibilityCheck from "@/components/saju/CompatibilityCheck";
import LuckyDayCalendar from "@/components/saju/LuckyDayCalendar";
import SubscriptionManager from "@/components/saju/SubscriptionManager";
import { formatPillar } from "@/lib/saju/format";
import { getCurrentDayPillar, getCurrentMonthPillar, getCurrentYearPillar } from "@/lib/saju/current-luck";

const noop = () => () => {};
const getProfile = () => getSajuProfile();
const getServerProfile = () => null;

export default function SajuDashboard() {
  const storedProfile = useSyncExternalStore(noop, getProfile, getServerProfile);
  const [profile, setProfile] = useState<SajuProfile | null>(storedProfile);
  const { isPremium, loading: premiumLoading, subscribe, restore, manageSubscription } = usePremium();
  const searchParams = useSearchParams();

  // Handle Stripe checkout redirect: verify session_id and save token
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;

    async function verifySession() {
      try {
        const res = await fetch('/api/subscribe/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        if (res.ok) {
          const { token } = await res.json();
          savePremiumToken(token);
          window.history.replaceState({}, '', '/saju');
          window.location.reload();
        }
      } catch { /* silent fail — user can retry */ }
    }

    verifySession();
  }, [searchParams]);

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

      {/* AI Interpretation */}
      <SajuInterpretation chart={chart} />

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

      {/* Premium: Daily Reading */}
      <PremiumGate
        isPremium={isPremium}
        loading={premiumLoading}
        onSubscribe={subscribe}
        onRestore={restore}
      >
        <DailyReading chart={chart} />
      </PremiumGate>

      {/* Premium: More Features (visible only to premium users) */}
      {isPremium && (
        <>
          <LuckyDayCalendar chart={chart} />
          <MonthlyOutlook chart={chart} />
          <YearlyForecast chart={chart} />
          <CompatibilityCheck chart={chart} />
        </>
      )}

      {/* Subscription Manager (for premium users) */}
      {isPremium && <SubscriptionManager onManage={manageSubscription} />}

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
