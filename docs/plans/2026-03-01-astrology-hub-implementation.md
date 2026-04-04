# Astrology Content Hub — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform fortunecrack.com from a fortune cookie tool site (21 indexed pages) into an astrology & fortune content hub (~100 indexed pages) to pass Google AdSense review.

**Architecture:** Add a `/learn/` knowledge base section with 10+ deep educational pages (2,000+ words each), enable indexing on existing horoscope/category/zodiac pages with enriched editorial content, add editorial identity (author bylines, editorial policy page), redesign homepage as content gateway, expand blog to 25+ posts. All new pages follow existing Next.js 16 patterns: `generateStaticParams`, `generateMetadata` with `await params`, `revalidate = 43200`, BreadcrumbJsonLd + FAQPageJsonLd, `bg-warm-gradient` wrapper, `mx-auto max-w-2xl` container.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, MDX (next-mdx-remote/rsc), gray-matter

---

## Context

- AdSense rejected for "low-value content" — site appears to be a tool/widget, not a content destination
- Only 21 pages in sitemap; 56 pages (horoscope/category/zodiac) are marked `noindex`
- No E-E-A-T signals (no author identity, no editorial policy)
- Competitors (horoscope.com 11.47M/mo, cafeastrology.com 5.42M/mo) all wrap tools in massive educational content
- Design doc: `docs/plans/2026-03-01-astrology-content-hub-redesign.md`

## Key Conventions (from codebase)

- **Metadata**: `SITE_URL`, `SITE_NAME` from `@/lib/constants`
- **Dynamic pages**: `export async function generateMetadata({ params }: { params: Promise<{...}> }): Promise<Metadata>` — must `await params`
- **Static generation**: `export function generateStaticParams()` returns array
- **ISR**: `export const revalidate = 43200` (12 hours)
- **Page wrapper**: `<div className="bg-warm-gradient min-h-screen px-4 py-16">`
- **Container**: `<article className="mx-auto max-w-2xl">` or `max-w-3xl`/`max-w-4xl`
- **H1**: `<h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">`
- **H2**: `<h2 className="text-xl font-semibold text-gold mb-4">`
- **Body text**: `<p className="leading-relaxed text-muted">` or `text-foreground/70`
- **JSON-LD**: `BreadcrumbJsonLd` + `FAQPageJsonLd` on content pages
- **Cards**: `rounded-2xl border border-border bg-background p-6`
- **Links**: `text-gold hover:underline` or `hover:text-gold transition`
- **Not found**: Return `<div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">` with message

---

## Phase 1: Foundation — E-E-A-T & Indexing (AdSense Critical)

### Task 1: Create Editorial Policy Page

**Files:**
- Create: `src/app/editorial-policy/page.tsx`

**Step 1: Create the page**

