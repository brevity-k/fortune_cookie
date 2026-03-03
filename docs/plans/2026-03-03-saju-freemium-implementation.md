# Saju Freemium Subscription — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Stripe-powered $2.99/month subscription that gates daily personalized saju readings and 5 other premium features behind payment, using JWT tokens in localStorage with no database.

**Architecture:** Stripe Checkout for payment, signed JWT tokens in localStorage for auth, on-demand Claude API calls for premium content, all premium endpoints verify JWT before serving. Stripe is the single source of truth for subscription status.

**Tech Stack:** Next.js 16, TypeScript, Stripe (`stripe` + `@stripe/stripe-js`), `jose` (JWT), Vitest, existing saju calculation engine.

**Design Doc:** `docs/plans/2026-03-03-saju-freemium-subscription-design.md`

---

## Phase 0: Dependencies & Infrastructure

### Task 0.1: Install dependencies and add environment variables

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

**Step 1:** Install packages
```bash
npm install stripe @stripe/stripe-js jose
```

**Step 2:** Add to `.env.example`
```bash
# Stripe (https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Premium JWT
PREMIUM_JWT_SECRET=your-random-256-bit-secret
```

**Step 3:** Run `npm run build` — expect PASS (no code changes yet)

**Step 4:** Commit: `chore: add stripe and jose dependencies`

---

### Task 0.2: Create JWT helper module

**Files:**
- Create: `src/lib/saju/premium.ts`
- Test: `src/lib/saju/__tests__/premium.test.ts`

**Step 1: Write tests**
```ts
import { describe, it, expect, vi } from 'vitest';

// Mock jose module
vi.mock('jose', () => ({
  SignJWT: class {
    private payload: Record<string, unknown>;
    constructor(payload: Record<string, unknown>) { this.payload = payload; }
    setProtectedHeader() { return this; }
    setIssuedAt() { return this; }
    setExpirationTime() { return this; }
    async sign() { return 'mock.jwt.token'; }
  },
  jwtVerify: async (_token: string, _secret: Uint8Array) => ({
    payload: { customerId: 'cus_test', status: 'active' },
  }),
}));

describe('premium token helpers', () => {
  it('signPremiumToken returns a string', async () => {
    const { signPremiumToken } = await import('@/lib/saju/premium');
    const token = await signPremiumToken('cus_test');
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('verifyPremiumToken returns payload', async () => {
    const { verifyPremiumToken } = await import('@/lib/saju/premium');
    const payload = await verifyPremiumToken('mock.jwt.token');
    expect(payload).toEqual({ customerId: 'cus_test', status: 'active' });
  });

  it('verifyPremiumToken returns null for invalid token', async () => {
    const { jwtVerify } = await import('jose');
    vi.mocked(jwtVerify).mockRejectedValueOnce(new Error('invalid'));
    const { verifyPremiumToken } = await import('@/lib/saju/premium');
    const payload = await verifyPremiumToken('bad-token');
    expect(payload).toBeNull();
  });

  it('getPremiumToken returns null on server', () => {
    const { getPremiumToken } = require('@/lib/saju/premium');
    // In test env (no window), should return null
    expect(getPremiumToken()).toBeNull();
  });
});
```

**Step 2:** Run tests — expect FAIL (module not found)

**Step 3: Write implementation**
```ts
// src/lib/saju/premium.ts
import { SignJWT, jwtVerify } from 'jose';

const STORAGE_KEY = 'saju_premium_token';
const TOKEN_EXPIRY = '24h';

function getSecret(): Uint8Array {
  const secret = process.env.PREMIUM_JWT_SECRET;
  if (!secret) throw new Error('PREMIUM_JWT_SECRET not set');
  return new TextEncoder().encode(secret);
}

export interface PremiumPayload {
  customerId: string;
  status: 'active' | 'cancelled';
}

export async function signPremiumToken(customerId: string): Promise<string> {
  return new SignJWT({ customerId, status: 'active' } as PremiumPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());
}

export async function verifyPremiumToken(token: string): Promise<PremiumPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as PremiumPayload;
  } catch {
    return null;
  }
}

export function savePremiumToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, token);
  }
}

export function getPremiumToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function clearPremiumToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
```

