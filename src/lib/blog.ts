import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
}

/**
 * Safely extract a BlogPost from raw MDX file content.
 * Returns null if frontmatter is missing required fields.
 */
function parseBlogPost(slug: string, raw: string): BlogPost | null {
  try {
    const { data, content } = matter(raw);

    const title = String(data.title || "");
    const date = String(data.date || "");
    const readTime = String(data.readTime || "");
    const excerpt = String(data.excerpt || "");

    if (!title || !date) return null;

    return { slug, title, date, readTime, excerpt, content };
  } catch {
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts: BlogPost[] = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    try {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const post = parseBlogPost(slug, raw);
      if (post) posts.push(post);
    } catch {
      // Skip files that can't be read
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPost(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return parseBlogPost(slug, raw) ?? undefined;
  } catch {
    return undefined;
  }
}