```tsx
// src/app/editorial-policy/page.tsx
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: `Learn about ${SITE_NAME}'s editorial standards, content creation process, and commitment to quality astrology and fortune content.`,
  alternates: { canonical: `${SITE_URL}/editorial-policy` },
  openGraph: {
    title: `Editorial Policy | ${SITE_NAME}`,
    description: `Our editorial standards and content creation process.`,
    url: `${SITE_URL}/editorial-policy`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Editorial Policy | ${SITE_NAME}`,
    description: `Our editorial standards and content creation process.`,
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Editorial Policy", url: `${SITE_URL}/editorial-policy` },
        ]}
      />
      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">
          Editorial Policy
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Our Mission</h2>
            <p className="leading-relaxed text-muted mb-3">
              Fortune Crack exists to bring moments of reflection, delight, and
              cosmic curiosity to people around the world. We combine the
              centuries-old tradition of fortune cookies with astrology, numerology,
              and digital interactivity to create a unique daily ritual.
            </p>
            <p className="leading-relaxed text-muted">
              Our editorial team is committed to delivering content that is accurate,
              thoughtful, and genuinely useful — whether you are a seasoned astrology
              enthusiast or cracking your first virtual fortune cookie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Content Standards</h2>
            <p className="leading-relaxed text-muted mb-3">
              Every piece of content on Fortune Crack meets the following standards:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                <strong className="text-foreground/70">Research-backed:</strong> Our
                educational articles cite historical sources, psychological studies,
                and established astrological traditions. We reference specific works,
                authors, and institutions.
              </li>
              <li>
                <strong className="text-foreground/70">Original writing:</strong> All
                articles are written by our editorial team. We do not republish,
                scrape, or spin content from other sites.
              </li>
              <li>
                <strong className="text-foreground/70">Minimum depth:</strong> Guide
                and educational articles are at least 1,500 words. Blog posts are at
                least 1,200 words. Every page offers genuine value beyond surface-level
                summaries.
              </li>
              <li>
                <strong className="text-foreground/70">Regular updates:</strong> Daily
                horoscopes update every morning. Blog posts publish 2-3 times per week.
                Fortune collections grow weekly.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              Astrology &amp; Fortune Content
            </h2>
            <p className="leading-relaxed text-muted mb-3">
              We approach astrology as a cultural and psychological tradition, not as
              a predictive science. Our horoscopes are written to inspire reflection
              and self-awareness, drawing on the rich symbolism of Western astrology
              (tropical zodiac system), Chinese astrology, and Vedic numerological
              traditions.
            </p>
            <p className="leading-relaxed text-muted">
              Our fortune cookie messages are handcrafted and curated across eight
              thematic categories — wisdom, love, career, humor, motivation,
              philosophy, adventure, and mystery — with four rarity tiers to make
              each discovery feel special.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              AI Transparency
            </h2>
            <p className="leading-relaxed text-muted mb-3">
              Some content on Fortune Crack uses AI-assisted generation as a starting
              point, including daily horoscope readings and initial blog post drafts.
              All AI-generated content is reviewed, edited, and enhanced by our
              editorial team before publication. We believe in using AI as a tool to
              increase the volume and freshness of our content while maintaining human
              editorial judgment and voice.
            </p>
            <p className="leading-relaxed text-muted">
              Our educational guides, zodiac profiles, and learn section articles are
              primarily human-written, with AI used only for research assistance and
              fact-checking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              Corrections &amp; Feedback
            </h2>
            <p className="leading-relaxed text-muted mb-3">
              If you notice an error in any of our content — whether factual,
              astrological, or typographical — please let us know through our{" "}
              <a href="/contact" className="text-gold hover:underline">
                contact page
              </a>
              . We take accuracy seriously and will investigate and correct any
              confirmed errors promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              Advertising &amp; Independence
            </h2>
            <p className="leading-relaxed text-muted">
              Fortune Crack may display advertisements to support the free availability
              of all our content and tools. Advertising never influences our editorial
              content, fortune messages, or horoscope readings. Our fortunes are
              selected by algorithms, not advertisers.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/editorial-policy/page.tsx
git commit -m "content: add editorial policy page for E-E-A-T signals"
```

---

### Task 2: Redesign About Page with Editorial Identity

**Files:**
- Modify: `src/app/about/page.tsx`

**Step 1: Read current about page**

Read `src/app/about/page.tsx` to understand current content and structure.

**Step 2: Rewrite with editorial identity**

Keep the existing technical explanation content but add:
- "The Fortune Crack Editorial Team" section introducing the team (use "Fortune Crack Editorial Team" as the author identity — do not use real names per CLAUDE.md developer identity policy)
- "Our Approach to Astrology" section explaining the editorial philosophy
- "What Makes Us Different" section highlighting the unique interactive + educational combination
- Internal links to `/editorial-policy`, `/learn/`, `/blog`

Target: 1,200+ words total (up from ~800).

The key addition is a visible editorial team section that Google can crawl for E-E-A-T:

```tsx
<section>
  <h2 className="text-xl font-semibold text-gold mb-3">
    The Fortune Crack Editorial Team
  </h2>
  <p className="leading-relaxed text-muted mb-3">
    Fortune Crack is maintained by a small team of astrology enthusiasts,
    web developers, and writers who share a passion for bringing ancient
    wisdom traditions into the digital age. Our team combines expertise in:
  </p>
  <ul className="list-disc pl-6 space-y-2 text-muted">
    <li><strong className="text-foreground/70">Astrology &amp; Divination:</strong> Western tropical astrology, Chinese zodiac, numerology, and tarot traditions</li>
    <li><strong className="text-foreground/70">Psychology:</strong> The Barnum effect, positive psychology, and the science of meaning-making</li>
    <li><strong className="text-foreground/70">Web Technology:</strong> Physics simulation, WebGL rendering, and interactive design</li>
    <li><strong className="text-foreground/70">Cultural History:</strong> Fortune cookie origins, divination traditions across cultures, and food history</li>
  </ul>
  <p className="leading-relaxed text-muted mt-3">
    Read more about our standards in our <a href="/editorial-policy" className="text-gold hover:underline">editorial policy</a>.
  </p>
</section>
```

**Step 3: Verify build**

Run: `npx next build`

**Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "content: redesign about page with editorial team identity"
```

---

### Task 3: Enable Indexing on Horoscope Pages + Add Editorial Content

**Files:**
- Modify: `src/app/horoscope/page.tsx` — remove `index: false` from robots
- Modify: `src/app/horoscope/daily/[sign]/page.tsx` — remove `index: false`, add editorial section
- Modify: `src/app/horoscope/weekly/[sign]/page.tsx` — remove `index: false`, add editorial section
- Modify: `src/app/horoscope/monthly/[sign]/page.tsx` — remove `index: false`, add editorial section

**Step 1: Read all horoscope page files**

Read each file to understand exact code structure before modifying.

**Step 2: For each file, make these changes:**

a) **Remove `index: false` from robots metadata.** Either remove the `robots` key entirely (default is indexable) or change to `{ index: true, follow: true }`.

b) **Add editorial content section** after the horoscope display and before the "Other Zodiac Signs" section. This section should be sign-specific, not generic. Create a `SIGN_EDITORIAL` data object with 300-500 words per sign covering:

For daily horoscope pages:
```tsx
// Add this data object near the top of the file
const SIGN_INSIGHTS: Record<string, { title: string; content: string[] }> = {
  aries: {
    title: "Understanding Your Aries Daily Horoscope",
    content: [
      "As the first sign of the zodiac, Aries is ruled by Mars — the planet of action, desire, and assertiveness. Your daily horoscope reflects Mars's influence on your energy levels, motivation, and drive. When Mars forms favorable aspects with other planets, you may find yourself brimming with initiative and confidence. During challenging transits, your daily reading helps you channel that fire sign intensity into productive rather than impulsive action.",
      "Aries daily horoscopes are particularly relevant for decisions about career moves, physical activity, and personal goals. As a cardinal fire sign, you thrive on new beginnings — pay special attention to your horoscope on Mondays and at the start of each month, when the energy of fresh starts aligns with your natural rhythm.",
      "Your love rating reflects Venus's current relationship to Mars, while your career rating tracks Jupiter and Saturn's influence on your ambitions. Health ratings consider Mars's impact on your physical energy and stress levels.",
    ],
  },
  // ... similar entries for all 12 signs
};
```

Then render it:
```tsx
{/* Editorial Section */}
<section className="rounded-2xl border border-border bg-background p-6 mb-8">
  <h2 className="text-lg font-semibold text-gold mb-3">
    {insight.title}
  </h2>
  {insight.content.map((paragraph, i) => (
    <p key={i} className="leading-relaxed text-muted mb-3 last:mb-0">
      {paragraph}
    </p>
  ))}
</section>
```

c) **Add visible FAQ section** (currently only JSON-LD, not visible):
```tsx
<section className="rounded-2xl border border-border bg-background p-6 mb-8">
  <h2 className="text-lg font-semibold text-gold mb-4">
    Frequently Asked Questions
  </h2>
  <div className="space-y-4">
    {faqs.map((faq, i) => (
      <div key={i}>
        <h3 className="text-sm font-semibold text-foreground/70 mb-1">{faq.q}</h3>
        <p className="text-sm text-muted">{faq.a}</p>
      </div>
    ))}
  </div>
</section>
```

d) **Add internal links section:**
```tsx
<div className="flex flex-wrap gap-2 mb-8">
  <Link href={`/zodiac/${sign}`} className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
    {signTitle} Fortune →
  </Link>
  <Link href="/learn/zodiac-signs" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
    Learn About Zodiac Signs →
  </Link>
  <Link href="/blog" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
    Read Articles →
  </Link>
</div>
```

**Step 3: Apply the same pattern to weekly and monthly pages**

Weekly pages: Focus on planetary transits for the week, weekly rhythms for each sign.
Monthly pages: Focus on lunar cycles, monthly themes, seasonal influences for each sign.

Each variant should have unique editorial content, not copy-pasted from daily.

**Step 4: Update the hub page (`horoscope/page.tsx`)**

Remove `index: false`, add 500+ words of editorial content about how horoscopes work, the tradition of daily horoscope reading, and how to interpret love/career/health ratings.

**Step 5: Verify build**

Run: `npx next build`

**Step 6: Commit**

```bash
git add src/app/horoscope/
git commit -m "content: enable indexing on horoscope pages, add editorial content per sign"
```

---

### Task 4: Enable Indexing on Category Pages

**Files:**
- Modify: `src/app/fortune/[category]/page.tsx`

**Step 1: Read the file**

Read `src/app/fortune/[category]/page.tsx`.

**Step 2: Remove `index: false` from robots metadata**

Change the robots metadata from `{ index: false, follow: true }` to remove the robots key entirely (default is indexable).

**Step 3: Add cultural context section**

The page already has `CATEGORY_DESCRIPTIONS` with 200-300 word descriptions. Add a second section: "Fortune Cookies in the [Category] Tradition" with 300-400 words covering:
- Historical context of this fortune theme across cultures
- Why this type of fortune resonates with people
- Practical tips for applying these fortunes

Create a `CATEGORY_CULTURAL_CONTEXT` data object with content for all 8 categories.

**Step 4: Add internal links to related blog posts**

Add a "Related Reading" section linking to 2-3 blog posts relevant to each category.

**Step 5: Verify build**

Run: `npx next build`

**Step 6: Commit**

```bash
git add src/app/fortune/[category]/page.tsx
git commit -m "content: enable indexing on category pages, add cultural context sections"
```

---

### Task 5: Enable Indexing on Zodiac Pages + Enrich Content

**Files:**
- Modify: `src/app/zodiac/[sign]/page.tsx`

**Step 1: Read the file**

Read `src/app/zodiac/[sign]/page.tsx`.

**Step 2: Remove `index: false` from robots metadata**

**Step 3: Expand personality section**

Current personality paragraphs are 100-150 words. Expand to 500-800 words per sign. Create a `SIGN_PROFILES` data object covering:
- Personality deep dive (2-3 paragraphs)
- Strengths and challenges (expanded from current lists)
- Fortune cookie wisdom that resonates with this sign (2-3 curated fortunes with brief commentary)

**Step 4: Add cross-links**

Link to:
- `/horoscope/daily/[sign]` — "Read Today's Horoscope"
- `/learn/zodiac-signs` — "Learn More About Zodiac Signs"  (once created in Phase 2)
- Related blog posts

**Step 5: Verify build**

Run: `npx next build`

**Step 6: Commit**

```bash
git add src/app/zodiac/[sign]/page.tsx
git commit -m "content: enable indexing on zodiac pages, expand personality profiles"
```

---

### Task 6: Enrich Daily Fortune Page

**Files:**
- Modify: `src/app/daily/page.tsx`

**Step 1: Read the file**

Read `src/app/daily/page.tsx`.

**Step 2: Remove `index: false` if present**

**Step 3: Add educational section**

Add a 500+ word section below the daily fortune display explaining:
- How the daily fortune algorithm works (date-seeded RNG, same for everyone globally)
- The psychology behind daily rituals (citing research on habit formation and the Zeigarnik effect)
- The tradition of daily fortune reading across cultures (Chinese, Japanese, Western)
- How to use your daily fortune as a reflection prompt

**Step 4: Add visible FAQ section**

**Step 5: Verify build**

Run: `npx next build`

**Step 6: Commit**

```bash
git add src/app/daily/page.tsx
git commit -m "content: enrich daily fortune page with educational content"
```

---

### Task 7: Update Sitemap to Include All Now-Indexed Pages

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Read current sitemap**

Read `src/app/sitemap.ts`.

**Step 2: Add all newly-indexed pages**

Add these page groups to the sitemap:

```typescript
import { ZODIAC_SIGNS } from "@/lib/horoscopes";
import { CATEGORIES } from "@/lib/fortuneEngine";

// ... existing entries ...

// Horoscope pages
const horoscopeEntries: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/horoscope`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.8,
  },
  ...ZODIAC_SIGNS.flatMap((sign) => [
    {
      url: `${baseUrl}/horoscope/daily/${sign.key}`,
      lastModified: today,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/horoscope/weekly/${sign.key}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/horoscope/monthly/${sign.key}`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]),
];

