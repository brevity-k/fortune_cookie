# Social-First Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Fortune Crack from a dark-themed game into a warm, modern content site with beautiful shareable fortune cards that drive a viral sharing loop.

**Architecture:** Update the global color system (cream background, category accent colors), create a FortuneCard component used both in-browser and for OG image generation, restructure the homepage as a server component with an embedded client game section, and redesign the share flow to embed the game on the share landing page.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, next/og ImageResponse, Pixi.js/Matter.js (existing, unchanged)

**Note:** This project has no test framework. Verification is via `npx next build`. Each task ends with a build check and commit.

---

### Task 1: Add category colors and fortune numbering to constants

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/lib/fortuneEngine.ts`

**Step 1: Add category color map to constants.ts**

Add to the bottom of `src/lib/constants.ts`:

```typescript
// Category accent colors for fortune cards and UI
export const CATEGORY_COLORS: Record<string, string> = {
  wisdom: "#0d7377",
  love: "#e8475f",
  career: "#d4870e",
  humor: "#ff6b6b",
  motivation: "#f77f00",
  philosophy: "#4a3f8a",
  adventure: "#2d6a4f",
  mystery: "#5a189a",
};
```

**Step 2: Add fortune numbering to fortuneEngine.ts**

Add this function to the bottom of `src/lib/fortuneEngine.ts` (before the journal functions):

```typescript
/**
 * Generate a deterministic "fortune number" for display (like Wordle #847).
 * Based on days since launch + a hash of the fortune text.
 */
export function getFortuneNumber(text: string): number {
  const LAUNCH_DATE = new Date("2026-02-01");
  const now = new Date();
  const daysSinceLaunch = Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / 86400000);
  // Simple hash of text to add variance
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(daysSinceLaunch * 1000 + (hash % 1000)) + 1;
}

/**
 * Get today's global fortune number (same for everyone).
 */
export function getDailyFortuneNumber(): number {
  const fortune = getDailyFortune();
  return getFortuneNumber(fortune.text);
}
```

**Step 3: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`
Expected: "Compiled successfully"

**Step 4: Commit**

```bash
git add src/lib/constants.ts src/lib/fortuneEngine.ts
git commit -m "feat: add category colors and fortune numbering system"
```

---

### Task 2: Update global color system and typography

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Replace globals.css color variables and gradients**

Replace the entire `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: #faf7f2;
  --foreground: #2d2420;
  --gold: #d4a04a;
  --gold-light: #f0d68a;
  --gold-dark: #8b6914;
  --amber: #b8860b;
  --cream: #fef3e0;
  --paper: #f5e6c8;
  --muted: #9c8b7a;
  --border: #e8e0d4;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-gold: var(--gold);
  --color-gold-light: var(--gold-light);
  --color-gold-dark: var(--gold-dark);
  --color-amber: var(--amber);
  --color-cream: var(--cream);
  --color-paper: var(--paper);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-serif: var(--font-lora);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
  overflow-x: hidden;
}

/* Warm gradient background — now subtle cream */
.bg-warm-gradient {
  background: linear-gradient(
    180deg,
    #faf7f2 0%,
    #f5f0e8 50%,
    #faf7f2 100%
  );
}

/* Golden shimmer text */
.text-golden-shimmer {
  background: linear-gradient(90deg, #d4a04a, #f0d68a, #d4a04a);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

/* Fortune paper texture */
.paper-texture {
  background: linear-gradient(135deg, #f5e6c8 0%, #ede0c8 50%, #f5e6c8 100%);
  box-shadow:
    0 2px 15px rgba(212, 160, 74, 0.3),
    inset 0 0 30px rgba(139, 105, 20, 0.1);
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Pulse glow */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 160, 74, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 160, 74, 0.6); }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Canvas container */
.cookie-canvas-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 6 / 5;
  margin: 0 auto;
}

.cookie-canvas-container canvas {
  width: 100% !important;
  height: 100% !important;
  border-radius: 1rem;
}

/* Typewriter effect */
@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: var(--gold); }
}

.typewriter-cursor {
  border-right: 2px solid var(--gold);
  animation: blink-caret 0.75s step-end infinite;
}

/* Ad container styling */
.ad-container {
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
}
```

**Step 2: Add Lora serif font to layout.tsx**

In `src/app/layout.tsx`, add the Lora import alongside existing fonts. Change line 3 and add after Geist_Mono:

```typescript
import { Geist, Geist_Mono } from "next/font/google";
import { Lora } from "next/font/google";
```

Add after line 19:

```typescript
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});
```

Update the body className (line 94) to include the new font variable:

```typescript
className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} bg-warm-gradient min-h-screen antialiased`}
```

**Step 3: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`
Expected: "Compiled successfully"

**Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "style: new color system (cream bg) and serif typography"
```

---

### Task 3: Update Header and Footer for new aesthetic

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`

**Step 1: Update Header.tsx**

Replace the entire file with updated colors for light background:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥠</span>
          <span className="text-golden-shimmer text-xl font-bold tracking-wide">
            Fortune Crack
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="text-foreground/60 transition hover:text-gold">
            Home
          </Link>
          <Link href="/daily" className="text-foreground/60 transition hover:text-gold">
            Daily
          </Link>
          <Link href="/blog" className="text-foreground/60 transition hover:text-gold">
            Blog
          </Link>
          <Link href="/about" className="text-foreground/60 transition hover:text-gold">
            About
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 -mr-2 text-foreground/60 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              Home
            </Link>
            <Link href="/daily" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              Daily
            </Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              Blog
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
```

**Step 2: Update Footer.tsx**

Replace the entire file with updated colors:

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/90">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">🥠</span>
              <span className="text-golden-shimmer font-bold">Fortune Crack</span>
            </div>
            <p className="text-sm text-muted">
              Crack open a fortune cookie and discover your destiny. A new fortune awaits you every day.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground/80">Pages</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-muted transition hover:text-gold">About</Link>
              <Link href="/blog" className="text-muted transition hover:text-gold">Blog</Link>
              <Link href="/contact" className="text-muted transition hover:text-gold">Contact</Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground/80">Explore</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/daily" className="text-muted transition hover:text-gold">Daily Fortune</Link>
              <Link href="/lucky-numbers" className="text-muted transition hover:text-gold">Lucky Numbers</Link>
              <Link href="/horoscope" className="text-muted transition hover:text-gold">Daily Horoscopes</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground/80">Legal</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="text-muted transition hover:text-gold">Privacy Policy</Link>
              <Link href="/terms" className="text-muted transition hover:text-gold">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Fortune Crack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

**Step 3: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`

**Step 4: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx
git commit -m "style: update header and footer for light theme"
```

---

### Task 4: Create FortuneCard component

**Files:**
- Create: `src/components/FortuneCard.tsx`

**Step 1: Create the FortuneCard component**

Create `src/components/FortuneCard.tsx`:

```tsx
import { Fortune, getRarityLabel, getFortuneNumber } from "@/lib/fortuneEngine";
import { CATEGORY_COLORS } from "@/lib/constants";

interface FortuneCardProps {
  fortune: Fortune;
  showNumber?: boolean;
}

function RarityStars({ rarity }: { rarity: string }) {
  const starCount =
    rarity === "common" ? 2 : rarity === "rare" ? 3 : rarity === "epic" ? 4 : 5;
  return (
    <span className="text-sm tracking-wide">
      {"★".repeat(starCount)}
      {"☆".repeat(5 - starCount)}
    </span>
  );
}

