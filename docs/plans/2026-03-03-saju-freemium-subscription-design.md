# Saju Freemium Subscription Platform — Design Document

**Date:** 2026-03-03
**Status:** Approved

## Problem

The saju feature drives strong user engagement, but:
1. Anthropic API costs will grow with traffic
2. A single birth chart produces static content — no reason to return daily
3. No monetization infrastructure exists

## Solution

A freemium subscription model ($2.99/month) that gates **recurring personalized content** behind payment, while keeping the core chart experience free.

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Infrastructure | Stripe + JWT, no database | Fits existing localStorage-only architecture. Stripe manages all customer state. |
| Paywall model | Feature gate | Free chart hooks users; daily readings create retention loop |
| Price | $2.99/month | Under psychological $5 barrier, 98.5% margin on API costs |
| Content generation | On-demand Claude API | Only active users incur cost, more personalized than batch |
| Auth | None (JWT token in localStorage) | Minimal friction, upgradeable later |

## Architecture

```
User Flow:
┌─────────────────────────────────────────────────┐
│  /saju page                                     │
│                                                 │
│  ┌─── Free ──────────────────────────────────┐  │
│  │ Birth data → Four Pillars Chart           │  │
│  │ Five Elements Analysis                    │  │
│  │ Major Luck Timeline                       │  │
│  │ Current Year/Month/Day Pillars            │  │
│  │ One-time AI Interpretation                │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─── Premium ($2.99/mo) ────────────────────┐  │
│  │ 🔒 Daily Personalized Reading             │  │
│  │ 🔒 Monthly Outlook                        │  │
│  │ 🔒 Yearly Forecast                        │  │
│  │ 🔒 Compatibility Check                    │  │
│  │ 🔒 Lucky Day Calendar                     │  │
│  │ 🔒 Career/Love Timing                     │  │
│  └───────────────────────────────────────────┘  │
│           │                                     │
│           ▼                                     │
│   "Go Premium" → Stripe Checkout → Payment      │
│           │                                     │
│           ▼                                     │
│   /api/subscribe/verify                         │
│   Verifies session → Signs JWT → Returns token  │
│           │                                     │
│           ▼                                     │
│   Token in localStorage → sent with API calls   │
└─────────────────────────────────────────────────┘
```

## Free Tier

Everything that exists today remains free:
- Birth data entry (onboarding form)
- Four Pillars chart with element colors
- Five Elements balance analysis
- Major Luck (대운) 10-year timeline
- Current year/month/day pillars
- One-time AI interpretation (cached forever)
- Educational content and FAQ

## Premium Features ($2.99/month)

### 1. Daily Personalized Reading
- **Endpoint:** `POST /api/saju/daily`
- **Changes:** Every day (today's pillar vs user's chart)
- **Cache:** localStorage, 24 hours
- **Content:** How today's heavenly stem and earthly branch interact with the user's day master, favorable element, and current major luck cycle. Actionable advice for the day.

### 2. Monthly Outlook
- **Endpoint:** `POST /api/saju/monthly`
- **Changes:** Every month
- **Cache:** localStorage, 30 days
- **Content:** Monthly pillar analysis, key dates, element balance shifts, career/love/health focus areas.

### 3. Yearly Forecast
- **Endpoint:** `POST /api/saju/yearly`
- **Changes:** Every year
- **Cache:** localStorage, 365 days
- **Content:** Deep 세운 analysis — how the year's pillar interacts with birth chart. Major themes, opportunities, cautions.

