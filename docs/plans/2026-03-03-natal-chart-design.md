# Personalized Natal Chart — Design Document

**Date:** 2026-03-03
**Status:** Approved

## Problem

The horoscope system serves the same content to all users of a sign — no personalization. Meanwhile, the saju feature proves that personalized fortune content drives engagement and justifies premium pricing. Western astrology has the same potential: a natal chart is unique to each person's birth date, time, and location.

## Solution

A full natal chart engine using `astronomy-engine` for planet position calculations, with a custom astrological layer for zodiac signs, houses, aspects, and transits. Free tier shows the chart + one-time AI reading. Premium tier adds daily transit readings, monthly forecasts, and chart compatibility — bundled into the existing $2.99/mo subscription.

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Library | `astronomy-engine` + custom astro layer | Zero deps, TypeScript, actively maintained, matches saju pattern |
| Location input | City autocomplete (bundled ~15K city database) | Good UX, no external API dependency |
| Computation | Client-side (browser) | Same as saju, no server cost for chart generation |
| Pricing | Bundled into existing $2.99/mo | Increases value proposition, no payment code changes |
| Paywall model | Same as saju (free chart + premium readings) | Proven model, free content for viral sharing |
| House system | Placidus | Most widely used, expected by users |
| Route | `/horoscope/birth-chart` | Under existing horoscope section |

## Architecture

```
User Flow:
┌──────────────────────────────────────────────────┐
│  /horoscope/birth-chart                          │
│                                                  │
│  ┌─── Free ─────────────────────────────────┐    │
│  │ Birth data entry (date, time, city)      │    │
│  │ Natal chart visualization (wheel)        │    │
│  │ Planet positions in signs                │    │
│  │ Ascendant + Midheaven                    │    │
│  │ House placements                         │    │
│  │ Element/modality balance                 │    │
│  │ One-time AI personality reading          │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌─── Premium ($2.99/mo, bundled) ──────────┐    │
│  │ Daily transit reading                    │    │
│  │ Monthly forecast based on transits       │    │
│  │ Compatibility with another person        │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Calculation Engine:                             │
│  astronomy-engine → planet ecliptic positions    │
│  src/lib/astro/   → zodiac, houses, aspects      │
│  localStorage     → saved natal chart profile    │
│  Claude API       → AI readings (premium)        │
└──────────────────────────────────────────────────┘
```

## Natal Chart Engine (`src/lib/astro/`)

### Core calculations (via `astronomy-engine`)

1. **Planet positions** — Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto ecliptic longitude
2. **Ascendant (Rising Sign)** — from birth time + geographic coordinates using obliquity of ecliptic and local sidereal time
3. **Midheaven (MC)** — from local sidereal time
4. **House cusps** — Placidus system (12 houses)
5. **Lunar Nodes** — North/South node positions

### Custom astrological layer

1. **Zodiac placement** — ecliptic longitude → sign + degree (0-30° = Aries, 30-60° = Taurus, etc.)
2. **Aspect detection** — conjunction (0°), sextile (60°), square (90°), trine (120°), opposition (180°) with ±8° orb
3. **Retrograde detection** — flag planets in retrograde
4. **Element balance** — fire/earth/air/water count across all planet placements
5. **Modality balance** — cardinal/fixed/mutable count
6. **Transit calculations** — current planet positions vs natal for daily/monthly readings

### Key types

```ts
interface NatalChart {
  planets: PlanetPosition[];
  ascendant: ZodiacPosition;
  midheaven: ZodiacPosition;
  houses: HouseCusp[];
  aspects: Aspect[];
  elements: ElementBalance;    // fire/earth/air/water
  modalities: ModalityBalance; // cardinal/fixed/mutable
}

interface PlanetPosition {
  planet: Planet;
  longitude: number;           // ecliptic (0-360)
  sign: ZodiacSign;
  degree: number;              // within sign (0-30)
  house: number;               // 1-12
  retrograde: boolean;
}

interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  orb: number;                 // actual deviation in degrees
  applying: boolean;           // approaching exact aspect
}
```

## Free Tier

