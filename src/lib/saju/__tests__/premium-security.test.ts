import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

beforeAll(() => {
  process.env.PREMIUM_JWT_SECRET = 'test-secret-for-vitest-minimum-256-bits-long-enough';
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
});

const subscriptionsList = vi.fn();
const customersList = vi.fn();
vi.mock('stripe', () => ({
  default: class {
    subscriptions = { list: subscriptionsList };
    customers = { list: customersList };
  },
}));

import {
  signPremiumToken,
  verifyPremiumToken,
  signRestoreToken,
  verifyRestoreToken,
  PREMIUM_COOKIE_NAME,
} from '@/lib/saju/premium';
import {
  hasActiveSubscription,
  findActiveCustomerByEmail,
  _clearSubscriptionCache,
} from '@/lib/saju/subscription';
import { requirePremium } from '@/lib/saju/require-premium';

const active = { data: [{ id: 'sub_1' }] };
const none = { data: [] };

beforeEach(() => {
  subscriptionsList.mockReset();
  customersList.mockReset();
  _clearSubscriptionCache();
});

describe('token purpose separation', () => {
  it('restore tokens are not accepted as premium sessions', async () => {
    const restoreToken = await signRestoreToken('cus_1');
    expect(await verifyPremiumToken(restoreToken)).toBeNull();
    expect(await verifyRestoreToken(restoreToken)).toBe('cus_1');
  });

  it('premium session tokens are not accepted as restore links', async () => {
    const session = await signPremiumToken('cus_1');
    expect(await verifyRestoreToken(session)).toBeNull();
    expect(await verifyPremiumToken(session)).toMatchObject({ customerId: 'cus_1' });
  });

  it('rejects tampered restore tokens', async () => {
    const token = await signRestoreToken('cus_1');
    expect(await verifyRestoreToken(token.slice(0, -2) + 'xx')).toBeNull();
  });
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

describe('findActiveCustomerByEmail', () => {
  it('finds the active customer among duplicates for the same email', async () => {
    customersList.mockResolvedValue({
      data: [{ id: 'cus_old', email: 'a@b.co' }, { id: 'cus_new', email: 'a@b.co' }],
    });
    subscriptionsList.mockImplementation(async ({ customer }: { customer: string }) =>
      customer === 'cus_new' ? active : none,
    );
    expect(await findActiveCustomerByEmail('a@b.co')).toEqual({ id: 'cus_new', email: 'a@b.co' });
  });

  it('returns null when nobody is subscribed', async () => {
    customersList.mockResolvedValue({ data: [] });
    expect(await findActiveCustomerByEmail('x@y.co')).toBeNull();
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

  it('401 for a restore token used as a session', async () => {
    const res = await requirePremium(reqWithCookie(await signRestoreToken('cus_1')));
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