**Step 4:** Run tests — expect PASS

**Step 5:** Commit: `feat(saju): add JWT premium token helpers`

---

## Phase 1: Stripe Payment Flow

### Task 1.1: Checkout session API route

**Files:**
- Create: `src/app/api/subscribe/checkout/route.ts`

**Step 1: Write route**
```ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!secretKey || !priceId) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/saju?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/saju`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add Stripe checkout session route`

---

### Task 1.2: Session verification API route

**Files:**
- Create: `src/app/api/subscribe/verify/route.ts`

**Step 1: Write route**
```ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';
import { signPremiumToken } from '@/lib/saju/premium';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing session ID.' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' || !session.customer) {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 400 });
    }

    const customerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer.id;

    const token = await signPremiumToken(customerId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add payment verification route`

---

### Task 1.3: Token refresh API route

**Files:**
- Create: `src/app/api/subscribe/refresh/route.ts`

**Step 1: Write route**
```ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken, signPremiumToken } from '@/lib/saju/premium';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided.' }, { status: 401 });
    }

    // Decode token even if expired to get customerId
    let customerId: string;
    try {
      const payload = await verifyPremiumToken(token);
      if (payload) {
        customerId = payload.customerId;
      } else {
        // Token expired — try to decode without verification
        const parts = token.split('.');
        const decoded = JSON.parse(atob(parts[1]));
        customerId = decoded.customerId;
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    if (!customerId) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Check Stripe subscription status
    const stripe = new Stripe(secretKey);
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription.' }, { status: 403 });
    }

    const newToken = await signPremiumToken(customerId);
    return NextResponse.json({ token: newToken });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token.' },
      { status: 500 }
    );
  }
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add token refresh route`

---

### Task 1.4: Subscription restore API route

**Files:**
- Create: `src/app/api/subscribe/restore/route.ts`

**Step 1: Write route**
```ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';
import { signPremiumToken } from '@/lib/saju/premium';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'No subscription found for this email.' },
        { status: 404 }
      );
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found.' },
        { status: 404 }
      );
    }

    const token = await signPremiumToken(customer.id);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore subscription.' },
      { status: 500 }
    );
  }
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add subscription restore route`

---

### Task 1.5: Stripe Customer Portal route

**Files:**
- Create: `src/app/api/subscribe/portal/route.ts`

**Step 1: Write route**
```ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken } from '@/lib/saju/premium';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided.' }, { status: 401 });
    }

    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.billingPortal.sessions.create({
      customer: payload.customerId,
      return_url: `${origin}/saju`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to open billing portal.' },
      { status: 500 }
    );
  }
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add Stripe customer portal route`

---

## Phase 2: Premium Content API Routes

### Task 2.1: Shared premium route helper

**Files:**
- Create: `src/lib/saju/prompts.ts`

Centralize Claude prompt templates and the premium route pattern.

**Step 1: Write prompts module**
```ts
// src/lib/saju/prompts.ts
import type { SajuChart, Pillar } from './types';
import { formatPillar } from './format';

export function buildDailyPrompt(chart: SajuChart, todayPillar: Pillar): string {
  const today = formatPillar(todayPillar);
  const dayMaster = formatPillar(chart.fourPillars.day);
  return `You are a Korean 사주 fortune advisor. Based on the user's birth chart and today's cosmic energy, write a personalized daily reading.

User's Day Master: ${dayMaster.stemHanja} (${dayMaster.stemElement}, ${dayMaster.yinYang})
Favorable Element: ${chart.fiveElements.favorableElement}
Day Master Strength: ${chart.fiveElements.isStrong ? 'Strong' : 'Weak'}

Today's Pillar: ${today.stemHanja}${today.branchHanja} (${today.stemElement} ${today.branchAnimal})

Explain how today's energy interacts with the user's chart. Cover:
1. Overall energy for today (2-3 sentences)
2. Work/career advice (1-2 sentences)
3. Relationships (1-2 sentences)
4. One specific actionable tip

Be warm, specific, and reference the actual elements. Respond in JSON:
{
  "energy": "...",
  "career": "...",
  "relationships": "...",
  "tip": "...",
  "favorableTime": "morning|afternoon|evening"
}`;
}