- Birth data entry: date (required), exact time (required), city (autocomplete from bundled DB)
- Natal chart wheel visualization with planet glyphs
- Planet-in-sign table (Sun in Aries 15°, Moon in Scorpio 22°, etc.)
- Ascendant and Midheaven display
- House placements
- Element/modality balance bars
- Major aspects list
- One-time AI personality reading (cached forever in localStorage)
- Educational content (what is a natal chart, what planets mean, etc.)

## Premium Features (Bundled into $2.99/mo)

### 1. Daily Transit Reading
- **Endpoint:** `POST /api/astro/daily`
- **Content:** Today's planet positions overlaid on user's natal chart. Which transits are active, what they mean.
- **Cache:** localStorage, 24 hours

### 2. Monthly Forecast
- **Endpoint:** `POST /api/astro/monthly`
- **Content:** Major transits affecting the chart this month. Key dates, opportunities, challenges.
- **Cache:** localStorage, 30 days

### 3. Chart Compatibility
- **Endpoint:** `POST /api/astro/compatibility`
- **Content:** Two-chart synastry analysis. Aspect overlay, harmony/tension points, compatibility score.
- **Cache:** localStorage, keyed by birth data pair

## City Database

Bundled JSON file with ~15K cities:
```json
[
  { "name": "New York", "country": "US", "lat": 40.7128, "lng": -74.0060 },
  { "name": "Seoul", "country": "KR", "lat": 37.5665, "lng": 126.9780 },
  ...
]
```

Autocomplete searches by city name prefix. Returns lat/lng for chart calculations. No external API calls.

## File Structure

```
src/
├── lib/astro/
│   ├── types.ts              # NatalChart, PlanetPosition, Aspect, etc.
│   ├── constants.ts          # Zodiac signs, planet data, aspect orbs
│   ├── planets.ts            # Planet position calculations via astronomy-engine
│   ├── zodiac.ts             # Longitude → sign/degree mapping
│   ├── houses.ts             # Placidus house cusp calculations
│   ├── ascendant.ts          # ASC + MC calculations
│   ├── aspects.ts            # Aspect detection between planets
│   ├── balance.ts            # Element/modality counting
│   ├── transits.ts           # Current transits vs natal chart
│   ├── natal-chart.ts        # Main orchestrator
│   ├── profile.ts            # localStorage profile manager
│   ├── prompts.ts            # Claude prompt templates
│   ├── format.ts             # Display formatting
│   ├── index.ts              # Barrel exports
│   └── __tests__/            # Vitest tests for each module
├── data/
│   └── cities.json           # ~15K cities with lat/lng
├── components/astro/
│   ├── AstroOnboarding.tsx   # Birth data + city autocomplete form
│   ├── NatalChartWheel.tsx   # SVG natal chart wheel visualization
│   ├── PlanetTable.tsx       # Planet positions table
│   ├── AspectGrid.tsx        # Aspect grid/list
│   ├── BalanceBar.tsx        # Element/modality balance
│   ├── AstroInterpretation.tsx # One-time AI reading (free)
│   ├── DailyTransit.tsx      # Premium: daily transit reading
│   ├── MonthlyForecast.tsx   # Premium: monthly forecast
│   └── AstroCompatibility.tsx # Premium: chart compatibility
├── app/horoscope/birth-chart/
│   ├── page.tsx              # Main page (SSR shell + client dashboard)
│   ├── AstroDashboard.tsx    # Client component
│   └── opengraph-image.tsx   # OG image
└── app/api/astro/
    ├── interpret/route.ts    # Free one-time AI interpretation
    ├── daily/route.ts        # Premium: daily transit
    ├── monthly/route.ts      # Premium: monthly forecast
    └── compatibility/route.ts # Premium: compatibility
```

## API Cost Projections (Combined Saju + Astro)

Same margins as saju. Adding astro premium features approximately doubles the API calls per premium user but also doubles the value proposition (two systems, daily engagement from both).

| Premium Users | Monthly API Calls | Cost/mo | Revenue/mo |
|---|---|---|---|
| 100 | 6,400 | ~$10 | $299 |
| 1,000 | 64,000 | ~$96 | $2,990 |
| 10,000 | 640,000 | ~$960 | $29,900 |

Margin: 96%+ at all scales.

## Future Upgrades (Not in Scope)

- SVG chart export / downloadable PDF
- Progressed chart (secondary progressions)
- Solar return chart (birthday chart)
- Sidereal zodiac option (Vedic)
- Chart animation (planet transit over time)