// Category pages
const categoryEntries = CATEGORIES.map((cat) => ({
  url: `${baseUrl}/fortune/${cat}`,
  lastModified: today,
  changeFrequency: "daily" as const,
  priority: 0.6,
}));

// Zodiac pages
const zodiacEntries = ZODIAC_SIGNS.map((sign) => ({
  url: `${baseUrl}/zodiac/${sign.key}`,
  lastModified: today,
  changeFrequency: "daily" as const,
  priority: 0.6,
}));

// Editorial policy
const editorialEntry = {
  url: `${baseUrl}/editorial-policy`,
  lastModified: staticPageDate,
  changeFrequency: "monthly" as const,
  priority: 0.4,
};

// Daily fortune
const dailyEntry = {
  url: `${baseUrl}/daily`,
  lastModified: today,
  changeFrequency: "daily" as const,
  priority: 0.7,
};
```

Include all these in the returned array.

**Step 3: Verify build**

Run: `npx next build`

**Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "seo: expand sitemap from 21 to 80+ URLs with newly-indexed pages"
```

---

### Task 8: Add Author Bylines to Blog Posts

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Read the file**

Read `src/app/blog/[slug]/page.tsx`.

**Step 2: Add author byline to blog post template**

After the date/readTime display, add:
```tsx
<span>·</span>
<span>By Fortune Crack Editorial Team</span>
```

