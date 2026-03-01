# AdSense Content Quality Improvement Design

**Date:** 2026-03-01
**Goal:** Pass Google AdSense approval by reducing thin content footprint and enriching remaining pages

## Problem

Google AdSense rejected fortunecrack.com for "low-value content" (가치가 별로 없는 콘텐츠). Root causes:

1. Site is < 1 month old with minimal organic traffic
2. 56 of 70+ pages are AI-generated programmatic pages (horoscopes, categories, zodiac)
3. These pages are template-repetitive with thin unique content
4. Interactive value (physics cookie breaking) is client-side JS, invisible to crawlers

## Approach: Reduce Footprint + Concentrate Value

Hide thin pages from Google's index while enriching the remaining ~15 strong pages with editorial content. Users still see everything; Google only evaluates the best content.

## Changes

### 1. noindex 56 thin pages

Add `robots: { index: false, follow: true }` to metadata in:

- `src/app/horoscope/page.tsx` (hub)
- `src/app/horoscope/daily/[sign]/page.tsx` (12 pages)
- `src/app/horoscope/weekly/[sign]/page.tsx` (12 pages)
- `src/app/horoscope/monthly/[sign]/page.tsx` (12 pages)
- `src/app/fortune/[category]/page.tsx` (8 pages)
- `src/app/zodiac/[sign]/page.tsx` (12 pages)

`follow: true` preserves internal link equity.

### 2. Remove from sitemap + block in robots.txt

**sitemap.ts:** Remove all horoscope, category, and zodiac routes.

**robots.ts:** Add Disallow rules for `/horoscope/`, `/fortune/`, `/zodiac/`.

### 3. Enrich 4 indexed pages

| Page | Addition | Words |
|------|----------|-------|
| Homepage (`/`) | "Why Fortune Crack?" + "How It Works" sections | 200-300 |
| Daily (`/daily`) | "About Your Daily Fortune" explainer | ~150 |
| About (`/about`) | Editorial rewrite with personal voice | 400-500 |
| Lucky Numbers (`/lucky-numbers`) | Number symbolism context | 100-150 |

Total: ~600-800 words of new editorial content.

### 4. Pages that stay indexed (~15)

- `/` (homepage)
- `/daily` (daily fortune)
- `/lucky-numbers`
- `/about`
- `/contact`
- `/privacy`, `/terms`
- `/blog` + 14 individual blog posts
- `/f/[id]` (share pages)

### 5. No structural changes

- No new files or routes
- No dependency changes
- Internal navigation to hidden pages stays intact for users

## Limitations

- **Site age:** Google may still reject sites under 3 months. If rejected again, wait 2-4 weeks and reapply.
- **Traffic:** AdSense reviewers look for real user signals. Social sharing and community engagement help.
- **Blog content:** If AI-generated blog posts are flagged separately, hand-edit 3-5 posts with personal voice and real citations.

## Post-Approval Plan

Gradually re-index hidden pages by removing noindex tags and adding routes back to sitemap.
