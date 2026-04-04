# Personalized Fortune Platform — Design Document

**Date:** 2026-03-02
**Status:** Draft
**Domain:** fortunecrack.com

---

## Problem Statement

The current site delivers one interactive moment (cracking a fortune cookie) surrounded by 69 static SEO pages. Content is generic — same fortune for everyone, same horoscope for everyone, no personalization. Horoscope pages reference planetary movements without actual astronomical calculations. There is no reason for a visitor to return after the first visit.

## Vision

Transform fortunecrack.com from a novelty fortune cookie site into a **personalized fortune tracking platform** powered by real birth-based fortune calculations. The cookie-cracking game remains the playful interactive gateway; the personalized fortune system becomes the reason people return daily.

The platform synthesizes multiple cultural fortune traditions — 사주 (Korean Four Pillars), Western astrology, and numerology — behind a universal, jargon-free interface accessible to global users.

## Core Principles

1. **Real calculations, not fake text.** Every reading is grounded in actual computed data (천간지지, planetary ephemeris, numerological formulas). AI handles interpretation only, never fabrication.
2. **Universal entry, cultural depth.** The surface layer speaks plain language ("Fire energy", "Expansion cycle"). Deeper layers expose specific traditions (사주 chart, natal chart) for users who want them.
3. **Cookie as gateway.** The interactive cookie game is the differentiator no competitor has. It stays as the daily ritual and entry point.
4. **localStorage only.** No accounts, no database. All user data lives in the browser. Ship fast, keep it simple.
5. **Built-in return cadence.** Fortune cycles change daily (일운), monthly (월운), yearly (세운), and by decade (대운). Each timescale gives users a reason to check back.

---

## User Experience

### First Visit Flow

```
1. User arrives → cracks a cookie → sees fortune (current flow, unchanged)
2. After fortune reveal, a gentle prompt appears:
   "Your birthday holds the key to your fortune. Want a personal reading?"
3. User enters birth date (required) + birth time (optional)
4. Site instantly calculates their fortune profile
5. The fortune they just cracked is reinterpreted through their personal chart
6. User sees their personal fortune dashboard for the first time
```

**Design constraints:**
- The prompt appears AFTER the fortune reveal, not before — don't interrupt the fun moment
- Birth date is a single input. No forms, no email, no friction
- Birth time is optional — the system works without it (시주/hour pillar is omitted, natal chart uses noon default)
- Skip button is always visible — no pressure
- The onboarding adds ~15 seconds, not minutes

### Returning Visitor Flow (Daily Ritual)

```
1. Open fortunecrack.com → "Good morning, ♈ Fire Day Master"
2. Crack today's cookie (the fun 10-second ritual)
3. Fortune appears with personalized interpretation:
   "As a Fire day master in an Expansion cycle, today's fortune about
    'bold new beginnings' aligns with your current energy."
4. Quick glance at fortune dashboard:
   - Today's 일운 (daily energy)
   - This month's 월운 (monthly theme)
   - Current 대운 (life phase)
5. Done in 60 seconds. Come back tomorrow.
```

**Target behavior:** A daily 60-second ritual, like checking weather or Wordle.

### Progressive Depth Layers

Users see content at their chosen depth:

| Layer | What they see | Who it's for |
|---|---|---|
| Surface | "Fire energy, Expansion phase, strong day" | Everyone — casual visitors |
| Intermediate | Five elements chart, life cycle timeline, monthly themes | Interested users who return |
| Deep | Full 사주 四柱 chart, natal chart, pillar analysis | Fortune/astrology enthusiasts |
| Educational | "What is 사주?", tradition comparisons, cultural context | Curious learners, SEO traffic |

Users are never forced to a deeper layer. The surface is satisfying on its own.

---

## Fortune Calculation Systems

### System 1: 사주 / 명리학 (Four Pillars of Destiny) — Primary

**What it is:** Korean/East Asian fortune system that maps birth date and time to four "pillars" (년주, 월주, 일주, 시주), each consisting of a Heavenly Stem (천간) and Earthly Branch (지지). The resulting chart reveals elemental balance, personality, and fortune cycles.

**Why it's primary:**
- Calculations are deterministic and well-documented — pure math, no API needed
- Massively underserved in English-language web
- Built-in multi-resolution fortune cycles (대운/세운/월운/일운) create natural return cadence
- Culturally coherent with the fortune cookie concept

**Calculation inputs:**
- Birth year, month, day (required) — Gregorian calendar
- Birth hour (optional) — enables 시주 (Hour Pillar)

