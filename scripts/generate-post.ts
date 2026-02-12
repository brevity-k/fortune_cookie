import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const SLUG_FILE = path.join(process.cwd(), ".generated-slug");

const CONTENT_PILLARS = [
  "Luck & Superstition — lucky charms, rituals, cultural beliefs, science of luck",
  "Wellness & Mindfulness — positive psychology, daily rituals, gratitude, small joys",
  "Astrology & Spirituality — zodiac, tarot, divination history, fortune-telling cultures",
  "Fun Lists & Stories — real-life fortune stories, viral moments, listicles",
  "Food & Culture — dessert traditions, Asian cuisine, cultural fusion, food history",
];

async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 30000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      console.log(
        `API call failed (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs / 1000}s...`,
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("Unreachable");
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
  console.log(`Content pillar: ${pillar}`);
  console.log(`Existing posts: ${existingFiles.length}`);

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
  const jsonMatch = topicText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to parse topic JSON:", topicText);
    process.exit(1);
  }

  const topic = JSON.parse(jsonMatch[0]) as {
    title: string;
    slug: string;
    excerpt: string;
    keywords: string[];
  };

  // Validate slug uniqueness
  if (existingSlugs.includes(topic.slug)) {
    console.error(`Slug "${topic.slug}" already exists. Aborting.`);
    process.exit(1);
  }

  console.log(`\nTopic: ${topic.title}`);
  console.log(`Slug: ${topic.slug}`);
  console.log(`Excerpt: ${topic.excerpt}`);

  // Stage 2: Write the post
  const postResponse = await callWithRetry(() =>
    client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Write a blog post for fortunecrack.com, an interactive fortune cookie website where users can virtually break fortune cookies to reveal their fortunes.

Title: "${topic.title}"
Target keywords: ${topic.keywords.join(", ")}

Requirements:
- Write 1,000-1,500 words of engaging, informative content
- Use 4-6 ## H2 headings for scannability (NEVER use # H1 — the page template adds the H1)
- Write in a warm, conversational, knowledgeable tone
- Include exactly one natural reference linking to the site: [break a fortune cookie at fortunecrack.com](https://fortunecrack.com)
- Every paragraph must add genuine value — no filler, no fluff, no generic statements
- Do NOT include the title as a heading
- Do NOT include frontmatter
- Start directly with an engaging opening paragraph (no "In this article..." openings)
- End with a thoughtful, memorable conclusion
- Use specific facts, examples, and anecdotes where possible`,
        },
      ],
    }),
  );

  const content =
    postResponse.content[0].type === "text"
      ? postResponse.content[0].text
      : "";

  // Calculate read time
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 250))} min read`;

  // Build MDX file
  const today = new Date().toISOString().split("T")[0];
  const mdxContent = matter.stringify(content.trim(), {
    title: topic.title,
    date: today,
    readTime,
    excerpt: topic.excerpt,
  });

  // Write the file
  const filePath = path.join(BLOG_DIR, `${topic.slug}.mdx`);
  fs.writeFileSync(filePath, mdxContent, "utf-8");

  // Write slug for downstream scripts
  fs.writeFileSync(SLUG_FILE, topic.slug, "utf-8");

  console.log(`\nPost written: ${filePath}`);
  console.log(`Word count: ${wordCount}`);
  console.log(`Read time: ${readTime}`);

  // GitHub Actions outputs
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `slug=${topic.slug}\ntitle=${topic.title}\nword_count=${wordCount}\n`,
    );
  }
}

main().catch((err) => {
  console.error("Generation failed:", err.message || err);
  process.exit(1);
});
