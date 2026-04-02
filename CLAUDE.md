# Fortune Cookie - Project Progress & Status

## Developer Identity Policy

**STRICT:** Never disclose the developer's real name, personal email, or any GitHub accounts other than `brevity-k` in any code, commits, comments, PRs, issues, documentation, or AI-generated content related to this project. The only public identity for this project is `brevity-k`. Any references to other accounts or personal identifiers must be redacted. This rule applies to all AI assistants, automation scripts, and contributors.

**Domain:** fortunecrack.com
**Stack:** Next.js 16 + TypeScript + Pixi.js + Matter.js + GSAP + Howler.js
**Last Audited:** 2026-04-01

---

## Progress Overview

| Area | Status | Notes |
|---|---|---|
| Core Interactive App | Done | 5 break methods, physics, sounds, animations |
| Fortune System | Done | 1,091 fortunes, 8 categories, 4 rarities, streaks |
| Cookie Consent Banner | Done | GDPR-compliant accept/reject with localStorage |
| SEO (basic) | Done | Meta tags, Open Graph, Twitter cards, sitemap, robots.txt |
| Blog Content | Done | 14 posts as MDX files in src/content/blog/ |
| Blog MDX Migration | Done | MDX files + content loader, single source of truth |
| Legal Pages | Done | Privacy Policy & Terms of Service |
| About Page | Done | Technology breakdown, features, categories |
| Contact Form | Done | Form with Resend auto-response + owner notification |
| Social Sharing | Done | Twitter/X, Facebook, WhatsApp, clipboard |
| Google Analytics | Done | GA4 enabled |
| Google AdSense | Not Active | 3 ad slots coded, publisher ID empty |
| Environment Variables | Done | .env.local with Resend API key, .env.example committed |
| Deployment | Done | Vercel, auto-deploys on push to main |
| OG Images | Done | Dynamic OG + Twitter images for homepage and all blog posts |
| JSON-LD Structured Data | Done | Organization, WebSite, Article, BreadcrumbList |
| Blog Auto-Generation | Done | scripts/ + .github/workflows/auto-blog.yml, needs ANTHROPIC_API_KEY secret |
| Shareable Fortune Cards | Done | /api/fortune-card image gen, /f/[id] share landing, rarity emoji sharing |
| Programmatic SEO Pages | Done | 23 new routes: 8 category + 12 zodiac + /daily + /lucky-numbers + OG images |
| Auto-Fortune Generation | Done | scripts/generate-fortunes.ts + weekly GitHub Actions workflow |
| PWA + Push Notifications | Not Started | Daily fortune push notification (deferred — Phase 6) |
| Site Health Monitoring | Done | link-check, lighthouse, content-health (self-healing) workflows |
| Self-Sufficient Automation | Done | Auto-close recovery, dedup issues, seasonal content, content validation (verified in Actions tab) |
| Horoscope Pages (Phase 8A) | Done | 36 pages: daily/weekly/monthly × 12 signs + hub + OG images |
| Astrology Content (Phase 8B-E) | Not Started | Compatibility, birth charts, tarot, moon fortune |
| Auto X (Twitter) Posting | Done | 2 tweets/day: fortune (8AM UTC) + horoscope (2PM UTC) via twitter-api-v2 |
| Auto Bluesky Posting | Done | Mirrors X posts to Bluesky via @atproto/api |
| Testing | Done | Vitest + 25 test files (saju, astro libs) |

---

## Growth Strategy

> Competitive analysis, traffic data, and growth targets are in `.private/business-strategy.md` (gitignored).

---

## Implementation Roadmap

### Completed Phases

#### Phase 1-2: Core App + Fortune System (DONE)
Interactive cookie breaking with 1,091 fortunes, 8 categories, 4 rarities, streaks.

#### Phase 3: Auto-Blog Pipeline (DONE)
Self-sufficient blog publishing 2-3 posts/week via Claude API + GitHub Actions.

#### Phase 4: Shareable Fortune Cards (DONE)
Wordle-style shareable fortune result images via `/api/fortune-card` + `/f/[id]` share landing.

#### Phase 5: Programmatic SEO Pages (DONE)
23 new routes: 8 category + 12 zodiac + /daily + /lucky-numbers with OG images.