### 4. Compatibility Check
- **Endpoint:** `POST /api/saju/compatibility`
- **Changes:** On-demand (user enters second person's birth data)
- **Cache:** localStorage, keyed by birth data pair
- **Content:** Two-chart comparison — element harmony, day master relationship, branch clashes/combinations, relationship advice.

### 5. Lucky Day Calendar
- **Endpoint:** `POST /api/saju/lucky-days`
- **Changes:** Weekly
- **Cache:** localStorage, 7 days
- **Content:** Next 7 days rated as favorable/neutral/challenging based on daily pillar vs user's chart. Pure calculation (minimal or no AI needed).

### 6. Career/Love Timing
- **Endpoint:** `POST /api/saju/timing`
- **Changes:** Monthly
- **Cache:** localStorage, 30 days
- **Content:** Current 대운 + monthly pillar context for career moves, relationship decisions, health focus.

## Payment Flow

### Subscribe
1. User clicks "Go Premium" → `POST /api/subscribe/checkout`
2. Server creates Stripe Checkout Session ($2.99/mo recurring)
3. User redirected to Stripe hosted checkout
4. After payment → redirected to `/saju?session_id=cs_xxx`
5. Client calls `POST /api/subscribe/verify` with session ID
6. Server verifies with Stripe API, signs JWT: `{customerId, status: "active", exp: +24h}`
7. JWT stored in localStorage as `saju_premium_token`

### Token Renewal
- JWT expires every 24 hours
- On page load, if expired → `POST /api/subscribe/refresh` with token
- Server extracts customer ID, checks Stripe subscription status, re-signs if active
- If cancelled/lapsed → token not renewed, user reverts to free tier

### Restore Subscription (cleared localStorage)
- "Already subscribed?" link → user enters email
- `POST /api/subscribe/restore` → Stripe customer lookup by email → re-issues JWT

### Cancel
- "Manage subscription" link → Stripe Customer Portal redirect
- Stripe handles cancellation, receipts, reactivation
- Next token refresh reflects cancelled status

## Token Design

**Library:** `jose` (lightweight, Edge-compatible JWT)

**JWT payload:**
```json
{
  "customerId": "cus_xxx",
  "status": "active",
  "iat": 1709424000,
  "exp": 1709510400
}
```

**Signing:** HMAC-SHA256 with `PREMIUM_JWT_SECRET` env var

**Verification on premium endpoints:**
```
Authorization: Bearer <jwt_token>
→ Verify signature → Check exp → Serve content
```

No database check per request. Stripe status only checked during daily token refresh.

## API Cost Projections

| Users | Daily readings/mo | Monthly/Yearly | Total API calls/mo | Cost/mo | Revenue/mo |
|---|---|---|---|---|---|
| 100 premium | 3,000 | 200 | 3,200 | ~$5 | $299 |
| 1,000 premium | 30,000 | 2,000 | 32,000 | ~$48 | $2,990 |
| 10,000 premium | 300,000 | 20,000 | 320,000 | ~$480 | $29,900 |

Cost per call: ~$0.0015 (Sonnet: ~200 input + 300 output tokens).
Margin: 98%+ at all scales.

## Environment Variables (New)

```
STRIPE_SECRET_KEY=sk_xxx          # Stripe API key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_xxx  # Stripe publishable key
PREMIUM_JWT_SECRET=xxx            # JWT signing secret (generate random 256-bit)
STRIPE_WEBHOOK_SECRET=whsec_xxx   # For future webhook integration
```

## File Structure (New/Modified)

```
src/
├── app/api/
│   ├── subscribe/
│   │   ├── checkout/route.ts     # Create Stripe Checkout Session
│   │   ├── verify/route.ts       # Verify session, issue JWT
│   │   ├── refresh/route.ts      # Refresh expired JWT
│   │   └── restore/route.ts      # Restore by email lookup
│   └── saju/
│       ├── daily/route.ts        # Premium: daily reading
│       ├── monthly/route.ts      # Premium: monthly outlook
│       ├── yearly/route.ts       # Premium: yearly forecast
│       ├── compatibility/route.ts # Premium: two-chart comparison
│       ├── lucky-days/route.ts   # Premium: 7-day calendar
│       └── timing/route.ts       # Premium: career/love timing
├── lib/saju/
│   ├── premium.ts                # JWT verify/sign helpers
│   └── prompts.ts                # Claude prompt templates for each reading type
├── components/saju/
│   ├── PremiumGate.tsx           # Paywall UI with "Go Premium" CTA
│   ├── DailyReading.tsx          # Daily personalized reading display
│   ├── MonthlyOutlook.tsx        # Monthly outlook display
│   ├── YearlyForecast.tsx        # Yearly forecast display
│   ├── CompatibilityCheck.tsx    # Two-person compatibility UI
│   ├── LuckyDayCalendar.tsx      # 7-day calendar display
│   └── SubscriptionManager.tsx   # Manage/restore/cancel links
```

## Future Upgrades (Not in Scope Now)

- Stripe webhooks for real-time cancellation handling
- Cross-device sync via Firebase/Supabase
- Annual plan ($29.99/year)
- Gift subscriptions
- Push notifications for daily readings (PWA Phase 6)
