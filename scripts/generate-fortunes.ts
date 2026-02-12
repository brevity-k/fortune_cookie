import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const FORTUNES_PATH = path.join(process.cwd(), "src/data/fortunes.json");

interface CategoryData {
  rarity: string;
  fortunes: string[];
}

interface FortunesFile {
  categories: Record<string, CategoryData>;
}

async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 30000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      console.log(
        `API call failed (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs / 1000}s...`
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("Unreachable");
}

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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  const client = new Anthropic({ apiKey });

  // Read current fortunes
  const rawData = fs.readFileSync(FORTUNES_PATH, "utf-8");
  const data: FortunesFile = JSON.parse(rawData);

  // Check fortune cap — skip generation if database is large enough
  const currentTotal = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length,
    0
  );
  if (currentTotal > 3000) {
    console.log(`Fortune database has ${currentTotal} fortunes (cap: 3000). Skipping generation.`);
    return;
  }

  // Find category with fewest fortunes
  const targetCategory = getSmallestCategory(data);
  const currentFortunes = data.categories[targetCategory].fortunes;
  const rarity = data.categories[targetCategory].rarity;

  console.log(`Target category: ${targetCategory} (${currentFortunes.length} fortunes, ${rarity} rarity)`);

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
    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array found in response");
    return JSON.parse(match[0]) as string[];
  });

  console.log(`Generated ${result.length} fortune candidates`);

  // Deduplicate against all existing fortunes
  const allExisting = new Set<string>();
  for (const cat of Object.values(data.categories)) {
    for (const f of cat.fortunes) {
      allExisting.add(f.toLowerCase().trim());
    }
  }

  const valid = result.filter((f) => {
    const normalized = f.toLowerCase().trim();
    // Check not duplicate
    if (allExisting.has(normalized)) {
      console.log(`  Duplicate: "${f}"`);
      return false;
    }
    // Check length (roughly 5-25 words)
    const wordCount = f.split(/\s+/).length;
    if (wordCount < 4 || wordCount > 30) {
      console.log(`  Bad length (${wordCount} words): "${f}"`);
      return false;
    }
    return true;
  });

  console.log(`Valid after dedup: ${valid.length}`);

  if (valid.length < 5) {
    throw new Error(
      `Only ${valid.length} valid fortunes after dedup (need >= 5). Regeneration needed.`
    );
  }

  // Add to category
  data.categories[targetCategory].fortunes.push(...valid);

  // Write back
  fs.writeFileSync(FORTUNES_PATH, JSON.stringify(data, null, 2) + "\n");

  const totalFortunes = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length,
    0
  );

  console.log(`Added ${valid.length} fortunes to "${targetCategory}"`);
  console.log(`New total: ${totalFortunes} fortunes`);
}

generateFortunes().catch((err) => {
  console.error("Failed to generate fortunes:", err);
  process.exit(1);
});
