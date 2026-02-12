/**
 * Horoscope content generation script
 *
 * Usage:
 *   npx tsx scripts/generate-horoscopes.ts              # Auto: daily + weekly if Sunday + monthly if 1st
 *   npx tsx scripts/generate-horoscopes.ts --daily       # Generate daily horoscopes only
 *   npx tsx scripts/generate-horoscopes.ts --weekly      # Generate weekly horoscopes only
 *   npx tsx scripts/generate-horoscopes.ts --monthly     # Generate monthly horoscopes only
 *   npx tsx scripts/generate-horoscopes.ts --all         # Generate all three
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Claude API key (required)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { callWithRetry, extractJson, requireEnv, ensureFileExists, log } from "./lib/utils";
import { ZODIAC_SIGNS } from "./lib/types";

const DATA_FILE = path.join(process.cwd(), "src/data/horoscopes.json");

const MOODS = [
  "energetic", "determined", "curious", "reflective", "confident", "focused",
  "harmonious", "intense", "adventurous", "ambitious", "innovative", "intuitive",
  "playful", "calm", "passionate", "grounded", "inspired", "optimistic",
];

const COLORS = [
  "red", "blue", "green", "gold", "silver", "purple", "pink", "orange",
  "white", "navy", "maroon", "teal", "coral", "lavender", "charcoal",
  "emerald", "crimson", "amber", "indigo", "seafoam", "electric blue",
];

interface HoroscopeData {
  daily: { date: string; horoscopes: Record<string, unknown> };
  weekly: { weekOf: string; horoscopes: Record<string, unknown> };
  monthly: { month: string; horoscopes: Record<string, unknown> };
}

const EMPTY_HOROSCOPE_DATA: HoroscopeData = {
  daily: { date: "", horoscopes: {} },
  weekly: { weekOf: "", horoscopes: {} },
  monthly: { month: "", horoscopes: {} },
};

function readData(): HoroscopeData {
  return ensureFileExists<HoroscopeData>(DATA_FILE, EMPTY_HOROSCOPE_DATA);
}

function writeData(data: HoroscopeData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n");
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getWeekStart(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.toISOString().split("T")[0];
}

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getSeasonContext(): string {
  const month = new Date().getUTCMonth() + 1;
  if (month >= 3 && month <= 5) return "spring — renewal, growth, new beginnings";
  if (month >= 6 && month <= 8) return "summer — vitality, passion, abundance";
  if (month >= 9 && month <= 11) return "autumn — harvest, reflection, transformation";
  return "winter — introspection, planning, resilience";
}

async function generateDaily(client: Anthropic): Promise<Record<string, unknown>> {
  const signList = ZODIAC_SIGNS.map((s) => `${s.name} (${s.element}, ruled by ${s.ruler})`).join("\n");

  const response = await callWithRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `You are an expert astrologer writing daily horoscopes. Generate today's horoscope for all 12 zodiac signs.

Date: ${getToday()}. Season: ${getSeasonContext()}.
Write engaging, warm English. Reference planetary movements. Each sign: 2-3 sentences (40-80 words). Vary tone.

Signs: ${signList}

Output JSON object with lowercase sign keys. Each value:
- "text": string (2-3 sentences)
- "love": number 1-5
- "career": number 1-5
- "health": number 1-5
- "luckyNumber": number 1-99
- "luckyColor": string (from: ${COLORS.join(", ")})
- "mood": string (from: ${MOODS.join(", ")})

Ensure variety in ratings. Unique luckyNumber, luckyColor, mood per sign.
Return ONLY JSON. No markdown fences.`,
      }],
    }),
  );

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return extractJson(text, "object") as Record<string, unknown>;
}

async function generateWeekly(client: Anthropic): Promise<Record<string, unknown>> {
  const signList = ZODIAC_SIGNS.map((s) => `${s.name} (${s.element}, ruled by ${s.ruler})`).join("\n");

  const response = await callWithRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 6000,
      messages: [{
        role: "user",
        content: `Expert astrologer writing weekly horoscopes. Week of: ${getWeekStart()}. Season: ${getSeasonContext()}.
English with depth. Reference planetary aspects. Each section: 2-3 sentences.

Signs: ${signList}

JSON object with lowercase sign keys. Each value:
- "overview": string
- "love": string
- "career": string
- "advice": string (1-2 sentences)

Return ONLY JSON. No markdown fences.`,
      }],
    }),
  );

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return extractJson(text, "object") as Record<string, unknown>;
}

async function generateMonthly(client: Anthropic): Promise<Record<string, unknown>> {
  const month = getCurrentMonth();
  const [year, mon] = month.split("-");
  const monthName = new Date(parseInt(year), parseInt(mon) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const signList = ZODIAC_SIGNS.map((s) => `${s.name} (${s.element}, ruled by ${s.ruler})`).join("\n");

  const response = await callWithRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: `Expert astrologer writing monthly horoscopes for ${monthName}. Season: ${getSeasonContext()}.
English with depth and warmth. Reference major transits. Each section: 2-4 sentences.

Signs: ${signList}

JSON object with lowercase sign keys. Each value:
- "overview": string (3-4 sentences)
- "love": string
- "career": string
- "health": string
- "advice": string (1-2 sentences)

Return ONLY JSON. No markdown fences.`,
      }],
    }),
  );

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return extractJson(text, "object") as Record<string, unknown>;
}

function validateKeys(horoscopes: Record<string, unknown>, required: string[], label: string): void {
  for (const sign of ZODIAC_SIGNS) {
    const h = horoscopes[sign.key] as Record<string, unknown> | undefined;
    if (!h) throw new Error(`${label}: missing ${sign.key}`);
    for (const key of required) {
      if (h[key] === undefined || h[key] === null || h[key] === "") {
        throw new Error(`${label}: ${sign.key} missing ${key}`);
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const validFlags = ["--all", "--daily", "--weekly", "--monthly"];
  const invalidFlags = args.filter((a) => a.startsWith("--") && !validFlags.includes(a));
  if (invalidFlags.length > 0) {
    log.error(`Unknown flags: ${invalidFlags.join(", ")}. Valid: ${validFlags.join(", ")}`);
    process.exit(1);
  }

  const flagAll = args.includes("--all");
  const flagDaily = args.includes("--daily");
  const flagWeekly = args.includes("--weekly");
  const flagMonthly = args.includes("--monthly");

  let doDaily = false, doWeekly = false, doMonthly = false;

  if (flagAll) {
    doDaily = doWeekly = doMonthly = true;
  } else if (flagDaily || flagWeekly || flagMonthly) {
    doDaily = flagDaily;
    doWeekly = flagWeekly;
    doMonthly = flagMonthly;
  } else {
    doDaily = true;
    const today = new Date();
    if (today.getUTCDay() === 0) doWeekly = true;
    if (today.getUTCDate() === 1) doMonthly = true;
  }

  const apiKey = requireEnv("ANTHROPIC_API_KEY");
  const client = new Anthropic({ apiKey });
  const data = readData();

  log.info(`Generating: daily=${doDaily} weekly=${doWeekly} monthly=${doMonthly}`);

  if (doDaily) {
    log.step("Generating daily horoscopes");
    const horoscopes = await generateDaily(client);
    validateKeys(horoscopes, ["text", "love", "career", "health", "luckyNumber", "luckyColor", "mood"], "daily");
    data.daily = { date: getToday(), horoscopes };
    log.ok(`Daily horoscopes generated for ${getToday()}`);
  }

  if (doWeekly) {
    log.step("Generating weekly horoscopes");
    const horoscopes = await generateWeekly(client);
    validateKeys(horoscopes, ["overview", "love", "career", "advice"], "weekly");
    data.weekly = { weekOf: getWeekStart(), horoscopes };
    log.ok(`Weekly horoscopes generated for week of ${getWeekStart()}`);
  }

  if (doMonthly) {
    log.step("Generating monthly horoscopes");
    const horoscopes = await generateMonthly(client);
    validateKeys(horoscopes, ["overview", "love", "career", "health", "advice"], "monthly");
    data.monthly = { month: getCurrentMonth(), horoscopes };
    log.ok(`Monthly horoscopes generated for ${getCurrentMonth()}`);
  }

  writeData(data);
  log.ok("Updated src/data/horoscopes.json");
}

main().catch((err) => {
  log.error(`Failed: ${err.message || err}`);
  process.exit(1);
});
