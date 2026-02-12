/**
 * Content integrity validator
 *
 * Usage:
 *   npx tsx scripts/validate-content.ts    # Validate fortunes, horoscopes, and blog posts
 *
 * Checks:
 *   - fortunes.json: structure, rarity fields, duplicates, word lengths
 *   - horoscopes.json: all 12 signs present, required fields, freshness
 *   - blog posts: frontmatter fields, word count (min 600), heading structure
 *
 * Exits with code 1 if any errors are found (warnings are non-fatal).
 */

import fs from "fs";
import path from "path";
import { ZODIAC_SIGN_KEYS } from "./lib/types";
import { log } from "./lib/utils";

const ROOT = process.cwd();
const FORTUNES_PATH = path.join(ROOT, "src/data/fortunes.json");
const HOROSCOPES_PATH = path.join(ROOT, "src/data/horoscopes.json");
const BLOG_DIR = path.join(ROOT, "src/content/blog");

const DAILY_REQUIRED_KEYS = ["text", "love", "career", "health", "luckyNumber", "luckyColor", "mood"];
const WEEKLY_REQUIRED_KEYS = ["overview", "love", "career", "advice"];
const MONTHLY_REQUIRED_KEYS = ["overview", "love", "career", "health", "advice"];

let errors = 0;
let warnings = 0;

function logError(msg: string) {
  log.error(msg);
  errors++;
}

function logWarn(msg: string) {
  log.warn(msg);
  warnings++;
}

// --- Fortunes validation ---

function validateFortunes() {
  log.step("Fortunes Validation");

  if (!fs.existsSync(FORTUNES_PATH)) {
    logError("fortunes.json not found");
    return;
  }

  let data: { categories: Record<string, { rarity: string; fortunes: string[] }> };
  try {
    data = JSON.parse(fs.readFileSync(FORTUNES_PATH, "utf-8"));
  } catch {
    logError("fortunes.json is not valid JSON");
    return;
  }

  if (!data.categories || typeof data.categories !== "object") {
    logError("fortunes.json missing 'categories' object");
    return;
  }

  const categories = Object.entries(data.categories);
  let totalFortunes = 0;
  const allFortunes = new Set<string>();
  let duplicates = 0;

  for (const [name, cat] of categories) {
    if (!Array.isArray(cat.fortunes)) {
      logError(`Category "${name}" missing fortunes array`);
      continue;
    }

    if (cat.fortunes.length < 10) {
      logError(`Category "${name}" has only ${cat.fortunes.length} fortunes (minimum: 10)`);
    }

    if (!cat.rarity) {
      logWarn(`Category "${name}" missing rarity field`);
    }

    for (const fortune of cat.fortunes) {
      const wordCount = fortune.split(/\s+/).length;
      if (wordCount < 4) {
        logWarn(`Category "${name}": fortune too short (${wordCount} words): "${fortune.slice(0, 50)}..."`);
      }
      if (wordCount > 30) {
        logWarn(`Category "${name}": fortune too long (${wordCount} words): "${fortune.slice(0, 50)}..."`);
      }

      const normalized = fortune.toLowerCase().trim();
      if (allFortunes.has(normalized)) {
        duplicates++;
        if (duplicates <= 5) {
          logWarn(`Duplicate fortune: "${fortune.slice(0, 60)}..."`);
        }
      }
      allFortunes.add(normalized);
    }

    totalFortunes += cat.fortunes.length;
  }

  if (duplicates > 5) {
    logWarn(`... and ${duplicates - 5} more duplicates`);
  }

  if (duplicates > 0) {
    logWarn(`Total duplicate fortunes: ${duplicates}`);
  }

  log.ok(`${categories.length} categories, ${totalFortunes} total fortunes`);
  for (const [name, cat] of categories) {
    console.log(`  ${name}: ${cat.fortunes.length} (${cat.rarity})`);
  }
}

// --- Horoscopes validation ---

function validateHoroscopeSection(
  horoscopes: Record<string, unknown>,
  requiredKeys: string[],
  label: string,
) {
  const signs = Object.keys(horoscopes);
  const missingSigns = ZODIAC_SIGN_KEYS.filter((s) => !signs.includes(s));
  if (missingSigns.length > 0) {
    logError(`${label} horoscope missing signs: ${missingSigns.join(", ")}`);
  } else {
    log.ok(`${label} horoscope: all 12 signs present`);
  }

  // Validate each sign has required keys
  for (const sign of ZODIAC_SIGN_KEYS) {
    const entry = horoscopes[sign] as Record<string, unknown> | undefined;
    if (!entry) continue;
    for (const key of requiredKeys) {
      if (entry[key] === undefined || entry[key] === null || entry[key] === "") {
        logWarn(`${label} ${sign}: missing or empty field '${key}'`);
      }
    }
  }
}

