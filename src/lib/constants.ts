/**
 * Centralized site configuration constants.
 *
 * All hardcoded site-wide values (domain, name, contact info, analytics IDs)
 * live here so they can be updated in a single place.
 */

export const SITE_URL = "https://www.fortunecrack.com";
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");
export const SITE_NAME = "Fortune Cookie";
export const SITE_DESCRIPTION =
  "Break your virtual fortune cookie and discover your fortune! Interactive physics-based experience with 1,000+ unique fortunes.";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@fortunecrack.com";
export const GA_MEASUREMENT_ID = "G-TMMGPRKTLD";

// Fortune system limits (also defined in scripts/lib/types.ts for script-layer access)
export const MAX_FORTUNES = 3000;
export const JOURNAL_LIMIT = 100;

// Streak thresholds for rarity bonus multipliers
export const STREAK_RARE_THRESHOLD = 7;
export const STREAK_EPIC_THRESHOLD = 14;
export const STREAK_LEGENDARY_THRESHOLD = 30;

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