**Step 3: Update ArticleJsonLd author**

The existing ArticleJsonLd already uses `Organization` as author. Verify this is correct — it should be:
```json
"author": {
  "@type": "Organization",
  "name": "Fortune Crack Editorial Team",
  "url": "https://www.fortunecrack.com/about"
}
```

If it currently just says "Fortune Cookie", update it.

**Step 4: Verify build**

Run: `npx next build`

**Step 5: Commit**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "content: add author byline to blog posts for E-E-A-T"
```

---

### Task 9: Update Header Navigation

**Files:**
- Modify: `src/components/Header.tsx`

**Step 1: Read the file**

Read `src/components/Header.tsx`.

**Step 2: Update nav links**

Desktop and mobile nav should be:
```
Home | Horoscopes | Learn | Blog | Fortune Cookie | About
```

Note: The "Learn" link points to `/learn` (created in Phase 2). Until Phase 2, it can point to `/blog` or be omitted.

For Phase 1, use:
```
Home | Horoscopes | Blog | About
```
(Same as current, which is fine.)

**Step 3: Commit** (if changes were needed)

---

### Task 10: Update Footer Navigation

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: Read the file**

Read `src/components/Footer.tsx`.

**Step 2: Update footer columns**

Add editorial policy link to Pages column:
```tsx
<Link href="/editorial-policy" className="text-muted transition hover:text-gold">
  Editorial Policy
</Link>
```

Update Explore section to include Daily Fortune:
```tsx
<Link href="/daily" className="text-muted transition hover:text-gold">Daily Fortune</Link>
<Link href="/lucky-numbers" className="text-muted transition hover:text-gold">Lucky Numbers</Link>
<Link href="/horoscope" className="text-muted transition hover:text-gold">Horoscopes</Link>
<Link href="/fortune/wisdom" className="text-muted transition hover:text-gold">Fortune Categories</Link>
<Link href="/zodiac/aries" className="text-muted transition hover:text-gold">Zodiac Signs</Link>
```

**Step 3: Verify build**

Run: `npx next build`

**Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "nav: add editorial policy and daily fortune to footer"
```

---

## Phase 2: Knowledge Base — Learn Section

### Task 11: Create Learn Data Module

**Files:**
- Create: `src/data/learn/zodiac-signs.ts`
- Create: `src/data/learn/elements.ts`
- Create: `src/data/learn/planets.ts`
- Create: `src/data/learn/houses.ts`
- Create: `src/data/learn/numerology.ts`
- Create: `src/data/learn/fortune-cookie-history.ts`
- Create: `src/data/learn/tarot-basics.ts`
- Create: `src/data/learn/moon-phases.ts`
- Create: `src/data/learn/chinese-zodiac.ts`

Each file exports content as structured data (title, sections with headings and paragraphs, FAQs). This separates content from presentation.

**Step 1: Define the data structure**