export function buildMonthlyPrompt(chart: SajuChart, monthPillar: Pillar): string {
  const month = formatPillar(monthPillar);
  const dayMaster = formatPillar(chart.fourPillars.day);
  return `You are a Korean 사주 fortune advisor. Write a monthly outlook based on this month's pillar and the user's birth chart.

User's Day Master: ${dayMaster.stemHanja} (${dayMaster.stemElement}, ${dayMaster.yinYang})
Favorable Element: ${chart.fiveElements.favorableElement}
Element Balance: Wood ${chart.fiveElements.counts.wood}, Fire ${chart.fiveElements.counts.fire}, Earth ${chart.fiveElements.counts.earth}, Metal ${chart.fiveElements.counts.metal}, Water ${chart.fiveElements.counts.water}

This Month's Pillar: ${month.stemHanja}${month.branchHanja} (${month.stemElement} ${month.branchAnimal})

Write a detailed monthly reading covering:
1. Overall theme (2-3 sentences)
2. Career opportunities and cautions (2-3 sentences)
3. Love and relationships (2-3 sentences)
4. Health focus (1-2 sentences)
5. Key dates or periods to watch (1-2 sentences)
6. Practical monthly advice (1-2 sentences)

Respond in JSON:
{
  "theme": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "keyDates": "...",
  "advice": "..."
}`;
}

export function buildYearlyPrompt(chart: SajuChart, yearPillar: Pillar): string {
  const year = formatPillar(yearPillar);
  const dayMaster = formatPillar(chart.fourPillars.day);
  return `You are a Korean 사주 fortune advisor. Write a comprehensive yearly forecast.

User's Day Master: ${dayMaster.stemHanja} (${dayMaster.stemElement}, ${dayMaster.yinYang})
Favorable Element: ${chart.fiveElements.favorableElement}
Day Master Strength: ${chart.fiveElements.isStrong ? 'Strong' : 'Weak'}
Birth Chart: ${JSON.stringify(chart.fourPillars)}
Element Balance: Wood ${chart.fiveElements.counts.wood}, Fire ${chart.fiveElements.counts.fire}, Earth ${chart.fiveElements.counts.earth}, Metal ${chart.fiveElements.counts.metal}, Water ${chart.fiveElements.counts.water}

This Year's Pillar: ${year.stemHanja}${year.branchHanja} (${year.stemElement} ${year.branchAnimal})

Write a deep yearly forecast covering:
1. Year overview and main theme (3-4 sentences)
2. Career and finances (3-4 sentences)
3. Love and relationships (3-4 sentences)
4. Health and wellness (2-3 sentences)
5. Best months and challenging months (2-3 sentences)
6. Year-long strategic advice (2-3 sentences)

Respond in JSON:
{
  "overview": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "timing": "...",
  "strategy": "..."
}`;
}

