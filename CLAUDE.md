# Fortune Cookie - Project Progress & Status

**Domain:** fortunecrack.com
**Stack:** Next.js 16 + TypeScript + Pixi.js + Matter.js + GSAP + Howler.js
**Last Audited:** 2026-02-12

---

## Progress Overview

| Area | Status | Notes |
|---|---|---|
| Core Interactive App | Done | 5 break methods, physics, sounds, animations |
| Fortune System | Done | 1,031 fortunes, 8 categories, 4 rarities, streaks |
| Cookie Consent Banner | Done | GDPR-compliant accept/reject with localStorage |
| SEO (basic) | Done | Meta tags, Open Graph, Twitter cards, sitemap, robots.txt |
| Blog Content | Done | 10 posts as MDX files in src/content/blog/ |
| Blog MDX Migration | Done | MDX files + content loader, single source of truth |
| Legal Pages | Done | Privacy Policy & Terms of Service |
| About Page | Done | Technology breakdown, features, categories |
| Contact Form | Done | Form with Resend auto-response + owner notification |
| Social Sharing | Done | Twitter/X, Facebook, WhatsApp, clipboard |
| Google Analytics | Done | GA4 enabled, ID: G-TMMGPRKTLD |
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
| Astrology Content | Not Started | Horoscopes, birth charts, compatibility — Phase 8 (NEW) |
| Testing | None | No test framework |

---

## Growth Strategy (Research-Based, Updated 2026-02-12)

### Competitive Landscape

#### Tier 1: Dominant Astrology/Horoscope Sites (10M+ monthly visits)

| Site | Monthly Visits | Key Strength |
|---|---|---|
| 16personalities.com | ~18.9M | MBTI test; 55% organic search; 9:58 avg session |
| horoscope.com | ~11.5M | Broadest content: daily/weekly/monthly horoscopes + games |
| astro.com (Astrodienst) | ~9.7M | Most respected birth chart calculator since 1990s |

#### Tier 2: Major Players (3M-10M monthly visits)

| Site | Monthly Visits | Key Strength |
|---|---|---|
| cafeastrology.com | ~4.1-5.4M | Free birth chart reports; 52% organic search |
| astrology.com | ~3.3M | Brand name domain; includes fortune cookie game |
| tarot.com | ~3.0M | 100+ tarot readings; 37% direct traffic |

#### Tier 3: High-Growth Apps

| App | Users | Key Strength |
|---|---|---|
| Co-Star | 30M+ registered | AI-personalized daily horoscopes; viral sharing |
| CHANI | Top-grossing US | Premium astrology education; celebrity brand |
| The Pattern | Millions | Psychological approach; relationship focus |

#### Tier 4: Viral Test/Quiz Sites

| Site | Monthly Visits | Key Strength |
|---|---|---|
| 16personalities.com | ~18.9M | 1B+ tests; 45+ languages; identity-based sharing |
| ktestone.com | Millions | Korean origin; TikTok viral; beautiful character cards |
| BuzzFeed Quizzes | Part of 100M+ | 92% completion rate; "which character are you" format |

#### Tier 5: Fortune Cookie Sites (The Blue Ocean)

| Site | Traffic | Notes |
|---|---|---|
| fortunecookiegenerator.com | ~1.2K/mo | Simple click-to-generate; minimal |
| fortunecookiemessage.com | ~100K | Database of messages; no interactivity |
| astrology.com/fortune-cookie | Part of astrology.com | ~60 messages; simple click; zero personalization |
| horoscope.com/fortune-cookie | Part of horoscope.com | Basic divination game; no astrology integration |

**Key Finding:** Fortune cookie websites are extremely low-competition. Even major astrology sites treat fortune cookies as throwaway mini-games with ~60 generic messages, no personalization, and no interactive experience. **This is a massive blue ocean.**

### Our Competitive Advantages

- **Interactive physics-based experience** — unique in the fortune cookie niche (no competitor has this)
- **1,031 curated fortunes** with rarity system (gamification)
- **Daily fortune mechanic** already exists
- **MDX blog** ready for auto-generation at scale
- **Dynamic OG images** already working for viral sharing
- **12 zodiac pages + 8 category pages** already built
- **Shareable fortune cards** with rarity badges

