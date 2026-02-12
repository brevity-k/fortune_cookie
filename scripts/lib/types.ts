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
  element: string;
  ruler: string;
}

export const ZODIAC_SIGNS: ZodiacSignData[] = [
  { key: "aries", name: "Aries", element: "Fire", ruler: "Mars" },
  { key: "taurus", name: "Taurus", element: "Earth", ruler: "Venus" },
  { key: "gemini", name: "Gemini", element: "Air", ruler: "Mercury" },
  { key: "cancer", name: "Cancer", element: "Water", ruler: "Moon" },
  { key: "leo", name: "Leo", element: "Fire", ruler: "Sun" },
  { key: "virgo", name: "Virgo", element: "Earth", ruler: "Mercury" },
  { key: "libra", name: "Libra", element: "Air", ruler: "Venus" },
  { key: "scorpio", name: "Scorpio", element: "Water", ruler: "Pluto" },
  { key: "sagittarius", name: "Sagittarius", element: "Fire", ruler: "Jupiter" },
  { key: "capricorn", name: "Capricorn", element: "Earth", ruler: "Saturn" },
  { key: "aquarius", name: "Aquarius", element: "Air", ruler: "Uranus" },
  { key: "pisces", name: "Pisces", element: "Water", ruler: "Neptune" },
];

export const ZODIAC_SIGN_KEYS = ZODIAC_SIGNS.map((s) => s.key);