Create `src/data/learn/types.ts`:

```typescript
export interface LearnSection {
  heading: string;
  paragraphs: string[];
}

export interface LearnPageData {
  title: string;
  subtitle: string;
  description: string; // for meta description
  keywords: string[];
  sections: LearnSection[];
  faqs: { q: string; a: string }[];
}
```

**Step 2: Create zodiac-signs.ts** (the most important learn page)

This should be 2,000-2,500 words covering:
- Introduction to the zodiac system (tropical vs sidereal, history)
- The 12 signs overview (dates, element, modality, ruling planet — brief 2-3 sentence summary each)
- How zodiac signs interact with fortune cookies
- Elements and modalities overview
- How to find your zodiac sign

**Step 3: Create similar data files for all 10 topics**

Each file should contain 1,500-2,500 words of genuine, educational content. Content should cite cultural traditions, historical sources, and psychological concepts. Avoid generic filler.

**Step 4: Commit**

```bash
git add src/data/learn/
git commit -m "content: add learn section data files for knowledge base"
```

---

### Task 12: Create Learn Hub Page

**Files:**
- Create: `src/app/learn/page.tsx`

**Step 1: Create the hub page**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Learn Astrology & Fortune Traditions",
  description: "Explore our guides on zodiac signs, planets, numerology, tarot, moon phases, Chinese zodiac, and fortune cookie history. Free astrology education.",
  alternates: { canonical: `${SITE_URL}/learn` },
  openGraph: {
    title: `Learn Astrology & Fortune Traditions | ${SITE_NAME}`,
    description: "Free astrology guides: zodiac signs, planets, numerology, tarot, and more.",
    url: `${SITE_URL}/learn`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Learn Astrology & Fortune Traditions | ${SITE_NAME}`,
    description: "Free astrology guides: zodiac signs, planets, numerology, tarot, and more.",
  },
};

const guides = [
  { title: "Zodiac Signs", description: "Complete guide to all 12 zodiac signs — personality traits, compatibility, and strengths", href: "/learn/zodiac-signs", emoji: "♈" },
  { title: "The Four Elements", description: "Fire, Earth, Air, and Water — how elements shape zodiac personality", href: "/learn/elements", emoji: "🔥" },
  { title: "Planets in Astrology", description: "The meaning of Sun, Moon, Mercury, Venus, Mars, and the outer planets", href: "/learn/planets", emoji: "🪐" },
  { title: "Astrological Houses", description: "The 12 houses and what each governs in your birth chart", href: "/learn/houses", emoji: "🏠" },
  { title: "Numerology", description: "The power of lucky numbers — Pythagorean, Chinese, and Vedic traditions", href: "/learn/numerology", emoji: "🔢" },
  { title: "Fortune Cookie History", description: "The surprising true origin of fortune cookies and their cultural journey", href: "/learn/fortune-cookie-history", emoji: "🥠" },
  { title: "Tarot Basics", description: "Introduction to tarot cards — Major and Minor Arcana explained", href: "/learn/tarot-basics", emoji: "🃏" },
  { title: "Moon Phases", description: "The 8 lunar phases and their spiritual and astrological significance", href: "/learn/moon-phases", emoji: "🌙" },
  { title: "Chinese Zodiac", description: "The 12 animal signs, five elements, and 60-year cycle of Chinese astrology", href: "/learn/chinese-zodiac", emoji: "🐉" },
];

export default function LearnHub() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Learn", url: `${SITE_URL}/learn` },
        ]}
      />

      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-3">
            Learn Astrology &amp; Fortune Traditions
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Explore our in-depth guides on astrology, numerology, tarot, and the
            rich cultural history of fortune-telling traditions from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group rounded-2xl border border-border bg-background p-5 transition hover:border-gold/30 hover:bg-gold/5"
            >
              <div className="text-3xl mb-3">{guide.emoji}</div>
              <h2 className="text-lg font-semibold text-foreground/90 group-hover:text-gold transition mb-2">
                {guide.title}
              </h2>
              <p className="text-sm text-muted">{guide.description}</p>
              <span className="mt-3 inline-block text-xs text-gold/60 group-hover:text-gold transition">
                Read guide →
              </span>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gold mb-3">
            Why Learn About Astrology?
          </h2>
          <p className="leading-relaxed text-muted">
            Astrology is one of humanity's oldest systems for finding meaning in
            the cosmos. Whether you approach it as psychology, mythology, cultural
            history, or personal reflection, understanding astrological concepts
            enriches your relationship with time, seasons, and self-awareness. Our
            guides are designed for curious beginners and seasoned enthusiasts
            alike — grounded in tradition, written for modern readers.
          </p>
          <p className="leading-relaxed text-muted">
            Each guide covers the essential knowledge you need, from the basics of
            zodiac signs to the nuances of planetary transits. We draw on Western
            tropical astrology, Chinese astrological traditions, Vedic numerology,
            and the rich history of divination practices across cultures.
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npx next build`

**Step 3: Commit**

```bash
git add src/app/learn/page.tsx
git commit -m "feat: create learn section hub page"
```

---

### Task 13: Create Learn Page Template Component

**Files:**
- Create: `src/components/LearnPage.tsx`

**Step 1: Create a reusable learn page component**

This is a server component that renders the standard learn page layout from `LearnPageData`:

```tsx
import Link from "next/link";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";
import type { LearnPageData } from "@/data/learn/types";

interface LearnPageProps {
  data: LearnPageData;
  slug: string;
  relatedLinks?: { title: string; href: string }[];
}

export default function LearnPage({ data, slug, relatedLinks }: LearnPageProps) {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Learn", url: `${SITE_URL}/learn` },
          { name: data.title, url: `${SITE_URL}/learn/${slug}` },
        ]}
      />
      {data.faqs.length > 0 && <FAQPageJsonLd faqs={data.faqs} />}

      <article className="mx-auto max-w-3xl">
        <Link
          href="/learn"
          className="mb-8 inline-flex items-center gap-1 text-sm text-foreground/40 transition hover:text-gold"
        >
          ← Back to Learn
        </Link>

        <header className="mb-8">
          <h1 className="text-golden-shimmer mb-3 text-3xl font-bold md:text-4xl">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-foreground/50 text-lg">{data.subtitle}</p>
          )}
        </header>

        <div className="space-y-8">
          {data.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-gold mb-3">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="leading-relaxed text-muted mb-3 last:mb-0">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {data.faqs.length > 0 && (
          <section className="mt-10 rounded-2xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-gold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-foreground/70 mb-1">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedLinks && relatedLinks.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1"
              >
                {link.title} →
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-border pt-8">
          <Link href="/learn" className="text-gold transition hover:text-gold-light">
            ← Explore more guides
          </Link>
        </div>
      </article>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npx next build`

**Step 3: Commit**

```bash
git add src/components/LearnPage.tsx src/data/learn/types.ts
git commit -m "feat: create reusable LearnPage component and data types"
```

---

### Task 14: Create Individual Learn Pages (9 pages)

**Files:**
- Create: `src/app/learn/zodiac-signs/page.tsx`
- Create: `src/app/learn/elements/page.tsx`
- Create: `src/app/learn/planets/page.tsx`
- Create: `src/app/learn/houses/page.tsx`
- Create: `src/app/learn/numerology/page.tsx`
- Create: `src/app/learn/fortune-cookie-history/page.tsx`
- Create: `src/app/learn/tarot-basics/page.tsx`
- Create: `src/app/learn/moon-phases/page.tsx`
- Create: `src/app/learn/chinese-zodiac/page.tsx`

Each page follows the same pattern:

```tsx
// Example: src/app/learn/zodiac-signs/page.tsx
import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { zodiacSignsData } from "@/data/learn/zodiac-signs";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: zodiacSignsData.title,
  description: zodiacSignsData.description,
  keywords: zodiacSignsData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/zodiac-signs` },
  openGraph: {
    title: `${zodiacSignsData.title} | ${SITE_NAME}`,
    description: zodiacSignsData.description,
    url: `${SITE_URL}/learn/zodiac-signs`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${zodiacSignsData.title} | ${SITE_NAME}`,
    description: zodiacSignsData.description,
  },
};

export default function ZodiacSignsLearnPage() {
  return (
    <LearnPage
      data={zodiacSignsData}
      slug="zodiac-signs"
      relatedLinks={[
        { title: "Daily Horoscopes", href: "/horoscope" },
        { title: "Zodiac Fortunes", href: "/zodiac/aries" },
        { title: "The Four Elements", href: "/learn/elements" },
      ]}
    />
  );
}
```

**Step 1: Create all 9 learn pages** following this exact pattern. Each page is ~20 lines of code — the content lives in the data files.

**Step 2: Add all learn pages to sitemap**

Update `src/app/sitemap.ts`:

```typescript
const learnSlugs = [
  "zodiac-signs", "elements", "planets", "houses", "numerology",
  "fortune-cookie-history", "tarot-basics", "moon-phases", "chinese-zodiac",
];

const learnEntries = learnSlugs.map((slug) => ({
  url: `${baseUrl}/learn/${slug}`,
  lastModified: staticPageDate,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

// Also add the hub
const learnHubEntry = {
  url: `${baseUrl}/learn`,
  lastModified: staticPageDate,
  changeFrequency: "monthly" as const,
  priority: 0.8,
};
```

**Step 3: Verify build**

Run: `npx next build`

**Step 4: Commit**

```bash
git add src/app/learn/ src/app/sitemap.ts
git commit -m "feat: create 9 learn section pages with educational content"
```

---

### Task 15: Create Zodiac Deep-Dive Pages (12 pages)

**Files:**
- Create: `src/data/learn/zodiac-profiles.ts` — detailed profile data for all 12 signs
- Create: `src/app/learn/zodiac/[sign]/page.tsx` — dynamic route for sign deep-dives

**Step 1: Create zodiac profile data**

`src/data/learn/zodiac-profiles.ts` should export a `Record<string, LearnPageData>` with 2,000+ words per sign covering:
- Personality overview (ruling planet, element, modality, dates)
- Core traits deep dive
- Strengths and positive qualities
- Challenges and growth areas
- Love and relationships
- Career and money
- Famous people of this sign
- Fortune cookie wisdom that resonates with this sign
- FAQs (3-4 per sign)

**Step 2: Create the dynamic page**

```tsx
// src/app/learn/zodiac/[sign]/page.tsx
import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { zodiacProfiles } from "@/data/learn/zodiac-profiles";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const profile = zodiacProfiles[sign];
  if (!profile) return { title: "Sign not found" };

  return {
    title: profile.title,
    description: profile.description,
    keywords: profile.keywords,
    alternates: { canonical: `${SITE_URL}/learn/zodiac/${sign}` },
    openGraph: {
      title: `${profile.title} | ${SITE_NAME}`,
      description: profile.description,
      url: `${SITE_URL}/learn/zodiac/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.title} | ${SITE_NAME}`,
      description: profile.description,
    },
  };
}

export default async function ZodiacLearnPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const profile = zodiacProfiles[sign];

  if (!profile) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">
        Zodiac sign not found.
      </div>
    );
  }

  return (
    <LearnPage
      data={profile}
      slug={`zodiac/${sign}`}
      relatedLinks={[
        { title: `${sign.charAt(0).toUpperCase() + sign.slice(1)} Daily Horoscope`, href: `/horoscope/daily/${sign}` },
        { title: `${sign.charAt(0).toUpperCase() + sign.slice(1)} Fortune`, href: `/zodiac/${sign}` },
        { title: "All Zodiac Signs", href: "/learn/zodiac-signs" },
      ]}
    />
  );
}
```

