# Fortune Cookie — fortunecrack.com

## Developer Identity Policy

**STRICT:** Never disclose the developer's real name, personal email, or any GitHub accounts other than `brevity-k` in any code, commits, comments, PRs, issues, documentation, or AI-generated content related to this project. The only public identity for this project is `brevity-k`.

**Domain:** fortunecrack.com | **Stack:** Next.js 16 + TypeScript + Pixi.js + Matter.js + GSAP + Howler.js | **Hosting:** Vercel

## Current Status

| Area | Status |
|---|---|
| Core Interactive App | Done — 5 break methods, physics, sounds, animations |
| Fortune System | Done — 1,091 fortunes, 8 categories, 4 rarities, streaks |
| SEO + JSON-LD | Done — meta, OG, sitemap, structured data |
| Blog (14 MDX posts) | Done — auto-generated 2-3x/week via Claude API |
| Shareable Fortune Cards | Done — /api/fortune-card + /f/[id] share landing |
| Programmatic SEO (23 routes) | Done — category + zodiac + daily + lucky-numbers |
| Horoscope Pages (36 pages) | Done — daily/weekly/monthly x 12 signs |
| Auto X + Bluesky Posting | Done — 2 posts/day via twitter-api-v2 + @atproto/api |
| Site Health + Self-Healing | Done — link-check, lighthouse, content-health workflows |
| Google AdSense | Not Active — 3 slots coded, publisher ID needed |

> Growth strategy details in `.private/business-strategy.md`. Upcoming phases (compatibility, birth chart, tarot, moon fortune) in `.private/NOTES.md`.

## Directory Overview

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage with interactive cookie
│   ├── fortune/[category]/       # 8 category fortune pages
│   ├── horoscope/                # Hub + daily/weekly/monthly/[sign] (36 pages)
│   ├── zodiac/[sign]/            # 12 zodiac fortune pages
│   ├── daily/, lucky-numbers/    # Daily fortune, lucky numbers
│   ├── blog/[slug]/              # MDX blog post renderer (next-mdx-remote)
│   ├── f/[id]/                   # Fortune share landing
│   ├── api/contact/              # Contact form (Resend)
│   └── api/fortune-card/         # Edge: dynamic OG image (1200x630)
├── components/
│   ├── CookieCanvas.tsx          # Main interactive component (Pixi.js + Matter.js)
│   ├── FortuneReveal.tsx         # Typewriter reveal + social sharing
│   ├── JsonLd.tsx                # Organization, WebSite, Article, Breadcrumb, FAQPage
│   └── StarRating.tsx            # Horoscope ratings
├── content/blog/                 # MDX blog posts with YAML frontmatter
├── lib/
│   ├── blog.ts                   # getAllPosts, getPost (content loader)
│   ├── fortuneEngine.ts          # Fortune logic, streaks, seededRandom
│   └── horoscopes.ts             # Horoscope data loader
├── data/
│   ├── fortunes.json             # 1,091 fortunes (auto-growing weekly)
│   └── horoscopes.json           # Daily/weekly/monthly horoscope data
scripts/
├── generate-post.ts              # Claude API blog generator (two-stage)
├── generate-fortunes.ts          # Weekly fortune growth
├── generate-horoscopes.ts        # Daily/weekly/monthly horoscope gen
├── post-to-x.ts                  # Auto-post to X (Twitter)
├── post-to-bluesky.ts            # Auto-post to Bluesky
└── quality-check.ts, auto-fix.ts, validate-content.ts
.github/workflows/                # 10 workflows (auto-blog, auto-fortunes, auto-horoscopes, auto-x-post, ci, content-health, etc.)
```

## Build & Run

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint
```

### Content Scripts

```bash
npm run blog:generate        # Generate a new blog post
npm run blog:fix             # Auto-fix blog post issues
npm run blog:quality         # AI quality check on latest post
npm run fortune:generate     # Generate 20 new fortunes
npm run horoscope:generate   # Generate horoscopes
npm run content:validate     # Validate all data file integrity
npm run x:post               # Post fortune + horoscope to X + Bluesky
```

## Fortune Data

- **Total:** 1,091 fortunes in `src/data/fortunes.json` (auto-growing ~20/week)
- **Categories:** wisdom (200), love (170), career (150), humor (150), motivation (150), philosophy (101), mystery (90), adventure (80)
- **Rarities:** Common 61%, Rare 23%, Epic 7%, Legendary 8%
- **Daily Fortune:** Seeded RNG (mulberry32) — same fortune globally per day
- **Blog:** MDX files in `src/content/blog/` with YAML frontmatter, loaded via `next-mdx-remote/rsc`

## GitHub Secrets Required

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API (blog, fortunes, horoscopes, quality checks) |
| `X_CONSUMER_KEY` / `X_SECRET_KEY` | X (Twitter) API |
| `X_ACCESS_TOKEN` / `X_ACCESS_TOKEN_SECRET` | X user tokens |
| `BLUESKY_HANDLE` / `BLUESKY_APP_PASSWORD` | Bluesky posting |

## Automation Summary

10 GitHub Actions workflows run this site autonomously:
- **Daily:** horoscopes (5AM UTC), X+Bluesky posts (8AM + 2PM UTC)
- **Tue/Fri:** blog post generation (9AM UTC)
- **Weekly:** fortune generation (Sun 10AM UTC), link-check (Mon 6AM), content-health (Mon noon), lighthouse (Wed 6AM)
- **On PR:** CI pipeline (required status check)

All workflows have retry + failure issues + auto-close on recovery. Content-health auto-triggers stale pipelines.

See `.private/NOTES.md` for detailed automation tables, upcoming phases (8B-E: compatibility, birth chart, tarot, moon fortune), SEO strategy, content pillars, and seasonal content windows.

## Contact Form

- Resend integration: `src/app/api/contact/route.ts`
- Auto-response to sender + notification to owner
- Env: `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL` in `.env.local`
- Using `onboarding@resend.dev` sender — verify own domain for production

## AdSense Activation

1. Set `ADSENSE_PUB_ID` in `src/components/AdUnit.tsx:6`
2. Uncomment AdSense script in `src/app/layout.tsx:63-69`
3. Configure ad slot IDs

## Debugging GitHub Actions

- `gh run view <id> --log-failed` — fastest failure diagnosis
- `continue-on-error: true` steps show check even when failed; check `steps.<id>.outcome`