### What Makes Top Sites Succeed

1. **Daily ritual mechanic** — Wordle's "one thing per day" drives massive daily return visits
2. **Shareable visual results** — Wordle's emoji grid generated 23.5M tweets; visual results are 40x more shared
3. **Identity/personality content** — Quizzes achieve 80% participation, 90% completion; people share results that reflect their identity
4. **Programmatic SEO** — Auto-generated pages targeting long-tail keywords at scale (horoscope.com has 200+ indexed pages)
5. **Push notifications** — 68% higher engagement, 7-15% open rate vs 1-3% for email
6. **Frictionless onboarding** — Zero sign-up, instant core experience; virality dies at barriers
7. **Zodiac personalization** — Cafe Astrology built 5M+ monthly traffic entirely around free zodiac tools

### The Winning Formula for FortuneCrack

```
Interactive cracking UX (unique — nobody else has this)
+ Astrology/zodiac personalization (taps into massive keyword universe)
+ Shareable visual results (proven by 16Personalities/Ktestone)
+ Programmatic SEO (190+ pages targeting long-tail keywords)
+ Daily refresh ritual (Co-Star's proven retention model)
= Target: 500K-1M+ monthly visits
```

---

## Implementation Roadmap

### Completed Phases

#### Phase 1-2: Core App + Fortune System (DONE)
Interactive cookie breaking with 1,031 fortunes, 8 categories, 4 rarities, streaks.

#### Phase 3: Auto-Blog Pipeline (DONE)
Self-sufficient blog publishing 2-3 posts/week via Claude API + GitHub Actions.

#### Phase 4: Shareable Fortune Cards (DONE)
Wordle-style shareable fortune result images via `/api/fortune-card` + `/f/[id]` share landing.

#### Phase 5: Programmatic SEO Pages (DONE)
23 new routes: 8 category + 12 zodiac + /daily + /lucky-numbers with OG images.

#### Phase 7: Site Health Monitoring (DONE)
link-check, lighthouse, content-health workflows.

### Upcoming Phases

#### Phase 6: PWA + Push Notifications (Deferred)

**Goal:** Daily fortune push notification to drive return visits.

- Add `manifest.json` and service worker for PWA support
- "Get daily fortune notifications" opt-in prompt (after first cookie break, not on load)
- Daily push at user's local morning: "Your fortune awaits"
- Notification click opens daily fortune page
- Push notifications: 68% higher engagement, 7-15% open rate

#### Phase 8: Astrology Content Expansion (NEW — High Priority)

**Goal:** Tap into the massive astrology keyword universe (horoscope: 5M/mo, astrology: 3.3M/mo, zodiac signs: 2.7M/mo) by adding comprehensive astrology content that no fortune cookie site currently offers.

**Why:** The gap between fortune cookie sites (minimal, ~1K traffic) and astrology sites (millions of visits) is enormous. By integrating real astrology content into our unique interactive experience, we bridge this gap and capture traffic from both keyword universes.

##### 8A: Daily Horoscopes (Highest Traffic Potential)

**New routes:**
```
/horoscope/daily/[sign]     — 12 pages, updated daily via Claude API
/horoscope/weekly/[sign]    — 12 pages, updated weekly
/horoscope/monthly/[sign]   — 12 pages, updated monthly
/horoscope                  — Hub page linking to all signs
```

**Target keywords:**
| Keyword | Monthly Searches | Competition |
|---|---|---|
| horoscope today | 1,500,000 | Very High |
| daily horoscope | 823,000 | High |
| [sign] horoscope today | 50K+ per sign | High |
| weekly horoscope [sign] | 10K+ per sign | Medium |

**Implementation:**
- Claude API generates personalized daily/weekly/monthly horoscope text for each sign
- Auto-generation workflow (daily at midnight UTC, like auto-blog)
- Each page includes: horoscope text + "crack a fortune cookie for [sign]" CTA + lucky numbers
- FAQPage JSON-LD schema for rich snippets
- = **36 new indexable pages** (12 signs x 3 time periods)

