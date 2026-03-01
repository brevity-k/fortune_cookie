# Social-First Fortune Cookie Redesign

**Date:** 2026-03-01
**Goal:** Make Fortune Crack visually compelling, shareable, and worth visiting by redesigning around a viral sharing loop.

## Problem

The current site is technically functional but visually generic (dark+gold casino aesthetic), has no compelling hook to attract visitors, produces nothing worth sharing on social media, and feels AI-generated. Nobody wants to click, visit, or return.

## Core Insight

Design everything around the **shareable fortune card**, not the breaking mechanic. The card is the product. The game is the delivery method. Each share is free advertising that brings new visitors.

## The Viral Loop

1. User breaks cookie → sees beautiful category-colored fortune card
2. Shares to social with curiosity gap ("I got an Epic wisdom fortune. What's yours?")
3. Friend sees card in feed → clicks → lands on share page with game embedded
4. Friend breaks their own → gets their card → shares → loop continues

---

## Visual Identity

### Color Palette

Abandon dark+gold. New direction: warm cream background (`#faf7f2`) with rich category-specific accent colors.

| Category | Color | Hex | Mood |
|----------|-------|-----|------|
| Wisdom | Deep teal | `#0d7377` | Calm, grounded |
| Love | Warm rose | `#e8475f` | Passionate |
| Career | Rich amber | `#d4870e` | Ambitious |
| Humor | Bright coral | `#ff6b6b` | Playful |
| Motivation | Electric orange | `#f77f00` | Energetic |
| Philosophy | Indigo | `#4a3f8a` | Contemplative |
| Adventure | Forest green | `#2d6a4f` | Bold |
| Mystery | Deep purple | `#5a189a` | Enigmatic |

### Typography

- Serif font for fortune text (literary, special feel)
- Clean sans-serif for UI and body text

### Overall Mood

Warm, approachable, slightly whimsical — like a well-designed indie app, not a casino.

---

## Fortune Card (The Viral Asset)

The single most important visual element. Appears as:
1. The live in-browser fortune reveal after breaking a cookie
2. The OG image when shared on social media (1200x630)

### Card Layout

- Background: category color with subtle gradient and pattern texture
- Fortune text: large serif typography, centered
- Divider line
- Rarity: 5-star visual display + category label (e.g., "Epic - Wisdom")
- Footer: cookie emoji + "Fortune Crack #1,247" + fortunecrack.com

### Design Decisions

- Background color matches fortune category — every card is visually distinct
- Fortune number (sequential, like Wordle #847) — creates FOMO and daily ritual feel
- Rarity as stars — instantly readable, adds game feel
- Cookie emoji small in footer — text is the hero, not the emoji
- Subtle pattern texture per category — visual richness without distraction
- What you see in browser = what appears on social media (no disconnect)

---

## Homepage Redesign

### Layout (top to bottom)

1. **Header** — Fortune Crack logo, navigation (Daily, Blog)
2. **Hero** — "Crack open today's fortune" + Fortune Crack #N + date. Cookie Canvas game.
3. **Fortune Card Reveal** — After break, fortune renders as the beautiful card (not plain text)
4. **Share Buttons** — X, Facebook, WhatsApp, Copy Link, Save to Journal, Break Another
5. **Today's Stats** — "12,847 cookies cracked today" / trending category / most common rarity (seeded daily, simulated)
6. **Latest Blog Posts** — 3 most recent posts with excerpts
7. **Editorial Section** — "Why Fortune Crack" text (for Google)
8. **Footer**

### Key Changes

- Cream background replaces dark theme
- Fortune card component replaces plain text reveal
- Fortune number in hero signals daily ritual
- Today's Stats creates social proof
- Blog posts on homepage for Google content signals
- Server component page with client game section (crawlable text)

---

## Share Flow

### Share Text

Old: `💛 My fortune: "Be kind to yourself" — Break your own at fortunecrack.com/f/abc123`

New: `🥠 Fortune Crack #1,247 — I got an Epic wisdom fortune. What's yours? fortunecrack.com/f/abc123`

Fortune text is NOT in the share text — it's only visible in the card image. This creates a curiosity gap that drives clicks.

### Share Landing Page (`/f/[id]`)

Old: Shows fortune + "Break Your Own Cookie" button linking to homepage.

New layout:
1. "Someone cracked a fortune for you" header
2. The shared fortune card (beautiful, category-colored)
3. "YOUR TURN" section with the Cookie Canvas embedded directly on the page
4. Competitive nudge: "2 of 3 people get a rarer fortune than this one. Can you?"

Critical: the game is embedded ON the share page. Zero friction to break your own cookie — see theirs, break yours, share yours. The loop completes without navigating away.

---

## What's NOT Changing

- Fortune data (1,091 fortunes, 8 categories, 4 rarities)
- Break mechanics (5-6 interaction methods, physics engine)
- Auto-generation pipelines (blog, horoscopes, fortunes, X posting)
- Blog content (14 posts)
- Horoscope/category/zodiac pages (still exist, still noindexed)
- Backend infrastructure (no new APIs, no database, no auth)

## What IS Changing

| Change | Effort | Files |
|--------|--------|-------|
| Color system (cream bg + category colors) | Medium | globals.css, tailwind config |
| Fortune card component (browser + OG) | Medium | New component + update API route |
| Homepage restructure | Medium | page.tsx rewrite |
| Share landing with embedded game | Medium | f/[id]/page.tsx |
| Share text (fortune number, curiosity gap) | Small | ShareButtons.tsx |
| Fortune numbering system | Small | fortuneEngine.ts |
| Today's Stats section | Small | New component |
| Typography update | Small | layout.tsx |

No new routes. No new dependencies. No structural changes. Visual + UX overhaul of existing pages and components.
