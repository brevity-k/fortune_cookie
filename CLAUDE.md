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
| Blog Auto-Generation | Not Started | Claude API script + GitHub Actions |
| Shareable Fortune Cards | Not Started | Wordle-style share image for each fortune |
| Programmatic SEO Pages | Not Started | /fortune/[category], /zodiac/[sign], /lucky-numbers |
| PWA + Push Notifications | Not Started | Daily fortune push notification |
| Site Health Monitoring | Not Started | Lighthouse CI, link checker, SEO audits |
| Testing | None | No test framework |

---

## Growth Strategy (Research-Based)

### Competitive Landscape

| Site | Monthly Visitors | Key Strength |
|---|---|---|
| fortunecookiemessage.com | ~100K | Fortune database, 88% female audience |
| Co-Star (astrology app) | Millions | Daily push notifications, personality-driven sharing |
| NYT Games (Wordle) | 10M+ daily | Daily ritual + emoji-grid shareable results |
| neal.fun | Viral spikes | Interactive novelty experiences, social sharing |

### What Works for High-Traffic Sites

1. **Daily ritual mechanic** — Wordle proved "one thing per day" drives massive daily return visits. NYT Games retention is highest when users engage weekly.
2. **Shareable result cards** — Wordle's emoji grid generated 23.5M tweets. Visual results are 40x more likely to be shared than text.
3. **Personality/identity content** — Quizzes achieve 80% participation, 90% completion. People share results that reflect positively on them.
4. **Programmatic SEO** — Auto-generated pages targeting long-tail keywords (e.g., "/fortune/love", "/zodiac/aries") capture search traffic at scale.
5. **Push notifications** — 68% higher engagement than other re-engagement methods. 7-15% open rate vs 1-3% for email.
6. **Frictionless onboarding** — Zero sign-up, instant core experience. Virality dies at barriers.

### Our Advantages

- Interactive physics-based experience (unique in fortune cookie niche)
- 1,031 curated fortunes with rarity system (gamification)
- Daily fortune mechanic already exists (needs enhancement)
- MDX blog ready for auto-generation
- Dynamic OG images already working

---

## Implementation Roadmap

### Phase 3: Auto-Blog Pipeline (NEXT — Week 1-2)

**Goal:** Self-sufficient blog that publishes 2-3 posts/week with zero manual input.

#### Files to Create

| File | Purpose |
|---|---|
| `scripts/generate-post.ts` | Two-stage Claude API content generation (topic selection + writing) |
| `scripts/quality-check.ts` | Automated content validation (frontmatter, word count, structure, AI review) |
| `scripts/auto-fix.ts` | Self-healing post fixer (truncate descriptions, fix H1s, ensure tags array) |
| `.github/workflows/auto-blog.yml` | Cron workflow: generate → quality-check → publish (Tue/Fri 9AM UTC) |

#### Generation Script Design (`scripts/generate-post.ts`)

- **Stage 1** (cheap): Claude Sonnet selects topic. Reads existing slugs to avoid duplicates. Rotates through 5 content pillars based on post count.
- **Stage 2** (main): Claude Sonnet writes 1,000-1,500 word post with specific constraints: heading structure, internal links, keyword density, no filler.
- **Output**: MDX file with frontmatter (title, slug, description, date, category, tags, readTime, draft:false)
- **GitHub Actions output**: slug, title, word_count for downstream jobs

#### Quality Gates (`scripts/quality-check.ts`)

1. Frontmatter validation (required fields, description length <= 160 chars)
2. Word count >= 600
3. H2 count >= 3
4. Internal link present
5. No H1 headings (template provides H1)
6. AI quality review via Claude (score 1-10, must be >= 6)

#### Self-Correction

- Retry on API failure (3 attempts, 30s wait)
- Auto-fix common issues (truncate descriptions, remove H1, fix slug/date)
- Regenerate if quality check fails (delete + re-run generation)
- Build check as final gate before commit