#### Phase 7: Site Health Monitoring (DONE)
link-check, lighthouse, content-health workflows.

#### Phase 8A: Horoscope Pages (DONE)
36 horoscope pages (daily/weekly/monthly × 12 signs) + hub page + OG images + JSON-LD FAQPage schema. Auto-generated daily via `auto-horoscopes.yml` workflow. Data stored in `src/data/horoscopes.json`. StarRating component for love/career/health display.

### Upcoming Phases

#### Phase 6: PWA + Push Notifications (Deferred)

**Goal:** Daily fortune push notification to drive return visits.

- Add `manifest.json` and service worker for PWA support
- "Get daily fortune notifications" opt-in prompt (after first cookie break, not on load)
- Daily push at user's local morning: "Your fortune awaits"
- Notification click opens daily fortune page
- Push notifications: 68% higher engagement, 7-15% open rate

#### Phase 8: Astrology Content Expansion (Partially Complete)

**Goal:** Tap into the massive astrology keyword universe (horoscope: 5M/mo, astrology: 3.3M/mo, zodiac signs: 2.7M/mo) by adding comprehensive astrology content that no fortune cookie site currently offers.

**Why:** The gap between fortune cookie sites (minimal, ~1K traffic) and astrology sites (millions of visits) is enormous. By integrating real astrology content into our unique interactive experience, we bridge this gap and capture traffic from both keyword universes.

##### 8A: Daily Horoscopes — DONE

36 pages live with OG images and auto-generation:
```
/horoscope                  — Hub page with all 12 signs
/horoscope/daily/[sign]     — 12 pages, updated daily via Claude API
/horoscope/weekly/[sign]    — 12 pages, updated weekly
/horoscope/monthly/[sign]   — 12 pages, updated monthly
```

##### 8B: Zodiac Compatibility Pages (Inherently Viral)

**New routes:**
```
/compatibility/[sign1]-[sign2]  — 144 pages (12x12 sign combinations)
/compatibility                  — Hub with interactive pair selector
```

**Implementation:**
- Pre-generated compatibility content for all 144 sign pairs
- Love score, friendship score, communication rating, challenge areas
- Two-person interactive: each person cracks a cookie → combined compatibility result
- Shareable compatibility card image (1200x630) for social sharing
- = **145 new indexable pages** (144 pairs + 1 hub)

##### 8C: Birth Chart Fortune Cookie (Unique Differentiator)

**New route:** `/birth-chart`

**No site currently offers a fortune cookie personalized to your birth chart.** This is unique.

- User enters: birth date (required), time (optional), location (optional)
- Generates: personalized fortune incorporating sun sign, moon sign (if time provided), current planetary transits
- Lucky numbers derived from numerological calculation
- Personalized message based on chart
- Result is highly shareable (feels personal, invites comparison)

##### 8D: Tarot Cookie (Hybrid Feature)

**New routes:**
```
/tarot              — Daily tarot card + fortune cookie hybrid
/tarot/love         — Love-specific tarot cookie
/tarot/yes-no       — Yes/no tarot cookie reading
```

**Implementation:**
- User "cracks" a fortune cookie to reveal a tarot card + fortune message
- Daily card changes based on date seed
- Love tarot and yes/no tarot as popular sub-types
- Tarot.com gets 3M+ monthly visits primarily from tarot content

##### 8E: Moon Phase Fortune

**New route:** `/moon-fortune`

- Fortune changes based on current moon phase (new moon, full moon, etc.)
- 8 moon phases = 8 different fortune pools
- Content about manifestation, intention-setting tied to lunar cycle
- Growing interest in moon-based content

##### 8F: Astrology Blog Content Auto-Generation

**Expand content pillars to include:**
6. **Astrology & Horoscopes** — daily/weekly zodiac insights, planetary transit guides, moon phases
7. **Zodiac Profiles** — in-depth sign guides, compatibility articles, "X sign as a..." content

