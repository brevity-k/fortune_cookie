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
import { ARCHETYPES } from "./lib/archetypes";

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

function getQualityRules(archetype: string | undefined) {
  const match = ARCHETYPES.find((a) => a.name === archetype);
  return match?.qualityRules ?? { h2Minimum: 3, internalLinkRequired: true };
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

  // 2. Word count (raised to 1,200 for in-depth quality)
  const wordCount = content.trim().split(/\s+/).length;
  log.info(`Word count: ${wordCount}`);
  if (wordCount < 1200) {
    result.issues.push(`Word count too low: ${wordCount} (min 1,200)`);
    result.pass = false;
  }

  // 3. H2 count (archetype-aware)
  const h2Count = (content.match(/^## /gm) || []).length;
  const rules = getQualityRules(data.archetype);
  log.info(`H2 headings: ${h2Count} (min: ${rules.h2Minimum}, archetype: ${data.archetype || "legacy"})`);
  if (h2Count < rules.h2Minimum) {
    result.issues.push(`Too few H2 headings: ${h2Count} (min ${rules.h2Minimum} for ${data.archetype || "legacy"})`);
    result.pass = false;
  }

  // 4. Internal link (archetype-aware)
  const hasInternalLink =
    content.includes("fortunecrack.com") ||
    content.includes("](/") ||
    content.includes("/blog/");
  log.info(`Internal link: ${hasInternalLink ? "yes" : "no"} (required: ${rules.internalLinkRequired ? "hard" : "soft"})`);
  if (!hasInternalLink) {
    if (rules.internalLinkRequired) {
      result.issues.push("No internal link found (required for this archetype)");
      result.pass = false;
    } else {
      log.warn("No internal link found (optional for this archetype)");
    }
  }

  // 5. No H1 headings
  const h1Count = (content.match(/^# [^#]/gm) || []).length;
  if (h1Count > 0) {
    result.issues.push(
      `Found ${h1Count} H1 heading(s) — page template provides H1`,
    );
    result.pass = false;
  }

  // 6. Specificity check — posts must contain concrete details
  // Count capitalized multi-word proper nouns (e.g., "Richard Wiseman", "University of Hertfordshire")
  const properNounPattern = /[A-Z][a-z]+(?:\s+(?:of\s+(?:the\s+)?)?[A-Z][a-z]+)+/g;
  const properNouns = content.match(properNounPattern) || [];
  // Deduplicate
  const uniqueProperNouns = [...new Set(properNouns)];
  log.info(`Proper nouns found: ${uniqueProperNouns.length} unique (${uniqueProperNouns.slice(0, 5).join(", ")}${uniqueProperNouns.length > 5 ? "..." : ""})`);
  if (uniqueProperNouns.length < 3) {
    result.issues.push(`Too few proper nouns: ${uniqueProperNouns.length} (min 3). Posts need named people, places, or institutions.`);
    result.pass = false;
  }

  // 7. Numbers check — posts must include specific numbers for concreteness
  const numberPattern = /\b\d[\d,.]+\b/g;
  const numbers = content.match(numberPattern) || [];
  log.info(`Specific numbers found: ${numbers.length}`);
  if (numbers.length < 3) {
    result.issues.push(`Too few specific numbers: ${numbers.length} (min 3). Posts need concrete measurements, dates, or statistics.`);
    result.pass = false;
  }

  // 8. AI quality review (only if structural checks pass)
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
              content: `Rate this blog post on a scale of 1-10 for quality, engagement, and SEO value. Be strict — a 7 is the minimum acceptable quality.

Context: This post is published on fortunecrack.com (a fortune cookie website). The post archetype is "${data.archetype || "legacy"}".

Archetype-specific criteria:${data.archetype === "midnight-question" ? " Does the opening create emotional recognition? Is there a genuine reframe?" : ""}${data.archetype === "honest-answer" ? " Does it acknowledge the obvious answer first? Is the real answer surprising?" : ""}${data.archetype === "one-thing-deeply" ? " Does it stay focused on one subject? Are there sensory details?" : ""}${data.archetype === "counterintuitive-truth" ? " Is the contrarian claim supported by specific, verifiable evidence?" : ""}${data.archetype === "list-that-teaches" ? " Does every list item include a specific, actionable suggestion?" : ""}${data.archetype === "timely-transit" ? " Does it reference a real astrological event with an accurate date? Are the action items concrete?" : ""}

DEPTH criteria (critical — score below 7 if any are missing):
- Does the post contain NAMED sources (researchers, institutions, specific people)?
- Does it include SPECIFIC numbers, dates, or measurements?
- Does it use SENSORY or VIVID language (not just abstract explanations)?
- Does it tell at least one SPECIFIC story or anecdote?
- Would a reader learn something they couldn't get from a generic article on the same topic?

General criteria: content quality, completeness (no truncated endings), structure, readability, SEO value. Internal links to the site are expected and should NOT be penalized.

Return ONLY a JSON object:
{"score": <number>, "feedback": "<one sentence>"}

Title: ${data.title}

${content}`,
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
        if (score < 7) {
          result.issues.push(`AI quality score too low: ${score}/10 (min 7)`);
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
