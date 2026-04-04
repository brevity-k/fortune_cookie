# Fortune Crack — Full Site Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete visual overhaul from warm cream to dark mystical theme, remove filler content, add substance to thin pages, and make the entire site match the quality of the interactive cookie game — all to address AdSense "low-value content" rejection.

**Architecture:** CSS-variable-driven theme change in globals.css cascades to all pages via Tailwind. Homepage restructured to focus on game + daily fortune + blog. TodayStats and AdUnit removed. Category/zodiac/lucky-numbers pages get substantial written content.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4 (@theme inline), Pixi.js, Matter.js, GSAP, Howler.js

---

## Context

- AdSense rejected for "low-value content"
- Current warm cream/gold palette feels generic
- TodayStats shows fake simulated data
- Category, zodiac, and lucky-numbers pages are thin listings
- The interactive cookie game is the only standout feature

## Key Insight: CSS Variables Cascade

The entire site uses CSS variables via `@theme inline` in globals.css. Changing variable values in `:root` automatically updates all Tailwind utility classes (`bg-background`, `text-foreground`, `border-border`, etc.) across every page. This makes the color swap much less work than it appears.

**Exceptions that need manual updates:**
- `.bg-warm-gradient` custom class (hardcoded gradient colors)
- `.paper-texture` custom class (hardcoded colors)
- `.ad-container` custom class (hardcoded colors)
- `CATEGORY_COLORS` in `src/lib/constants.ts` (may need contrast adjustment)
- Inline `style={{}}` with hardcoded colors in some pages
- CookieCanvas background gradient (rendered in canvas)
- OG image components (hardcoded background colors)
- ContactForm success state (hardcoded green)

---

### Task 1: Rewrite Theme — globals.css

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Update CSS variables to dark mystical palette**

Replace the `:root` CSS variable block and custom classes. New values:

```css
:root {
  --background: #0f0b1a;
  --background-secondary: #1a1528;
  --foreground: #e8e0f0;
  --gold: #d4a04a;
  --gold-light: #f0d68a;
  --gold-dark: #8b6914;
  --amber: #c49a2a;
  --cream: #f5e6d0;
  --paper: #f5e6d0;
  --muted: #8b7fa8;
  --border: #2a2440;
}
```

Update `.bg-warm-gradient` to use dark indigo/purple gradient:
```css
.bg-warm-gradient {
  background: linear-gradient(180deg, #0f0b1a 0%, #1a1230 50%, #0f0b1a 100%);
}
```

Update `.paper-texture` to keep light paper on dark background (fortune reveal):
```css
.paper-texture {
  background: linear-gradient(135deg, #f5e6d0 0%, #ede0c8 50%, #f5e6d0 100%);
  box-shadow: 0 2px 20px rgba(212, 160, 74, 0.3);
  color: #2d2420;
}
```

Update `.ad-container` to dark theme or remove it entirely.

Update `.cookie-canvas-container` border to use new border color.

Update `.text-golden-shimmer` — keep the animation, it works great on dark backgrounds.

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build`
Expected: Build succeeds. The entire site now uses dark colors via cascading CSS variables.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: rewrite theme to dark mystical palette"
```

---

### Task 2: Update Layout and Remove AdSense Placeholder

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Update layout**

- Change `themeColor` in metadata to `#0f0b1a`
- Remove the commented-out/disabled AdSense script block (lines ~63-69)
- Keep GA4 script
- Keep `bg-warm-gradient` class on body (it now uses the dark gradient from Task 1)

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "chore: update layout theme color, remove AdSense placeholder"
```

---

### Task 3: Remove TodayStats and AdUnit Components

**Files:**
- Delete: `src/components/TodayStats.tsx`
- Delete: `src/components/AdUnit.tsx`
- Modify: `src/app/page.tsx` — remove TodayStats and AdUnit imports/usage

**Step 1: Remove imports and usage from homepage**

In `src/app/page.tsx`:
- Remove `import TodayStats from "@/components/TodayStats"`
- Remove `import AdUnit from "@/components/AdUnit"`
- Remove the 3 `<AdUnit ... />` instances and their wrapper divs
- Remove `<TodayStats />`

**Step 2: Delete the component files**

```bash
rm src/components/TodayStats.tsx src/components/AdUnit.tsx
```

**Step 3: Check for other references to AdUnit/TodayStats**

Search for any other imports of these components across the codebase. Remove if found.

**Step 4: Verify build**

Run: `npx next build`
Expected: Build succeeds with no broken imports.

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove TodayStats (fake data) and AdUnit (inactive)"
```