**Step 3: Add to sitemap**

```typescript
const zodiacLearnEntries = ZODIAC_SIGNS.map((sign) => ({
  url: `${baseUrl}/learn/zodiac/${sign.key}`,
  lastModified: staticPageDate,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));
```

**Step 4: Verify build**

Run: `npx next build`

**Step 5: Commit**

```bash
git add src/data/learn/zodiac-profiles.ts src/app/learn/zodiac/ src/app/sitemap.ts
git commit -m "feat: create 12 zodiac deep-dive learn pages"
```

---

## Phase 3: Homepage Redesign

### Task 16: Redesign Homepage as Content Hub

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Read current homepage**

Read `src/app/page.tsx`.

**Step 2: Redesign layout**

The new homepage should be a content gateway, not a tool page. New layout (top to bottom):

1. **Hero** — Keep existing H1 + date
2. **"Featured Today" card row** (3 cards in a grid):
   - Today's Fortune (from existing dailyFortune)
   - Today's Horoscope highlight (pick one featured sign based on date)
   - Today's Lucky Numbers (link to /lucky-numbers)
3. **"Break a Fortune Cookie" prominent CTA** — Large, eye-catching button linking to `/` (the cookie game stays on the homepage but is visually secondary to content)
4. **CookieGameSection** — Keep the interactive cookie widget (this is your unique differentiator) but position it as one section among many, not the entire page
5. **"Explore Fortune &amp; Astrology" grid** — Cards linking to Learn pages, Horoscopes, Categories, Zodiac
6. **Latest Articles** — 6 blog posts (up from 3)
7. **"The Story Behind the Cookie"** — Keep existing 800-word section (this is great content)
8. **Visible FAQ section** — Render existing FAQs visually (not just JSON-LD)

