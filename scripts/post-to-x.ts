/**
 * Post daily fortune, horoscope, or blog tweets to X (Twitter).
 *
 * Usage:
 *   npx tsx scripts/post-to-x.ts --fortune     # Post daily fortune tweet
 *   npx tsx scripts/post-to-x.ts --horoscope   # Post rotating zodiac horoscope tweet
 *   npx tsx scripts/post-to-x.ts --both        # Post fortune + horoscope
 *   npx tsx scripts/post-to-x.ts --blog        # Post one untweeted blog post (oldest first)
 *   npx tsx scripts/post-to-x.ts --blog-all    # Post all untweeted blog posts (30s delay between)
 *
 * Requires env vars: X_CONSUMER_KEY, X_SECRET_KEY, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
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
    appKey: requireEnv("X_CONSUMER_KEY"),
    appSecret: requireEnv("X_SECRET_KEY"),
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
// Blog tweet helpers
// ---------------------------------------------------------------------------

const BLOG_STATE_PATH = path.join(__dirname, "x-blog-state.json");
const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

function loadBlogState(): string[] {
  if (!fs.existsSync(BLOG_STATE_PATH)) return [];
  return JSON.parse(fs.readFileSync(BLOG_STATE_PATH, "utf-8"));
}

function saveBlogState(slugs: string[]): void {
  fs.writeFileSync(BLOG_STATE_PATH, JSON.stringify(slugs, null, 2) + "\n");
}

function loadBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data } = matter(raw);
    posts.push({
      slug: file.replace(/\.mdx$/, ""),
      title: data.title || file.replace(/\.mdx$/, ""),
      excerpt: data.excerpt || "",
      date: data.date || "1970-01-01",
    });
  }

  // Sort oldest first
  posts.sort((a, b) => a.date.localeCompare(b.date));
  return posts;
}

function buildBlogTweet(post: BlogPost): string {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const header = `\uD83D\uDCD6 ${post.title}\n\n`;
  const footer = `\n\nRead \u2192 ${url}`;
  const maxExcerptLength = MAX_TWEET_LENGTH - header.length - footer.length;

  let excerpt = post.excerpt;
  if (excerpt.length > maxExcerptLength) {
    const truncated = excerpt.slice(0, maxExcerptLength - 1);
    const lastSpace = truncated.lastIndexOf(" ");
    excerpt =
      (lastSpace > maxExcerptLength * 0.5
        ? truncated.slice(0, lastSpace)
        : truncated) + "\u2026";
  }

  return `${header}${excerpt}${footer}`;
}

function getUntweetedPosts(): BlogPost[] {
  const tweeted = loadBlogState();
  const allPosts = loadBlogPosts();
  return allPosts.filter((p) => !tweeted.includes(p.slug));
}

async function postBlogTweets(all: boolean): Promise<void> {
  const untweeted = getUntweetedPosts();

  if (untweeted.length === 0) {
    log.info("No untweeted blog posts. Nothing to do.");
    return;
  }

  const toPost = all ? untweeted : [untweeted[0]];
  log.info(`${untweeted.length} untweeted post(s) found, posting ${toPost.length}`);

  const tweeted = loadBlogState();

  for (let i = 0; i < toPost.length; i++) {
    const post = toPost[i];
    log.step(`Posting blog tweet for: ${post.title}`);
    const tweet = buildBlogTweet(post);
    log.info(`Tweet (${tweet.length} chars):\n${tweet}`);
    await postTweet(tweet);
    tweeted.push(post.slug);
    saveBlogState(tweeted);

    // Delay between tweets to avoid rate limiting
    if (all && i < toPost.length - 1) {
      log.info("Waiting 30s before next tweet...");
      await new Promise((r) => setTimeout(r, 30000));
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const doFortune = args.includes("--fortune") || args.includes("--both");
  const doHoroscope = args.includes("--horoscope") || args.includes("--both");
  const doBlog = args.includes("--blog");
  const doBlogAll = args.includes("--blog-all");

  if (!doFortune && !doHoroscope && !doBlog && !doBlogAll) {
    log.error("Usage: post-to-x.ts --fortune | --horoscope | --both | --blog | --blog-all");
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

  if (doBlog || doBlogAll) {
    log.step("Posting blog tweet(s)");
    await postBlogTweets(doBlogAll);
  }

  log.ok("Done!");
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
