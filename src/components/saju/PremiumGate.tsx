"use client";

import { useState } from "react";

interface Props {
  isPremium: boolean;
  loading: boolean;
  onSubscribe: () => Promise<void>;
  onRestore: (email: string) => Promise<string | null>;
  children: React.ReactNode;
}

export default function PremiumGate({ isPremium, loading, onSubscribe, onRestore, children }: Props) {
  const [showRestore, setShowRestore] = useState(false);
  const [email, setEmail] = useState("");
  const [restoreError, setRestoreError] = useState("");
  const [restoring, setRestoring] = useState(false);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 animate-pulse">
        <div className="h-6 w-48 rounded bg-white/5 mb-4" />
        <div className="h-4 w-full rounded bg-white/5 mb-2" />
        <div className="h-4 w-3/4 rounded bg-white/5" />
      </div>
    );
  }

  if (isPremium) return <>{children}</>;

  async function handleRestore() {
    setRestoring(true);
    setRestoreError("");
    const err = await onRestore(email);
    if (err) setRestoreError(err);
    setRestoring(false);
  }

  return (
    <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 text-center">
      <h3 className="text-xl font-bold text-gold mb-2">
        Unlock Daily Personalized Readings
      </h3>
      <p className="text-sm text-foreground/50 mb-4">
        Get daily fortune readings, monthly outlooks, compatibility checks, and more
        — all personalized to your unique birth chart.
      </p>
      <div className="text-3xl font-bold text-gold mb-1">$2.99<span className="text-sm font-normal text-foreground/40">/month</span></div>
      <p className="text-xs text-foreground/30 mb-6">Cancel anytime</p>
      <button
        onClick={onSubscribe}
        className="rounded-lg bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
      >
        Go Premium
      </button>

      <div className="mt-4">
        {!showRestore ? (
          <button
            onClick={() => setShowRestore(true)}
            className="text-xs text-foreground/30 underline underline-offset-2 hover:text-foreground/50 transition"
          >
            Already subscribed?
          </button>
        ) : (
          <div className="mt-2 flex flex-col items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full max-w-xs rounded-lg border border-border bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold/40 focus:outline-none"
            />
            {restoreError && <p className="text-xs text-red-400">{restoreError}</p>}
            <button
              onClick={handleRestore}
              disabled={restoring || !email}
              className="text-sm text-gold underline underline-offset-2 hover:text-gold-light disabled:opacity-50"
            >
              {restoring ? "Restoring..." : "Restore subscription"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