##### 8B: Zodiac Compatibility Pages (Inherently Viral)

**New routes:**
```
/compatibility/[sign1]-[sign2]  — 144 pages (12x12 sign combinations)
/compatibility                  — Hub with interactive pair selector
```

**Target keywords:**
| Keyword | Monthly Searches | Competition |
|---|---|---|
| zodiac compatibility | 74,000 | Medium |
| [sign1] and [sign2] compatibility | 5-20K per pair | Medium |
| love compatibility test | 50,000+ | High |

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

**Target keywords:**
| Keyword | Monthly Searches | Competition |
|---|---|---|
| birth chart | 673,000 | Medium |
| free birth chart | 90,500 | Medium |
| natal chart | 246,000 | Medium |
| birth chart compatibility | 90,500 | Medium |

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

**Target keywords:**
| Keyword | Monthly Searches | Competition |
|---|---|---|
| tarot reading | 550,000 | High |
| daily tarot | 60,500 | Medium |
| yes or no tarot | 135,000 | Medium |
| love tarot | 90,500 | Medium |

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

| Content Type | New Pages | Target Keywords |
|---|---|---|
| Daily/weekly/monthly horoscopes | 36 | horoscope today, daily horoscope |
| Zodiac compatibility | 145 | zodiac compatibility, [sign] compatibility |
| Birth chart | 1 | birth chart, natal chart |
| Tarot cookie | 3 | tarot reading, daily tarot, yes/no tarot |
| Moon fortune | 1 | moon phase fortune, moon reading |
| Astrology blog articles | 170+ | Long-tail astrology keywords |
| **Total new pages** | **356+** | |

**Combined with existing 30+ pages = 386+ indexed pages** (vs current ~30)

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

**Phase 10A (0-100K visits):**
- Google AdSense (after fortune reveal, not during interaction)
- Already 3 ad slots coded; just needs publisher ID

**Phase 10B (100K-500K visits):**
- Premium readings: detailed birth-chart-based fortune cookie ($1-3)
- Ad-free subscription ($2.99/month)
- Sponsored/branded fortune cookies (partnerships)

**Phase 10C (500K+ visits):**
- Live astrologer consultations
- Premium compatibility reports
- Fortune cookie merchandise (physical cookies with custom fortunes)
- API licensing (fortune cookie widget for other sites)

**Market context:** Global astrology app market ~$3B (2024), projected $9B by 2030 (CAGR ~20%).

---

## SEO Strategy

### Primary Keyword Targets (Ranked by Opportunity)

| Keyword | Monthly Searches | Competition | Our Page |
|---|---|---|---|
| fortune cookie online | 5K-10K | Very Low | Homepage |
| virtual fortune cookie | 1K-5K | Very Low | Homepage |
| fortune cookie generator | 5K-10K | Low | Homepage |
| open fortune cookie | 1K-5K | Very Low | Homepage |
| daily fortune | 10K-20K | Medium | /daily |
| lucky numbers today | 10K-50K | Medium | /lucky-numbers |
| [sign] fortune today | 1K-5K per sign | Low | /zodiac/[sign] |
| zodiac fortune | 1K-5K | Low | /zodiac hub |
| horoscope today | 1,500,000 | Very High | /horoscope (Phase 8) |
| daily horoscope | 823,000 | High | /horoscope/daily (Phase 8) |
| birth chart | 673,000 | Medium | /birth-chart (Phase 8) |
| zodiac compatibility | 74,000 | Medium | /compatibility (Phase 8) |
| tarot reading | 550,000 | High | /tarot (Phase 8) |
| yes or no tarot | 135,000 | Medium | /tarot/yes-no (Phase 8) |

### Programmatic SEO Structure (Current + Planned)

