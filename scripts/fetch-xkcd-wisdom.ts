/**
 * XKCD wisdom harvester for the fortune database.
 *
 * Fetches random XKCD comics, extracts alt text (title text), and filters
 * for fortune-worthy entries that are witty, philosophical, or insightful.
 * Uses Claude to curate and adapt the best ones into fortune cookie style.
 *
 * Usage:
 *   npx tsx scripts/fetch-xkcd-wisdom.ts              # Fetch and add ~10 fortunes
 *   npx tsx scripts/fetch-xkcd-wisdom.ts --dry-run     # Preview without writing
 *   npx tsx scripts/fetch-xkcd-wisdom.ts --count 30    # Fetch 30 random comics (default: 50)
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
const XKCD_API = "https://xkcd.com";

// ---------------------------------------------------------------------------
// XKCD API
// ---------------------------------------------------------------------------

interface XkcdComic {
  num: number;
  title: string;
  alt: string;
}

async function fetchLatestComicNumber(): Promise<number> {
  const res = await fetch(`${XKCD_API}/info.0.json`);
  if (!res.ok) throw new Error(`XKCD API error: ${res.status}`);
  const data = await res.json();
  return data.num;
}

async function fetchComic(num: number): Promise<XkcdComic | null> {
  try {
    const res = await fetch(`${XKCD_API}/${num}/info.0.json`);
    if (!res.ok) return null;
    const data = await res.json();
    return { num: data.num, title: data.title, alt: data.alt };
  } catch {
    return null;
  }
}

function pickRandomNumbers(max: number, count: number): number[] {
  const nums = new Set<number>();
  while (nums.size < count && nums.size < max) {
    // Skip comic 404 (it's intentionally missing)
    const n = Math.floor(Math.random() * max) + 1;
    if (n !== 404) nums.add(n);
  }
  return [...nums];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function fetchXkcdWisdom(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const countIndex = args.indexOf("--count");
  const fetchCount = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 50;

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

  // Fetch random XKCD comics
  log.step("Fetching XKCD comics");
  const latestNum = await fetchLatestComicNumber();
  log.info(`Latest XKCD: #${latestNum}. Sampling ${fetchCount} random comics.`);

  const numbers = pickRandomNumbers(latestNum, fetchCount);
  const comics: XkcdComic[] = [];

  for (const num of numbers) {
    const comic = await fetchComic(num);
    if (comic && comic.alt) {
      comics.push(comic);
    }
  }

  log.info(`Fetched ${comics.length} comics with alt text`);

  // Prepare alt text candidates
  const candidates = comics
    .map((c) => ({ num: c.num, title: c.title, alt: c.alt }))
    .filter((c) => {
      const words = c.alt.split(/\s+/).length;
      // Filter for reasonable length — too short or too long won't make good fortunes
      return words >= 3 && words <= 60;
    });

  log.info(`${candidates.length} candidates after length filter`);

  if (candidates.length === 0) {
    log.warn("No suitable XKCD alt texts found. Try fetching more comics.");
    return;
  }

  // Use Claude to curate and adapt into fortune cookie style
  log.step("Curating XKCD wisdom into fortunes");

  const candidateList = candidates
    .map((c) => `[#${c.num}] "${c.alt}"`)
    .join("\n");

  const result = await callWithRetry(async () => {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a fortune cookie writer with a love of science and wit. Below are alt texts from random XKCD comics. Your job:

1. Pick the ones that contain genuine wisdom, wit, or philosophical insight
2. Adapt each into a fortune cookie message (5-25 words)
3. Keep the clever essence but make it standalone (no XKCD context needed)
4. Categorize each as "humor" or "philosophy"

Skip alt texts that are too niche, reference-heavy, or don't contain a transferable insight.

XKCD alt texts:
${candidateList}

Return a JSON array of objects: [{"text": "fortune text", "category": "humor"|"philosophy"}, ...]
Aim for 8-15 fortunes. Quality over quantity — only include genuinely good ones.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = extractJson(text, "array");
    if (!Array.isArray(parsed)) throw new Error("Response is not an array");
    return parsed.filter(
      (item): item is { text: string; category: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).text === "string" &&
        typeof (item as Record<string, unknown>).category === "string",
    );
  });

  log.info(`Claude selected ${result.length} fortune candidates`);

  // Deduplicate against all existing fortunes
  const allExisting = new Set<string>();
  for (const cat of Object.values(data.categories)) {
    for (const f of cat.fortunes) {
      allExisting.add(f.toLowerCase().trim());
    }
  }

  const valid = result.filter((item) => {
    const normalized = item.text.toLowerCase().trim();
    if (allExisting.has(normalized)) {
      log.warn(`Duplicate: "${item.text}"`);
      return false;
    }
    const wordCount = item.text.split(/\s+/).length;
    if (wordCount < 4 || wordCount > 30) {
      log.warn(`Bad length (${wordCount} words): "${item.text}"`);
      return false;
    }
    // Must target an existing category
    if (!data.categories[item.category]) {
      log.warn(`Unknown category "${item.category}" for: "${item.text}"`);
      return false;
    }
    allExisting.add(normalized);
    return true;
  });

  log.info(`Valid after dedup: ${valid.length}`);

  if (valid.length === 0) {
    log.warn("No valid fortunes after filtering. Try fetching more comics.");
    return;
  }

  if (dryRun) {
    log.info("[DRY RUN] Would add these fortunes:");
    valid.forEach((item, i) => console.log(`  ${i + 1}. [${item.category}] "${item.text}"`));
    return;
  }

  // Add to categories
  const counts: Record<string, number> = {};
  for (const item of valid) {
    data.categories[item.category].fortunes.push(item.text);
    counts[item.category] = (counts[item.category] || 0) + 1;
  }

  fs.writeFileSync(FORTUNES_PATH, JSON.stringify(data, null, 2) + "\n");

  const totalFortunes = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length,
    0,
  );

  for (const [cat, count] of Object.entries(counts)) {
    log.ok(`Added ${count} XKCD-inspired fortunes to "${cat}"`);
  }
  log.ok(`New total: ${totalFortunes} fortunes`);
}

fetchXkcdWisdom().catch((err) => {
  log.error(`Failed: ${err.message || err}`);
  process.exit(1);
});
