import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { getAllPosts, getPost } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const components = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-8 mb-3 text-xl font-semibold text-gold"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-4 text-foreground/70 leading-relaxed" {...props} />
  ),
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    ...(post.noindex && { robots: { index: false, follow: true } }),
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="bg-warm-gradient flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-golden-shimmer mb-4 text-4xl font-bold">Post Not Found</h1>
          <Link href="/blog" className="text-gold underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={slug}
        datePublished={post.date}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${slug}` },
        ]}
      />
      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-foreground/40 transition hover:text-gold"
        >
          ← Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-golden-shimmer mb-3 text-3xl font-bold md:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-foreground/30">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readTime}</span>
            <span>·</span>
            <span>Fortune Crack</span>
          </div>
        </header>

        <div className="prose prose-invert max-w-prose space-y-4">
          <MDXRemote source={post.content} components={components} />
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="rounded-xl border border-border bg-background p-5 mb-6">
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">
              About Fortune Crack
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Fortune Crack is a daily fortune and astrology destination featuring 1,000+ original
              fortunes, daily horoscopes for all 12 zodiac signs, and in-depth zodiac insights.
              Content is updated every day.{" "}
              <Link href="/about" className="text-gold hover:underline">
                Learn more about us
              </Link>
            </p>
          </div>
          <Link href="/blog" className="text-gold transition hover:text-gold-light">
            ← Read more articles
          </Link>
        </div>
      </article>
    </div>
  );
}