export function buildCompatibilityPrompt(
  chartA: SajuChart,
  chartB: SajuChart
): string {
  const dayMasterA = formatPillar(chartA.fourPillars.day);
  const dayMasterB = formatPillar(chartB.fourPillars.day);
  return `You are a Korean 사주 compatibility advisor. Compare these two birth charts.

Person A — Day Master: ${dayMasterA.stemHanja} (${dayMasterA.stemElement}, ${dayMasterA.yinYang}), Favorable: ${chartA.fiveElements.favorableElement}
Person B — Day Master: ${dayMasterB.stemHanja} (${dayMasterB.stemElement}, ${dayMasterB.yinYang}), Favorable: ${chartB.fiveElements.favorableElement}

Person A Elements: Wood ${chartA.fiveElements.counts.wood}, Fire ${chartA.fiveElements.counts.fire}, Earth ${chartA.fiveElements.counts.earth}, Metal ${chartA.fiveElements.counts.metal}, Water ${chartA.fiveElements.counts.water}
Person B Elements: Wood ${chartB.fiveElements.counts.wood}, Fire ${chartB.fiveElements.counts.fire}, Earth ${chartB.fiveElements.counts.earth}, Metal ${chartB.fiveElements.counts.metal}, Water ${chartB.fiveElements.counts.water}

Analyze their compatibility covering:
1. Overall harmony (2-3 sentences)
2. Communication style match (2-3 sentences)
3. Emotional compatibility (2-3 sentences)
4. Potential challenges (2-3 sentences)
5. Advice for the relationship (2-3 sentences)

Also provide a compatibility score from 1-100.

Respond in JSON:
{
  "harmony": "...",
  "communication": "...",
  "emotional": "...",
  "challenges": "...",
  "advice": "...",
  "score": 75
}`;
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add Claude prompt templates for premium readings`

---

### Task 2.2: Daily reading premium route

**Files:**
- Create: `src/app/api/saju/daily/route.ts`

**Step 1: Write route**
```ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken } from '@/lib/saju/premium';
import { getCurrentDayPillar } from '@/lib/saju/current-luck';
import { buildDailyPrompt } from '@/lib/saju/prompts';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Premium check
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Premium subscription required.' }, { status: 401 });
    }
    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service is not configured.' }, { status: 503 });
    }

    const { chart } = await req.json();
    if (!chart?.fourPillars || !chart?.fiveElements) {
      return NextResponse.json({ error: 'Missing chart data.' }, { status: 400 });
    }

    const todayPillar = getCurrentDayPillar();
    const prompt = buildDailyPrompt(chart, todayPillar);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 512,
      system: prompt,
      messages: [{ role: 'user', content: 'Please provide my daily saju reading.' }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No reading generated.' }, { status: 500 });
    }

    let parsed;
    try {
      const jsonStr = textBlock.text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Failed to parse reading.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Daily reading error:', error);
    return NextResponse.json({ error: 'Failed to generate daily reading.' }, { status: 500 });
  }
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add daily reading premium route`

---

### Task 2.3: Monthly, yearly, compatibility, lucky-days, timing routes

**Files:**
- Create: `src/app/api/saju/monthly/route.ts`
- Create: `src/app/api/saju/yearly/route.ts`
- Create: `src/app/api/saju/compatibility/route.ts`
- Create: `src/app/api/saju/lucky-days/route.ts`
- Create: `src/app/api/saju/timing/route.ts`

All follow the same pattern as the daily route. Key differences:

**Monthly:** Uses `buildMonthlyPrompt`, `getCurrentMonthPillar()`, `max_tokens: 768`

**Yearly:** Uses `buildYearlyPrompt`, `getCurrentYearPillar()`, `max_tokens: 1024`

**Compatibility:** Uses `buildCompatibilityPrompt`, takes `{ chartA, chartB }` in body, `max_tokens: 768`

**Lucky days:** Pure calculation, no Claude API. Computes next 7 days' pillars via `calculateDayPillar` and rates each against user's favorable/unfavorable elements. Returns `{ days: [{ date, pillar, rating: 'favorable'|'neutral'|'challenging' }] }`.

**Timing:** Uses `buildMonthlyPrompt` variant focused on career/love timing with current 대운 context. `max_tokens: 768`.

**Step 1:** Create all 5 routes following the daily route pattern above. Lucky-days is the only one without a Claude API call.

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add monthly, yearly, compatibility, lucky-days, and timing routes`

---

## Phase 3: UI Components

### Task 3.1: Premium subscription hook

**Files:**
- Create: `src/lib/saju/use-premium.ts`

Client-side hook for managing premium state.

**Step 1: Write hook**
```ts
// src/lib/saju/use-premium.ts
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
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add usePremium client hook`

---

### Task 3.2: PremiumGate component

**Files:**
- Create: `src/components/saju/PremiumGate.tsx`

**Step 1: Write component**
```tsx
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
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add PremiumGate component`

---

### Task 3.3: DailyReading premium component

**Files:**
- Create: `src/components/saju/DailyReading.tsx`

Follows `SajuInterpretation.tsx` pattern — fetch, cache in localStorage, show loading/error/content states.

