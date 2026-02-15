/**
 * Shared type definitions for automation scripts.
 *
 * Scripts cannot use the `@/` path alias, so types that mirror the app layer
 * (src/lib/fortuneEngine.ts, src/lib/horoscopes.ts) are defined here for DRY
 * usage across generate-fortunes, generate-seasonal, generate-horoscopes, and
 * validate-content.
 */

// ---------------------------------------------------------------------------
// Fortune data types
// ---------------------------------------------------------------------------

export interface CategoryData {
  rarity: string;
  fortunes: string[];
}

export interface FortunesFile {
  categories: Record<string, CategoryData>;
}

/** Maximum fortune count before generation scripts stop adding new ones.
 *  Keep in sync with src/lib/constants.ts. */
export const MAX_FORTUNES = 3000;

// ---------------------------------------------------------------------------
// Zodiac data
// ---------------------------------------------------------------------------

export interface ZodiacSignData {
  key: string;
  name: string;
  symbol: string;
  element: string;
  ruler: string;
}

export const ZODIAC_SIGNS: ZodiacSignData[] = [
  { key: "aries", name: "Aries", symbol: "\u2648", element: "Fire", ruler: "Mars" },
  { key: "taurus", name: "Taurus", symbol: "\u2649", element: "Earth", ruler: "Venus" },
  { key: "gemini", name: "Gemini", symbol: "\u264A", element: "Air", ruler: "Mercury" },
  { key: "cancer", name: "Cancer", symbol: "\u264B", element: "Water", ruler: "Moon" },
  { key: "leo", name: "Leo", symbol: "\u264C", element: "Fire", ruler: "Sun" },
  { key: "virgo", name: "Virgo", symbol: "\u264D", element: "Earth", ruler: "Mercury" },
  { key: "libra", name: "Libra", symbol: "\u264E", element: "Air", ruler: "Venus" },
  { key: "scorpio", name: "Scorpio", symbol: "\u264F", element: "Water", ruler: "Pluto" },
  { key: "sagittarius", name: "Sagittarius", symbol: "\u2650", element: "Fire", ruler: "Jupiter" },
  { key: "capricorn", name: "Capricorn", symbol: "\u2651", element: "Earth", ruler: "Saturn" },
  { key: "aquarius", name: "Aquarius", symbol: "\u2652", element: "Air", ruler: "Uranus" },
  { key: "pisces", name: "Pisces", symbol: "\u2653", element: "Water", ruler: "Neptune" },
];

export const ZODIAC_SIGN_KEYS = ZODIAC_SIGNS.map((s) => s.key);