---

### Task 4: Restructure Homepage

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Rewrite the "Why Fortune Crack" section**

Replace the current marketing blurb with informational content about:
- The psychology of fortune cookies (why humans seek meaning in random messages)
- Cultural history (invented in San Francisco, not China; Japanese origins)
- How our daily fortune algorithm works (date-seeded RNG, same for everyone globally)
- What makes the interactive experience different (physics simulation, 5 break methods)

Target: 300-400 words of genuine, informative content. This is E-E-A-T content for AdSense.

**Step 2: Clean up section ordering**

Final homepage structure (top to bottom):
1. Hero (h1 + date + fortune number)
2. CookieGameSection
3. Divider
4. Today's Fortune card
5. Past 7 Days
6. Latest Blog Posts (3 articles)
7. "About Fortune Cookies" informational section (rewritten)
8. FAQ JSON-LD (already present, no visible FAQ section needed)

**Step 3: Verify build**

Run: `npx next build`

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: restructure homepage, rewrite 'Why' section with informational content"
```

---

### Task 5: Update Header Navigation

**Files:**
- Modify: `src/components/Header.tsx`

**Step 1: Change nav links**

Desktop and mobile nav links should be:
- Home → `/`
- Horoscopes → `/horoscope`
- Blog → `/blog`
- About → `/about`

Replace both the desktop nav and mobile nav link sets.

**Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "style: update header nav links (Home, Horoscopes, Blog, About)"
```

---

### Task 6: Update Footer

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: Update footer links**

Keep 4-column layout. Update "Explore" section to include broader links:
- Lucky Numbers → `/lucky-numbers`
- Daily Horoscopes → `/horoscope`
- Fortune Categories → `/fortune/wisdom`
- Zodiac Signs → `/zodiac/aries`

Keep Pages (About, Blog, Contact) and Legal (Privacy, Terms) as-is.

**Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "style: update footer explore links"
```

---

### Task 7: Update CookieCanvas Background

**Files:**
- Modify: `src/components/CookieCanvas.tsx`

**Step 1: Find and update canvas background colors**

The CookieCanvas renders a radial gradient background on the Pixi.js canvas. Search for background color values (cream, beige, gold references) and update to dark mystical palette:
- Canvas background: dark indigo (`#0f0b1a` → `#1a1528`)
- Glow/vignette: deep purple tint instead of warm golden

Also update the fortune paper overlay colors if they exist in this component.

**Step 2: Update `.cookie-canvas-container` styling if needed**

The container has a border — ensure it uses the new `border` variable.

**Step 3: Verify the game still looks good**

Run dev server: `npm run dev`
Test the cookie breaking experience visually.

**Step 4: Commit**

```bash
git add src/components/CookieCanvas.tsx
git commit -m "style: update cookie canvas to dark mystical background"
```

---

### Task 8: Update FortuneReveal Component

**Files:**
- Modify: `src/components/FortuneReveal.tsx`

**Step 1: Update styling for dark theme**

The fortune reveal shows a paper-textured box with the fortune text. The `.paper-texture` class (updated in Task 1) handles the paper background. But check for any hardcoded colors in the component JSX (inline styles, Tailwind classes referencing old colors).

Key: Fortune text on the paper should remain dark (`#2d2420`) against the light paper — this creates intentional contrast.

The rarity badge, category label, and decorative elements should work well with the new theme variables.

**Step 2: Commit**

```bash
git add src/components/FortuneReveal.tsx
git commit -m "style: update FortuneReveal for dark theme"
```

---

### Task 9: Update CookieConsent Banner

**Files:**
- Modify: `src/components/CookieConsent.tsx`

**Step 1: Update styling**

Currently uses `bg-background/95` which will automatically pick up dark background. But the gold shadow `shadow-[0_0_30px_rgba(212,160,74,0.15)]` and button styles should be verified.

Check that:
- Banner background is dark + translucent
- Gold shadow still looks good on dark
- Accept/reject buttons have good contrast
- Text is readable on dark background

**Step 2: Commit**

```bash
git add src/components/CookieConsent.tsx
git commit -m "style: update cookie consent banner for dark theme"
```

---