**Step 3: Implement the changes**

The key structural change is adding the "Explore" grid and expanding the blog section. The cookie game stays on the homepage — we are NOT moving it to a separate page (that would hurt the unique interactive experience that differentiates this site).

```tsx
{/* Explore Fortune & Astrology */}
<section className="mx-auto max-w-4xl px-4 py-10">
  <h2 className="text-2xl font-bold text-foreground/80 mb-6 text-center">
    Explore Fortune &amp; Astrology
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {[
      { emoji: "♈", title: "Zodiac Signs", href: "/learn/zodiac-signs" },
      { emoji: "🔮", title: "Daily Horoscopes", href: "/horoscope" },
      { emoji: "🔢", title: "Lucky Numbers", href: "/lucky-numbers" },
      { emoji: "🪐", title: "Planets Guide", href: "/learn/planets" },
      { emoji: "🌙", title: "Moon Phases", href: "/learn/moon-phases" },
      { emoji: "🃏", title: "Tarot Basics", href: "/learn/tarot-basics" },
      { emoji: "🐉", title: "Chinese Zodiac", href: "/learn/chinese-zodiac" },
      { emoji: "🥠", title: "Cookie History", href: "/learn/fortune-cookie-history" },
    ].map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center transition hover:border-gold/30 hover:bg-gold/5"
      >
        <span className="text-2xl">{item.emoji}</span>
        <span className="text-xs font-medium text-foreground/70 group-hover:text-gold transition">
          {item.title}
        </span>
      </Link>
    ))}
  </div>
</section>
```

**Step 4: Verify build**

Run: `npx next build`

**Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign homepage as content hub with explore grid"
```

---

### Task 17: Update Header with Learn Link

**Files:**
- Modify: `src/components/Header.tsx`

**Step 1: Add Learn link to navigation**

Update both desktop and mobile nav:
```
Home | Horoscopes | Learn | Blog | About
```

**Step 2: Verify build**

Run: `npx next build`

**Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "nav: add Learn section to header navigation"
```

---

### Task 18: Update Footer with Learn Section Links

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: Add Learn section to footer**

Add a "Learn" column:
```tsx
<div>
  <h3 className="mb-3 text-sm font-semibold text-foreground/80">Learn</h3>
  <div className="flex flex-col gap-2 text-sm">
    <Link href="/learn/zodiac-signs" className="text-muted transition hover:text-gold">Zodiac Signs</Link>
    <Link href="/learn/numerology" className="text-muted transition hover:text-gold">Numerology</Link>
    <Link href="/learn/tarot-basics" className="text-muted transition hover:text-gold">Tarot Basics</Link>
    <Link href="/learn/moon-phases" className="text-muted transition hover:text-gold">Moon Phases</Link>
    <Link href="/learn/chinese-zodiac" className="text-muted transition hover:text-gold">Chinese Zodiac</Link>
  </div>
</div>
```