**Auto-generated article topics:**
- "[Sign] Horoscope This Week" (12 per week)
- "Mercury Retrograde [Year] Dates and Survival Guide" (3-4x/year)
- "New Moon in [Sign]: What It Means for You" (~12/year)
- "[Sign1] and [Sign2] Compatibility: The Complete Guide" (144 articles)
- "Best Fortune Cookie Messages for [Sign]" (12 articles)

This creates **170+ additional SEO-optimized articles** over time.

##### Phase 8 SEO Impact Summary

| Content Type | New Pages | Target Keywords | Status |
|---|---|---|---|
| Daily/weekly/monthly horoscopes | 36 | horoscope today, daily horoscope | Done |
| Zodiac compatibility | 145 | zodiac compatibility, [sign] compatibility | Planned |
| Birth chart | 1 | birth chart, natal chart | Planned |
| Tarot cookie | 3 | tarot reading, daily tarot, yes/no tarot | Planned |
| Moon fortune | 1 | moon phase fortune, moon reading | Planned |
| Astrology blog articles | 170+ | Long-tail astrology keywords | Ongoing |
| **Total new pages** | **356+** | | |

**Current: 70+ indexed pages (was ~30). Target with remaining phases: 390+**

#### Phase 9: Viral Mechanics Enhancement

##### 9A: Personality-Style Fortune Quiz

Create themed "tests" that rotate seasonally (Ktestone model):
- **"What Fortune Cookie Flavor Are You?"** — personality quiz → shareable character card
- **"Zodiac Fortune Cookie Challenge"** — crack 12 cookies for all signs, compare results
- **"Your Cosmic Cookie Profile"** — birth data → personalized fortune cookie "type"

Each result generates a beautiful, social-media-native image (1080x1920 for Stories, 1200x630 for shares).

##### 9B: Fortune Cookie Emoji Grid (Wordle Model)

After cracking a cookie, generate a shareable emoji grid:
```
🥠 Fortune Cookie #247
⭐⭐⭐⭐ Epic Love
💛💙💜❤️
🔢 Lucky: 7, 14, 23, 38, 42, 49
fortunecrack.com
```

##### 9C: Comparison/Social Features

- "Compare your fortune with a friend" — share link → friend cracks cookie → comparison card
- "Today X% of people got a [rarity] fortune" — social proof + "did I get lucky?" sharing
- "Your fortune is rarer than 92% of people today" — percentile ranking

#### Phase 10: Monetization

> Pricing details and market analysis are in `.private/business-strategy.md` (gitignored).

---

## SEO Strategy

> Keyword research data (search volumes, competition levels) is in `.private/business-strategy.md` (gitignored).

### Programmatic SEO Structure (Current + Planned)

```
CURRENT (70+ pages):
/                              — Homepage
/daily                         — Daily fortune
/lucky-numbers                 — Lucky numbers
/fortune/[category]            — 8 category pages
/zodiac/[sign]                 — 12 zodiac pages
/horoscope                     — Horoscope hub
/horoscope/daily/[sign]        — 12 daily horoscopes
/horoscope/weekly/[sign]       — 12 weekly horoscopes
/horoscope/monthly/[sign]      — 12 monthly horoscopes
/blog/[slug]                   — 14 blog posts
/f/[id]                        — Fortune share landing
/about, /contact, /privacy, /terms

PLANNED ADDITIONS (Phase 8B-E, 320+ pages):
/compatibility                 — Compatibility hub
/compatibility/[sign1]-[sign2] — 144 pair pages
/birth-chart                   — Birth chart fortune
/tarot                         — Tarot cookie hub
/tarot/love                    — Love tarot
/tarot/yes-no                  — Yes/no tarot
/moon-fortune                  — Moon phase fortune
+ 170+ blog articles
```

### Content Auto-Generation Schedule (Active)

| Content | Frequency | Workflow |
|---|---|---|
| Daily horoscopes (12 signs) | Daily | auto-horoscope.yml |
| Weekly horoscopes (12 signs) | Weekly | auto-horoscope.yml |
| Monthly horoscopes (12 signs) | Monthly | auto-horoscope.yml |
| Blog posts | 2-3x/week | auto-blog.yml |
| New fortunes | Weekly | auto-fortunes.yml |

---

## Content Pillars (Rotating for Auto-Generation)

