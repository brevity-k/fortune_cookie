import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const FORTUNES_PATH = path.join(ROOT, "src/data/fortunes.json");
const STATE_PATH = path.join(ROOT, "scripts/seasonal-state.json");

interface Season {
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  category: string;
  theme: string;
  prompt: string;
}

const SEASONS: Season[] = [
  {
    name: "new-year",
    startMonth: 12, startDay: 26,
    endMonth: 1, endDay: 7,
    category: "motivation",
    theme: "New Year resolutions and fresh beginnings",
    prompt: "New Year themed fortune cookie messages about fresh starts, resolutions, new beginnings, hope for the year ahead, and turning over a new leaf.",
  },
  {
    name: "valentine",
    startMonth: 2, startDay: 1,
    endMonth: 2, endDay: 14,
    category: "love",
    theme: "Valentine's Day love and romance",
    prompt: "Valentine's Day themed fortune cookie messages about love, romance, soulmates, heartfelt connections, and the magic of relationships.",
  },
  {
    name: "halloween",
    startMonth: 10, startDay: 15,
    endMonth: 10, endDay: 31,
    category: "mystery",
    theme: "Halloween mystery and the supernatural",
    prompt: "Halloween themed fortune cookie messages with a spooky, mysterious, or supernatural twist. Think eerie wisdom, dark humor, and uncanny predictions.",
  },
  {
    name: "thanksgiving",
    startMonth: 11, startDay: 15,
    endMonth: 11, endDay: 28,
    category: "wisdom",
    theme: "Thanksgiving gratitude and abundance",
    prompt: "Thanksgiving themed fortune cookie messages about gratitude, abundance, thankfulness, family bonds, and appreciating life's blessings.",
  },
  {
    name: "christmas",
    startMonth: 12, startDay: 10,
    endMonth: 12, endDay: 25,
    category: "wisdom",
    theme: "Christmas joy and holiday spirit",
    prompt: "Christmas and holiday themed fortune cookie messages about joy, generosity, holiday magic, warmth, togetherness, and the spirit of giving.",
  },
];

interface CategoryData {
  rarity: string;
  fortunes: string[];
}

interface FortunesFile {
  categories: Record<string, CategoryData>;
}

interface SeasonalState {
  [year: string]: string[];
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
      console.log(`API call failed (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs / 1000}s...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("Unreachable");
}

function isInWindow(season: Season, now: Date): boolean {
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Handle year-wrapping seasons (e.g., new-year: Dec 26 - Jan 7)
  if (season.startMonth > season.endMonth) {
    return (
      (month === season.startMonth && day >= season.startDay) ||
      (month > season.startMonth) ||
      (month < season.endMonth) ||
      (month === season.endMonth && day <= season.endDay)
    );
  }

  // Same-year window
  if (month < season.startMonth || month > season.endMonth) return false;
  if (month === season.startMonth && day < season.startDay) return false;
  if (month === season.endMonth && day > season.endDay) return false;
  return true;
}

function getActiveSeason(now: Date): Season | null {
  for (const season of SEASONS) {
    if (isInWindow(season, now)) return season;
  }
  return null;
}

async function generateSeasonal(): Promise<void> {
  const now = new Date();
  const year = String(now.getFullYear());

  const season = getActiveSeason(now);

  if (!season) {
    console.log("No active seasonal window. Skipping.");
    return;
  }

  console.log(`Active season: ${season.name} (${season.theme})`);

  // Check state
  let state: SeasonalState = {};
  if (fs.existsSync(STATE_PATH)) {
    try {
      state = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
    } catch {
      state = {};
    }
  }

  if (state[year]?.includes(season.name)) {
    console.log(`Season "${season.name}" already generated for ${year}. Skipping.`);
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  const client = new Anthropic({ apiKey });

  // Read current fortunes
  const data: FortunesFile = JSON.parse(fs.readFileSync(FORTUNES_PATH, "utf-8"));

  // Collect all existing fortunes for dedup
  const allExisting = new Set<string>();
  for (const cat of Object.values(data.categories)) {
    for (const f of cat.fortunes) {
      allExisting.add(f.toLowerCase().trim());
    }
  }

  // Get sample fortunes from target category for style reference
  const targetCat = data.categories[season.category];
  if (!targetCat) {
    throw new Error(`Target category "${season.category}" not found in fortunes.json`);
  }

  const samples = [...targetCat.fortunes]
    .sort(() => Math.random() - 0.5)
    .slice(0, 15);

  console.log(`Generating 20 ${season.name} fortunes for "${season.category}" category...`);

  const result = await callWithRetry(async () => {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a fortune cookie writer. Generate exactly 20 seasonal fortune cookie messages.

Theme: ${season.prompt}

Style constraints:
- Each fortune must be 5-25 words long
- No generic filler phrases ("remember to", "always try to", etc.)
- Subtly seasonal — the theme should enhance, not overpower the fortune cookie voice
- Original and creative — do NOT copy existing fortunes
- Match the tone and style of these existing "${season.category}" fortunes:

${samples.map((f) => `- "${f}"`).join("\n")}

Return ONLY a JSON array of 20 strings, no other text. Example format:
["Fortune one.", "Fortune two.", "Fortune three."]`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array found in response");
    return JSON.parse(match[0]) as string[];
  });

  console.log(`Generated ${result.length} fortune candidates`);

  // Validate and deduplicate
  const valid = result.filter((f) => {
    const normalized = f.toLowerCase().trim();
    if (allExisting.has(normalized)) {
      console.log(`  Duplicate: "${f}"`);
      return false;
    }
    const wordCount = f.split(/\s+/).length;
    if (wordCount < 4 || wordCount > 30) {
      console.log(`  Bad length (${wordCount} words): "${f}"`);
      return false;
    }
    allExisting.add(normalized);
    return true;
  });

  console.log(`Valid after dedup: ${valid.length}`);

  if (valid.length < 5) {
    throw new Error(`Only ${valid.length} valid fortunes after dedup (need >= 5)`);
  }

  // Add to target category
  data.categories[season.category].fortunes.push(...valid);
  fs.writeFileSync(FORTUNES_PATH, JSON.stringify(data, null, 2) + "\n");

  // Update state
  if (!state[year]) state[year] = [];
  state[year].push(season.name);
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");

  const totalFortunes = Object.values(data.categories).reduce(
    (sum, cat) => sum + cat.fortunes.length, 0
  );

  console.log(`Added ${valid.length} seasonal "${season.name}" fortunes to "${season.category}"`);
  console.log(`New total: ${totalFortunes} fortunes`);
}

generateSeasonal().catch((err) => {
  console.error("Failed to generate seasonal content:", err);
  process.exit(1);
});
