# Fortune Cookie - Project Progress & Status

**Domain:** fortunecrack.com
**Stack:** Next.js 16 + TypeScript + Pixi.js + Matter.js + GSAP + Howler.js
**Last Audited:** 2026-02-11

---

## Progress Overview

| Area | Status | Notes |
|---|---|---|
| Core Interactive App | Done | 5 break methods, physics, sounds, animations |
| Fortune System | Done | 1,031 fortunes, 8 categories, 4 rarities, streaks |
| Cookie Consent Banner | Done | GDPR-compliant accept/reject with localStorage |
| SEO (basic) | Done | Meta tags, Open Graph, Twitter cards, sitemap, robots.txt |
| Blog Content | Done | 5 posts, all expanded to 1,200-1,600 words each |
| Legal Pages | Done | Privacy Policy & Terms of Service |
| About Page | Done | Technology breakdown, features, categories |
| Contact Form | Done | Form with Resend auto-response + owner notification |
| Social Sharing | Done | Twitter/X, Facebook, WhatsApp, clipboard |
| Google Analytics | Not Active | Code exists, no measurement ID configured |
| Google AdSense | Not Active | 3 ad slots coded, publisher ID empty |
| Environment Variables | Done | .env.local with Resend API key, .env.example committed |
| Deployment | Not Configured | No vercel.json, no CI/CD |
| Blog Automation | Not Started | Posts are hardcoded in TSX |
| OG Images | Missing | No social sharing images |
| JSON-LD Structured Data | Missing | No schema.org markup |
| Testing | None | No test framework |
| CI/CD | None | No GitHub Actions |

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

Blog system is **hardcoded** in `src/app/blog/[slug]/page.tsx`. No CMS, no automated generation.

---

## Automatic Blog Posting Strategy

**Goal:** Publish 2-3 new posts per week to build organic SEO traffic.

### Content Pillars (rotate weekly)
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
- Meta description auto-generated from first 160 chars

### Upcoming Post Ideas
- "How to Create Your Own Luck: 7 Science-Backed Strategies"
- "Tarot vs Fortune Cookies: Two Traditions of Finding Meaning"
- "The Most Iconic Fortune Cookie Moments in Movies and TV"
- "What Your Favorite Fortune Cookie Category Says About You"
- "Mindful Eating: The Forgotten Art of Savoring Every Bite"
- "Why Breaking Things Feels So Good: The Psychology of Destruction"
- "Fortune Cookies vs Horoscopes: Which Is More Accurate?"
- "The 50 Greatest Fortune Cookie Messages of All Time"
- "How Different Cultures Find Daily Inspiration"
- "The Surprising Health Benefits of Laughter and Lightheartedness"

### Automation Plan (Future)
1. **Phase 1 (current):** Manual — posts hardcoded in TSX
2. **Phase 2:** Migrate to MDX files in `/content/blog/` for easier authoring
3. **Phase 3:** Add a script (`scripts/generate-post.ts`) that uses Claude API to draft posts from topic + outline, outputs MDX
4. **Phase 4:** GitHub Action cron job (2x/week) that auto-generates, commits, and deploys new posts

---

## Fortune Data

- **Total:** 1,031 fortunes in `src/data/fortunes.json`
- **Categories:** wisdom (200), love (150), career (150), humor (150), motivation (150), philosophy (101), adventure (80), mystery (50)
- **Rarities:** Common 63%, Rare 24%, Epic 8%, Legendary 5%
- **Daily Fortune:** Seeded RNG (mulberry32) — same fortune globally per day

---

## AdSense Activation Checklist

1. [ ] Deploy site to fortunecrack.com
2. [ ] Apply for Google AdSense
3. [ ] Set `ADSENSE_PUB_ID` in `src/components/AdUnit.tsx:6`
4. [ ] Uncomment AdSense script in `src/app/layout.tsx:63-69`
5. [ ] Configure ad slot IDs (top-leaderboard, post-reveal-rectangle, bottom-leaderboard)

---

## Analytics Activation Checklist

1. [ ] Create GA4 property
2. [ ] Add GA script tag to layout.tsx (currently commented out)
3. [ ] Set measurement ID in analytics code
4. [ ] Events already coded: cookie_break, fortune_reveal, share_click, new_cookie

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

1. ~~Expand all blog posts to 500+ words each~~ Done (10 posts, 1.2-1.6k words each)
2. Migrate blog to MDX for easier authoring, then add auto-generation script
3. Enable Google Analytics (add measurement ID)
4. Configure AdSense (add publisher ID)
5. Add OG images for social sharing
6. Add JSON-LD structured data (Organization, Article, BreadcrumbList)
7. ~~Set up environment variables (.env.local) instead of hardcoded values~~ Done
8. Deploy to Vercel

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
│   ├── blog/[slug]/page.tsx  # Hardcoded blog posts (5 posts, 1.2-1.6k words)
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
├── lib/
│   ├── fortuneEngine.ts      # Fortune logic, streaks, journal
│   └── analytics.ts          # GA4 event tracking (disabled)
└── data/
    └── fortunes.json         # 1,031 fortunes
```

---

## Build & Run

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
