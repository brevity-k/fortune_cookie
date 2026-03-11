import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read about fortune cookie history, traditions, and the technology behind our interactive fortune cookie experience.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      "Read about fortune cookie history, traditions, and the technology behind our interactive fortune cookie experience.",
    url: `${SITE_URL}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${SITE_NAME}`,
    description:
      "Articles about fortune cookie history, traditions, and the technology behind our interactive experience.",
  },
};

export const revalidate = 86400; // 24 hours — blog auto-generates 2-3x/week

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ]}
      />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-golden-shimmer mb-4 text-3xl sm:text-4xl font-bold">Blog</h1>
        <div className="mb-12 space-y-3 text-muted leading-relaxed">
          <p>
            Stories, insights, and deep dives into the world of fortune cookies, astrology, and the
            traditions behind everyday rituals of luck and reflection.
          </p>
          <p>
            Our articles explore the cultural history of fortune cookies — from their origins as
            Japanese <em>tsujiura senbei</em> to their place in American dining — alongside the
            psychology of fortune telling, including the Barnum effect and the science of positive
            affirmation. We cover astrology fundamentals like zodiac compatibility, planetary
            transits, and tarot card meanings, as well as wellness topics such as gratitude
            practices, morning rituals, and the role of small joys in daily life. Whether you are
            curious about why lucky numbers feel meaningful, how different cultures use charms and
            superstitions, or the real stories behind fortunes that came true, you will find
            something worth reading here.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-border bg-background p-6 transition hover:border-gold/20 hover:bg-gold/5"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="mb-2 flex items-center gap-3 text-xs text-muted">
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
                <h2 className="mb-2 text-xl font-semibold text-gold transition group-hover:text-gold-light">
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
