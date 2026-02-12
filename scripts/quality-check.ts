/**
 * Blog post quality checker
 *
 * Usage:
 *   npx tsx scripts/quality-check.ts [slug]  # Check a specific post by slug
 *   npx tsx scripts/quality-check.ts         # Check the post whose slug is in .generated-slug
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Claude API key (optional; enables AI quality review)
 *
 * Checks: frontmatter fields, word count (min 600), H2 headings (min 3), internal links,
 * no H1 headings, and optionally an AI quality review (score >= 6/10 to pass).
 * Exits with code 1 if any checks fail.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { callWithRetry, extractJson, log } from "./lib/utils";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const SLUG_FILE = path.join(process.cwd(), ".generated-slug");

interface QualityResult {
  pass: boolean;
  issues: string[];
  score?: number;
}

function getSlug(): string {
  if (process.argv[2]) return process.argv[2];
  if (fs.existsSync(SLUG_FILE)) return fs.readFileSync(SLUG_FILE, "utf-8").trim();
  log.error("No slug provided. Pass as argument or run generate-post.ts first.");
  process.exit(1);
}

async function main() {
  const slug = getSlug();
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    log.error(`Post not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const result: QualityResult = { pass: true, issues: [] };

  log.step(`Quality check: ${slug}`);

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
  log.info(`Word count: ${wordCount}`);
  if (wordCount < 600) {
    result.issues.push(`Word count too low: ${wordCount} (min 600)`);
    result.pass = false;
  }

  // 3. H2 count
  const h2Count = (content.match(/^## /gm) || []).length;
  log.info(`H2 headings: ${h2Count}`);
  if (h2Count < 3) {
    result.issues.push(`Too few H2 headings: ${h2Count} (min 3)`);
    result.pass = false;
  }

  // 4. Internal link
  const hasInternalLink =
    content.includes("fortunecrack.com") || content.includes("/blog/");
  log.info(`Internal link: ${hasInternalLink ? "yes" : "no"}`);
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
    log.info("Running AI quality review...");
    const client = new Anthropic();

    try {
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
      const reviewObj = extractJson(reviewText, "object") as {
        score: unknown;
        feedback: unknown;
      };
      const score = Number(reviewObj.score);
      const feedback = String(reviewObj.feedback || "");

      if (isNaN(score)) {
        result.issues.push("AI quality review returned invalid score");
        result.pass = false;
      } else {
        result.score = score;
        log.info(`AI quality score: ${score}/10 — ${feedback}`);
        if (score < 6) {
          result.issues.push(`AI quality score too low: ${score}/10`);
          result.pass = false;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.warn(`AI quality review failed: ${msg}`);
      result.issues.push("AI quality review failed to complete");
      result.pass = false;
    }
  }

  // Output results
  if (result.issues.length > 0) {
    log.error("Issues found:");
    for (const issue of result.issues) {
      console.log(`  - ${issue}`);
    }
  } else {
    log.ok("All quality checks passed.");
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
  log.error(`Quality check error: ${err.message || err}`);
  process.exit(1);
});