```
CURRENT (30+ pages):
/                              — Homepage
/daily                         — Daily fortune
/lucky-numbers                 — Lucky numbers
/fortune/[category]            — 8 category pages
/zodiac/[sign]                 — 12 zodiac pages
/blog/[slug]                   — 10+ blog posts
/f/[id]                        — Fortune share landing
/about, /contact, /privacy, /terms

PHASE 8 ADDITIONS (356+ pages):
/horoscope                     — Horoscope hub
/horoscope/daily/[sign]        — 12 daily horoscopes
/horoscope/weekly/[sign]       — 12 weekly horoscopes
/horoscope/monthly/[sign]      — 12 monthly horoscopes
/compatibility                 — Compatibility hub
/compatibility/[sign1]-[sign2] — 144 pair pages
/birth-chart                   — Birth chart fortune
/tarot                         — Tarot cookie hub
/tarot/love                    — Love tarot
/tarot/yes-no                  — Yes/no tarot
/moon-fortune                  — Moon phase fortune
+ 170+ blog articles
```

### Content Auto-Generation Schedule (Phase 8)

| Content | Frequency | Workflow | Claude API Cost |
|---|---|---|---|
| Daily horoscopes (12 signs) | Daily | auto-horoscope.yml | ~$0.10/day |
| Weekly horoscopes (12 signs) | Weekly | auto-horoscope.yml | ~$0.10/week |
| Monthly horoscopes (12 signs) | Monthly | auto-horoscope.yml | ~$0.10/month |
| Blog posts | 2-3x/week | auto-blog.yml (existing) | ~$0.20/week |
| New fortunes | Weekly | auto-fortunes.yml (existing) | ~$0.10/week |
| **Total** | | | **~$5-7/month** |

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

- **Total:** 1,031+ fortunes in `src/data/fortunes.json` (auto-growing ~20/week)
- **Categories:** wisdom (200), love (150), career (150), humor (150), motivation (150), philosophy (101), adventure (80), mystery (50)
- **Rarities:** Common 63%, Rare 24%, Epic 8%, Legendary 5%
- **Daily Fortune:** Seeded RNG (mulberry32) — same fortune globally per day
- **Auto-Growth:** `scripts/generate-fortunes.ts` adds ~20 fortunes/week to smallest category via Claude API

### Planned Fortune Data Expansion (Phase 8)

- **Astrology-themed fortunes:** New category "astrology" with zodiac-influenced messages (~200 fortunes)
- **Tarot-themed fortunes:** New category "tarot" with card-inspired messages (~78 fortunes, one per card)
- **Moon phase fortunes:** Pool of fortunes tied to 8 moon phases
- **Target total:** 1,500+ fortunes

---

## Blog Posts (10 Posts, All 500+ Words)

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

Blog system uses **MDX files** in `src/content/blog/` with YAML frontmatter. Content loader in `src/lib/blog.ts` provides `getAllPosts()` and `getPost(slug)`. Rendered with `next-mdx-remote/rsc`.

---

## GitHub Secrets Required

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API for blog auto-generation + quality checks + fortune generation + horoscopes |
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
3. ~~Enable Google Analytics~~ Done (G-TMMGPRKTLD)
4. ~~Add OG images for social sharing~~ Done
5. ~~Add JSON-LD structured data~~ Done
6. ~~Set up environment variables~~ Done
7. ~~Deploy to Vercel~~ Done (fortunecrack.com)
8. ~~Build auto-blog pipeline~~ Done (scripts + GitHub Actions)
9. ~~Add shareable fortune card images~~ Done (Phase 4)
10. ~~Create programmatic SEO pages~~ Done (Phase 5 — 23 routes)
11. **Add daily horoscope pages** — Phase 8A (highest traffic potential)
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
│   ├── sitemap.ts            # Dynamic sitemap (30+ entries)
│   ├── robots.ts             # Search engine directives
│   ├── about/page.tsx
│   ├── blog/page.tsx         # Blog index
│   ├── blog/[slug]/page.tsx  # MDX blog post renderer (next-mdx-remote)
│   ├── api/contact/route.ts  # Contact form API (Resend)
│   ├── api/fortune-card/route.tsx # Edge: OG image for fortune shares (1200x630)
│   ├── contact/page.tsx
│   ├── daily/page.tsx        # Daily fortune page + 7-day history
│   ├── f/[id]/page.tsx       # Fortune share landing page (base64url encoded)
│   ├── fortune/[category]/page.tsx  # 8 category fortune pages (SSG)
│   ├── zodiac/[sign]/page.tsx       # 12 zodiac fortune pages (SSG)
│   ├── lucky-numbers/page.tsx       # Daily lucky numbers page
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
│   ├── Header.tsx            # Responsive nav
│   └── Footer.tsx            # Footer links + Explore section
├── content/
│   └── blog/                 # MDX blog posts with YAML frontmatter (10+ posts)
├── lib/
│   ├── blog.ts               # Blog content loader (getAllPosts, getPost)
│   ├── fortuneEngine.ts      # Fortune logic, streaks, journal, seededRandom, category helpers
│   └── analytics.ts          # GA4 event tracking (disabled)
└── data/
    └── fortunes.json         # 1,031+ fortunes (auto-growing weekly)

