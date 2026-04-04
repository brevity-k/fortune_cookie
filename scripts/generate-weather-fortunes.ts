/**
 * Weather-themed fortune generation script.
 *
 * Fetches current weather from the NWS API (free, no key required),
 * then generates fortunes that match the atmospheric mood.
 *
 * Usage:
 *   npx tsx scripts/generate-weather-fortunes.ts              # Auto-detect weather mood
 *   npx tsx scripts/generate-weather-fortunes.ts --mood sunny  # Force a specific mood
 *   npx tsx scripts/generate-weather-fortunes.ts --dry-run     # Preview without writing
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Claude API key (required)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { callWithRetry, extractJson, requireEnv, log } from "./lib/utils";
import { MAX_FORTUNES } from "./lib/types";
import type { FortunesFile } from "./lib/types";

const FORTUNES_PATH = path.join(process.cwd(), "src/data/fortunes.json");

// NWS API — NYC default (no API key needed)
const NWS_POINTS_URL = "https://api.weather.gov/points/40.7128,-74.006";

// ---------------------------------------------------------------------------
// Weather mood mapping
// ---------------------------------------------------------------------------

interface WeatherMood {
  mood: string;
  targetCategory: string;
  promptHint: string;
}

const WEATHER_MOODS: Record<string, WeatherMood> = {
  sunny: {
    mood: "sunny",
    targetCategory: "motivation",
    promptHint: "bright, warm, optimistic, full of energy and possibility",
  },
  cloudy: {
    mood: "cloudy",
    targetCategory: "philosophy",
    promptHint: "contemplative, layered, seeing things from new angles, subtle depth",
  },
  rainy: {
    mood: "rainy",
    targetCategory: "wisdom",
    promptHint: "reflective, cleansing, finding beauty in quiet moments, renewal",
  },
  stormy: {
    mood: "stormy",
    targetCategory: "mystery",
    promptHint: "dramatic, powerful, embracing chaos, transformation through turmoil",
  },
  snowy: {
    mood: "snowy",
    targetCategory: "philosophy",
    promptHint: "still, peaceful, clarity through silence, fresh beginnings",
  },
  windy: {
    mood: "windy",
    targetCategory: "adventure",
    promptHint: "restless, change is coming, bold moves, untethered freedom",
  },
  foggy: {
    mood: "foggy",
    targetCategory: "mystery",
    promptHint: "uncertain, trust your instincts, hidden paths, the unknown beckons",
  },
};

function classifyWeather(forecast: string): string {
  const lower = forecast.toLowerCase();
  if (/thunderstorm|storm|severe/.test(lower)) return "stormy";
  if (/snow|flurr|blizzard|ice|sleet/.test(lower)) return "snowy";
  if (/rain|shower|drizzle/.test(lower)) return "rainy";
  if (/fog|mist|haze/.test(lower)) return "foggy";
  if (/wind|breezy|gusty/.test(lower)) return "windy";
  if (/cloud|overcast|partly/.test(lower)) return "cloudy";
  return "sunny";
}

// ---------------------------------------------------------------------------
// NWS API
// ---------------------------------------------------------------------------

async function fetchCurrentWeather(): Promise<string> {
  // Step 1: Get forecast URL from points endpoint
  const pointsRes = await fetch(NWS_POINTS_URL, {
    headers: { "User-Agent": "fortune-cookie-weather/1.0" },
  });
  if (!pointsRes.ok) {
    throw new Error(`NWS points API error: ${pointsRes.status}`);
  }
  const pointsData = await pointsRes.json();
  const forecastUrl = pointsData.properties?.forecast;
  if (!forecastUrl) throw new Error("No forecast URL in NWS response");

  // Step 2: Get actual forecast
  const forecastRes = await fetch(forecastUrl, {
    headers: { "User-Agent": "fortune-cookie-weather/1.0" },
  });
  if (!forecastRes.ok) {
    throw new Error(`NWS forecast API error: ${forecastRes.status}`);
  }
  const forecastData = await forecastRes.json();
  const periods = forecastData.properties?.periods;
  if (!periods || periods.length === 0) throw new Error("No forecast periods");

  return periods[0].shortForecast as string;
}

// ---------------------------------------------------------------------------
// Fortune generation
// ---------------------------------------------------------------------------

async function generateWeatherFortunes(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const moodIndex = args.indexOf("--mood");
  const forceMood = moodIndex !== -1 ? args[moodIndex + 1] : undefined;

  const apiKey = requireEnv("ANTHROPIC_API_KEY");
  const client = new Anthropic({ apiKey });

  // Read current fortunes
  const rawData = fs.readFileSync(FORTUNES_PATH, "utf-8");
  const data: FortunesFile = JSON.parse(rawData);

  const currentTotal = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length,
    0,
  );
  if (currentTotal > MAX_FORTUNES) {
    log.info(`Fortune database has ${currentTotal} fortunes (cap: ${MAX_FORTUNES}). Skipping.`);
    return;
  }

  // Determine weather mood
  let moodKey: string;
  if (forceMood) {
    if (!WEATHER_MOODS[forceMood]) {
      log.error(`Unknown mood: ${forceMood}. Valid: ${Object.keys(WEATHER_MOODS).join(", ")}`);
      process.exit(1);
    }
    moodKey = forceMood;
    log.info(`Forced mood: ${moodKey}`);
  } else {
    log.step("Fetching current weather from NWS");
    const forecast = await fetchCurrentWeather();
    moodKey = classifyWeather(forecast);
    log.info(`Current weather: "${forecast}" -> mood: ${moodKey}`);
  }

  const { targetCategory, promptHint } = WEATHER_MOODS[moodKey];
  const categoryData = data.categories[targetCategory];

  if (!categoryData) {
    log.error(`Category "${targetCategory}" not found in fortunes.json`);
    process.exit(1);
  }

  log.info(`Target: ${targetCategory} category (${categoryData.fortunes.length} existing)`);

  // Get samples from target category for style reference
  const samples = [...categoryData.fortunes]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  // Generate weather-inspired fortunes
  log.step("Generating weather-themed fortunes");
  const result = await callWithRetry(async () => {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a fortune cookie writer. Generate exactly 15 new fortune cookie messages inspired by ${moodKey} weather.

Weather mood: ${promptHint}

Style constraints:
- Each fortune must be 5-25 words long
- Subtly evoke the weather mood without literally mentioning weather/rain/sun/etc.
- The fortune should feel timeless, not tied to a specific weather event
- No generic filler phrases ("remember to", "always try to")
- Original and creative

Match the tone of these existing "${targetCategory}" fortunes:

${samples.map((f) => `- "${f}"`).join("\n")}

Return ONLY a JSON array of 15 strings, no other text.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = extractJson(text, "array");
    if (!Array.isArray(parsed)) throw new Error("Response is not an array");
    return parsed.filter((item): item is string => typeof item === "string");
  });

  log.info(`Generated ${result.length} candidates`);

  // Deduplicate
  const allExisting = new Set<string>();
  for (const cat of Object.values(data.categories)) {
    for (const f of cat.fortunes) {
      allExisting.add(f.toLowerCase().trim());
    }
  }

  const valid = result.filter((f) => {
    const normalized = f.toLowerCase().trim();
    if (allExisting.has(normalized)) {
      log.warn(`Duplicate: "${f}"`);
      return false;
    }
    const wordCount = f.split(/\s+/).length;
    if (wordCount < 4 || wordCount > 30) {
      log.warn(`Bad length (${wordCount} words): "${f}"`);
      return false;
    }
    allExisting.add(normalized);
    return true;
  });

  log.info(`Valid after dedup: ${valid.length}`);

  if (valid.length === 0) {
    log.warn("No valid fortunes after dedup. Try again.");
    return;
  }

  if (dryRun) {
    log.info("[DRY RUN] Would add these fortunes:");
    valid.forEach((f, i) => console.log(`  ${i + 1}. "${f}"`));
    return;
  }

  // Add to category
  data.categories[targetCategory].fortunes.push(...valid);
  fs.writeFileSync(FORTUNES_PATH, JSON.stringify(data, null, 2) + "\n");

  const totalFortunes = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length,
    0,
  );

  log.ok(`Added ${valid.length} ${moodKey}-themed fortunes to "${targetCategory}"`);
  log.ok(`New total: ${totalFortunes} fortunes`);
}

generateWeatherFortunes().catch((err) => {
  log.error(`Failed: ${err.message || err}`);
  process.exit(1);
});