function validateHoroscopes() {
  log.step("Horoscopes Validation");

  if (!fs.existsSync(HOROSCOPES_PATH)) {
    logError("horoscopes.json not found");
    return;
  }

  let data: {
    daily?: { date: string; horoscopes: Record<string, unknown> };
    weekly?: { weekOf: string; horoscopes: Record<string, unknown> };
    monthly?: { month: string; horoscopes: Record<string, unknown> };
  };
  try {
    data = JSON.parse(fs.readFileSync(HOROSCOPES_PATH, "utf-8"));
  } catch {
    logError("horoscopes.json is not valid JSON");
    return;
  }

  // Check daily
  if (!data.daily) {
    logError("horoscopes.json missing 'daily' section");
  } else {
    if (!data.daily.date) {
      logError("daily horoscope missing 'date' field");
    } else {
      const daysOld = Math.floor(
        (Date.now() - new Date(data.daily.date).getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysOld > 2) {
        logWarn(`Daily horoscope is ${daysOld} days old (date: ${data.daily.date})`);
      } else {
        log.ok(`Daily horoscope date: ${data.daily.date} (${daysOld} days old)`);
      }
    }

    validateHoroscopeSection(data.daily.horoscopes || {}, DAILY_REQUIRED_KEYS, "Daily");
  }

  // Check weekly
  if (!data.weekly) {
    logError("horoscopes.json missing 'weekly' section");
  } else {
    if (data.weekly.weekOf) {
      log.ok(`Weekly horoscope weekOf: ${data.weekly.weekOf}`);
    } else {
      logWarn("Weekly horoscope missing 'weekOf' field");
    }
    validateHoroscopeSection(data.weekly.horoscopes || {}, WEEKLY_REQUIRED_KEYS, "Weekly");
  }

  // Check monthly
  if (!data.monthly) {
    logError("horoscopes.json missing 'monthly' section");
  } else {
    if (data.monthly.month) {
      log.ok(`Monthly horoscope month: ${data.monthly.month}`);
    } else {
      logWarn("Monthly horoscope missing 'month' field");
    }
    validateHoroscopeSection(data.monthly.horoscopes || {}, MONTHLY_REQUIRED_KEYS, "Monthly");
  }
}

// --- Blog validation ---

function validateBlog() {
  log.step("Blog Validation");

  if (!fs.existsSync(BLOG_DIR)) {
    logError("Blog directory not found: src/content/blog/");
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  if (files.length === 0) {
    logError("No MDX blog posts found");
    return;
  }

  let valid = 0;
  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");

    // Check frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) {
      logError(`${file}: missing YAML frontmatter`);
      continue;
    }

    const frontmatter = fmMatch[1];
    const required = ["title", "date", "readTime", "excerpt"];
    for (const field of required) {
      if (!frontmatter.includes(`${field}:`)) {
        logError(`${file}: missing required frontmatter field '${field}'`);
      }
    }

    // Check content length
    const body = content.slice(fmMatch[0].length).trim();
    const wordCount = body.split(/\s+/).length;
    if (wordCount < 600) {
      logWarn(`${file}: only ${wordCount} words (minimum recommended: 600)`);
    }

    // Check H2 count (mirrors quality-check.ts)
    const h2Count = (body.match(/^## /gm) || []).length;
    if (h2Count < 3) {
      logWarn(`${file}: only ${h2Count} H2 headings (minimum recommended: 3)`);
    }

    // Check for H1 headings (should not exist)
    const h1Count = (body.match(/^# [^#]/gm) || []).length;
    if (h1Count > 0) {
      logWarn(`${file}: has ${h1Count} H1 heading(s) — page template provides H1`);
    }

    valid++;
  }

  log.ok(`${valid}/${files.length} blog posts validated`);
}

// --- Main ---

log.step("Content Integrity Validation");

validateFortunes();
validateHoroscopes();
validateBlog();

log.info(`Results: ${errors} errors, ${warnings} warnings`);

if (errors > 0) {
  log.error("Validation FAILED");
  process.exit(1);
} else {
  log.ok("Validation PASSED");
}
