import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const SLUG_FILE = path.join(process.cwd(), ".generated-slug");

function getSlug(): string {
  if (process.argv[2]) return process.argv[2];
  if (fs.existsSync(SLUG_FILE)) return fs.readFileSync(SLUG_FILE, "utf-8").trim();
  console.error("No slug provided. Pass as argument or run generate-post.ts first.");
  process.exit(1);
}

function main() {
  const slug = getSlug();
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    console.error(`Post not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  let fixedContent = content;
  const fixedData = { ...data };
  const fixes: string[] = [];

  // Fix 1: Truncate excerpt > 160 chars
  if (fixedData.excerpt && String(fixedData.excerpt).length > 160) {
    fixedData.excerpt = String(fixedData.excerpt).slice(0, 157) + "...";
    fixes.push("Truncated excerpt to 160 chars");
  }

  // Fix 2: Convert H1 headings to H2
  if (/^# [^#]/m.test(fixedContent)) {
    fixedContent = fixedContent.replace(/^# ([^#])/gm, "## $1");
    fixes.push("Converted H1 headings to H2");
  }

  // Fix 3: Ensure date is valid YYYY-MM-DD
  if (fixedData.date) {
    const dateStr = String(fixedData.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        fixedData.date = d.toISOString().split("T")[0];
        fixes.push(`Fixed date format to ${fixedData.date}`);
      }
    }
  } else {
    fixedData.date = new Date().toISOString().split("T")[0];
    fixes.push(`Added missing date: ${fixedData.date}`);
  }

  // Fix 4: Ensure readTime exists
  if (!fixedData.readTime) {
    const wordCount = fixedContent.trim().split(/\s+/).length;
    fixedData.readTime = `${Math.max(1, Math.ceil(wordCount / 250))} min read`;
    fixes.push(`Added readTime: ${fixedData.readTime}`);
  }

  // Fix 5: Ensure title exists
  if (!fixedData.title) {
    const h2Match = fixedContent.match(/^## (.+)/m);
    if (h2Match) {
      fixedData.title = h2Match[1].trim();
      fixes.push(`Set title from first H2: ${fixedData.title}`);
    }
  }

  // Fix 6: Ensure excerpt exists
  if (!fixedData.excerpt) {
    // Extract first paragraph as excerpt
    const firstPara = fixedContent
      .trim()
      .split(/\n\n/)[0]
      .replace(/[#*[\]()]/g, "")
      .trim();
    fixedData.excerpt = firstPara.slice(0, 157) + "...";
    fixes.push("Generated excerpt from first paragraph");
  }

  if (fixes.length === 0) {
    console.log(`No fixes needed for: ${slug}`);
    return;
  }

  // Write fixed file
  const fixed = matter.stringify(fixedContent, fixedData);
  fs.writeFileSync(filePath, fixed, "utf-8");

  console.log(`Fixed ${fixes.length} issue(s) in: ${slug}`);
  for (const fix of fixes) {
    console.log(`  - ${fix}`);
  }
}

main();
