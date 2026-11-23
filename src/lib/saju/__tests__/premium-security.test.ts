import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

beforeAll(() => {
  process.env.PREMIUM_JWT_SECRET = 'test-secret-for-vitest-minimum-256-bits-long-enough';
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
});

const subscriptionsList = vi.fn();
vi.mock('stripe', () => ({
  default: class {
    subscriptions = { list: subscriptionsList };
  },
}));

import { signPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { hasActiveSubscription, _clearSubscriptionCache } from '@/lib/saju/subscription';
import { requirePremium } from '@/lib/saju/require-premium';

const active = { data: [{ id: 'sub_1' }] };
const none = { data: [] };

beforeEach(() => {
  subscriptionsList.mockReset();
  _clearSubscriptionCache();
});

describe('hasActiveSubscription', () => {
  it('caches the Stripe lookup per customer', async () => {
    subscriptionsList.mockResolvedValue(active);
    expect(await hasActiveSubscription('cus_1')).toBe(true);
    expect(await hasActiveSubscription('cus_1')).toBe(true);
    expect(subscriptionsList).toHaveBeenCalledTimes(1);
  });

  it('returns false when no active subscription', async () => {
    subscriptionsList.mockResolvedValue(none);
    expect(await hasActiveSubscription('cus_2')).toBe(false);
  });
});

describe('requirePremium', () => {
  function reqWithCookie(token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers.cookie = `${PREMIUM_COOKIE_NAME}=${token}`;
    return new NextRequest('https://example.com/api/x', { method: 'POST', headers });
  }

  it('401 without cookie', async () => {
    const res = await requirePremium(reqWithCookie());
    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(401);
  });

  it('403 and clears cookie when subscription was cancelled', async () => {
    subscriptionsList.mockResolvedValue(none);
    const res = (await requirePremium(reqWithCookie(await signPremiumToken('cus_1')))) as Response;
    expect(res.status).toBe(403);
    expect(res.headers.get('set-cookie')).toContain(`${PREMIUM_COOKIE_NAME}=;`);
  });

  it('returns payload for an active subscriber', async () => {
    subscriptionsList.mockResolvedValue(active);
    const res = await requirePremium(reqWithCookie(await signPremiumToken('cus_1')));
    expect(res).toMatchObject({ customerId: 'cus_1', status: 'active' });
  });
});
