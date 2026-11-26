"use client";

import { useState, useEffect, useCallback } from 'react';

interface PremiumState {
  isPremium: boolean;
  loading: boolean;
  subscribe: () => Promise<void>;
  /** Requests an emailed sign-in link; resolves to a message to show the user. */
  restore: (email: string) => Promise<string>;
  manageSubscription: () => Promise<void>;
}

export function usePremium(): PremiumState {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/subscribe/status', {
          credentials: 'same-origin',
        });
        if (res.ok) {
          const { isPremium: premium } = await res.json();
          setIsPremium(premium);
        } else {
          setIsPremium(false);
        }
      } catch {
        setIsPremium(false);
      }
      setLoading(false);
    }

    checkStatus();
  }, []);

  const subscribe = useCallback(async () => {
    const res = await fetch('/api/subscribe/checkout', {
      method: 'POST',
      credentials: 'same-origin',
    });
    if (!res.ok) throw new Error('Failed to start checkout');
    const { url } = await res.json();
    window.location.href = url;
  }, []);

  const restore = useCallback(async (email: string): Promise<string> => {
    const res = await fetch('/api/subscribe/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'same-origin',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return body.error || 'Failed to restore subscription.';
    }
    // Access is granted only after the user clicks the emailed sign-in link
    return body.message || 'Check your email for a sign-in link.';
  }, []);

  const manageSubscription = useCallback(async () => {
    const res = await fetch('/api/subscribe/portal', {
      method: 'POST',
      credentials: 'same-origin',
    });
    if (!res.ok) return;
    const { url } = await res.json();
    window.location.href = url;
  }, []);

  return { isPremium, loading, subscribe, restore, manageSubscription };
}