1. **Luck & Superstition** — lucky charms, rituals, cultural beliefs, science of luck
2. **Wellness & Mindfulness** — positive psychology, daily rituals, gratitude, small joys
3. **Astrology & Horoscopes** — zodiac profiles, planetary transits, moon phases, birth charts
4. **Fun Lists & Stories** — "X things that...", real-life fortune stories, viral moments
5. **Food & Culture** — dessert traditions, Asian cuisine, cultural fusion, food history
6. **Zodiac Deep Dives** — sign compatibility, zodiac personality traits, "your sign as..." content
7. **Tarot & Divination** — tarot card meanings, spreads, divination history, oracle guidance

### Post Requirements

- Minimum 600 words (target 1,000-1,500)
- SEO-friendly title with target keyword
- 4-6 H2 sections for scannability
- Internal link to homepage ("break a fortune cookie")
- Meta description from frontmatter `excerpt` field (max 160 chars)

---

## Fortune Data

- **Total:** 1,091 fortunes in `src/data/fortunes.json` (auto-growing ~20/week)
- **Categories:** wisdom (200), love (170), career (150), humor (150), motivation (150), philosophy (101), mystery (90), adventure (80)
- **Rarities:** Common 61%, Rare 23%, Epic 7%, Legendary 8%
- **Daily Fortune:** Seeded RNG (mulberry32) — same fortune globally per day
- **Auto-Growth:** `scripts/generate-fortunes.ts` adds ~20 fortunes/week to smallest category via Claude API

### Planned Fortune Data Expansion (Phase 8)

- **Astrology-themed fortunes:** New category "astrology" with zodiac-influenced messages (~200 fortunes)
- **Tarot-themed fortunes:** New category "tarot" with card-inspired messages (~78 fortunes, one per card)
- **Moon phase fortunes:** Pool of fortunes tied to 8 moon phases
- **Target total:** 1,500+ fortunes

---

## Blog Posts (14 Posts, All 500+ Words)

| Slug | Words | Topic |
|---|---|---|
| history-of-fortune-cookies | ~1,500 | History |
| fortune-cookie-traditions | ~1,400 | Culture |
| building-interactive-web-games | ~1,600 | Tech |
| psychology-of-fortune-telling | ~1,300 | Psychology |
| digital-fortune-cookies-future | ~1,200 | Future/Tech |
| lucky-numbers-superstitions-science | ~1,400 | Luck/Science |
| morning-rituals-around-the-world | ~1,500 | Lifestyle |
| famous-fortunes-that-came-true | ~1,600 | Stories |
| zodiac-fortune-cookies-astrology-meets-wisdom | ~1,500 | Astrology |
| why-we-need-small-joys | ~1,400 | Wellness |
| beginners-guide-tarot-card-reading-symbols-meanings | ~1,500 | Tarot |
| fortune-cookies-that-changed-lives | ~1,400 | Stories |
| good-luck-charms-from-around-the-world | ~1,500 | Luck/Culture |
| how-to-create-daily-gratitude-practice-fortune-cookies | ~1,400 | Wellness |

Blog system uses **MDX files** in `src/content/blog/` with YAML frontmatter. Content loader in `src/lib/blog.ts` provides `getAllPosts()` and `getPost(slug)`. Rendered with `next-mdx-remote/rsc`.

---

## GitHub Secrets Required

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API for blog auto-generation + quality checks + fortune generation + horoscopes |
| `X_CONSUMER_KEY` | X (Twitter) consumer key for automated tweets |
| `X_SECRET_KEY` | X (Twitter) secret key |
| `X_ACCESS_TOKEN` | X (Twitter) user access token |
| `X_ACCESS_TOKEN_SECRET` | X (Twitter) user access token secret |
| `BLUESKY_HANDLE` | Bluesky handle (e.g. user.bsky.social) |
| `BLUESKY_APP_PASSWORD` | Bluesky app password for API access |
| (GITHUB_TOKEN) | Auto-provided by GitHub Actions for git push |

---

## AdSense Activation Checklist