**Step 1: Write component**
```tsx
"use client";

import { useState, useEffect } from "react";
import type { SajuChart } from "@/lib/saju/types";
import { getPremiumToken } from "@/lib/saju/premium";

interface DailyReadingData {
  energy: string;
  career: string;
  relationships: string;
  tip: string;
  favorableTime: string;
}

const CACHE_KEY = "saju_daily_reading";

function getCached(): DailyReadingData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    if (cached.date === new Date().toISOString().slice(0, 10)) return cached.data;
    return null;
  } catch { return null; }
}

function cache(data: DailyReadingData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    date: new Date().toISOString().slice(0, 10),
    data,
  }));
}

const SECTIONS: { key: keyof DailyReadingData; label: string; icon: string }[] = [
  { key: "energy", label: "Today's Energy", icon: "⚡" },
  { key: "career", label: "Work & Career", icon: "💼" },
  { key: "relationships", label: "Relationships", icon: "💕" },
  { key: "tip", label: "Today's Tip", icon: "💡" },
];

interface Props {
  chart: SajuChart;
}

export default function DailyReading({ chart }: Props) {
  const [reading, setReading] = useState<DailyReadingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = getCached();
    if (cached) { setReading(cached); return; }

    async function fetchReading() {
      setLoading(true);
      setError("");
      const token = getPremiumToken();
      try {
        const res = await fetch("/api/saju/daily", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chart }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to get daily reading.");
        }
        const data = await res.json();
        setReading(data);
        cache(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchReading();
  }, [chart]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gold/20 bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-gold">Daily Personalized Reading</h3>
        <div className="space-y-4">
          {SECTIONS.map(({ key }) => (
            <div key={key} className="animate-pulse">
              <div className="h-4 w-32 rounded bg-white/5 mb-2" />
              <div className="h-3 w-full rounded bg-white/5 mb-1" />
              <div className="h-3 w-3/4 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-2 text-lg font-semibold text-gold">Daily Reading</h3>
        <p className="text-sm text-foreground/40">{error}</p>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="rounded-2xl border border-gold/20 bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gold">Daily Personalized Reading</h3>
        <span className="text-xs text-gold/40 bg-gold/10 px-2 py-1 rounded-full">Premium</span>
      </div>
      <div className="space-y-4">
        {SECTIONS.map(({ key, label, icon }) => {
          const text = reading[key];
          if (!text) return null;
          return (
            <div key={key} className="rounded-xl border border-border/20 bg-white/3 p-4">
              <div className="mb-1 text-sm font-medium text-gold/70">{icon} {label}</div>
              <p className="text-sm text-foreground/60 leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
      {reading.favorableTime && (
        <p className="mt-4 text-center text-xs text-foreground/30">
          Best time of day: <span className="capitalize text-gold/50">{reading.favorableTime}</span>
        </p>
      )}
    </div>
  );
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add DailyReading premium component`

---

### Task 3.4: Remaining premium components (MonthlyOutlook, YearlyForecast, CompatibilityCheck, LuckyDayCalendar)

**Files:**
- Create: `src/components/saju/MonthlyOutlook.tsx`
- Create: `src/components/saju/YearlyForecast.tsx`
- Create: `src/components/saju/CompatibilityCheck.tsx`
- Create: `src/components/saju/LuckyDayCalendar.tsx`

All follow the exact same pattern as `DailyReading.tsx`: fetch from their respective API endpoint, cache in localStorage with appropriate expiry, show loading/error/content states.

**CompatibilityCheck** is unique — it includes a mini form for entering the second person's birth data (year/month/day/gender) before fetching.

**LuckyDayCalendar** is unique — it shows a 7-day grid with color-coded ratings (green=favorable, yellow=neutral, red=challenging).

**Step 1:** Create all 4 components.

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add monthly, yearly, compatibility, and lucky-day components`

---

### Task 3.5: SubscriptionManager component

**Files:**
- Create: `src/components/saju/SubscriptionManager.tsx`

Small component showing subscription status and manage/cancel links.

**Step 1: Write component**
```tsx
"use client";

interface Props {
  onManage: () => Promise<void>;
}