### Task 10: Update ContactForm Component

**Files:**
- Modify: `src/components/ContactForm.tsx`

**Step 1: Update form styling**

The form uses `bg-white/5` for inputs which works on dark. But verify:
- Input borders and focus states
- Label colors
- Success state (green) — keep green, it's semantic
- Error state (red) — keep red, it's semantic
- Submit button contrast

**Step 2: Commit**

```bash
git add src/components/ContactForm.tsx
git commit -m "style: update contact form for dark theme"
```

---

### Task 11: Update All Page Backgrounds

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/terms/page.tsx`
- Modify: `src/app/f/[id]/page.tsx`

**Step 1: Verify these pages look correct**

Since all these pages use `bg-warm-gradient` (updated in Task 1) and theme-variable Tailwind classes (`text-foreground`, `border-border`, etc.), they should already look correct with the dark theme.

Check each page for:
- Any hardcoded color values that need updating
- Text readability on dark background
- Card/border visibility

The blog post page (`blog/[slug]/page.tsx`) uses `prose prose-invert` — verify MDX content renders well on dark background. The `prose-invert` class already handles dark mode for prose content.

The share landing page (`f/[id]/page.tsx`) uses `CATEGORY_COLORS` with inline gradients — these are colorful and should look fine on dark.

**Step 2: Fix any issues found**

Make minimal adjustments where needed.

**Step 3: Commit**

```bash
git add src/app/about/page.tsx src/app/blog/page.tsx src/app/blog/[slug]/page.tsx src/app/contact/page.tsx src/app/privacy/page.tsx src/app/terms/page.tsx src/app/f/[id]/page.tsx
git commit -m "style: verify and fix standard pages for dark theme"
```

---

### Task 12: Update Horoscope Pages

**Files:**
- Modify: `src/app/horoscope/page.tsx`
- Modify: `src/app/horoscope/daily/[sign]/page.tsx`
- Modify: `src/app/horoscope/weekly/[sign]/page.tsx`
- Modify: `src/app/horoscope/monthly/[sign]/page.tsx`

**Step 1: Verify horoscope pages**

These use theme-variable classes so should cascade. Check:
- Sign cards with hover states (currently `hover:bg-gold/5` — should be subtle on dark)
- Star ratings (StarRating component) contrast
- Element badges (Fire/Earth/Air/Water colors) — these are hardcoded but colorful, should work
- Tab-like navigation between daily/weekly/monthly

**Step 2: Fix any issues**

**Step 3: Commit**

```bash
git add src/app/horoscope/
git commit -m "style: update horoscope pages for dark theme"
```

---

### Task 13: Add Substance to Fortune Category Pages

**Files:**
- Modify: `src/app/fortune/[category]/page.tsx`

**Step 1: Add category descriptions**

Add a `CATEGORY_DESCRIPTIONS` object with 300-400 word descriptions for each of the 8 categories. Each description should cover:
- What this category of fortune means
- Cultural or philosophical background
- Why these messages resonate with people
- How to apply these fortunes to daily life

Categories: wisdom, love, career, humor, motivation, philosophy, adventure, mystery

**Step 2: Render the description**

Add a section between the featured fortune and the sample fortunes list, showing the category description in a well-styled card.

**Step 3: Update page styling for dark theme**

Check for hardcoded colors in inline styles (rarity colors, decorative elements).

**Step 4: Verify build**

Run: `npx next build`

**Step 5: Commit**

```bash
git add src/app/fortune/[category]/page.tsx
git commit -m "content: add substantial descriptions to fortune category pages"
```

---

### Task 14: Add Substance to Zodiac Sign Pages

**Files:**
- Modify: `src/app/zodiac/[sign]/page.tsx`

**Step 1: Add sign descriptions**

Add a `SIGN_DESCRIPTIONS` object with content for each of the 12 signs. Each entry should include:
- Personality overview (2-3 sentences)
- Key strengths and challenges
- Compatibility highlights (best matches)
- Fortune cookie wisdom that resonates with this sign

**Step 2: Render the descriptions**

Add a "About [Sign]" section with the personality content, placed after the zodiac header and before the fortune recommendations.

**Step 3: Update styling for dark theme**

Check element colors (Fire/Earth/Air/Water) contrast on dark background.

**Step 4: Verify build**

Run: `npx next build`

**Step 5: Commit**

```bash
git add src/app/zodiac/[sign]/page.tsx
git commit -m "content: add personality descriptions to zodiac sign pages"
```

---

### Task 15: Add Substance to Lucky Numbers Page

**Files:**
- Modify: `src/app/lucky-numbers/page.tsx`

**Step 1: Add numerology content**

Add an informational section (300-400 words) covering:
- Numerology traditions across cultures (Chinese, Western, Indian)
- The significance of lucky numbers in different societies
- How our daily lucky numbers are generated (date-seeded algorithm)
- Fun facts about number symbolism

**Step 2: Place content section**

Add after the lucky numbers display and before the "More Fortune Fun" links section.

**Step 3: Update styling for dark theme**

Check number circles, power number, and color swatch contrast on dark.

**Step 4: Commit**

```bash
git add src/app/lucky-numbers/page.tsx
git commit -m "content: add numerology traditions content to lucky numbers page"
```

---

### Task 16: Update All OG Images

**Files:**
- Modify: `src/app/opengraph-image.tsx`
- Modify: `src/app/twitter-image.tsx`
- Modify: `src/app/blog/[slug]/opengraph-image.tsx`
- Modify: `src/app/fortune/[category]/opengraph-image.tsx`
- Modify: `src/app/horoscope/opengraph-image.tsx`
- Modify: `src/app/horoscope/daily/[sign]/opengraph-image.tsx`
- Modify: `src/app/horoscope/weekly/[sign]/opengraph-image.tsx`
- Modify: `src/app/horoscope/monthly/[sign]/opengraph-image.tsx`
- Modify: `src/app/lucky-numbers/opengraph-image.tsx`
- Modify: `src/app/zodiac/[sign]/opengraph-image.tsx`

**Step 1: Update background gradients**

All OG images currently use warm brown/cream gradients like:
```
background: "linear-gradient(135deg, #1a0e04 0%, #3d2216 50%, #1a0e04 100%)"
```

Change to dark mystical:
```
background: "linear-gradient(135deg, #0f0b1a 0%, #1a1230 50%, #0f0b1a 100%)"
```

Keep gold text color (#d4a04a) — it works on both dark backgrounds.

**Step 2: Verify build**

Run: `npx next build`

**Step 3: Commit**

```bash
git add src/app/opengraph-image.tsx src/app/twitter-image.tsx src/app/blog/ src/app/fortune/ src/app/horoscope/ src/app/lucky-numbers/ src/app/zodiac/
git commit -m "style: update all OG images to dark mystical backgrounds"
```

---

### Task 17: Update Constants (CATEGORY_COLORS)

**Files:**
- Modify: `src/lib/constants.ts`

**Step 1: Verify CATEGORY_COLORS contrast**

Current category colors:
- wisdom: `#0d7377` (teal)
- love: `#e8475f` (rose)
- career: `#d4870e` (orange)
- humor: `#ff6b6b` (red)
- motivation: `#f77f00` (orange)
- philosophy: `#4a3f8a` (purple)
- adventure: `#2d6a4f` (green)
- mystery: `#5a189a` (purple)