scripts/
├── generate-post.ts          # Two-stage Claude API blog post generator
├── quality-check.ts          # Content quality validation (structural + AI review)
├── auto-fix.ts               # Self-healing post fixer (frontmatter, H1→H2, etc.)
├── generate-fortunes.ts      # Weekly fortune database growth via Claude API
├── generate-horoscopes.ts    # Daily/weekly/monthly horoscope generation via Claude API
├── generate-seasonal.ts      # Seasonal holiday content generation via Claude API
├── validate-content.ts       # Data integrity validation (fortunes, horoscopes, blog)
└── seasonal-state.json       # Tracks which seasonal content has been generated per year

.github/workflows/
├── auto-blog.yml             # Cron (Tue/Fri 9AM UTC): generate + validate + publish
├── auto-fortunes.yml         # Cron (Sun 10AM UTC): generate 20 new fortunes + validate + publish
├── auto-horoscopes.yml       # Cron (Daily 6AM UTC): daily/weekly/monthly horoscopes for 12 signs
├── auto-seasonal.yml         # Cron (Mon 8AM UTC): seasonal content if holiday window active
├── content-health.yml        # Weekly (Mon noon UTC): blog/horoscope/fortune freshness + URL pings + auto-triggers
├── link-check.yml            # Weekly (Mon 6AM UTC): broken link detection → deduplicated issues
└── lighthouse.yml            # Weekly (Wed 6AM UTC): SEO + performance audit
```

### Planned File Additions (Phase 8)

```
src/app/
├── horoscope/
│   ├── page.tsx                    # Horoscope hub
│   ├── daily/[sign]/page.tsx       # Daily horoscope (12 signs)
│   ├── weekly/[sign]/page.tsx      # Weekly horoscope (12 signs)
│   └── monthly/[sign]/page.tsx     # Monthly horoscope (12 signs)
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
├── generate-horoscopes.ts         # Daily/weekly/monthly horoscope generation via Claude API
└── generate-compatibility.ts      # One-time: generate 144 compatibility pages

.github/workflows/
└── auto-horoscope.yml             # Daily: generate horoscopes for all 12 signs
```

---

## Automation Pipeline (Self-Sufficient)

| Schedule | Workflow | What It Does | Self-Healing |
|----------|----------|-------------|-------------|
| Daily 6AM UTC | auto-horoscopes | Daily/weekly/monthly horoscopes for 12 signs | Retry + issue + auto-close |
| Tue/Fri 9AM UTC | auto-blog | Blog post: generate + fix + quality check + retry | Retry + issue + auto-close |
| Sun 10AM UTC | auto-fortunes | 20 new fortunes to smallest category (cap: 3000) | Retry + issue + auto-close |
| Mon 6AM UTC | link-check | Broken link detection | Deduplicated issues |
| Mon 8AM UTC | auto-seasonal | Seasonal content if holiday window active | Issue + auto-close |
| Mon noon UTC | content-health | Blog/horoscope/fortune freshness + URL pings + auto-trigger stale pipelines | Issue + auto-trigger |
| Wed 6AM UTC | lighthouse | SEO, performance, accessibility audit | Issue |
| On push | dependabot-updates | Auto-merge Dependabot PRs after CI passes | Auto-merge |

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
```
