# AdSense Content Quality Improvements

**Date:** 2026-04-06
**Goal:** Address Google AdSense "low value content" rejection by improving E-E-A-T signals, reducing template repetition, adding crawlable homepage text, and humanizing auto-generated content.
**Constraint:** No false claims. Only state what is factually true about the site.

---

## Fix 1: E-E-A-T Signals

### 1A. About Page Rewrite (`src/app/about/page.tsx`)

Replace the current tech-showcase about page with a mission-and-product page.

**Sections:**
1. **Hero** — "About Fortune Crack" + one-liner: daily fortune and astrology destination
2. **What We Offer** — Factual overview: interactive fortune cookie experience, 1,000+ original fortunes across 8 categories, daily horoscopes for 12 zodiac signs, weekly/monthly forecasts, zodiac profiles, lucky numbers, blog content
3. **How It Works** — The interactive experience: physics-based cookie breaking (5 methods), fortune reveal with rarity system, daily seeded fortunes so everyone gets the same one
4. **Our Approach** — Honest methodology:
   - "Fortunes span 8 categories — wisdom, love, career, humor, motivation, philosophy, mystery, and adventure"
   - "Horoscopes are generated daily based on traditional Western astrology principles and current planetary transits"
   - "Content is updated automatically every day to keep readings fresh"
5. **Built With** — Brief tech mention (interactive physics, animations) without overselling
6. **Contact** — Link to /contact

**What NOT to say:** No "team of experts," no "hand-curated," no "editorial review process."

### 1B. Blog Post Author Section (`src/app/blog/[slug]/page.tsx`)

Add an "About Fortune Crack" box after the MDX content:

```
Fortune Crack is a daily fortune and astrology destination featuring 1,000+ original
fortunes, daily horoscopes, and zodiac insights. Updated every day.
[Read more about us →]
```

No changes to blog frontmatter schema. Same attribution everywhere.

### 1C. Horoscope/Zodiac Attribution Lines

**Daily horoscope pages** (`src/app/horoscope/daily/[sign]/page.tsx`):
- Add below the horoscope card: "Based on traditional Western astrology and current planetary positions"

**Zodiac pages** (`src/app/zodiac/[sign]/page.tsx`):
- Add below sign profile: "Based on traditional Western astrology"

These are methodology transparency lines, not author claims.

---

## Fix 2: Differentiate Templated Pages

### 2A. Zodiac Pages (`src/app/zodiac/[sign]/page.tsx`)

**Problem:** 12 pages with identical section structure — Google flags as template content farm.

**Fix:** Add a unique `SIGN_NARRATIVES` object with a freeform opening paragraph per sign. Each narrative should:
- Be 80-150 words
- Use a different angle/tone per sign (e.g., Aries: action-oriented opener; Pisces: reflective/poetic; Scorpio: intense/mysterious)
- NOT follow the same sentence pattern across signs
- Appear as the first content section, before the existing profile

Also vary FAQ questions per sign — replace the current template-swapped questions with 2-3 genuinely different questions per sign that reflect that sign's actual characteristics.

### 2B. Horoscope Daily Pages (`src/app/horoscope/daily/[sign]/page.tsx`)

**Problem:** `SIGN_INSIGHTS` already has unique content per sign, but the page structure is identical (hero → card → insights 3 paragraphs → FAQ → other signs).

**Fix:**
- Add a unique `SIGN_DAILY_CONTEXT` paragraph per sign (40-80 words) that appears between the horoscope card and the insights section. Each should explain what makes this sign's daily reading distinctive (e.g., "Aries daily horoscopes tend to focus on initiative and action because Mars, your ruling planet, drives momentum day by day")
- Vary the number of FAQ items per sign (2-4 instead of exactly 3 for every sign)
- Make FAQ questions genuinely different per sign, not "[Sign] + generic question"

---

## Fix 3: Crawlable Homepage Text

### 3A. "What Is Fortune Crack?" Section (`src/app/page.tsx`)

Add a server-rendered content section between the Explore grid and the blog section. ~300 words covering:
- What Fortune Crack is (daily fortune and astrology site with an interactive twist)
- What makes it different (physics-based cookie breaking, not just a random quote generator)
- What content is available (daily fortunes, horoscopes, zodiac profiles, lucky numbers, blog)
- How often it's updated (daily horoscopes, weekly new fortunes, regular blog posts)

This is purely factual — describing what the site actually offers.

### 3B. Citations in "Story Behind the Cookie" Section

Add real external links to claims already on the homepage:
- "Makoto Hagiwara" → link to Wikipedia article
- "Japanese Tea Garden in San Francisco" → link to official site or Wikipedia
- "Barnum effect" → link to psychology reference (e.g., Wikipedia or APA)
- "World War II" context → link to Smithsonian or history source

These are `<a target="_blank" rel="noopener noreferrer">` tags. Signals to Google that claims are backed by real sources.

---

## Fix 4: Humanize Auto-Generated Content

### 4A. Horoscope Generation Script (`scripts/generate-horoscopes.ts`)

Update the Claude API prompt to produce more natural, varied text:

**Add to system/user prompt:**
- "Vary sentence structure. Do not start every horoscope with a planetary body name."
- "Mix practical daily advice with reflective questions."
- "Use conversational, warm tone — like a knowledgeable friend, not a textbook."
- "Vary length between signs (2-4 sentences, not always exactly 3)."

**Add negative examples:**
- "Do NOT use these patterns: 'Mars charges through your X sector', 'Venus graces your Y house', 'The cosmos aligns to bring', 'planetary energies suggest', 'celestial bodies indicate'"

**No structural changes** to the script — just prompt modifications.

### 4B. Blog Generation Script (`scripts/generate-post.ts`)

Update the Claude API prompt:

**Add to system/user prompt:**
- "Write in a warm, conversational editorial voice."
- "Include specific examples, anecdotes, or scenarios — not just abstract advice."
- "Vary paragraph lengths (some short, some longer)."
- "Not every post needs to be a listicle. Use narrative, Q&A, or essay formats too."
- "Avoid generic AI writing patterns: 'In today's fast-paced world', 'Let's dive in', 'In conclusion', 'Whether you're X or Y'."

**No structural changes** to the script — just prompt modifications.

---

## Files Changed

| File | Change Type | Fix |
|------|------------|-----|
| `src/app/about/page.tsx` | Rewrite | 1A |
| `src/app/blog/[slug]/page.tsx` | Add author section | 1B |
| `src/app/horoscope/daily/[sign]/page.tsx` | Add attribution + unique content + varied FAQs | 1C, 2B |
| `src/app/zodiac/[sign]/page.tsx` | Add attribution + unique narratives + varied FAQs | 1C, 2A |
| `src/app/page.tsx` | Add content section + citations | 3A, 3B |
| `scripts/generate-horoscopes.ts` | Update prompts | 4A |
| `scripts/generate-post.ts` | Update prompts | 4B |

**No new files. No new dependencies. No schema changes.**

---

## Out of Scope

- Fortune category pages (already strong content)
- New pages (compatibility, birth chart, tarot)
- Blog frontmatter schema changes
- Horoscope JSON data edits (regenerated daily by automation)
- AdSense configuration (separate task after re-approval)
