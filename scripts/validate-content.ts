import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const FORTUNES_PATH = path.join(ROOT, "src/data/fortunes.json");
const HOROSCOPES_PATH = path.join(ROOT, "src/data/horoscopes.json");
const BLOG_DIR = path.join(ROOT, "src/content/blog");

const ZODIAC_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.error(`ERROR: ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`WARN: ${msg}`);
  warnings++;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
}

// --- Fortunes validation ---

function validateFortunes() {
  console.log("\n=== Fortunes Validation ===\n");

  if (!fs.existsSync(FORTUNES_PATH)) {
    error("fortunes.json not found");
    return;
  }

  let data: { categories: Record<string, { rarity: string; fortunes: string[] }> };
  try {
    data = JSON.parse(fs.readFileSync(FORTUNES_PATH, "utf-8"));
  } catch {
    error("fortunes.json is not valid JSON");
    return;
  }

  if (!data.categories || typeof data.categories !== "object") {
    error("fortunes.json missing 'categories' object");
    return;
  }

  const categories = Object.entries(data.categories);
  let totalFortunes = 0;
  const allFortunes = new Set<string>();
  let duplicates = 0;

  for (const [name, cat] of categories) {
    if (!Array.isArray(cat.fortunes)) {
      error(`Category "${name}" missing fortunes array`);
      continue;
    }

    if (cat.fortunes.length < 10) {
      error(`Category "${name}" has only ${cat.fortunes.length} fortunes (minimum: 10)`);
    }

    if (!cat.rarity) {
      warn(`Category "${name}" missing rarity field`);
    }

    for (const fortune of cat.fortunes) {
      const wordCount = fortune.split(/\s+/).length;
      if (wordCount < 4) {
        warn(`Category "${name}": fortune too short (${wordCount} words): "${fortune.slice(0, 50)}..."`);
      }
      if (wordCount > 30) {
        warn(`Category "${name}": fortune too long (${wordCount} words): "${fortune.slice(0, 50)}..."`);
      }

      const normalized = fortune.toLowerCase().trim();
      if (allFortunes.has(normalized)) {
        duplicates++;
        if (duplicates <= 5) {
          warn(`Duplicate fortune: "${fortune.slice(0, 60)}..."`);
        }
      }
      allFortunes.add(normalized);
    }

    totalFortunes += cat.fortunes.length;
  }

  if (duplicates > 5) {
    warn(`... and ${duplicates - 5} more duplicates`);
  }

  if (duplicates > 0) {
    warn(`Total duplicate fortunes: ${duplicates}`);
  }

  ok(`${categories.length} categories, ${totalFortunes} total fortunes`);
  for (const [name, cat] of categories) {
    console.log(`  ${name}: ${cat.fortunes.length} (${cat.rarity})`);
  }
}

// --- Horoscopes validation ---

function validateHoroscopes() {
  console.log("\n=== Horoscopes Validation ===\n");

  if (!fs.existsSync(HOROSCOPES_PATH)) {
    error("horoscopes.json not found");
    return;
  }

  let data: {
    daily?: { date: string; horoscopes: Record<string, unknown> };
    weekly?: { week: string; horoscopes: Record<string, unknown> };
    monthly?: { month: string; horoscopes: Record<string, unknown> };
  };
  try {
    data = JSON.parse(fs.readFileSync(HOROSCOPES_PATH, "utf-8"));
  } catch {
    error("horoscopes.json is not valid JSON");
    return;
  }

  // Check daily
  if (!data.daily) {
    error("horoscopes.json missing 'daily' section");
  } else {
    if (!data.daily.date) {
      error("daily horoscope missing 'date' field");
    } else {
      const daysOld = Math.floor(
        (Date.now() - new Date(data.daily.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysOld > 2) {
        warn(`Daily horoscope is ${daysOld} days old (date: ${data.daily.date})`);
      } else {
        ok(`Daily horoscope date: ${data.daily.date} (${daysOld} days old)`);
      }
    }

    const dailySigns = Object.keys(data.daily.horoscopes || {});
    const missingSigns = ZODIAC_SIGNS.filter((s) => !dailySigns.includes(s));
    if (missingSigns.length > 0) {
      error(`Daily horoscope missing signs: ${missingSigns.join(", ")}`);
    } else {
      ok(`Daily horoscope: all 12 signs present`);
    }
  }

  // Check weekly
  if (!data.weekly) {
    error("horoscopes.json missing 'weekly' section");
  } else {
    const weeklySigns = Object.keys(data.weekly.horoscopes || {});
    const missingSigns = ZODIAC_SIGNS.filter((s) => !weeklySigns.includes(s));
    if (missingSigns.length > 0) {
      error(`Weekly horoscope missing signs: ${missingSigns.join(", ")}`);
    } else {
      ok(`Weekly horoscope: all 12 signs present (week: ${data.weekly.week})`);
    }
  }

  // Check monthly
  if (!data.monthly) {
    error("horoscopes.json missing 'monthly' section");
  } else {
    const monthlySigns = Object.keys(data.monthly.horoscopes || {});
    const missingSigns = ZODIAC_SIGNS.filter((s) => !monthlySigns.includes(s));
    if (missingSigns.length > 0) {
      error(`Monthly horoscope missing signs: ${missingSigns.join(", ")}`);
    } else {
      ok(`Monthly horoscope: all 12 signs present (month: ${data.monthly.month})`);
    }
  }
}

// --- Blog validation ---

function validateBlog() {
  console.log("\n=== Blog Validation ===\n");

  if (!fs.existsSync(BLOG_DIR)) {
    error("Blog directory not found: src/content/blog/");
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  if (files.length === 0) {
    error("No MDX blog posts found");
    return;
  }

  let valid = 0;
  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");

    // Check frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) {
      error(`${file}: missing YAML frontmatter`);
      continue;
    }

    const frontmatter = fmMatch[1];
    const required = ["title", "date", "readTime", "excerpt"];
    for (const field of required) {
      if (!frontmatter.includes(`${field}:`)) {
        error(`${file}: missing required frontmatter field '${field}'`);
      }
    }

    // Check content length
    const body = content.slice(fmMatch[0].length).trim();
    const wordCount = body.split(/\s+/).length;
    if (wordCount < 300) {
      warn(`${file}: only ${wordCount} words (minimum recommended: 500)`);
    }

    valid++;
  }

  ok(`${valid}/${files.length} blog posts validated`);
}

// --- Main ---

console.log("Content Integrity Validation");
console.log("============================");

validateFortunes();
validateHoroscopes();
validateBlog();

console.log("\n============================");
console.log(`Results: ${errors} errors, ${warnings} warnings`);

if (errors > 0) {
  console.error("\nValidation FAILED");
  process.exit(1);
} else {
  console.log("\nValidation PASSED");
}