export default function SubscriptionManager({ onManage }: Props) {
  return (
    <div className="text-center space-y-2">
      <span className="inline-block text-xs text-gold/40 bg-gold/10 px-3 py-1 rounded-full">
        Premium Active
      </span>
      <div>
        <button
          onClick={onManage}
          className="text-xs text-foreground/30 underline underline-offset-2 hover:text-foreground/50 transition"
        >
          Manage subscription
        </button>
      </div>
    </div>
  );
}
```

**Step 2:** Run `npm run build` — expect PASS

**Step 3:** Commit: `feat(saju): add SubscriptionManager component`

---

## Phase 4: Dashboard Integration

### Task 4.1: Integrate premium features into SajuDashboard

**Files:**
- Modify: `src/app/saju/SajuDashboard.tsx`

**Step 1:** Add imports and hook
```tsx
import { usePremium } from "@/lib/saju/use-premium";
import PremiumGate from "@/components/saju/PremiumGate";
import DailyReading from "@/components/saju/DailyReading";
import LuckyDayCalendar from "@/components/saju/LuckyDayCalendar";
import SubscriptionManager from "@/components/saju/SubscriptionManager";
```

**Step 2:** Add `usePremium()` hook call inside the component, after `useState`.

**Step 3:** Add premium sections to the dashboard after the existing free content:
```tsx
{/* Premium: Daily Reading */}
<PremiumGate
  isPremium={isPremium}
  loading={premiumLoading}
  onSubscribe={subscribe}
  onRestore={restore}
>
  <DailyReading chart={chart} />
</PremiumGate>

{/* Premium: Lucky Day Calendar */}
{isPremium && <LuckyDayCalendar chart={chart} />}

{/* Subscription Manager (for premium users) */}
{isPremium && <SubscriptionManager onManage={manageSubscription} />}
```

**Step 4:** Handle `session_id` query param on redirect back from Stripe checkout. Use `useSearchParams` to detect `session_id`, call `/api/subscribe/verify`, save token.

**Step 5:** Run `npm run build` — expect PASS

**Step 6:** Commit: `feat(saju): integrate premium features into dashboard`

---

### Task 4.2: Handle Stripe checkout redirect

**Files:**
- Modify: `src/app/saju/SajuDashboard.tsx`

**Step 1:** Add `useSearchParams` from `next/navigation` and effect to verify session on redirect:
```tsx
const searchParams = useSearchParams();

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
        // Remove session_id from URL
        window.history.replaceState({}, '', '/saju');
        window.location.reload();
      }
    } catch { /* silent fail — user can retry */ }
  }

  verifySession();
}, [searchParams]);
```

**Step 2:** Run `npm run build` — expect PASS. Note: may need `<Suspense>` wrapper for `useSearchParams`.

**Step 3:** Commit: `feat(saju): handle Stripe checkout redirect`

---

## Phase 5: Environment & Verification

### Task 5.1: Update .env.example and run full verification

**Files:**
- Modify: `.env.example`

**Step 1:** Add Stripe and JWT env vars to `.env.example`

**Step 2:** Run full verification:
```bash
npm test        # All saju tests pass
npm run build   # No type errors
npm run lint    # No new warnings
```

**Step 3:** Commit: `chore: add Stripe env vars to .env.example`

---

## Verification Checklist

1. `npm test` — all tests pass
2. `npm run build` — no type errors
3. `npm run lint` — no new warnings
4. Free tier works without Stripe keys (graceful 503)
5. Premium gate shows when not subscribed
6. Stripe checkout redirect works (requires test Stripe keys)
7. Token refresh works on page reload
8. Daily reading caches in localStorage for 24h
9. "Already subscribed?" restore flow works
10. "Manage subscription" opens Stripe portal

---

## Key Decisions

| Decision | Rationale |
|---|---|
| `jose` over `jsonwebtoken` | Edge-runtime compatible, smaller bundle |
| 24h token expiry | Balance between Stripe API calls and access revocation speed |
| localStorage cache per feature | Minimizes redundant API calls, each feature has own TTL |
| Lucky days is pure calculation | No AI cost, high engagement, fast response |
| Single `usePremium` hook | Centralizes all subscription logic for any component |
| Decode expired token for refresh | Allows re-verification without re-login |