**Calculation outputs:**

```typescript
interface SajuChart {
  // Four Pillars
  yearPillar: { stem: HeavenlyStem; branch: EarthlyBranch };   // 년주 — social identity
  monthPillar: { stem: HeavenlyStem; branch: EarthlyBranch };  // 월주 — career, parents
  dayPillar: { stem: HeavenlyStem; branch: EarthlyBranch };    // 일주 — self (day master)
  hourPillar?: { stem: HeavenlyStem; branch: EarthlyBranch };  // 시주 — children, later life

  // Derived analysis
  dayMaster: Element;              // 일간 — the person's core element
  elementBalance: ElementBalance;  // 오행 balance (木火土金水)
  favorableElements: Element[];    // 용신 — elements that help
  unfavorableElements: Element[];  // 기신 — elements that hinder

  // Fortune cycles
  majorCycles: MajorCycle[];       // 대운 — ~10-year life phases
  currentMajorCycle: MajorCycle;   // Which 대운 they're in now
  yearlyFortune: YearlyFortune;    // 세운 — this year's fortune
  monthlyFortune: MonthlyFortune;  // 월운 — this month's fortune
  dailyFortune: DailyFortune;     // 일운 — today's fortune
}

type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
```

**Calculation algorithm (high-level):**

1. Convert Gregorian birth date to Chinese/Korean lunar calendar
2. Determine 년주 (Year Pillar) from the year's stem-branch cycle (60-year cycle / 육십갑자)
3. Determine 월주 (Month Pillar) from the month's stem-branch, adjusted by year stem
4. Determine 일주 (Day Pillar) from the day's stem-branch (lookup table or formula)
5. Determine 시주 (Hour Pillar) from the birth hour's branch, adjusted by day stem
6. Identify 일간 (Day Master) — the day pillar's heavenly stem = the person's core element
7. Analyze 오행 (Five Elements) distribution across all pillars
8. Determine 용신 (favorable element) based on balance and season of birth
9. Calculate 대운 (Major Luck Cycles): direction determined by gender + year stem yin/yang, starting age from month pillar to nearest seasonal node
10. Calculate 세운/월운/일운 from current date's stem-branch values and their interaction with the natal chart

**Implementation approach:**
- Pure TypeScript, runs client-side
- Lunar calendar conversion: use established algorithm (Korean Lunar Calendar tables or astronomical calculation)
- 만세력 (perpetual calendar) lookup for historical stem-branch data
- No external API needed — all calculations are deterministic

### System 2: Western Astrology — Secondary (Phase 2)

**What it is:** Natal chart based on planetary positions at birth time and location.

**Why it's secondary:**
- Requires ephemeris data (planetary position tables) — more complex
- Highly competitive market (Co-Star, Astrology.com)
- But massive search volume makes it worth adding as second system

**Calculation inputs:**
- Birth date, time, location (latitude/longitude)

**Calculation outputs:**
- Sun, Moon, Rising (Ascendant) signs
- Planetary placements in houses and signs
- Major aspects (conjunctions, squares, trines, oppositions)
- Current transits vs natal chart

**Implementation approach:**
- Use Swiss Ephemeris (open source) compiled to WASM, or a JS ephemeris library
- Calculate house system (Placidus or Whole Sign)
- Phase 2 implementation — architecture should accommodate it but don't build it yet

### System 3: Numerology — Lightweight Addition

**What it is:** Life path number and personal year derived from birth date.

**Why include it:**
- Trivially simple to calculate (digit sums)
- Adds another data point to the universal fortune profile
- "Life path number" has decent search volume

**Calculation:**
- Life path number: reduce birth date digits to single digit (or master number 11, 22, 33)
- Personal year: reduce current year + birth month + birth day
- No complex implementation needed

---

## AI Interpretation Layer

### How AI Is Used

The AI (Claude API) receives the **actual calculated chart data** and interprets it in context. It does NOT generate chart data.

```
INPUT to Claude:
{
  "chart": { /* actual 사주 chart data */ },
  "todayFortune": "A calm mind hears what a busy mind cannot.",
  "todayDailyPillar": { "stem": "丙", "branch": "午" },
  "userHistory": { "recentThemes": ["reflection", "patience"] }
}

PROMPT:
"You are interpreting a 사주 reading. The user is a [Water day master]
currently in a [Fire 대운]. Today's pillar is [丙午 / Fire-Fire].
Today's fortune cookie message was: '[fortune text]'.
Write a 2-3 sentence personalized interpretation connecting the fortune
to their chart and current energy. Warm, accessible tone. No jargon."

OUTPUT:
"Today's message about inner calm speaks directly to your Water nature —
as a Water day master, stillness is where your power lives. With today's
strong Fire energy, the universe is reminding you to balance action with
reflection. Trust your natural flow."
```

