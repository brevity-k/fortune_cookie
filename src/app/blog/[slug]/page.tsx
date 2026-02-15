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
          </div>
        </header>

        <div className="prose prose-invert max-w-prose space-y-4">
          <MDXRemote source={post.content} components={components} />
        </div>

        <div className="mt-12 border-t border-gold/10 pt-8">
          <Link href="/blog" className="text-gold transition hover:text-gold-light">
            ← Read more articles
          </Link>
        </div>
      </article>
    </div>
  );
}
