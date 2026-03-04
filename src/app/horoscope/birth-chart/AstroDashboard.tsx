"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import {
  getAstroProfile,
  clearAstroProfile,
} from "@/lib/astro/profile";
import type { AstroProfile } from "@/lib/astro/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import AstroOnboarding from "@/components/astro/AstroOnboarding";
import NatalChartWheel from "@/components/astro/NatalChartWheel";
import PlanetTable from "@/components/astro/PlanetTable";
import BalanceBar from "@/components/astro/BalanceBar";
import AspectGrid from "@/components/astro/AspectGrid";
import AstroInterpretation from "@/components/astro/AstroInterpretation";

const noop = () => () => {};
const getProfile = () => getAstroProfile();
const getServerProfile = () => null;

export default function AstroDashboard() {
  const storedProfile = useSyncExternalStore(
    noop,
    getProfile,
    getServerProfile
  );
  const [profile, setProfile] = useState<AstroProfile | null>(storedProfile);

  // Sync chart to Supabase if authenticated
  useEffect(() => {
    if (!profile) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from('user_charts').upsert({
        user_id: user.id,
        track: 'astro',
        chart_data: profile.chart,
        birth_info: profile.birthInfo,
      }, { onConflict: 'user_id,track' }).then(({ error }) => {
        if (error) console.error('Chart sync error:', error.message);
        else {
          supabase.from('profiles').select('active_tracks').eq('id', user.id).single()
            .then(({ data }) => {
              const tracks: string[] = data?.active_tracks || [];
              if (!tracks.includes('astro')) {
                supabase.from('profiles').update({
                  active_tracks: [...tracks, 'astro'],
                }).eq('id', user.id).then(() => {});
              }
            });
        }
      });
    });
  }, [profile]);

  function handleComplete(p: AstroProfile) {
    setProfile(p);
  }

  function handleReset() {
    clearAstroProfile();
    setProfile(null);
  }

  if (!profile) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-golden-shimmer text-3xl font-bold sm:text-4xl">
            Free Birth Chart Calculator
          </h1>
          <p className="mt-3 text-foreground/50">
            Enter your birth date, time, and city to calculate your personalized
            natal chart with real astronomical data.
          </p>
        </div>
        <AstroOnboarding onComplete={handleComplete} />
      </div>
    );
  }

  const { chart, birthInfo } = profile;
  const sunSign =
    chart.planets.find((p) => p.planet === "Sun")?.sign ?? "Unknown";
  const moonSign =
    chart.planets.find((p) => p.planet === "Moon")?.sign ?? "Unknown";
  const risingSign = chart.ascendant.sign;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-golden-shimmer text-3xl font-bold sm:text-4xl">
          Your Natal Chart
        </h1>
        <p className="mt-2 text-foreground/50">
          Born {birthInfo.year}-{String(birthInfo.month).padStart(2, "0")}-
          {String(birthInfo.day).padStart(2, "0")} at{" "}
          {String(birthInfo.hour).padStart(2, "0")}:
          {String(birthInfo.minute).padStart(2, "0")} in {birthInfo.cityName}
        </p>
        <p className="mt-1 text-sm text-gold/70">
          {sunSign} Sun &middot; {moonSign} Moon &middot; {risingSign} Rising
        </p>
      </div>

      {/* Natal Chart Wheel */}
      <div className="rounded-2xl border border-border bg-background p-6 flex justify-center overflow-x-auto">
        <NatalChartWheel chart={chart} />
      </div>

      {/* Planet Positions Table */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <PlanetTable chart={chart} />
      </div>

      {/* Element & Modality Balance */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <BalanceBar elements={chart.elements} modalities={chart.modalities} />
      </div>

      {/* Aspect Grid */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <AspectGrid chart={chart} />
      </div>

      {/* AI Interpretation (free) */}
      <AstroInterpretation chart={chart} birthInfo={birthInfo} />

      {/* Premium CTA */}
      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 text-center">
        <p className="text-sm text-foreground/60">
          🌌 <Link href="/login?redirect=/my-fortune" className="text-gold underline underline-offset-2 hover:text-gold/80 transition">Sign in</Link> to save your chart and get personalized daily fortunes
        </p>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          onClick={handleReset}
          className="text-sm text-foreground/30 underline underline-offset-2 hover:text-foreground/50 transition"
        >
          Reset chart and enter new birth data
        </button>
      </div>
    </div>
  );
}