### Caching Strategy

- Same chart + same date = same interpretation
- Cache in localStorage: `{ date: "2026-03-02", interpretation: "..." }`
- One Claude API call per user per day maximum
- For users without birth data (not onboarded), show generic daily fortune (current behavior)

### API Route

```
POST /api/fortune-reading
Body: { chart: SajuChart, fortune: string, date: string }
Response: { interpretation: string, dailyEnergy: string, monthlyTheme: string }
```

Rate limited per session. Cached aggressively.

---

## Data Architecture (localStorage)

```typescript
interface UserProfile {
  // Identity
  birthDate: string;           // "1990-03-15"
  birthTime?: string;          // "14:30" (optional)
  birthLocation?: string;      // future: for Western astrology
  zodiacSign: ZodiacSign;      // derived from birth date

  // Calculated chart (computed once, stored)
  sajuChart: SajuChart;

  // Preferences
  displayName?: string;        // optional nickname
  preferredSystem: 'universal' | 'saju' | 'western';
  theme: 'default' | 'dark';
  soundOn: boolean;

  // Engagement
  joinDate: string;
  lastVisitDate: string;
  totalCracks: number;
  streak: {
    current: number;
    best: number;
    lastCrackDate: string;
  };

  // Fortune history
  fortuneJournal: FortuneEntry[];
  resonanceLog: string[];      // fortune IDs user marked as meaningful

  // Cached interpretations
  cachedReadings: {
    [date: string]: {
      interpretation: string;
      dailyEnergy: string;
      monthlyTheme: string;
    };
  };
}

interface FortuneEntry {
  id: string;
  date: string;
  fortuneText: string;
  category: string;
  rarity: string;
  dailyPillar: { stem: string; branch: string };
  interpretation?: string;
  resonated: boolean;
}
```

**Storage budget:** ~50KB for a year of daily use. Well within localStorage limits (5-10MB).

**Data loss mitigation:** Since localStorage can be cleared, include an export/import feature:
- "Save your fortune profile" → downloads JSON file
- "Restore your profile" → uploads JSON file
- Simple, no backend needed

---

## Page Architecture

### New Pages

#### `/my-fortune` — Personal Fortune Dashboard

The core daily destination page.

**Layout:**
```
┌─────────────────────────────────────────┐
│  Good morning, ♈ Fire Day Master        │
│  Day 47 streak 🔥                       │
├─────────────────────────────────────────┤
│                                         │
│  [  🥠 Crack Today's Cookie  ]          │
│  (Interactive cookie game)              │
│                                         │
├─────────────────────────────────────────┤
│  Today's Reading                        │
│  ┌─────────────────────────────────┐    │
│  │ "A calm mind hears what a busy │    │
│  │  mind cannot."                  │    │
│  │                                 │    │
│  │ As a Water day master in a Fire │    │
│  │ 대운, today's message about     │    │
│  │ inner calm speaks to your core  │    │
│  │ nature...                       │    │
│  └─────────────────────────────────┘    │
│  [♡ This resonates]  [Share →]          │
├─────────────────────────────────────────┤
│  Today's Energy                         │
│  ┌───┬───┬───┬───┬───┐                  │
│  │ 木 │ 🔥│ 土 │ 金 │ 水 │              │
│  │ 2  │ 4 │ 1  │ 1  │ 3  │              │
│  └───┴───┴───┴───┴───┘                  │
│  Fire dominant — action day             │
├─────────────────────────────────────────┤
│  Your Fortune Timeline                  │
│  ├── 대운: Expansion (2024-2033) ██░░   │
│  ├── 세운 2026: Growth year             │
│  ├── 월운 March: Communication focus    │
│  └── 일운 Today: Strong fire energy     │
├─────────────────────────────────────────┤
│  Fortune Journal                        │
│  Mar 2: "A calm mind..." (★ Rare)       │
│  Mar 1: "The river does..." (Common)    │
│  Feb 28: "Bold steps..." (★★ Epic)      │
│  [View all →]                           │
└─────────────────────────────────────────┘
```

**Behavior:**
- If user has NOT entered birth data: shows onboarding prompt instead of dashboard
- If user HAS birth data: shows full personalized dashboard
- Cookie game is embedded at the top — the daily ritual starts here
- After cracking, the reading section populates with today's interpretation