1. [ ] Apply for Google AdSense
2. [ ] Set `ADSENSE_PUB_ID` in `src/components/AdUnit.tsx:6`
3. [ ] Uncomment AdSense script in `src/app/layout.tsx:63-69`
4. [ ] Configure ad slot IDs (top-leaderboard, post-reveal-rectangle, bottom-leaderboard)

---

## Contact Form & Auto-Response

- **Form:** `src/components/ContactForm.tsx` (name, email, subject, message)
- **API Route:** `src/app/api/contact/route.ts` (Resend integration)
- **On submit:** Sends notification to owner + branded auto-response to sender
- **Env vars:** `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL` in `.env.local`
- **Status:** Tested and working (2026-02-11)
- **Note:** Using `onboarding@resend.dev` sender — verify own domain in Resend for production

---

## High Priority TODO

1. ~~Expand all blog posts to 500+ words each~~ Done
2. ~~Migrate blog to MDX for easier authoring~~ Done
3. ~~Enable Google Analytics~~ Done
4. ~~Add OG images for social sharing~~ Done
5. ~~Add JSON-LD structured data~~ Done
6. ~~Set up environment variables~~ Done
7. ~~Deploy to Vercel~~ Done (fortunecrack.com)
8. ~~Build auto-blog pipeline~~ Done (scripts + GitHub Actions)
9. ~~Add shareable fortune card images~~ Done (Phase 4)
10. ~~Create programmatic SEO pages~~ Done (Phase 5 — 23 routes)
11. ~~Add daily horoscope pages~~ Done (Phase 8A — 36 pages + hub)
12. **Add zodiac compatibility pages (144)** — Phase 8B (inherently viral)
13. **Add birth chart fortune** — Phase 8C (unique differentiator)
14. **Add tarot cookie feature** — Phase 8D
15. **Add PWA + push notifications** — Phase 6
16. Configure AdSense (add publisher ID)

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with interactive cookie
│   ├── layout.tsx            # Root layout (GA/AdSense scripts here)
│   ├── globals.css           # Theme variables, animations
│   ├── sitemap.ts            # Dynamic sitemap (60+ entries)
│   ├── robots.ts             # Search engine directives
│   ├── icon.tsx              # Dynamic favicon
│   ├── apple-icon.tsx        # Apple touch icon
│   ├── opengraph-image.tsx   # Homepage OG image
│   ├── twitter-image.tsx     # Homepage Twitter image
│   ├── about/page.tsx
│   ├── blog/page.tsx         # Blog index
│   ├── blog/[slug]/page.tsx  # MDX blog post renderer (next-mdx-remote)
│   ├── blog/[slug]/opengraph-image.tsx
│   ├── api/contact/route.ts  # Contact form API (Resend)
│   ├── api/fortune-card/route.tsx # Edge: OG image for fortune shares (1200x630)
│   ├── contact/page.tsx
│   ├── daily/page.tsx        # Daily fortune page + 7-day history
│   ├── daily/opengraph-image.tsx
│   ├── f/[id]/page.tsx       # Fortune share landing page (base64url encoded)
│   ├── fortune/[category]/page.tsx  # 8 category fortune pages (SSG)
│   ├── fortune/[category]/opengraph-image.tsx
│   ├── horoscope/page.tsx           # Horoscope hub (all 12 signs)
│   ├── horoscope/opengraph-image.tsx
│   ├── horoscope/daily/[sign]/page.tsx        # 12 daily horoscope pages
│   ├── horoscope/daily/[sign]/opengraph-image.tsx
│   ├── horoscope/weekly/[sign]/page.tsx       # 12 weekly horoscope pages
│   ├── horoscope/weekly/[sign]/opengraph-image.tsx
│   ├── horoscope/monthly/[sign]/page.tsx      # 12 monthly horoscope pages
│   ├── horoscope/monthly/[sign]/opengraph-image.tsx
│   ├── zodiac/[sign]/page.tsx       # 12 zodiac fortune pages (SSG)
│   ├── zodiac/[sign]/opengraph-image.tsx
│   ├── lucky-numbers/page.tsx       # Daily lucky numbers page
│   ├── lucky-numbers/opengraph-image.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── components/
│   ├── CookieCanvas.tsx      # Main interactive component
│   ├── CookieRenderer.ts     # Pixi.js rendering
│   ├── CookiePhysics.ts      # Matter.js physics
│   ├── InteractionDetector.ts # 5 break methods
│   ├── SoundManager.ts       # Howler.js audio
│   ├── ParticleSystem.ts     # Visual effects
│   ├── FortuneReveal.tsx     # Typewriter effect
│   ├── FortuneOfTheDay.tsx   # Daily seeded fortune
│   ├── ShareButtons.tsx      # Social sharing with personalized fortune URLs
│   ├── JsonLd.tsx            # JSON-LD: Organization, WebSite, Article, Breadcrumb, FAQPage
│   ├── ContactForm.tsx       # Contact form with validation
│   ├── AdUnit.tsx            # AdSense (disabled, no pub ID)
│   ├── CookieConsent.tsx     # GDPR consent banner
│   ├── StarRating.tsx        # Star rating display for horoscope pages
│   ├── Header.tsx            # Responsive nav
│   └── Footer.tsx            # Footer links + Explore section
├── content/
│   └── blog/                 # MDX blog posts with YAML frontmatter (14 posts)
├── lib/
│   ├── blog.ts               # Blog content loader (getAllPosts, getPost)
│   ├── constants.ts           # Site-wide configuration constants
│   ├── fortuneEngine.ts      # Fortune logic, streaks, journal, seededRandom, category helpers
│   ├── horoscopes.ts         # Horoscope data loader, ZODIAC_SIGNS, formatters
│   └── analytics.ts          # GA4 event tracking (disabled)
└── data/
    ├── fortunes.json         # 1,091 fortunes (auto-growing weekly)
    └── horoscopes.json       # Daily/weekly/monthly horoscope data for 12 signs

