# AdSense Content Quality Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Pass Google AdSense approval by noindexing 56 thin pages, removing them from sitemap/robots, and enriching 4 remaining pages with editorial content.

**Architecture:** Edit existing page metadata to add `robots: { index: false, follow: true }`, update `sitemap.ts` to exclude thin routes, update `robots.ts` to disallow thin sections, and add editorial text sections to 4 pages.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS

---

### Task 1: Add noindex to horoscope hub page

**Files:**
- Modify: `src/app/horoscope/page.tsx:15-43`

**Step 1: Add robots noindex to metadata**

In `src/app/horoscope/page.tsx`, add `robots` field to the existing `metadata` export:

```typescript
export const metadata: Metadata = {
  title: "Daily Horoscopes & Zodiac Readings",
  description:
    "Read your free daily, weekly, and monthly horoscope for all 12 zodiac signs. Get personalized astrology readings with love, career, and health predictions.",
  robots: {
    index: false,
    follow: true,
  },
  keywords: [
    // ... existing keywords unchanged
```

**Step 2: Verify the change builds**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/horoscope/page.tsx
git commit -m "seo: noindex horoscope hub page for AdSense compliance"
```

---

### Task 2: Add noindex to horoscope daily/weekly/monthly pages

**Files:**
- Modify: `src/app/horoscope/daily/[sign]/page.tsx:20-49`
- Modify: `src/app/horoscope/weekly/[sign]/page.tsx:20-48`
- Modify: `src/app/horoscope/monthly/[sign]/page.tsx:20-48`

**Step 1: Add robots noindex to daily horoscope generateMetadata**

In `src/app/horoscope/daily/[sign]/page.tsx`, add `robots` to the returned metadata object inside `generateMetadata`:

```typescript
  return {
    title: `${zodiac.name} Daily Horoscope Today - ${formatted}`,
    description: `Read today's ${zodiac.name} horoscope (${zodiac.dateRange}). Get your free daily astrology reading with love, career, and health predictions. Updated daily.`,
    robots: {
      index: false,
      follow: true,
    },
    keywords: [
      // ... rest unchanged
```

**Step 2: Add robots noindex to weekly horoscope generateMetadata**

In `src/app/horoscope/weekly/[sign]/page.tsx`, add `robots` to the returned metadata:

```typescript
  return {
    title: `${zodiac.name} Weekly Horoscope - Week of ${formatted}`,
    description: `${zodiac.name} weekly horoscope for the week of ${formatted}. Get your free weekly astrology reading with love, career insights, and advice.`,
    robots: {
      index: false,
      follow: true,
    },
    keywords: [
      // ... rest unchanged
```

**Step 3: Add robots noindex to monthly horoscope generateMetadata**

In `src/app/horoscope/monthly/[sign]/page.tsx`, add `robots` to the returned metadata:

```typescript
  return {
    title: `${zodiac.name} Monthly Horoscope - ${formatted}`,
    description: `${zodiac.name} horoscope for ${formatted}. Get your free monthly astrology reading with love, career, health predictions, and advice.`,
    robots: {
      index: false,
      follow: true,
    },
    keywords: [
      // ... rest unchanged
```

**Step 4: Commit**

```bash
git add src/app/horoscope/daily/[sign]/page.tsx src/app/horoscope/weekly/[sign]/page.tsx src/app/horoscope/monthly/[sign]/page.tsx
git commit -m "seo: noindex all horoscope sign pages (36 pages)"
```

---

### Task 3: Add noindex to fortune category pages

**Files:**
- Modify: `src/app/fortune/[category]/page.tsx:75-102`

**Step 1: Add robots noindex to generateMetadata**

In `src/app/fortune/[category]/page.tsx`, add `robots` to the returned metadata inside `generateMetadata`:

```typescript
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      // ... rest unchanged
```

**Step 2: Commit**

```bash
git add src/app/fortune/[category]/page.tsx
git commit -m "seo: noindex fortune category pages (8 pages)"
```

---

### Task 4: Add noindex to zodiac sign pages

**Files:**
- Modify: `src/app/zodiac/[sign]/page.tsx:35-64`

**Step 1: Add robots noindex to generateMetadata**

In `src/app/zodiac/[sign]/page.tsx`, add `robots` to the returned metadata inside `generateMetadata`:

```typescript
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      // ... rest unchanged
```

**Step 2: Commit**

```bash
git add src/app/zodiac/[sign]/page.tsx
git commit -m "seo: noindex zodiac sign pages (12 pages)"
```

---

### Task 5: Remove thin pages from sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Remove category, zodiac, and horoscope entries from sitemap**

Replace the entire `src/app/sitemap.ts` with:

```typescript
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const latestPostDate = blogEntries.length > 0
    ? new Date(Math.max(...blogEntries.map((e) => e.lastModified.getTime())))
    : new Date("2026-02-12");

  const staticPageDate = new Date("2026-02-12");

  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/daily`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lucky-numbers`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticPageDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticPageDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: staticPageDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticPageDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...blogEntries,
  ];
}
```

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | tail -20`
Expected: Build succeeds with no import errors

**Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "seo: remove horoscope/category/zodiac routes from sitemap"
```

---

### Task 6: Block thin page sections in robots.txt

**Files:**
- Modify: `src/app/robots.ts`

**Step 1: Add Disallow rules for thin sections**

Replace `src/app/robots.ts` with:

```typescript
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/horoscope/", "/fortune/", "/zodiac/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

**Step 2: Commit**

```bash
git add src/app/robots.ts
git commit -m "seo: block horoscope/fortune/zodiac crawling in robots.txt"
```

---

### Task 7: Enrich homepage with editorial content

**Files:**
- Modify: `src/app/page.tsx:192-211`

**Step 1: Replace the "Magic of Fortune Cookies" section with expanded editorial content**

In `src/app/page.tsx`, replace the existing SEO content section (lines 192-211) with:

```tsx
      {/* Why Fortune Crack */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-golden-shimmer mb-4 text-center text-2xl font-bold">
          Why Fortune Crack?
        </h2>
        <div className="rounded-2xl border border-gold/10 bg-gold/5 p-8 space-y-4">
          <p className="leading-relaxed text-foreground/60">
            Fortune Crack is not just another fortune cookie website. We built something you can
            actually <em>feel</em>. Using real-time physics simulation and WebGL rendering, every
            cookie you break shatters into unique fragments that bounce, spin, and settle naturally.
            The crack sounds, the particle effects, the slow reveal of your fortune — it all comes
            together to recreate the tactile satisfaction of breaking a real cookie.
          </p>
          <p className="leading-relaxed text-foreground/60">
            Most fortune cookie sites give you a random quote and call it a day. We wanted more.
            Fortune Crack features over 1,000 handcrafted fortunes across eight categories — from
            ancient wisdom and philosophical musings to career motivation and laugh-out-loud humor.
            Each fortune carries a rarity tier, and the longer your daily streak, the better your
            chances of discovering something truly legendary.
          </p>
          <p className="leading-relaxed text-foreground/60">
            We also believe fortune cookies are better shared. Every day, everyone in the world
            receives the same Daily Fortune — a shared moment of serendipity that connects strangers
            across time zones. You can share any fortune to social media with a single tap, compare
            lucky numbers with friends, or quietly save your favorites to a personal journal that
            lives right in your browser.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="text-golden-shimmer mb-4 text-center text-2xl font-bold">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gold/10 bg-gold/5 p-6 text-center">
            <div className="text-3xl mb-3">1</div>
            <h3 className="text-sm font-semibold text-gold mb-2">Break</h3>
            <p className="text-xs text-foreground/50">
              Choose your style — tap, drag, shake, double-tap, or squeeze the cookie to crack it open.
            </p>
          </div>
          <div className="rounded-xl border border-gold/10 bg-gold/5 p-6 text-center">
            <div className="text-3xl mb-3">2</div>
            <h3 className="text-sm font-semibold text-gold mb-2">Read</h3>
            <p className="text-xs text-foreground/50">
              Watch your fortune reveal itself letter by letter. Check the rarity — did you get a Legendary?
            </p>
          </div>
          <div className="rounded-xl border border-gold/10 bg-gold/5 p-6 text-center">
            <div className="text-3xl mb-3">3</div>
            <h3 className="text-sm font-semibold text-gold mb-2">Share</h3>
            <p className="text-xs text-foreground/50">
              Share your fortune on Twitter, Facebook, or WhatsApp. Save it to your journal for later.
            </p>
          </div>
        </div>
      </section>
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "content: add 'Why Fortune Crack' and 'How It Works' to homepage"
```

---

### Task 8: Enrich daily fortune page

**Files:**
- Modify: `src/app/daily/page.tsx:130-132`

**Step 1: Add "About Your Daily Fortune" section**

In `src/app/daily/page.tsx`, replace the single-line paragraph after the fortune card (line 130-132):

```tsx
        <p className="text-center text-sm text-foreground/30 mb-10">
          Everyone sees this same fortune today. Come back tomorrow for a new one!
        </p>
```

with:

```tsx
        <div className="rounded-2xl border border-gold/10 bg-gold/5 p-6 mb-10">
          <h2 className="text-lg font-semibold text-gold mb-3">About Your Daily Fortune</h2>
          <p className="text-sm text-foreground/50 leading-relaxed mb-3">
            Every day at midnight UTC, a single fortune is chosen from our collection of over 1,000
            messages using a date-based algorithm. The result is the same for everyone — no matter
            where you are in the world, you and millions of others share the same fortune today.
          </p>
          <p className="text-sm text-foreground/50 leading-relaxed mb-3">
            This is what makes the Daily Fortune special. It turns a personal moment into a communal
            one. Friends compare notes, couples check if they got a love fortune, and strangers on
            social media bond over the same message. Come back tomorrow — your next fortune is
            already waiting.
          </p>
          <p className="text-sm text-foreground/40">
            The past 7 days of fortunes are shown below so you never miss one.
          </p>
        </div>
```

**Step 2: Commit**

```bash
git add src/app/daily/page.tsx
git commit -m "content: add 'About Your Daily Fortune' section to daily page"
```

---

### Task 9: Rewrite about page with editorial voice

**Files:**
- Modify: `src/app/about/page.tsx:25-79`

**Step 1: Replace the AboutPage component with editorial content**

Replace the `AboutPage` function (lines 25-79) in `src/app/about/page.tsx` with:

```tsx
export default function AboutPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">
          About Fortune Crack
        </h1>

        <div className="space-y-6 text-foreground/70 leading-relaxed">
          <p>
            Fortune Crack started with a simple question: why do fortune cookie websites feel so
            lifeless? A real fortune cookie is a tiny event — you hold it, crack it, hear the snap,
            and pull out a slip of paper with your fate scribbled on it. That moment of anticipation
            and surprise is the whole point. We wanted to bring that feeling to the screen.
          </p>

          <p>
            So we built something different. Fortune Crack uses real-time 2D physics powered by
            Matter.js, WebGL rendering through Pixi.js, and cinematic animations with GSAP to
            create a fortune cookie you can actually <em>break</em>. Every fragment is a physics
            object that cracks, bounces, and tumbles. The sound of the break, the shower of
            particles, the slow typewriter reveal of your fortune — these details matter because
            they turn a click into an experience.
          </p>

          <h2 className="text-xl font-semibold text-gold">More Than Random Quotes</h2>
          <p>
            We did not want to serve recycled inspirational quotes from a database. Fortune Crack
            features over 1,000 original fortunes across eight carefully chosen categories: wisdom,
            love, career, humor, motivation, philosophy, adventure, and mystery. Each fortune
            carries a rarity level — Common, Rare, Epic, or Legendary — and your daily streak
            improves your odds of discovering the rarest ones. It is a small game layered on top of
            a simple ritual, and it gives you a reason to come back every day.
          </p>

          <h2 className="text-xl font-semibold text-gold">Five Ways to Break</h2>
          <p>
            We believe in giving you choices. Tap three times for a quick smash. Drag your finger
            across the cookie to throw it. Shake your mouse — or your phone — to rattle it apart.
            Double-tap for a two-stage dramatic crack, or press and hold to squeeze it open slowly.
            Each method triggers a different breaking pattern, so the experience changes every time.
          </p>

          <h2 className="text-xl font-semibold text-gold">A Shared Daily Moment</h2>
          <p>
            Every day, Fortune Crack selects one fortune for the entire world. Using a date-based
            seed, everyone who visits sees the same Daily Fortune — a shared slice of serendipity.
            Friends compare their fortunes on social media. Couples check together over morning
            coffee. It is a small thing, but small things are what fortune cookies are all about.
          </p>

          <h2 className="text-xl font-semibold text-gold">Built for Delight</h2>
          <p>
            Fortune Crack is built with Next.js for speed, Tailwind CSS for clean design, and a
            physics engine that runs at 60 frames per second on every device. We obsess over the
            details — from the exact pitch of the crack sound to the way a fortune fades in letter
            by letter — because we think the internet could use more things that bring people a
            small, unexpected moment of joy.
          </p>
        </div>
      </article>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "content: rewrite about page with editorial voice (400+ words)"
```

---

### Task 10: Enrich lucky numbers page

**Files:**
- Modify: `src/app/lucky-numbers/page.tsx:139-142`

**Step 1: Add number symbolism context**

In `src/app/lucky-numbers/page.tsx`, replace the info paragraph (lines 139-142):

```tsx
        {/* Info */}
        <p className="text-center text-sm text-foreground/30 mb-10">
          Numbers refresh daily at midnight UTC. Everyone sees the same numbers each day.
        </p>
```

with:

```tsx
        {/* Number Symbolism */}
        <div className="rounded-2xl border border-gold/10 bg-gold/5 p-6 mb-10">
          <h2 className="text-lg font-semibold text-gold mb-3">The Power of Lucky Numbers</h2>
          <p className="text-sm text-foreground/50 leading-relaxed mb-3">
            Across cultures and centuries, certain numbers have carried special meaning. The number
            7 is considered lucky in Western traditions, rooted in its prevalence in nature and
            religion — seven days of the week, seven colors of the rainbow. In Chinese culture, 8
            is the luckiest number because it sounds like the word for prosperity. Meanwhile, 3
            symbolizes harmony in many Asian traditions, representing heaven, earth, and humanity.
          </p>
          <p className="text-sm text-foreground/50 leading-relaxed mb-3">
            Your daily lucky numbers are generated using a date-based algorithm, so everyone around
            the world sees the same set each day. Whether you use them for lottery picks, daily
            decisions, or just a fun ritual, they are a fresh set of possibilities delivered to you
            every morning.
          </p>
          <p className="text-sm text-foreground/40">
            Numbers refresh at midnight UTC.
          </p>
        </div>
```

**Step 2: Commit**

```bash
git add src/app/lucky-numbers/page.tsx
git commit -m "content: add number symbolism context to lucky numbers page"
```

---

### Task 11: Verify full build succeeds

**Step 1: Run production build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | tail -30`
Expected: Build completes successfully with no errors

**Step 2: Spot-check sitemap output**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | grep -c "horoscope\|fortune/\|zodiac/"`
Expected: 0 (no horoscope/fortune/zodiac routes in sitemap)

**Step 3: Commit all changes (if any unstaged fixes needed)**

Final verification commit if any fixes were required during build.