#### `/my-fortune/chart` — Your 사주 Chart

Full Four Pillars visualization with educational annotations.

```
┌─────────────────────────────────────────┐
│  Your Four Pillars (사주 四柱)            │
│                                         │
│  시주(時)   일주(日)   월주(月)   년주(年) │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │ 丙   │  │ 壬   │  │ 己   │  │ 庚   │   │
│  │ Fire │  │Water │  │Earth │  │Metal │   │
│  ├─────┤  ├─────┤  ├─────┤  ├─────┤   │
│  │ 未   │  │ 申   │  │ 卯   │  │ 午   │   │
│  │Earth │  │Metal │  │ Wood │  │ Fire │   │
│  └─────┘  └─────┘  └─────┘  └─────┘   │
│   Hour      Day      Month    Year      │
│  (Future)  (Self)  (Career) (Social)    │
│                                         │
│  Your Day Master: 壬 Water              │
│  "You are Water — adaptive, deep,       │
│   intuitive. Like a river, you find     │
│   your way around obstacles."           │
│                                         │
│  Five Elements Balance:                 │
│  木 Wood  ██░░░░░░░░  15%               │
│  火 Fire  ████░░░░░░  30%               │
│  土 Earth ███░░░░░░░  20%               │
│  金 Metal ███░░░░░░░  20%               │
│  水 Water ██░░░░░░░░  15%               │
│                                         │
│  Favorable element: 木 Wood             │
│  "Wood feeds your Water nature and      │
│   brings growth energy into your life." │
└─────────────────────────────────────────┘
```

#### `/my-fortune/timeline` — Life Fortune Timeline

Visual timeline of 대운 (10-year major cycles) showing past, present, and future phases.

```
┌─────────────────────────────────────────┐
│  Your Life Fortune Timeline             │
│                                         │
│  ──●──────●──────●──────●──────●──────  │
│   1990   2000   2010   2020   2030      │
│                                         │
│  Ages 0-9: 甲子 Wood/Water              │
│  "Foundation period — building roots"   │
│                                         │
│  Ages 10-19: 乙丑 Wood/Earth            │
│  "Learning period — absorbing deeply"   │
│                                         │
│  Ages 20-29: 丙寅 Fire/Wood       ← You │
│  "Expansion — your fire grows bold"     │
│  ████████████░░░░░░░░ (60% complete)    │
│                                         │
│  Ages 30-39: 丁卯 Fire/Wood             │
│  "Expression — creative peak ahead"     │
│                                         │
│  [See detailed analysis →]              │
└─────────────────────────────────────────┘
```

#### `/saju` — What Is 사주? (Educational SEO Landing)

Accessible English-language introduction to Korean fortune reading. This is a content/SEO page, not a tool page.

**Sections:**
1. What is 사주 (Four Pillars of Destiny)?
2. How it works — the calculation explained simply
3. The Five Elements (오행) and what they mean
4. How 사주 compares to Western astrology
5. History and cultural significance
6. "Try your own reading" CTA → links to `/my-fortune`

#### `/birthday/[month]-[day]` — Birthday Fortune Pages (365 Pages)

Programmatic SEO pages for every birthday.

```
/birthday/march-15  →  "March 15 Birthday Fortune"
```

**Content per page:**
- 사주 year-independent analysis for that month-day combination
- Day pillar pattern for this birthday
- Compatible birthdays
- Famous people born on this day
- "Get your full personal reading" CTA
- = 365 new indexable pages targeting "march 15 birthday", "march 15 zodiac", etc.

### Modified Pages

#### `/` — Homepage

**Changes:**
- After cookie crack + fortune reveal, add onboarding prompt for birth data
- If user already onboarded: show personalized greeting + streak count in header
- Daily fortune section becomes personalized if birth data exists

#### `/daily` — Daily Fortune

**Changes:**
- If user has birth data: shows personalized interpretation alongside generic fortune
- "Your reading" section appears above generic content

#### `/horoscope/*` — Horoscope Pages

**Changes:**
- If user has birth data and matches the sign: personalized annotation appears
- Cross-reference with 사주: "Your Western sign is Aries. In your 사주, your year branch 午 (Horse) carries similar Fire energy."

---

## Five Elements Visual System

The Five Elements (오행) become the visual language of the entire personalized experience. Each element maps to a color and character:

| Element | Korean | Color | Energy | Visual |
|---|---|---|---|---|
| 木 Wood | 목 | Green | Growth, flexibility | 🌿 |
| 火 Fire | 화 | Red/Orange | Passion, action | 🔥 |
| 土 Earth | 토 | Yellow/Brown | Stability, nurture | 🌍 |
| 金 Metal | 금 | White/Silver | Precision, clarity | ⚡ |
| 水 Water | 수 | Blue/Black | Wisdom, flow | 💧 |

These colors and symbols are used consistently across:
- Element balance charts
- Daily energy indicators
- Fortune timeline phases
- Cookie varieties (future: element-themed cookies)

---

## Gamification Layer

Built on top of the personalized fortune system:

### Daily Streak

- Streak counter increments when user cracks a cookie on consecutive days
- Streak multiplier: higher streak = slightly higher chance of rare fortunes
- Streak display: fire emoji count (🔥🔥🔥 = 3 days) up to custom badges
- Streak freeze: miss one day, streak pauses (not resets) for the first miss

### Fortune Journal

- Every cracked fortune is saved with date, interpretation, and chart context
- Searchable and filterable by category, rarity, element, date
- "Resonated" fortunes are starred and highlighted
- Monthly summary: "March fortunes pointed toward growth and change"

### Collection Progress

- "47/1,091 fortunes collected"
- Category completion: "12/200 wisdom fortunes found"
- Rarity tracker: "Legendary: 2 found"
- Element collection: "You've found 30 Fire fortunes, 12 Water fortunes"

### Achievements (Examples)

| Achievement | Condition | Badge |
|---|---|---|
| First Steps | Enter birth data | 🌱 |
| Week Warrior | 7-day streak | 🔥 |
| Moon Cycle | 28-day streak | 🌙 |
| Element Collector | 10+ fortunes in each element | ⭐ |
| Night Owl | Crack a cookie after midnight | 🦉 |
| Early Bird | Crack a cookie before 6 AM | 🐦 |
| Philosopher | Collect 50 wisdom fortunes | 📚 |
| Lucky Star | Find a Legendary fortune | 💫 |

---

## Monetization Integration

### Free Tier (Launch)

Everything described above is free:
- Cookie game + daily fortune
- Birth data onboarding + 사주 chart
- Personalized daily interpretation (1 per day)
- Fortune journal and streak tracking
- Element balance visualization
- Life timeline overview

### Ad Placement Strategy

Engaged daily users with 60+ second sessions and return visits are dramatically more valuable for ad revenue than bounce traffic.

**Ad slots (non-intrusive):**
1. Below the daily reading (after the value is delivered)
2. Between fortune journal entries (native format)
3. On educational/SEO pages (`/saju`, `/birthday/*`)

**Never place ads:**
- During the cookie-cracking experience
- Over the fortune reveal
- On the onboarding flow

### Future Premium Features (Not for V1)