scripts/
├── generate-post.ts          # Two-stage Claude API blog post generator
├── quality-check.ts          # Content quality validation (structural + AI review)
├── auto-fix.ts               # Self-healing post fixer (frontmatter, H1→H2, etc.)
├── generate-fortunes.ts      # Weekly fortune database growth via Claude API
├── generate-horoscopes.ts    # Daily/weekly/monthly horoscope generation via Claude API
├── generate-seasonal.ts      # Seasonal holiday content generation via Claude API
├── validate-content.ts       # Data integrity validation (fortunes, horoscopes, blog)
├── post-to-x.ts              # Auto-post daily fortune/horoscope tweets to X (Twitter)
├── post-to-bluesky.ts        # Auto-post daily fortune/horoscope/blog to Bluesky
├── lib/
│   ├── types.ts              # Shared TypeScript types for scripts
│   └── utils.ts              # Shared utility functions for scripts
├── seasonal-state.json       # Tracks which seasonal content has been generated per year
└── x-post-state.json         # Tracks X posting state (last dates, tweeted blog slugs)

.github/workflows/
├── auto-blog.yml             # Cron (Tue/Fri 9AM UTC): generate + validate + publish
├── auto-fortunes.yml         # Cron (Sun 10AM UTC): generate 20 new fortunes + validate + publish
├── auto-horoscopes.yml       # Cron (Daily 5AM UTC): daily/weekly/monthly horoscopes for 12 signs
├── auto-seasonal.yml         # Cron (Mon 8AM UTC): seasonal content if holiday window active
├── auto-x-post.yml           # Cron (Daily 8AM+2PM UTC): fortune + horoscope tweets to X
├── ci.yml                    # CI pipeline for pull requests (required status check)
├── content-health.yml        # Weekly (Mon noon UTC): blog/horoscope/fortune freshness + URL pings + auto-triggers
├── dependabot-automerge.yml  # Auto-merge Dependabot PRs after CI passes
├── link-check.yml            # Weekly (Mon 6AM UTC): broken link detection → deduplicated issues
└── lighthouse.yml            # Weekly (Wed 6AM UTC): SEO + performance audit
```

### Planned File Additions (Phase 8B-E)

```
src/app/
├── compatibility/
│   ├── page.tsx                    # Compatibility hub with pair selector
│   └── [pair]/page.tsx             # 144 sign-pair pages (aries-taurus, etc.)
├── birth-chart/
│   └── page.tsx                    # Birth chart fortune calculator
├── tarot/
│   ├── page.tsx                    # Tarot cookie hub
│   ├── love/page.tsx               # Love tarot cookie
│   └── yes-no/page.tsx             # Yes/no tarot cookie
└── moon-fortune/
    └── page.tsx                    # Moon phase fortune

