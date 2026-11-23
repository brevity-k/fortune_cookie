// src/lib/saju/subscription.ts — server-side only
import Stripe from 'stripe';

const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 5000;
const cache = new Map<string, { active: boolean; expiresAt: number }>();

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(secretKey);
}

/**
 * Whether the Stripe customer currently has an active subscription.
 * Cached briefly per instance so cancellations take effect within CACHE_TTL_MS
 * without a Stripe round-trip on every premium request.
 */
export async function hasActiveSubscription(customerId: string): Promise<boolean> {
  const now = Date.now();
  const cached = cache.get(customerId);
  if (cached && cached.expiresAt > now) return cached.active;

  const subscriptions = await getStripe().subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });
  const active = subscriptions.data.length > 0;

  if (cache.size >= MAX_CACHE_ENTRIES) cache.clear();
  cache.set(customerId, { active, expiresAt: now + CACHE_TTL_MS });
  return active;
}

/** Test-only: reset the per-instance cache. */
export function _clearSubscriptionCache(): void {
  cache.clear();
}
