'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import OnboardingQuestions from '@/components/premium/OnboardingQuestions';
import DailyCheckIn from '@/components/premium/DailyCheckIn';
import type { FortuneCategory } from '@/lib/premium/prompts';
import { FORTUNE_CATEGORY_LABELS } from '@/lib/premium/prompts';

interface Props {
  activeTracks: string[];
  availableTracks: string[];
  hasOnboarded: boolean;
}

interface FortuneData {
  title: string;
  content: string;
  luckyElement?: string;
  luckyPlanet?: string;
  intensity: number;
}

const CATEGORY_ORDER: FortuneCategory[] = ['daily', 'love', 'career', 'health'];
const CATEGORY_EMOJIS: Record<FortuneCategory, string> = {
  daily: '🥠',
  love: '💕',
  career: '💼',
  health: '💚',
  monthly: '📅',
};

function IntensityStars({ value }: { value: number }) {
  return (
    <span className="text-xs text-gold">
      {'★'.repeat(value)}
      {'☆'.repeat(5 - value)}
    </span>
  );
}

export default function MyFortuneDashboard({ activeTracks, availableTracks, hasOnboarded }: Props) {
  const [showOnboarding, setShowOnboarding] = useState(!hasOnboarded);
  const [activeTrack, setActiveTrack] = useState<string>(
    activeTracks[0] || availableTracks[0] || 'saju',
  );
  const [fortunes, setFortunes] = useState<Record<string, FortuneData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [monthlyFortune, setMonthlyFortune] = useState<FortuneData | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  const fetchFortune = useCallback(async (category: FortuneCategory) => {
    const key = `${activeTrack}_${category}`;
    if (fortunes[key] || loading[key]) return;

    setLoading((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: '' }));

    try {
      const res = await fetch('/api/my-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: activeTrack, category }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to load fortune.');
      }

      const { fortune } = await res.json();
      if (category === 'monthly') {
        setMonthlyFortune(fortune);
      } else {
        setFortunes((prev) => ({ ...prev, [key]: fortune }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred.';
      setErrors((prev) => ({ ...prev, [key]: message }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, [activeTrack, fortunes, loading]);

  // No chart data yet
  if (availableTracks.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-12 text-center">
        <div className="text-4xl">🥠</div>
        <h1 className="text-xl font-bold text-foreground">Get Started with Your Personalized Fortune</h1>
        <p className="text-sm text-foreground/60">
          First, enter your birth details to create your chart.
        </p>
        <div className="mx-auto flex max-w-xs flex-col gap-3">
          <Link
            href="/saju"
            className="rounded-xl border border-gold/30 bg-gold/20 px-4 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/30"
          >
            🔮 Enter Four Pillars (Saju)
          </Link>
          <Link
            href="/horoscope/birth-chart"
            className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm font-medium text-foreground/60 transition-colors hover:bg-background/60"
          >
            🌌 Enter Natal Chart
          </Link>
        </div>
      </div>
    );
  }

  // Onboarding
  if (showOnboarding) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-8">
        <div className="space-y-2 text-center">
          <div className="text-3xl">🥠</div>
          <h1 className="text-lg font-bold text-foreground">Tell Us About Yourself</h1>
          <p className="text-xs text-foreground/60">
            Answer a few questions and your very first fortune will be personalized.
          </p>
        </div>
        <OnboardingQuestions onComplete={() => setShowOnboarding(false)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 py-4">
      {/* Track selector (if multiple) */}
      {availableTracks.length > 1 && (
        <div className="flex justify-center gap-2">
          {availableTracks.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTrack(t)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                activeTrack === t
                  ? 'border-gold/40 bg-gold/20 text-gold'
                  : 'border-border bg-background/30 text-foreground/60 hover:border-foreground/20'
              }`}
            >
              {t === 'saju' ? '🔮 Four Pillars' : '🌌 Natal Chart'}
            </button>
          ))}
        </div>
      )}

      {/* Daily check-in */}
      <DailyCheckIn />

      {/* Category fortune cards */}
      <div className="space-y-3">
        {CATEGORY_ORDER.map((category) => {
          const key = `${activeTrack}_${category}`;
          const fortune = fortunes[key];
          const isLoading = loading[key];
          const error = errors[key];

          return (
            <FortuneCard
              key={key}
              category={category}
              fortune={fortune}
              loading={isLoading}
              error={error}
              onRequest={() => fetchFortune(category)}
            />
          );
        })}
      </div>

      {/* Monthly fortune */}
      <div className="pt-2">
        <FortuneCard
          category="monthly"
          fortune={monthlyFortune ?? undefined}
          loading={monthlyLoading}
          error={errors[`${activeTrack}_monthly`]}
          onRequest={() => {
            setMonthlyLoading(true);
            fetchFortune('monthly').finally(() => setMonthlyLoading(false));
          }}
        />
      </div>
    </div>
  );
}

function FortuneCard({
  category,
  fortune,
  loading,
  error,
  onRequest,
}: {
  category: FortuneCategory;
  fortune?: FortuneData;
  loading?: boolean;
  error?: string;
  onRequest: () => void;
}) {
  const emoji = CATEGORY_EMOJIS[category];
  const label = FORTUNE_CATEGORY_LABELS[category];

  if (fortune) {
    return (
      <div className="animate-fade-in-up space-y-2 rounded-xl border border-border bg-background/40 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            {emoji} {fortune.title}
          </h3>
          <IntensityStars value={fortune.intensity} />
        </div>
        <p className="text-sm leading-relaxed text-foreground/60">{fortune.content}</p>
        {fortune.luckyElement && (
          <p className="text-xs text-foreground/40">Lucky element: {fortune.luckyElement}</p>
        )}
        {fortune.luckyPlanet && (
          <p className="text-xs text-foreground/40">Lucky planet: {fortune.luckyPlanet}</p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onRequest}
      disabled={loading}
      className="w-full rounded-xl border border-border bg-background/30 p-4 text-left transition-colors hover:bg-background/50 disabled:opacity-50"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/60">
          {emoji} {label}
        </span>
        {loading ? (
          <span className="animate-pulse text-xs text-foreground/40">Generating...</span>
        ) : error ? (
          <span className="text-xs text-red-400">{error}</span>
        ) : (
          <span className="text-xs text-gold">View fortune →</span>
        )}
      </div>
    </button>
  );
}
