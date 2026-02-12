/**
 * Fortune database growth script
 *
 * Usage:
 *   npx tsx scripts/generate-fortunes.ts   # Add ~20 fortunes to the smallest category
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Claude API key (required)
 *
 * Stops generating when total fortune count exceeds 3000.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { callWithRetry, extractJson, requireEnv, log } from "./lib/utils";
import { MAX_FORTUNES } from "./lib/types";
import type { CategoryData, FortunesFile } from "./lib/types";

const FORTUNES_PATH = path.join(process.cwd(), "src/data/fortunes.json");

function getSmallestCategory(data: FortunesFile): string {
  let smallest = "";
  let minCount = Infinity;

  for (const [name, cat] of Object.entries(data.categories)) {
    if (cat.fortunes.length < minCount) {
      minCount = cat.fortunes.length;
      smallest = name;
    }
  }

  return smallest;
}

function getSampleFortunes(fortunes: string[], count: number): string[] {
  const shuffled = [...fortunes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function generateFortunes(): Promise<void> {
  const apiKey = requireEnv("ANTHROPIC_API_KEY");
  const client = new Anthropic({ apiKey });

  // Read current fortunes
  const rawData = fs.readFileSync(FORTUNES_PATH, "utf-8");
  const data: FortunesFile = JSON.parse(rawData);

  // Check fortune cap
  const currentTotal = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length,
    0,
  );
  if (currentTotal > MAX_FORTUNES) {
    log.info(`Fortune database has ${currentTotal} fortunes (cap: ${MAX_FORTUNES}). Skipping generation.`);
    return;
  }

  // Find category with fewest fortunes
  const targetCategory = getSmallestCategory(data);
  const currentFortunes = data.categories[targetCategory].fortunes;
  const rarity = data.categories[targetCategory].rarity;

  log.info(
    `Target category: ${targetCategory} (${currentFortunes.length} fortunes, ${rarity} rarity)`,
  );

  // Get sample fortunes as style reference
  const samples = getSampleFortunes(currentFortunes, 30);

  // Generate new fortunes
  const result = await callWithRetry(async () => {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a fortune cookie writer. Generate exactly 20 new fortune cookie messages for the "${targetCategory}" category (${rarity} rarity).

Style constraints:
- Each fortune must be 5-25 words long
- No generic filler phrases ("remember to", "always try to", etc.)
- Original and creative — do NOT copy existing fortunes
- Match the tone and style of these existing ${targetCategory} fortunes:

${samples.map((f) => `- "${f}"`).join("\n")}

Return ONLY a JSON array of 20 strings, no other text. Example format:
["Fortune one.", "Fortune two.", "Fortune three."]`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = extractJson(text, "array");
    if (!Array.isArray(parsed)) throw new Error("Response is not an array");
    const strings = parsed.filter((item): item is string => typeof item === "string");
    if (strings.length === 0) throw new Error("No valid fortune strings in response");
    return strings;
  });

  log.info(`Generated ${result.length} fortune candidates`);

  // Deduplicate against all existing fortunes
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
    // Track newly accepted fortune to prevent intra-batch duplicates
    allExisting.add(normalized);
    return true;
  });

  log.info(`Valid after dedup: ${valid.length}`);

  if (valid.length < 5) {
    throw new Error(
      `Only ${valid.length} valid fortunes after dedup (need >= 5). Regeneration needed.`,
    );
  }

  // Add to category
  data.categories[targetCategory].fortunes.push(...valid);

  // Write back
  fs.writeFileSync(FORTUNES_PATH, JSON.stringify(data, null, 2) + "\n");

  const totalFortunes = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length,
    0,
  );

  log.ok(`Added ${valid.length} fortunes to "${targetCategory}"`);
  log.ok(`New total: ${totalFortunes} fortunes`);
}

generateFortunes().catch((err) => {
  log.error(`Failed to generate fortunes: ${err.message || err}`);
  process.exit(1);
});
