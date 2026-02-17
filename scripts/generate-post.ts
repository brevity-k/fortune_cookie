/**
 * Blog post generator
 *
 * Usage:
 *   npx tsx scripts/generate-post.ts       # Generate a new blog post via Claude API
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Claude API key (required)
 *
 * Two-stage process: (1) topic selection with slug collision retry, (2) full post writing.
 * Writes the MDX file to src/content/blog/ and saves the slug to .generated-slug for
 * downstream scripts (auto-fix.ts, quality-check.ts).
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { callWithRetry, extractJson, log } from "./lib/utils";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const SLUG_FILE = path.join(process.cwd(), ".generated-slug");

const CONTENT_PILLARS = [
  "Luck & Superstition — lucky charms, rituals, cultural beliefs, science of luck",
  "Wellness & Mindfulness — positive psychology, daily rituals, gratitude, small joys",
  "Astrology & Spirituality — zodiac, tarot, divination history, fortune-telling cultures",
  "Fun Lists & Stories — real-life fortune stories, viral moments, listicles",
  "Food & Culture — dessert traditions, Asian cuisine, cultural fusion, food history",
];

interface TopicResult {
  title: string;
  slug: string;
  excerpt: string;
  keywords: string[];
}

function validateTopic(obj: unknown): TopicResult {
  const t = obj as Record<string, unknown>;
  if (!t.title || typeof t.title !== "string") throw new Error("Topic missing 'title'");
  if (!t.slug || typeof t.slug !== "string") throw new Error("Topic missing 'slug'");
  if (!t.excerpt || typeof t.excerpt !== "string") throw new Error("Topic missing 'excerpt'");
  if (!Array.isArray(t.keywords)) throw new Error("Topic missing 'keywords' array");
  if (!/^[a-z0-9-]+$/.test(t.slug)) throw new Error(`Invalid slug format: "${t.slug}"`);
  return t as unknown as TopicResult;
}

async function main() {
  const client = new Anthropic();

  // Read existing posts
  const existingFiles = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));
  const existingSlugs = existingFiles.map((f) => f.replace(/\.mdx$/, ""));
  const existingTitles: string[] = [];

  for (const file of existingFiles) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data } = matter(raw);
    existingTitles.push(data.title);
  }

  // Rotate content pillars based on post count
  const pillarIndex = existingFiles.length % CONTENT_PILLARS.length;
  const pillar = CONTENT_PILLARS[pillarIndex];
  log.info(`Content pillar: ${pillar}`);
  log.info(`Existing posts: ${existingFiles.length}`);

  // Stage 1: Topic selection
  const topicResponse = await callWithRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a blog content strategist for fortunecrack.com, an interactive fortune cookie website where users can virtually break fortune cookies.

Content pillar for this post: "${pillar}"

Existing blog post titles (DO NOT duplicate these topics):
${existingTitles.map((t) => `- ${t}`).join("\n")}

Generate ONE new blog post topic. Return ONLY a JSON object with no other text:
{
  "title": "SEO-friendly title with target keyword (50-70 chars)",
  "slug": "url-friendly-slug-lowercase-hyphens",
  "excerpt": "Compelling meta description under 155 characters",
  "keywords": ["primary keyword", "secondary keyword"]
}

Requirements:
- Title must be engaging and include a target keyword
- Slug: lowercase, hyphens only, no special characters
- Excerpt: under 155 characters, compelling for search results
- Topic must be completely unique from existing posts
- Related to fortune cookies, luck, wisdom, or the content pillar theme`,
        },
      ],
    }),
  );

  const topicText =
    topicResponse.content[0].type === "text"
      ? topicResponse.content[0].text
      : "";
  const topicObj = extractJson(topicText, "object");
  let finalTopic = validateTopic(topicObj);

  // Validate slug uniqueness — retry Stage 1 up to 3 times on collision
  const MAX_SLUG_RETRIES = 3;

  if (existingSlugs.includes(finalTopic.slug)) {
    let resolved = false;
    for (let retry = 1; retry <= MAX_SLUG_RETRIES; retry++) {
      log.warn(`Slug "${finalTopic.slug}" already exists. Retrying topic selection (${retry}/${MAX_SLUG_RETRIES})...`);

      const retryResponse = await callWithRetry(() =>
        client.messages.create({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: `You are a blog content strategist for fortunecrack.com, an interactive fortune cookie website where users can virtually break fortune cookies.

Content pillar for this post: "${pillar}"

Existing blog post titles (DO NOT duplicate these topics):
${existingTitles.map((t) => `- ${t}`).join("\n")}

Slugs that are already taken (DO NOT reuse): ${[...existingSlugs, finalTopic.slug].join(", ")}

Generate ONE new blog post topic that is COMPLETELY DIFFERENT from previous attempts. Return ONLY a JSON object with no other text:
{
  "title": "SEO-friendly title with target keyword (50-70 chars)",
  "slug": "url-friendly-slug-lowercase-hyphens",
  "excerpt": "Compelling meta description under 155 characters",
  "keywords": ["primary keyword", "secondary keyword"]
}

Requirements:
- Title must be engaging and include a target keyword
- Slug: lowercase, hyphens only, no special characters
- Excerpt: under 155 characters, compelling for search results
- Topic must be completely unique from existing posts
- Related to fortune cookies, luck, wisdom, or the content pillar theme`,
            },
          ],
        }),
      );

      const retryText =
        retryResponse.content[0].type === "text"
          ? retryResponse.content[0].text
          : "";

      try {
        const retryObj = extractJson(retryText, "object");
        finalTopic = validateTopic(retryObj);
      } catch {
        continue;
      }

      if (!existingSlugs.includes(finalTopic.slug)) {
        resolved = true;
        break;
      }
    }

    if (!resolved) {
      log.error(`Failed to generate unique slug after ${MAX_SLUG_RETRIES} retries. Aborting.`);
      process.exit(1);
    }
  }

  log.info(`Topic: ${finalTopic.title}`);
  log.info(`Slug: ${finalTopic.slug}`);
  log.info(`Excerpt: ${finalTopic.excerpt}`);

  // Stage 2: Write the post
  const postResponse = await callWithRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 16384,
      messages: [
        {
          role: "user",
          content: `Write a blog post for fortunecrack.com, an interactive fortune cookie website where users can virtually break fortune cookies to reveal their fortunes.

Title: "${finalTopic.title}"
Target keywords: ${finalTopic.keywords.join(", ")}

Requirements:
- Write 1,000-1,500 words of engaging, informative content
- Use 4-6 ## H2 headings for scannability (NEVER use # H1 — the page template adds the H1)
- Write in a warm, conversational, knowledgeable tone
- Naturally weave in ONE brief mention of fortunecrack.com — only where it fits the context organically (e.g., in a sentence about trying your luck or exploring fortune-telling traditions). Do NOT force a promotional link if it doesn't flow naturally. Use format: [anchor text](https://fortunecrack.com)
- Every paragraph must add genuine value — no filler, no fluff, no generic statements
- Do NOT include the title as a heading
- Do NOT include frontmatter
- Start directly with an engaging opening paragraph (no "In this article..." openings)
- End with a complete, thoughtful conclusion paragraph that wraps up the key takeaways. The conclusion MUST be a full, well-formed paragraph — never end mid-sentence
- Use specific facts, examples, and anecdotes where possible
- IMPORTANT: Make sure every sentence is complete. Double-check that the final paragraph ends properly with a full stop`,
        },
      ],
    }),
  );

  if (postResponse.stop_reason === "max_tokens") {
    log.error("API response was truncated (hit max_tokens). Post would be incomplete.");
    process.exit(1);
  }

  const content =
    postResponse.content[0].type === "text"
      ? postResponse.content[0].text
      : "";

  if (!content.trim()) {
    log.error("API returned empty content");
    process.exit(1);
  }

  // Calculate read time
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 250))} min read`;

  // Build MDX file
  const today = new Date().toISOString().split("T")[0];
  const mdxContent = matter.stringify(content.trim(), {
    title: finalTopic.title,
    date: today,
    readTime,
    excerpt: finalTopic.excerpt,
  });

  // Write the file
  const filePath = path.join(BLOG_DIR, `${finalTopic.slug}.mdx`);
  fs.writeFileSync(filePath, mdxContent, "utf-8");

  // Write slug for downstream scripts
  fs.writeFileSync(SLUG_FILE, finalTopic.slug, "utf-8");

  log.ok(`Post written: ${filePath}`);
  log.info(`Word count: ${wordCount}`);
  log.info(`Read time: ${readTime}`);

  // GitHub Actions outputs
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `slug=${finalTopic.slug}\ntitle=${finalTopic.title}\nword_count=${wordCount}\n`,
    );
  }
}

main().catch((err) => {
  log.error(`Generation failed: ${err.message || err}`);
  process.exit(1);
});
