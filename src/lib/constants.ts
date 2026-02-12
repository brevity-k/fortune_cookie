/**
 * Centralized site configuration constants.
 *
 * All hardcoded site-wide values (domain, name, contact info, analytics IDs)
 * live here so they can be updated in a single place.
 */

export const SITE_URL = "https://fortunecrack.com";
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");
export const SITE_NAME = "Fortune Cookie";
export const SITE_DESCRIPTION =
  "Break your virtual fortune cookie and discover your fortune! Interactive physics-based experience with 1,000+ unique fortunes.";
export const CONTACT_EMAIL = "your-email@example.com";
export const GA_MEASUREMENT_ID = "G-TMMGPRKTLD";

// Fortune system limits (also defined in scripts/lib/types.ts for script-layer access)
export const MAX_FORTUNES = 3000;
export const JOURNAL_LIMIT = 100;

// Streak thresholds for rarity bonus multipliers
export const STREAK_RARE_THRESHOLD = 7;
export const STREAK_EPIC_THRESHOLD = 14;
export const STREAK_LEGENDARY_THRESHOLD = 30;
