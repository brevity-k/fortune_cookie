/**
 * Post daily fortune or horoscope tweets to X (Twitter).
 *
 * Usage:
 *   npx tsx scripts/post-to-x.ts --fortune     # Post daily fortune tweet
 *   npx tsx scripts/post-to-x.ts --horoscope   # Post rotating zodiac horoscope tweet
 *   npx tsx scripts/post-to-x.ts --both        # Post both
 *
 * Requires env vars: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 */

import fs from "fs";
import path from "path";
import { TwitterApi } from "twitter-api-v2";
import { log, requireEnv, callWithRetry } from "./lib/utils";
import { ZODIAC_SIGNS } from "./lib/types";
import type { FortunesFile } from "./lib/types";

const SITE_URL = "https://fortunecrack.com";
const MAX_TWEET_LENGTH = 280;

// ---------------------------------------------------------------------------
// Seeded random — must match src/lib/fortuneEngine.ts exactly
// ---------------------------------------------------------------------------

function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// ---------------------------------------------------------------------------
// Data loaders
// ---------------------------------------------------------------------------

function loadFortunes(): FortunesFile {
  const filePath = path.join(process.cwd(), "src/data/fortunes.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

interface DailyHoroscope {
  text: string;
  love: number;
  career: number;
  health: number;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
}

interface HoroscopesFile {
  daily: { date: string; horoscopes: Record<string, DailyHoroscope> };
}

function loadHoroscopes(): HoroscopesFile {
  const filePath = path.join(process.cwd(), "src/data/horoscopes.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ---------------------------------------------------------------------------
// Tweet builders
// ---------------------------------------------------------------------------

function truncateToTweetLength(text: string): string {
  if (text.length <= MAX_TWEET_LENGTH) return text;
  const truncated = text.slice(0, MAX_TWEET_LENGTH - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > MAX_TWEET_LENGTH * 0.5 ? truncated.slice(0, lastSpace) : truncated) + "\u2026";
}

function buildFortuneTweet(): string {
  const data = loadFortunes();
  const seed = dateSeed();
  const rng = seededRandom(seed);

  // Replicate getDailyFortune logic
  const allFortunes: { text: string; category: string }[] = [];
  for (const [cat, catData] of Object.entries(data.categories)) {
    for (const text of catData.fortunes) {
      allFortunes.push({ text, category: cat });
    }
  }

  const index = Math.floor(rng() * allFortunes.length);
  const fortune = allFortunes[index];

  const tweet = `\u{1F960} Today's Fortune: "${fortune.text}" \u2728\n\nBreak your own \u2192 ${SITE_URL}/daily`;
  return truncateToTweetLength(tweet);
}

function buildHoroscopeTweet(): string {
  const horoscopes = loadHoroscopes();
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const signIndex = dayOfYear % 12;
  const sign = ZODIAC_SIGNS[signIndex];

  const daily = horoscopes.daily.horoscopes[sign.key];
  if (!daily) {
    throw new Error(`No daily horoscope found for ${sign.key}. Run horoscope generation first.`);
  }

  // Truncate horoscope text to fit within tweet limit
  const header = `${sign.symbol} ${sign.name} Daily Horoscope: `;
  const footer = `\n\n\u2764\uFE0F Love: ${daily.love}/5 | \uD83D\uDCBC Career: ${daily.career}/5 | \uD83C\uDF40 Lucky: ${daily.luckyNumber}\n\nRead more \u2192 ${SITE_URL}/horoscope/daily/${sign.key}`;
  const maxTextLength = MAX_TWEET_LENGTH - header.length - footer.length;

  let horoscopeText = daily.text;
  if (horoscopeText.length > maxTextLength) {
    // Truncate at sentence boundary
    const truncated = horoscopeText.slice(0, maxTextLength);
    const lastPeriod = truncated.lastIndexOf(".");
    horoscopeText = lastPeriod > maxTextLength * 0.4 ? truncated.slice(0, lastPeriod + 1) : truncated + "\u2026";
  }

  return `${header}${horoscopeText}${footer}`;
}

// ---------------------------------------------------------------------------
// Twitter client
// ---------------------------------------------------------------------------

function createClient(): TwitterApi {
  return new TwitterApi({
    appKey: requireEnv("X_API_KEY"),
    appSecret: requireEnv("X_API_SECRET"),
    accessToken: requireEnv("X_ACCESS_TOKEN"),
    accessSecret: requireEnv("X_ACCESS_TOKEN_SECRET"),
  });
}

async function postTweet(text: string): Promise<void> {
  const client = createClient();
  const result = await callWithRetry(
    () => client.v2.tweet(text),
    3,
    10000,
  );
  log.ok(`Tweet posted (ID: ${result.data.id})`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const doFortune = args.includes("--fortune") || args.includes("--both");
  const doHoroscope = args.includes("--horoscope") || args.includes("--both");

  if (!doFortune && !doHoroscope) {
    log.error("Usage: post-to-x.ts --fortune | --horoscope | --both");
    process.exit(1);
  }

  if (doFortune) {
    log.step("Posting daily fortune tweet");
    const tweet = buildFortuneTweet();
    log.info(`Tweet (${tweet.length} chars):\n${tweet}`);
    await postTweet(tweet);
  }

  if (doHoroscope) {
    log.step("Posting horoscope tweet");
    const tweet = buildHoroscopeTweet();
    log.info(`Tweet (${tweet.length} chars):\n${tweet}`);
    await postTweet(tweet);
  }

  log.ok("Done!");
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
