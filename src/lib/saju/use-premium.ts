"use client";

import { useState, useEffect, useCallback } from 'react';
import { getPremiumToken, savePremiumToken, clearPremiumToken } from './premium';

interface PremiumState {
  isPremium: boolean;
  loading: boolean;
  subscribe: () => Promise<void>;
  restore: (email: string) => Promise<string | null>;
  manageSubscription: () => Promise<void>;
}

export function usePremium(): PremiumState {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const token = getPremiumToken();
      if (!token) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      // Try to refresh if we have a token
      try {
        const res = await fetch('/api/subscribe/refresh', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const { token: newToken } = await res.json();
          savePremiumToken(newToken);
          setIsPremium(true);
        } else {
          clearPremiumToken();
          setIsPremium(false);
        }
      } catch {
        // Network error — trust existing token if present
        setIsPremium(!!token);
      }
      setLoading(false);
    }

    checkToken();
  }, []);

  const subscribe = useCallback(async () => {
    const res = await fetch('/api/subscribe/checkout', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start checkout');
    const { url } = await res.json();
    window.location.href = url;
  }, []);

  const restore = useCallback(async (email: string): Promise<string | null> => {
    const res = await fetch('/api/subscribe/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return body.error || 'Failed to restore subscription.';
    }
    const { token } = await res.json();
    savePremiumToken(token);
    setIsPremium(true);
    return null;
  }, []);

  const manageSubscription = useCallback(async () => {
    const token = getPremiumToken();
    if (!token) return;
    const res = await fetch('/api/subscribe/portal', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const { url } = await res.json();
    window.location.href = url;
  }, []);

  return { isPremium, loading, subscribe, restore, manageSubscription };
}
