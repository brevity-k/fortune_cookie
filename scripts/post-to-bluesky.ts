/**
 * Post daily fortune, horoscope, or blog posts to Bluesky.
 *
 * Usage:
 *   npx tsx scripts/post-to-bluesky.ts --fortune     # Post daily fortune
 *   npx tsx scripts/post-to-bluesky.ts --horoscope   # Post rotating zodiac horoscope
 *   npx tsx scripts/post-to-bluesky.ts --both        # Post fortune + horoscope
 *   npx tsx scripts/post-to-bluesky.ts --blog        # Post one unposted blog post (oldest first)
 *   npx tsx scripts/post-to-bluesky.ts --blog-all    # Post all unposted blog posts (30s delay between)
 *
 * Requires env vars: BLUESKY_HANDLE, BLUESKY_APP_PASSWORD
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { AtpAgent, RichText } from "@atproto/api";
import { log, requireEnv, callWithRetry } from "./lib/utils";
import { ZODIAC_SIGNS } from "./lib/types";
import type { FortunesFile } from "./lib/types";

const SITE_URL = "https://www.fortunecrack.com";
const MAX_GRAPHEMES = 300;

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
// Grapheme counting
// ---------------------------------------------------------------------------

function graphemeLength(text: string): number {
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  return [...segmenter.segment(text)].length;
}

function truncateToGraphemeLimit(text: string, limit: number): string {
  if (graphemeLength(text) <= limit) return text;
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const segments = [...segmenter.segment(text)];
  const truncated = segments.slice(0, limit - 1).map((s) => s.segment).join("");
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > limit * 0.5 ? truncated.slice(0, lastSpace) : truncated) + "\u2026";
}

// ---------------------------------------------------------------------------
// Post builders
// ---------------------------------------------------------------------------

function buildFortunePost(): string {
  const data = loadFortunes();
  const seed = dateSeed();
  const rng = seededRandom(seed);

  const allFortunes: { text: string; category: string }[] = [];
  for (const [cat, catData] of Object.entries(data.categories)) {
    for (const text of catData.fortunes) {
      allFortunes.push({ text, category: cat });
    }
  }

  const index = Math.floor(rng() * allFortunes.length);
  const fortune = allFortunes[index];

  const post = `\u{1F960} Today's Fortune: "${fortune.text}" \u2728\n\nBreak your own \u2192 ${SITE_URL}/daily`;
  return truncateToGraphemeLimit(post, MAX_GRAPHEMES);
}

function buildHoroscopePost(): string {
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

  const header = `${sign.symbol} ${sign.name} Daily Horoscope: `;
  const footer = `\n\n\u2764\uFE0F Love: ${daily.love}/5 | \uD83D\uDCBC Career: ${daily.career}/5 | \uD83C\uDF40 Lucky: ${daily.luckyNumber}\n\nRead more \u2192 ${SITE_URL}/horoscope/daily/${sign.key}`;
  const maxTextLength = MAX_GRAPHEMES - graphemeLength(header) - graphemeLength(footer);

  let horoscopeText = daily.text;
  if (graphemeLength(horoscopeText) > maxTextLength) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const segments = [...segmenter.segment(horoscopeText)];
    const truncated = segments.slice(0, maxTextLength).map((s) => s.segment).join("");
    const lastPeriod = truncated.lastIndexOf(".");
    horoscopeText = lastPeriod > maxTextLength * 0.4 ? truncated.slice(0, lastPeriod + 1) : truncated + "\u2026";
  }

  return `${header}${horoscopeText}${footer}`;
}

// ---------------------------------------------------------------------------
// Bluesky client
// ---------------------------------------------------------------------------

let _agent: AtpAgent | null = null;

async function getAgent(): Promise<AtpAgent> {
  if (_agent) return _agent;
  _agent = new AtpAgent({ service: "https://bsky.social" });
  await callWithRetry(
    () => _agent!.login({
      identifier: requireEnv("BLUESKY_HANDLE"),
      password: requireEnv("BLUESKY_APP_PASSWORD"),
    }),
    3,
    10000,
  );
  return _agent;
}

async function postToBluesky(text: string): Promise<void> {
  const agent = await getAgent();
  const rt = new RichText({ text });
  await rt.detectFacets(agent);
  const result = await callWithRetry(
    () => agent.post({ text: rt.text, facets: rt.facets, createdAt: new Date().toISOString() }),
    3,
    10000,
  );
  log.ok(`Posted to Bluesky (URI: ${result.uri})`);
}

// ---------------------------------------------------------------------------
// Dedup state
// ---------------------------------------------------------------------------

const STATE_PATH = path.join(__dirname, "bsky-post-state.json");

interface PostState {
  lastFortuneDate: string | null;
  lastHoroscopeDate: string | null;
  postedBlogSlugs: string[];
}

function loadState(): PostState {
  if (!fs.existsSync(STATE_PATH)) {
    return { lastFortuneDate: null, lastHoroscopeDate: null, postedBlogSlugs: [] };
  }
  const raw = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  return {
    lastFortuneDate: raw.lastFortuneDate ?? null,
    lastHoroscopeDate: raw.lastHoroscopeDate ?? null,
    postedBlogSlugs: raw.postedBlogSlugs ?? [],
  };
}

function saveState(state: PostState): void {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Blog post helpers
// ---------------------------------------------------------------------------

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
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

  posts.sort((a, b) => a.date.localeCompare(b.date));
  return posts;
}

function buildBlogPost(post: BlogPost): string {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const header = `\uD83D\uDCD6 ${post.title}\n\n`;
  const footer = `\n\nRead \u2192 ${url}`;
  const maxExcerptLength = MAX_GRAPHEMES - graphemeLength(header) - graphemeLength(footer);

  let excerpt = post.excerpt;
  if (graphemeLength(excerpt) > maxExcerptLength) {
    excerpt = truncateToGraphemeLimit(excerpt, maxExcerptLength);
  }

  return `${header}${excerpt}${footer}`;
}

function getUnpostedPosts(state: PostState): BlogPost[] {
  const allPosts = loadBlogPosts();
  return allPosts.filter((p) => !state.postedBlogSlugs.includes(p.slug));
}

async function postBlogPosts(all: boolean): Promise<void> {
  const state = loadState();
  const unposted = getUnpostedPosts(state);

  if (unposted.length === 0) {
    log.info("No unposted blog posts. Nothing to do.");
    return;
  }

  const toPost = all ? unposted : [unposted[0]];
  log.info(`${unposted.length} unposted post(s) found, posting ${toPost.length}`);

  for (let i = 0; i < toPost.length; i++) {
    const post = toPost[i];
    log.step(`Posting blog to Bluesky: ${post.title}`);
    const text = buildBlogPost(post);
    log.info(`Post (${graphemeLength(text)} graphemes):\n${text}`);
    await postToBluesky(text);
    state.postedBlogSlugs.push(post.slug);
    saveState(state);

    if (all && i < toPost.length - 1) {
      log.info("Waiting 30s before next post...");
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
    log.error("Usage: post-to-bluesky.ts --fortune | --horoscope | --both | --blog | --blog-all");
    process.exit(1);
  }

  const state = loadState();
  const today = todayString();

  if (doFortune) {
    if (state.lastFortuneDate === today) {
      log.info(`Fortune already posted to Bluesky today (${today}). Skipping.`);
    } else {
      log.step("Posting daily fortune to Bluesky");
      const text = buildFortunePost();
      log.info(`Post (${graphemeLength(text)} graphemes):\n${text}`);
      await postToBluesky(text);
      state.lastFortuneDate = today;
      saveState(state);
    }
  }

  if (doHoroscope) {
    if (state.lastHoroscopeDate === today) {
      log.info(`Horoscope already posted to Bluesky today (${today}). Skipping.`);
    } else {
      log.step("Posting horoscope to Bluesky");
      const text = buildHoroscopePost();
      log.info(`Post (${graphemeLength(text)} graphemes):\n${text}`);
      await postToBluesky(text);
      state.lastHoroscopeDate = today;
      saveState(state);
    }
  }

  if (doBlog || doBlogAll) {
    log.step("Posting blog to Bluesky");
    await postBlogPosts(doBlogAll);
  }

  log.ok("Done!");
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