When daily active users reach sufficient numbers:
- Detailed 대운 analysis for each life period
- Compatibility readings (your chart + another person's)
- Annual forecast report (downloadable PDF)
- Custom element-themed cookie skins
- Extended fortune journal analytics
- Ad-free experience

---

## SEO Impact

### New Indexable Pages

| Content Type | Pages | Target Keywords |
|---|---|---|
| Birthday fortune pages | 365 | "[month] [day] birthday fortune/zodiac" |
| 사주 educational | 5-8 | "korean fortune telling", "four pillars destiny", "사주 english" |
| Element pages | 5 | "fire element personality", "wood element meaning" |
| Personal fortune (not indexable) | 1 | N/A (requires user data) |
| **Total new pages** | **~375** | |

### Content Opportunities

- "What is 사주? Korean Fortune Telling Explained" — first-mover advantage in English
- "사주 vs Western Astrology: Same Birthday, Different Reading" — comparison content
- "Your Birthday in Korean Fortune Telling" — 365 articles
- "[Element] Personality: What Your Day Master Reveals" — 5 deep articles
- "Korean 대운: Understanding Your Life's 10-Year Cycles" — unique content

### Search Volume Opportunities

- "birthday fortune" / "birthday meaning" — moderate volume, low competition
- "korean fortune telling" — growing interest, almost no English content
- "four pillars of destiny" — niche but underserved
- "fire/water/wood/metal/earth personality" — moderate volume
- Plus all existing keyword targets remain

---

## Technical Implementation Phases

### Phase 1: 사주 Calculation Engine

Build the core calculation engine as a standalone TypeScript module.

**Deliverables:**
- `src/lib/saju/` — Pure TypeScript 사주 engine
  - `calendar.ts` — Gregorian to lunar calendar conversion
  - `pillars.ts` — Four Pillars calculation
  - `elements.ts` — Five Elements analysis
  - `cycles.ts` — 대운/세운/월운/일운 computation
  - `types.ts` — TypeScript interfaces
  - `index.ts` — Public API
- Unit tests for calculation accuracy (verify against known charts)

**Validation:** Compare calculated charts against established 만세력 (perpetual calendar) references for at least 50 known birth dates.

### Phase 2: Personal Dashboard + Onboarding

Build the user-facing experience.

**Deliverables:**
- Birth data onboarding UI (post-cookie-crack prompt)
- localStorage user profile management
- `/my-fortune` — Personal dashboard page
- `/my-fortune/chart` — 사주 chart visualization
- Element balance visualization component
- Daily streak tracking

### Phase 3: AI Interpretation Integration

Connect the real chart data to Claude API for personalized readings.

**Deliverables:**
- `/api/fortune-reading` — API route for personalized interpretation
- Interpretation prompt engineering (chart data → warm, accessible reading)
- Caching layer (one API call per user per day)
- Personalized fortune reveal (post-crack interpretation)

### Phase 4: Fortune Timeline + Journal

Build the long-term engagement features.

**Deliverables:**
- `/my-fortune/timeline` — Life fortune timeline visualization
- Fortune journal with search/filter
- Monthly fortune summary generation
- Resonance tracking ("this hit home" button)
- Collection progress UI
- Achievements system

### Phase 5: SEO Content Expansion

Build out educational and programmatic SEO pages.

**Deliverables:**
- `/saju` — Educational landing page
- `/saju/elements` — Five Elements guide
- `/saju/pillars` — Four Pillars guide
- `/birthday/[month]-[day]` — 365 birthday pages
- Updated sitemap
- Blog content about 사주 and Korean fortune telling

### Phase 6: Western Astrology (Future)

Add natal chart as second fortune system.

**Deliverables:**
- Ephemeris integration (Swiss Ephemeris WASM or JS library)
- Natal chart calculation
- Transit calculation (current planets vs birth chart)
- "Your Western Reading" tab on dashboard
- Cross-system insights ("Your 사주 Fire nature aligns with your Leo rising")

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| localStorage cleared — user loses all data | High frustration for engaged users | Export/import feature for fortune profile backup |
| 사주 calculations are wrong | Destroys credibility | Validate against 50+ known charts before launch; show calculation methodology transparently |
| Claude API interpretation feels generic | Undermines personalization value | Careful prompt engineering; include specific chart details in every prompt; A/B test interpretations |
| "사주" term unfamiliar to Western users | Bounce from educational pages | Lead with universal language ("Your Birthday Fortune"); 사주 is opt-in depth layer |
| Scope creep across 6 phases | Never ships | Phase 1-3 is the MVP. Ship after Phase 3. Phases 4-6 are enhancements. |
| Daily API costs for interpretations | Cost scales with users | Aggressive caching; batch similar charts; set daily interpretation limit |

---

## Success Metrics

| Metric | Current | Target (3 months post-launch) |
|---|---|---|
| Return visitor rate | ~5% (estimated) | 20%+ |
| Average session duration | ~30 seconds | 90+ seconds |
| Birth data onboarding rate | N/A | 15% of cookie crackers |
| Daily active users with profile | 0 | Measurable cohort |
| 7-day streak holders | 0 | 10% of profiled users |
| Pages indexed | ~70 | ~450 |
| Fortune journal entries per user | 0 | 10+ (after 2 weeks) |

---

## What This Is NOT

- Not a replacement for professional fortune telling or counseling
- Not a social network (no user-to-user interaction in V1)
- Not a subscription service (V1 is fully free)
- Not an astrology app competitor — it's a fortune cookie site that got deep
- Not culturally appropriative — it's educational and respectful, explaining traditions with proper context

---

## Summary

The site evolves from "crack a cookie, get a random fortune" to "crack a cookie, see what your personal fortune chart says today." The interactive cookie game remains the unique, playful gateway. Real 사주 calculations provide substance and credibility. AI interprets the real data in accessible language. Built-in fortune cycles (daily/monthly/yearly/decade) create natural return cadence. All powered by localStorage — no accounts, no backend complexity.

The 사주 system is the foundation because it's calculable, underserved in English, and culturally coherent with the fortune cookie concept. Western astrology adds as a second system once the infrastructure exists. The universal presentation layer ensures global accessibility regardless of which calculation system powers the reading.