#### GitHub Actions Workflow Structure

```
auto-blog.yml (cron: Tue/Fri 9AM UTC + manual trigger)
├── generate (npx tsx scripts/generate-post.ts)
├── quality-check (npx tsx scripts/quality-check.ts + npm run build)
└── publish (git commit + push → triggers Vercel auto-deploy)
```

#### Cost Estimate

| Item | Cost/Month |
|---|---|
| Claude API (~10-14 posts/month) | ~$1-2 |
| GitHub Actions (~60-120 min/month) | Free tier |
| Vercel builds (~10-14/month) | Free tier |
| **Total** | **~$1-2/month** |

### Phase 4: Shareable Fortune Cards (Week 3)

**Goal:** Wordle-style shareable result after breaking a fortune cookie.

#### Concept

After breaking a cookie and revealing a fortune, generate a shareable card image showing:
- The fortune text
- Category + rarity badge (color-coded)
- Cookie break emoji pattern (unique per session, like Wordle's emoji grid)
- "fortunecrack.com" branding

#### Implementation

- **Dynamic OG image route**: `/api/fortune-card?text=...&category=...&rarity=...`
- Uses `next/og` ImageResponse (already used for blog OG images)
- Share buttons updated to include the card URL as og:image
- **Emoji grid format** for text-based sharing: `🥠💛 My fortune: "..." — fortunecrack.com`
  - Rarity indicators: 💛 Common, 💙 Rare, 💜 Epic, ❤️ Legendary

#### Why This Matters

- Tweets with visual cards get 40% higher engagement
- Each share becomes a free ad with branded preview image
- Creates viral loop: see friend's fortune → visit site → break own → share

### Phase 5: Programmatic SEO Pages (Week 4)

**Goal:** Auto-generated pages targeting long-tail keywords to capture organic search.

#### Pages to Create

| Route Pattern | Example | Target Keywords |
|---|---|---|
| `/fortune/[category]` | `/fortune/love` | "love fortune cookie", "romance fortune" |
| `/fortune/[category]` | `/fortune/career` | "career fortune cookie", "work fortune" |
| `/zodiac/[sign]` | `/zodiac/aries` | "aries fortune today", "aries lucky message" |
| `/lucky-numbers` | `/lucky-numbers` | "lucky numbers today", "fortune cookie numbers" |
| `/daily` | `/daily` | "daily fortune cookie", "fortune of the day" |

#### Implementation

- Each page renders a filtered fortune + "break a cookie" CTA
- `/zodiac/[sign]` uses daily seeded RNG + sign index for personalized daily fortune
- `/lucky-numbers` generates 6 daily lucky numbers (seeded RNG)
- All pages get auto-generated JSON-LD (FAQPage schema for rich snippets)
- Auto-included in sitemap via `getAllPosts()` pattern

#### SEO Impact

- 8 category pages + 12 zodiac pages + 2 utility pages = 22 new indexable routes
- Each targets specific long-tail keywords with low competition
- Daily-changing content signals freshness to search engines

### Phase 6: PWA + Push Notifications (Week 5)

**Goal:** Daily fortune push notification to drive return visits.

#### Implementation

- Add `manifest.json` and service worker for PWA support
- "Get daily fortune notifications" opt-in prompt (after first cookie break, not on load)
- Daily push at user's local morning time: "Your fortune awaits 🥠"
- Notification click opens the daily fortune page

#### Why This Matters

- Push notifications: 68% higher engagement, 7-15% open rate
- PWA installable on home screen (mobile)
- No app store needed — works from the browser

### Phase 7: Site Health Monitoring (Ongoing)

**Goal:** Automated monitoring with zero manual oversight.

#### Workflows

| Workflow | Schedule | Purpose |
|---|---|---|
| `.github/workflows/auto-blog.yml` | Tue/Fri 9AM UTC | Generate + publish blog posts |
| `.github/workflows/link-check.yml` | Weekly (Sun midnight) | Detect broken links, auto-create GitHub issue |
| `.github/workflows/lighthouse.yml` | Weekly (Mon 6AM) | SEO + performance audit |

#### Self-Healing Capabilities

- Blog generation retries 3x on API failure
- Auto-fix script corrects common frontmatter/content issues
- Quality check rejects + regenerates low-scoring content
- Build verification before every publish
- Broken link detection creates GitHub issues automatically

---

## Content Pillars (Rotating for Auto-Generation)

1. **Luck & Superstition** — lucky charms, rituals, cultural beliefs, science of luck
2. **Wellness & Mindfulness** — positive psychology, daily rituals, gratitude, small joys
3. **Astrology & Spirituality** — zodiac, tarot, divination history, fortune-telling cultures
4. **Fun Lists & Stories** — "X things that...", real-life fortune stories, viral moments
5. **Food & Culture** — dessert traditions, Asian cuisine, cultural fusion, food history

### Post Requirements

- Minimum 600 words (target 1,000-1,500)
- SEO-friendly title with target keyword
- 4-6 H2 sections for scannability
- Internal link to homepage ("break a fortune cookie")
- Meta description from frontmatter `excerpt` field (max 160 chars)

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

## Fortune Data

- **Total:** 1,031 fortunes in `src/data/fortunes.json`
- **Categories:** wisdom (200), love (150), career (150), humor (150), motivation (150), philosophy (101), adventure (80), mystery (50)
- **Rarities:** Common 63%, Rare 24%, Epic 8%, Legendary 5%
- **Daily Fortune:** Seeded RNG (mulberry32) — same fortune globally per day

---

## GitHub Secrets Required

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API for blog auto-generation + quality checks |
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
8. **Build auto-blog pipeline** (scripts + GitHub Actions) — Phase 3
9. **Add shareable fortune card images** — Phase 4
10. **Create programmatic SEO pages** (/fortune/[category], /zodiac/[sign], /lucky-numbers) — Phase 5
11. **Add PWA + push notifications** — Phase 6
12. Configure AdSense (add publisher ID)

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with interactive cookie
│   ├── layout.tsx            # Root layout (GA/AdSense scripts here)
│   ├── globals.css           # Theme variables, animations
│   ├── sitemap.ts            # Dynamic sitemap generation
│   ├── robots.ts             # Search engine directives
│   ├── about/page.tsx
│   ├── blog/page.tsx         # Blog index
│   ├── blog/[slug]/page.tsx  # MDX blog post renderer (next-mdx-remote)
│   ├── api/contact/route.ts  # Contact form API (Resend)
│   ├── contact/page.tsx
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
│   ├── ShareButtons.tsx      # Social sharing
│   ├── ContactForm.tsx       # Contact form with validation
│   ├── AdUnit.tsx            # AdSense (disabled, no pub ID)
│   ├── CookieConsent.tsx     # GDPR consent banner
│   ├── Header.tsx            # Responsive nav
│   └── Footer.tsx            # Footer links
├── content/
│   └── blog/                 # MDX blog posts with YAML frontmatter (10 posts)
├── lib/
│   ├── blog.ts               # Blog content loader (getAllPosts, getPost)
│   ├── fortuneEngine.ts      # Fortune logic, streaks, journal
│   └── analytics.ts          # GA4 event tracking (disabled)
└── data/
    └── fortunes.json         # 1,031 fortunes

scripts/                      # (Phase 3 — to be created)
├── generate-post.ts          # Claude API blog post generator
├── quality-check.ts          # Content quality validation
└── auto-fix.ts               # Self-healing post fixer

.github/workflows/            # (Phase 3 — to be created)
├── auto-blog.yml             # Cron: auto-generate + publish blog posts
├── link-check.yml            # Weekly: broken link detection
└── lighthouse.yml            # Weekly: SEO + performance audit
```

---

## Build & Run

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