These are used as card gradient backgrounds with white text on top. They should have good contrast on both the dark page background and with white fortune text. Adjust any that don't work:
- `wisdom: #0d7377` — dark teal may be hard to see on dark bg. Lighten to `#11999e`
- `adventure: #2d6a4f` — dark green may need lightening to `#40916c`

**Step 2: Commit**

```bash
git add src/lib/constants.ts
git commit -m "style: adjust category colors for dark theme contrast"
```

---

### Task 18: Final Verification

**Step 1: Full build check**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build`
Expected: Clean build, no errors.

**Step 2: Grep for remaining references**

Search for any remaining references to old warm colors:
- `#faf7f2` (old background)
- `#2d2420` (old foreground) — note: this is still used intentionally on paper-texture
- `#e8e0d4` (old border)
- `#9c8b7a` (old muted)

Verify any remaining references are intentional (e.g., paper texture contrast).

**Step 3: Search for orphaned imports**

Grep for `TodayStats` and `AdUnit` across entire `src/` directory. Should return 0 results.

**Step 4: Dev server spot check**

Run: `npm run dev`
Visually check: homepage, a blog post, horoscope hub, a zodiac page, lucky numbers, contact form, cookie consent banner.

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "chore: final verification and cleanup for dark mystical redesign"
```