scripts/
└── generate-compatibility.ts      # One-time: generate 144 compatibility pages
```

---

## Automation Pipeline (Self-Sufficient)

| Schedule | Workflow | What It Does | Self-Healing |
|----------|----------|-------------|-------------|
| Daily 5AM UTC | auto-horoscopes | Daily/weekly/monthly horoscopes for 12 signs | Retry + issue + auto-close |
| Tue/Fri 9AM UTC | auto-blog | Blog post: generate + fix + quality check + retry | Retry + issue + auto-close |
| Sun 10AM UTC | auto-fortunes | 20 new fortunes to smallest category (cap: 3000) | Retry + issue + auto-close |
| Mon 6AM UTC | link-check | Broken link detection | Deduplicated issues |
| Mon 8AM UTC | auto-seasonal | Seasonal content if holiday window active | Issue + auto-close |
| Mon noon UTC | content-health | Blog/horoscope/fortune freshness + URL pings + auto-trigger stale pipelines | Issue + auto-trigger |
| Wed 7AM UTC | lighthouse | SEO, performance, accessibility audit | Issue |
| Daily 8AM UTC | auto-x-post | Fortune post to X + Bluesky | Retry + issue + auto-close |
| Daily 2PM UTC | auto-x-post | Rotating zodiac horoscope post to X + Bluesky | Retry + issue + auto-close |
| On PR | ci | CI pipeline: lint + build validation | Required check |
| On push | dependabot-automerge | Auto-merge Dependabot PRs after CI passes | Auto-merge |

### Self-Corrective Mechanisms

1. **Stale content detection**: content-health monitors all 3 content types; auto-triggers their workflows if stale
2. **Quality gates**: Blog posts go through auto-fix + AI quality review (score >= 6/10); retry on failure
3. **Issue lifecycle**: Failure creates issue → recovery auto-closes with comment
4. **Deduplication**: No duplicate failure issues (checked before creation)
5. **Data validation**: validate-content.ts checks integrity of all data files
6. **Fortune cap**: Stops generating at 3000 fortunes to prevent bloat

### Seasonal Content Windows

| Season | Window | Category | Content |
|--------|--------|----------|---------|
| new-year | Dec 26 – Jan 7 | motivation | 20 New Year resolution fortunes |
| valentine | Feb 1 – Feb 14 | love | 20 love-themed fortunes |
| halloween | Oct 15 – Oct 31 | mystery | 20 spooky/mystery fortunes |
| thanksgiving | Nov 15 – Nov 28 | wisdom | 20 gratitude fortunes |
| christmas | Dec 10 – Dec 25 | wisdom | 20 holiday/joy fortunes |

---

### Debugging GitHub Actions

- `gh run view <id> --log-failed` — fastest way to see failure cause
- `gh run view <id> --log 2>&1 | grep -E "pattern"` — search full logs
- `continue-on-error: true` steps show ✓ in `gh run watch` even when they fail; check `steps.<id>.outcome`

---

## Build & Run

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

### Content Scripts (Manual)

```bash
npm run blog:generate        # Generate a new blog post
npm run blog:fix             # Auto-fix blog post issues
npm run blog:quality         # AI quality check on latest post
npm run fortune:generate     # Generate 20 new fortunes
npm run seasonal:generate    # Generate seasonal content (if in window)
npm run content:validate     # Validate all data file integrity
npm run horoscope:generate   # Generate horoscopes (auto-detect type)
npm run horoscope:daily      # Generate daily horoscopes only
npm run horoscope:weekly     # Generate weekly horoscopes only
npm run horoscope:monthly    # Generate monthly horoscopes only
npm run x:post               # Post both fortune + horoscope tweets to X
npm run x:fortune            # Post daily fortune tweet to X
npm run x:horoscope          # Post horoscope tweet to X
npm run x:blog               # Post all untweeted blog posts to X
```