export default function FortuneCard({ fortune, showNumber = true }: FortuneCardProps) {
  const categoryColor = CATEGORY_COLORS[fortune.category] || "#d4a04a";
  const rarityLabel = getRarityLabel(fortune.rarity);
  const fortuneNumber = getFortuneNumber(fortune.text);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 sm:p-10 text-center"
      style={{
        background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 50%, ${categoryColor}bb 100%)`,
        color: "#fff",
      }}
    >
      <p
        className="text-xl sm:text-2xl leading-relaxed mb-6"
        style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
      >
        &ldquo;{fortune.text}&rdquo;
      </p>

      <div className="h-px w-24 mx-auto mb-4 bg-white/30" />

      <div className="flex items-center justify-center gap-3 mb-4">
        <span style={{ color: "rgba(255,255,255,0.9)" }}>
          <RarityStars rarity={fortune.rarity} />
        </span>
        <span className="text-sm text-white/70">
          {rarityLabel}
        </span>
        <span className="text-white/30">·</span>
        <span className="text-sm text-white/70 capitalize">
          {fortune.category}
        </span>
      </div>

      {showNumber && (
        <div className="text-xs text-white/50 tracking-wider">
          🥠 Fortune Crack #{fortuneNumber.toLocaleString()}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`

**Step 3: Commit**

```bash
git add src/components/FortuneCard.tsx
git commit -m "feat: add FortuneCard component with category colors and rarity stars"
```

---

### Task 5: Update fortune card OG image API

**Files:**
- Modify: `src/app/api/fortune-card/route.tsx`

**Step 1: Replace the OG image route with new card design**

Replace the entire `src/app/api/fortune-card/route.tsx` with:

```tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { SITE_DOMAIN } from "@/lib/constants";

export const runtime = "edge";

const VALID_CATEGORIES = [
  "wisdom", "love", "career", "humor",
  "motivation", "philosophy", "adventure", "mystery",
];

const VALID_RARITIES = ["common", "rare", "epic", "legendary"];

const CATEGORY_COLORS: Record<string, string> = {
  wisdom: "#0d7377",
  love: "#e8475f",
  career: "#d4870e",
  humor: "#ff6b6b",
  motivation: "#f77f00",
  philosophy: "#4a3f8a",
  adventure: "#2d6a4f",
  mystery: "#5a189a",
};

const RARITY_STARS: Record<string, string> = {
  common: "★★☆☆☆",
  rare: "★★★☆☆",
  epic: "★★★★☆",
  legendary: "★★★★★",
};

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  let text = searchParams.get("text") || "A fortune awaits you";
  const category = searchParams.get("category") || "wisdom";
  const rarity = searchParams.get("rarity") || "common";
  const num = searchParams.get("num") || "1";

  if (text.length > 300) text = text.slice(0, 300);
  const validCategory = VALID_CATEGORIES.includes(category) ? category : "wisdom";
  const validRarity = VALID_RARITIES.includes(rarity) ? rarity : "common";
  const bgColor = CATEGORY_COLORS[validCategory];
  const stars = RARITY_STARS[validRarity];
  const rarityLabel = RARITY_LABELS[validRarity];

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 50%, ${bgColor}bb 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          padding: 60,
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 400,
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 900,
            marginBottom: 40,
            display: "flex",
          }}
        >
          {`\u201C${text}\u201D`}
        </div>
        <div
          style={{
            width: 100,
            height: 1,
            backgroundColor: "rgba(255,255,255,0.3)",
            marginBottom: 30,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 30,
            fontSize: 18,
          }}
        >
          <span style={{ display: "flex", opacity: 0.9 }}>{stars}</span>
          <span style={{ display: "flex", opacity: 0.7 }}>{rarityLabel}</span>
          <span style={{ display: "flex", opacity: 0.3 }}>&middot;</span>
          <span style={{ display: "flex", opacity: 0.7, textTransform: "capitalize" }}>{validCategory}</span>
        </div>
        <div
          style={{
            fontSize: 14,
            letterSpacing: 2,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.5,
          }}
        >
          <span style={{ display: "flex" }}>🥠</span>
          <span style={{ display: "flex" }}>Fortune Crack #{num}</span>
          <span style={{ display: "flex" }}>&middot;</span>
          <span style={{ display: "flex" }}>{SITE_DOMAIN}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, immutable",
      },
    }
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`

**Step 3: Commit**

```bash
git add src/app/api/fortune-card/route.tsx
git commit -m "feat: redesign fortune card OG image with category colors"
```

---

### Task 6: Update ShareButtons with curiosity gap

**Files:**
- Modify: `src/components/ShareButtons.tsx`

**Step 1: Update share text format and add fortune number**

Replace the entire `src/components/ShareButtons.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { Fortune, Rarity, getRarityLabel, getFortuneNumber } from "@/lib/fortuneEngine";
import { trackShare } from "@/lib/analytics";
import { SITE_URL } from "@/lib/constants";

interface ShareButtonsProps {
  fortune: Fortune | null;
  visible: boolean;
}

function encodeFortuneId(fortune: Fortune): string {
  const data = JSON.stringify({ t: fortune.text, c: fortune.category, r: fortune.rarity });
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function ShareButtons({ fortune, visible }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  if (!fortune || !visible) return null;

  const fortuneId = encodeFortuneId(fortune);
  const shareUrl = `${SITE_URL}/f/${fortuneId}`;
  const fortuneNumber = getFortuneNumber(fortune.text);
  const rarityLabel = getRarityLabel(fortune.rarity);

  // Curiosity gap: fortune text NOT in share text — only visible in card image
  const shareText = `🥠 Fortune Crack #${fortuneNumber.toLocaleString()} — I got a${rarityLabel === "Epic" ? "n" : ""} ${rarityLabel} ${fortune.category} fortune. What's yours?`;

  const handleShareClick = (platform: string) => {
    trackShare(platform);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = `${shareText} ${shareUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  return (
    <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-3">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        onClick={() => handleShareClick("twitter")}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground/70 transition hover:border-gold hover:text-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        onClick={() => handleShareClick("facebook")}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground/70 transition hover:border-gold hover:text-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Share
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        onClick={() => handleShareClick("whatsapp")}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground/70 transition hover:border-gold hover:text-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Share
      </a>

      <button
        onClick={() => { handleShareClick("copy"); handleCopy(); }}
        aria-label="Copy fortune link"
        className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground/70 transition hover:border-gold hover:text-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`

**Step 3: Commit**

```bash
git add src/components/ShareButtons.tsx
git commit -m "feat: redesign share text with curiosity gap and fortune number"
```

---

### Task 7: Create TodayStats component

**Files:**
- Create: `src/components/TodayStats.tsx`

**Step 1: Create the component**

Create `src/components/TodayStats.tsx`:

```tsx
import { seededRandom, dateSeed, CATEGORIES } from "@/lib/fortuneEngine";

export default function TodayStats() {
  const seed = dateSeed();
  const rng = seededRandom(seed * 777);

  // Simulated daily stats (seeded so everyone sees the same numbers)
  const cookiesCracked = Math.floor(rng() * 15000) + 5000;
  const trendingCategory = CATEGORIES[Math.floor(rng() * CATEGORIES.length)];
  const rarities = ["Common", "Rare", "Epic", "Legendary"];
  const topRarity = rarities[Math.floor(rng() * 3)]; // Bias toward Common/Rare/Epic

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-2xl font-bold text-foreground/80">
            {cookiesCracked.toLocaleString()}
          </p>
          <p className="text-xs text-muted mt-1">cookies cracked today</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-2xl font-bold text-foreground/80 capitalize">
            {trendingCategory}
          </p>
          <p className="text-xs text-muted mt-1">trending category</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-2xl font-bold text-foreground/80">
            {topRarity}
          </p>
          <p className="text-xs text-muted mt-1">most common rarity</p>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`

**Step 3: Commit**

```bash
git add src/components/TodayStats.tsx
git commit -m "feat: add TodayStats component with simulated daily stats"
```

---

### Task 8: Redesign homepage as server component with embedded game

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/CookieGameSection.tsx`

**Step 1: Extract the client-side game into CookieGameSection.tsx**

Create `src/components/CookieGameSection.tsx`:

```tsx
"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import FortuneReveal from "@/components/FortuneReveal";
import FortuneCard from "@/components/FortuneCard";
import ShareButtons from "@/components/ShareButtons";
import {
  Fortune,
  getRandomFortune,
  getStreak,
  updateStreak,
  saveToJournal,
} from "@/lib/fortuneEngine";
import { trackCookieBreak, trackFortuneReveal, trackNewCookie } from "@/lib/analytics";

const noopSubscribe = () => () => {};
const getIsMobile = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
const getServerIsMobile = () => false;
const getClientStreak = () => getStreak();

let _initialFortune: Fortune | null = null;
const getInitialFortune = () => {
  if (!_initialFortune) _initialFortune = getRandomFortune(getStreak());
  return _initialFortune;
};

const CookieCanvas = dynamic(() => import("@/components/CookieCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[6/5] w-full max-w-[600px] mx-auto items-center justify-center rounded-2xl border border-border">
      <div className="text-center text-muted">
        <div className="mb-2 text-4xl">🥠</div>
        <p className="text-sm">Loading your fortune cookie...</p>
      </div>
    </div>
  ),
});

export default function CookieGameSection() {
  const isMobile = useSyncExternalStore(noopSubscribe, getIsMobile, getServerIsMobile);
  const initialFortune = useSyncExternalStore(noopSubscribe, getInitialFortune, () => null);

  const [fortuneOverride, setFortuneOverride] = useState<Fortune | null>(null);
  const fortune = fortuneOverride ?? initialFortune;
  const [showFortune, setShowFortune] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleBreak = useCallback(() => {
    trackCookieBreak("break");
    const newStreak = updateStreak();
    setFortuneOverride(getRandomFortune(newStreak));
    setShowFortune(false);
    setShowShare(false);

    try {
      const count = parseInt(localStorage.getItem("fortune_total") || "0", 10) + 1;
      localStorage.setItem("fortune_total", count.toString());
    } catch { /* empty */ }
  }, []);

  const handleFortuneReveal = useCallback(() => {
    setShowFortune(true);
    setShowShare(true);
    if (fortune) {
      trackFortuneReveal(fortune.category, fortune.rarity);
      saveToJournal(fortune);
    }
  }, [fortune]);

  const handleNewCookie = useCallback(() => {
    trackNewCookie();
    const streak = getStreak();
    setFortuneOverride(getRandomFortune(streak));
    setShowFortune(false);
    setShowShare(false);
  }, []);

  return (
    <section className="px-4 pb-8">
      <div className="text-center mb-4">
        <p className="text-sm text-muted">
          {isMobile
            ? "Tap, drag, shake your phone, or squeeze to crack"
            : "Click, drag, shake, double-tap, or squeeze to crack"}
        </p>
      </div>

      <CookieCanvas
        fortune={fortune?.text || "Good things are coming your way."}
        onBreak={handleBreak}
        onFortuneReveal={handleFortuneReveal}
        onNewCookie={handleNewCookie}
      />

      {/* Fortune reveal as text (for typewriter effect) */}
      <FortuneReveal fortune={fortune} visible={showFortune} />

      {/* Fortune card (beautiful, shareable) */}
      {showFortune && fortune && (
        <div className="mx-auto max-w-lg mt-6">
          <FortuneCard fortune={fortune} />
        </div>
      )}

      {/* Share buttons */}
      <ShareButtons fortune={fortune} visible={showShare} />

      {showShare && (
        <div className="text-center mt-4">
          <button
            onClick={handleNewCookie}
            className="text-sm text-muted underline underline-offset-4 hover:text-gold transition"
          >
            Break another cookie
          </button>
        </div>
      )}
    </section>
  );
}
```

**Step 2: Rewrite homepage as server component**

Replace the entire `src/app/page.tsx` with:

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getDailyFortune, getDailyFortuneNumber } from "@/lib/fortuneEngine";
import FortuneCard from "@/components/FortuneCard";
import TodayStats from "@/components/TodayStats";
import CookieGameSection from "@/components/CookieGameSection";
import AdUnit from "@/components/AdUnit";

export default function Home() {
  const dailyFortune = getDailyFortune();
  const dailyNumber = getDailyFortuneNumber();
  const posts = getAllPosts().slice(0, 3);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-warm-gradient">
      {/* Top Ad */}
      <div className="mx-auto max-w-4xl px-4 pt-4">
        <AdUnit slot="top-leaderboard" format="horizontal" />
      </div>

      {/* Hero */}
      <section className="px-4 pb-4 pt-8 sm:pt-12 text-center">
        <h1 className="text-golden-shimmer mb-2 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
          Crack Open Today&apos;s Fortune
        </h1>
        <p className="text-muted text-sm">
          Fortune Crack #{dailyNumber.toLocaleString()} &middot; {today}
        </p>
      </section>

      {/* Cookie Game (client component) */}
      <CookieGameSection />

      {/* Post-reveal Ad */}
      <div className="mx-auto max-w-lg px-4 pt-4">
        <AdUnit slot="post-reveal-rectangle" format="rectangle" />
      </div>

      {/* Divider */}
      <div className="mx-auto my-10 max-w-xs border-t border-border" />

      {/* Today's Fortune of the Day */}
      <section className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground/80 mb-1">
            Today&apos;s Fortune
          </h2>
          <p className="text-sm text-muted">
            Everyone sees this same fortune today
          </p>
        </div>
        <FortuneCard fortune={dailyFortune} />
      </section>

      {/* Today's Stats */}
      <TodayStats />

      {/* Latest Articles */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground/80">Latest Articles</h2>
            <Link href="/blog" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-border bg-background p-5 transition hover:border-gold/30 hover:shadow-sm"
              >
                <p className="text-xs text-muted mb-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {post.readTime && ` · ${post.readTime}`}
                </p>
                <h3 className="text-sm font-semibold text-foreground/80 group-hover:text-gold transition mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Fortune Crack */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold text-foreground/80 mb-4 text-center">
          Why Fortune Crack?
        </h2>
        <div className="rounded-2xl border border-border bg-background p-8 space-y-4">
          <p className="leading-relaxed text-muted">
            Fortune Crack is not just another fortune cookie website. We built something you can
            actually <em>feel</em>. Using real-time physics simulation and WebGL rendering, every
            cookie you break shatters into unique fragments that bounce, spin, and settle naturally.
            The crack sounds, the particle effects, the slow reveal of your fortune — it all comes
            together to recreate the tactile satisfaction of breaking a real cookie.
          </p>
          <p className="leading-relaxed text-muted">
            Most fortune cookie sites give you a random quote and call it a day. We wanted more.
            Fortune Crack features over 1,000 handcrafted fortunes across eight categories — from
            ancient wisdom and philosophical musings to career motivation and laugh-out-loud humor.
            Each fortune carries a rarity tier, and the longer your daily streak, the better your
            chances of discovering something truly legendary.
          </p>
          <p className="leading-relaxed text-muted">
            We also believe fortune cookies are better shared. Every day, everyone in the world
            receives the same Daily Fortune — a shared moment of serendipity that connects strangers
            across time zones. You can share any fortune to social media with a single tap, compare
            lucky numbers with friends, or quietly save your favorites to a personal journal that
            lives right in your browser.
          </p>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <AdUnit slot="bottom-leaderboard" format="horizontal" />
      </div>
    </div>
  );
}
```

**Step 3: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`
Expected: "Compiled successfully"

**Step 4: Commit**

```bash
git add src/components/CookieGameSection.tsx src/app/page.tsx
git commit -m "feat: redesign homepage as server component with embedded game and fortune card"
```

---

### Task 9: Redesign share landing page with embedded game

**Files:**
- Modify: `src/app/f/[id]/page.tsx`

**Step 1: Replace the share landing page**

Replace the entire `src/app/f/[id]/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, CATEGORY_COLORS } from "@/lib/constants";
import { getRarityLabel, getFortuneNumber } from "@/lib/fortuneEngine";
import CookieGameSection from "@/components/CookieGameSection";

interface FortuneData {
  t: string;
  c: string;
  r: string;
}

const RARITY_STARS: Record<string, string> = {
  common: "★★☆☆☆",
  rare: "★★★☆☆",
  epic: "★★★★☆",
  legendary: "★★★★★",
};

const VALID_RARITIES = ["common", "rare", "epic", "legendary"];
const VALID_CATEGORIES = ["wisdom", "love", "career", "humor", "motivation", "philosophy", "adventure", "mystery"];

function decodeFortuneId(id: string): FortuneData | null {
  try {
    const base64 = id.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    const data = JSON.parse(json);
    if (!data.t || typeof data.t !== "string") return null;
    return {
      t: data.t.slice(0, 300),
      c: VALID_CATEGORIES.includes(data.c) ? data.c : "wisdom",
      r: VALID_RARITIES.includes(data.r) ? data.r : "common",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const fortune = decodeFortuneId(id);

  if (!fortune) {
    return { title: SITE_NAME };
  }

  const fortuneNumber = getFortuneNumber(fortune.t);
  const rarityLabel = getRarityLabel(fortune.r as "common" | "rare" | "epic" | "legendary");
  const title = `Fortune Crack #${fortuneNumber.toLocaleString()} — ${rarityLabel} ${fortune.c} fortune`;
  const description = `Someone cracked a ${rarityLabel} ${fortune.c} fortune! Can you get a rarer one?`;
  const cardUrl = `${SITE_URL}/api/fortune-card?text=${encodeURIComponent(fortune.t)}&category=${encodeURIComponent(fortune.c)}&rarity=${encodeURIComponent(fortune.r)}&num=${fortuneNumber}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/f/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/f/${id}`,
      images: [{ url: cardUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cardUrl],
    },
  };
}

export default async function FortuneSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fortune = decodeFortuneId(id);

  if (!fortune) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="text-6xl mb-4">🥠</div>
          <h1 className="text-2xl font-bold text-foreground/80 mb-4">Fortune Not Found</h1>
          <p className="text-muted mb-8">This fortune link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[fortune.c] || "#d4a04a";
  const rarityLabel = getRarityLabel(fortune.r as "common" | "rare" | "epic" | "legendary");
  const stars = RARITY_STARS[fortune.r] || RARITY_STARS.common;
  const fortuneNumber = getFortuneNumber(fortune.t);

  // Calculate competitive nudge based on rarity
  const rarerPercent = fortune.r === "common" ? 85 : fortune.r === "rare" ? 62 : fortune.r === "epic" ? 15 : 5;

  return (
    <div className="bg-warm-gradient min-h-screen">
      <div className="px-4 py-12">
        <div className="mx-auto max-w-lg text-center mb-10">
          <p className="text-sm text-muted mb-6">
            Someone cracked a fortune for you
          </p>

          {/* The shared fortune card */}
          <div
            className="relative overflow-hidden rounded-2xl p-8 sm:p-10 text-center mb-6"
            style={{
              background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 50%, ${categoryColor}bb 100%)`,
              color: "#fff",
            }}
          >
            <p
              className="text-xl sm:text-2xl leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            >
              &ldquo;{fortune.t}&rdquo;
            </p>
            <div className="h-px w-24 mx-auto mb-4 bg-white/30" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>{stars}</span>
              <span className="text-sm text-white/70">{rarityLabel}</span>
              <span className="text-white/30">&middot;</span>
              <span className="text-sm text-white/70 capitalize">{fortune.c}</span>
            </div>
            <div className="text-xs text-white/50 tracking-wider">
              🥠 Fortune Crack #{fortuneNumber.toLocaleString()}
            </div>
          </div>

          {/* Competitive nudge */}
          <p className="text-sm text-muted">
            {rarerPercent}% of people get a rarer fortune than this one. Can you?
          </p>
        </div>

        {/* YOUR TURN — embedded game */}
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-foreground/80 mb-2">
            Your Turn
          </h2>
          <CookieGameSection />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`

**Step 3: Commit**

```bash
git add src/app/f/[id]/page.tsx
git commit -m "feat: redesign share page with fortune card and embedded game"
```

---

### Task 10: Update remaining pages for new theme

**Files:**
- Modify: `src/app/daily/page.tsx` — Update color classes (gold/10 → border, foreground/50 → muted, etc.)
- Modify: `src/app/about/page.tsx` — Update color classes
- Modify: `src/app/lucky-numbers/page.tsx` — Update color classes
- Modify: `src/app/blog/page.tsx` — Update color classes
- Modify: `src/components/FortuneOfTheDay.tsx` — Update color classes
- Modify: `src/components/FortuneReveal.tsx` — Update color classes for light theme

**Step 1: Update color classes across all listed files**

For all files, make these systematic replacements:
- `border-gold/10` → `border-border`
- `border-gold/15` → `border-border`
- `border-gold/20` → `border-border`
- `border-gold/30` → `border-border`
- `border-gold/40` → `border-gold/30`
- `bg-gold/5` → `bg-background`
- `bg-gold/10` → `bg-background`
- `bg-gold/15` → `bg-background`
- `text-foreground/30` → `text-muted`
- `text-foreground/40` → `text-muted`
- `text-foreground/50` → `text-muted`
- `text-foreground/60` → `text-muted`
- `text-foreground/70` → `text-foreground/80`
- `text-gold/30` → `text-gold/20`
- `text-gold/60` → `text-gold`
- `hover:bg-gold/15` → `hover:bg-gold/10`
- `hover:bg-gold/10` → `hover:bg-gold/5`

Read each file, apply the relevant replacements, and ensure the page still looks coherent on a light background.

**Step 2: Verify build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | head -5`

**Step 3: Commit**

```bash
git add -A
git commit -m "style: update all pages for light cream theme"
```

---

### Task 11: Final build verification and cleanup

**Step 1: Run full production build**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | tail -30`
Expected: Build completes with no errors

**Step 2: Check for any remaining dark-theme references**

Search for old dark colors that should have been replaced:

Run: `grep -r "#1a0e04\|#2d1810\|#3d2216" src/ --include="*.tsx" --include="*.ts" --include="*.css"`
Expected: No results (or only in CookieCanvas/CookieRenderer which uses its own canvas colors)

**Step 3: Commit any final fixes**

If any issues found, fix and commit:

```bash
git add -A
git commit -m "fix: final cleanup for social-first redesign"
```