This changes footer from 4-column to 5-column. On mobile it remains responsive.

**Step 2: Verify build**

Run: `npx next build`

**Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "nav: add Learn section links to footer"
```

---

## Phase 4: Blog Expansion

### Task 19: Write 16 New Blog Posts

**Files:**
- Create: 16 new `.mdx` files in `src/content/blog/`

**Step 1: Write blog posts**

Create the following blog posts (each 1,200-1,500 words):

1. `beginners-guide-birth-chart.mdx` — "A Beginner's Guide to Reading Your Birth Chart"
2. `mercury-retrograde-explained.mdx` — "Mercury Retrograde Explained: What It Actually Means"
3. `rising-sign-guide.mdx` — "Your Rising Sign: The Mask You Show the World"
4. `understanding-moon-signs.mdx` — "Understanding Moon Signs: Your Emotional Blueprint"
5. `how-fortune-cookies-are-made.mdx` — "How Fortune Cookies Are Actually Made: Inside the Factory"
6. `mathematics-of-luck.mdx` — "The Mathematics of Luck: Probability and Why Lucky Streaks Feel Real"
7. `fortune-telling-traditions-worldwide.mdx` — "Fortune Telling Traditions Around the World"
8. `zodiac-communication-styles.mdx` — "What Your Zodiac Sign Says About Your Communication Style"
9. `zodiac-career-strengths.mdx` — "Zodiac Signs at Work: Career Strengths by Astrological Sign"
10. `astrology-vs-mbti.mdx` — "Astrology vs MBTI: How They Compare as Personality Systems"
11. `spring-equinox-2026.mdx` — "Spring Equinox 2026: Astrological Significance and Fortune Predictions"
12. `full-moon-rituals.mdx` — "Full Moon Rituals: How to Use Lunar Energy for Manifestation"
13. `master-numbers-numerology.mdx` — "Master Numbers in Numerology: The Power of 11, 22, and 33"
14. `daily-fortune-rituals.mdx` — "Daily Rituals for Good Fortune: What Different Cultures Practice"
15. `journaling-with-fortune-cookies.mdx` — "Journaling with Fortune Cookies: A 30-Day Self-Reflection Practice"
16. `psychology-of-horoscopes.mdx` — "The Psychology of Hope: Why Reading Your Horoscope Actually Helps"

Each post must follow this frontmatter format:
```yaml
---
title: "Full Title Here"
date: "2026-03-XX"
readTime: "X min read"
excerpt: "Max 160 chars for meta description."
---
```

And follow these quality standards:
- 1,200+ words minimum
- 4-6 H2 sections
- At least 1 internal link to fortune cookie homepage or learn page
- At least 1 cited source, study, or cultural reference
- Natural, engaging voice — not AI boilerplate

**Step 2: Verify build**

Run: `npx next build`

**Step 3: Commit in batches of 4-5 posts**

```bash
git add src/content/blog/
git commit -m "content: add 16 new blog posts for astrology content expansion"
```

---

## Phase 5: Final Verification & Sitemap

### Task 20: Final Sitemap Verification

**Files:**
- Modify: `src/app/sitemap.ts` (if not already updated)

**Step 1: Verify final sitemap contains all pages**

The sitemap should include:
- Homepage (1)
- Learn hub (1) + 9 topic pages + 12 zodiac deep-dives = 22
- Horoscope hub (1) + 36 sign pages = 37
- 8 category pages
- 12 zodiac fortune pages
- Daily fortune (1)
- Lucky numbers (1)
- Blog hub (1) + ~30 blog posts
- About (1), Contact (1), Editorial policy (1)
- Privacy (1), Terms (1)

**Total: ~105+ URLs**

**Step 2: Full build check**

Run: `npx next build`
Expected: Clean build with all pages generated.

**Step 3: Verify no remaining `index: false` on content pages**

Search for remaining `index: false` in the codebase:
```bash
grep -r "index: false" src/app/ --include="*.tsx"
```

The only pages that should still have `index: false`:
- `src/app/f/[id]/page.tsx` (share landing pages — thin by design)

All other content pages should be indexable.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "chore: final verification — all content pages indexed, sitemap complete"
```

---

## Summary

| Phase | Tasks | New Pages | Key Outcome |
|---|---|---|---|
| Phase 1: Foundation | Tasks 1-10 | 2 new pages (editorial policy, enriched daily) | E-E-A-T signals, 56 pages un-noindexed, sitemap 21→80+ |
| Phase 2: Knowledge Base | Tasks 11-15 | 22 new pages (hub + 9 topics + 12 zodiac deep-dives) | Deep educational content for high-volume keywords |
| Phase 3: Homepage | Tasks 16-18 | 0 new (redesign existing) | Homepage becomes content gateway |
| Phase 4: Blog | Task 19 | 16 new blog posts | Blog count 14→30, all 1,200+ words |
| Phase 5: Verification | Task 20 | 0 | 105+ indexed pages, clean build |

**After completing all phases:** Wait 2-4 weeks for Google to re-crawl, then reapply for AdSense.
