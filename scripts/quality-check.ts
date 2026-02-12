import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const SLUG_FILE = path.join(process.cwd(), ".generated-slug");

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

interface QualityResult {
  pass: boolean;
  issues: string[];
  score?: number;
}

function getSlug(): string {
  // From CLI argument or .generated-slug file
  if (process.argv[2]) return process.argv[2];
  if (fs.existsSync(SLUG_FILE)) return fs.readFileSync(SLUG_FILE, "utf-8").trim();
  console.error("No slug provided. Pass as argument or run generate-post.ts first.");
  process.exit(1);
}

async function main() {
  const slug = getSlug();
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    console.error(`Post not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const result: QualityResult = { pass: true, issues: [] };

  console.log(`Quality check: ${slug}\n`);

  // 1. Frontmatter validation
  const required = ["title", "date", "readTime", "excerpt"];
  for (const field of required) {
    if (!data[field]) {
      result.issues.push(`Missing frontmatter field: ${field}`);
      result.pass = false;
    }
  }

  if (data.excerpt && String(data.excerpt).length > 160) {
    result.issues.push(
      `Excerpt too long: ${String(data.excerpt).length} chars (max 160)`,
    );
    result.pass = false;
  }

  // 2. Word count
  const wordCount = content.trim().split(/\s+/).length;
  console.log(`  Word count: ${wordCount}`);
  if (wordCount < 600) {
    result.issues.push(`Word count too low: ${wordCount} (min 600)`);
    result.pass = false;
  }

  // 3. H2 count
  const h2Count = (content.match(/^## /gm) || []).length;
  console.log(`  H2 headings: ${h2Count}`);
  if (h2Count < 3) {
    result.issues.push(`Too few H2 headings: ${h2Count} (min 3)`);
    result.pass = false;
  }

  // 4. Internal link
  const hasInternalLink =
    content.includes("fortunecrack.com") || content.includes("/blog/");
  console.log(`  Internal link: ${hasInternalLink ? "yes" : "no"}`);
  if (!hasInternalLink) {
    result.issues.push("No internal link to fortunecrack.com found");
    result.pass = false;
  }

  // 5. No H1 headings
  const h1Count = (content.match(/^# [^#]/gm) || []).length;
  if (h1Count > 0) {
    result.issues.push(
      `Found ${h1Count} H1 heading(s) — page template provides H1`,
    );
    result.pass = false;
  }

  // 6. AI quality review (only if structural checks pass)
  if (result.pass && process.env.ANTHROPIC_API_KEY) {
    console.log("\n  Running AI quality review...");
    const client = new Anthropic();
    const reviewResponse = await callWithRetry(() =>
      client.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Rate this blog post on a scale of 1-10 for quality, engagement, and SEO value. Be strict — a 6 is the minimum acceptable quality. Return ONLY a JSON object:
{"score": <number>, "feedback": "<one sentence>"}

Title: ${data.title}

${content.slice(0, 6000)}`,
          },
        ],
      }),
    );

    const reviewText =
      reviewResponse.content[0].type === "text"
        ? reviewResponse.content[0].text
        : "";
    const reviewMatch = reviewText.match(/\{[\s\S]*\}/);
    if (reviewMatch) {
      const review = JSON.parse(reviewMatch[0]) as {
        score: number;
        feedback: string;
      };
      result.score = review.score;
      console.log(
        `  AI quality score: ${review.score}/10 — ${review.feedback}`,
      );
      if (review.score < 6) {
        result.issues.push(`AI quality score too low: ${review.score}/10`);
        result.pass = false;
      }
    }
  }

  // Output results
  if (result.issues.length > 0) {
    console.log("\nIssues:");
    for (const issue of result.issues) {
      console.log(`  - ${issue}`);
    }
  } else {
    console.log("\nAll quality checks passed.");
  }

  // GitHub Actions outputs
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `quality_pass=${result.pass}\nscore=${result.score ?? "N/A"}\n`,
    );
  }

  if (!result.pass) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Quality check error:", err.message || err);
  process.exit(1);
});
