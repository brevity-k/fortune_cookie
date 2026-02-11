import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read about fortune cookie history, traditions, and the technology behind our interactive fortune cookie experience.",
};

const posts = [
  {
    slug: "history-of-fortune-cookies",
    title: "The Surprising History of Fortune Cookies",
    excerpt:
      "Fortune cookies aren't actually from China — discover the fascinating true origin story of everyone's favorite post-meal treat.",
    date: "2026-02-01",
    readTime: "5 min read",
  },
  {
    slug: "fortune-cookie-traditions",
    title: "Fortune Cookie Traditions Around the World",
    excerpt:
      "From restaurant tables to wedding favors, explore how fortune cookies have been adapted and celebrated across different cultures.",
    date: "2026-02-05",
    readTime: "4 min read",
  },
  {
    slug: "building-interactive-web-games",
    title: "Building Interactive Web Games with Physics Engines",
    excerpt:
      "A deep dive into how we used Pixi.js and Matter.js to create a realistic fortune cookie breaking experience in the browser.",
    date: "2026-02-08",
    readTime: "7 min read",
  },
  {
    slug: "psychology-of-fortune-telling",
    title: "The Psychology Behind Fortune Telling and Why We Love It",
    excerpt:
      "Why do vague positive statements feel so personal? Explore the Barnum effect and the psychology that makes fortune cookies irresistible.",
    date: "2026-02-10",
    readTime: "6 min read",
  },
  {
    slug: "digital-fortune-cookies-future",
    title: "The Future of Digital Fortune Cookies",
    excerpt:
      "From AI-generated personalized fortunes to AR cookie breaking, here's where virtual fortune cookies might be heading.",
    date: "2026-02-10",
    readTime: "4 min read",
  },
  {
    slug: "lucky-numbers-superstitions-science",
    title: "Lucky Numbers, Superstitions, and What Science Actually Says",
    excerpt:
      "Why do we believe in lucky numbers? From cultural superstitions to the psychology of luck, explore the science behind what makes us feel fortunate.",
    date: "2026-02-11",
    readTime: "6 min read",
  },
  {
    slug: "morning-rituals-around-the-world",
    title: "Morning Rituals Around the World That Set the Tone for Your Day",
    excerpt:
      "From Japanese mindful mornings to Italian espresso rituals, discover how cultures around the world start their day with intention and joy.",
    date: "2026-02-11",
    readTime: "6 min read",
  },
  {
    slug: "famous-fortunes-that-came-true",
    title: "10 Famous Fortune Cookie Predictions That Actually Came True",
    excerpt:
      "Lottery wins, career changes, surprise proposals — real stories of fortune cookie messages that proved eerily accurate.",
    date: "2026-02-12",
    readTime: "7 min read",
  },
  {
    slug: "zodiac-fortune-cookies-astrology-meets-wisdom",
    title: "Your Zodiac Sign as a Fortune Cookie: What the Stars Would Tell You",
    excerpt:
      "What fortune does your zodiac sign need to hear? We matched each sign with its perfect fortune cookie message.",
    date: "2026-02-12",
    readTime: "6 min read",
  },
  {
    slug: "why-we-need-small-joys",
    title: "The Science of Small Joys: Why Tiny Moments of Delight Matter More Than You Think",
    excerpt:
      "Research shows that frequent small pleasures contribute more to happiness than rare big events. Here's why fortune cookies are a perfect micro-joy.",
    date: "2026-02-13",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-golden-shimmer mb-4 text-4xl font-bold">Blog</h1>
        <p className="mb-12 text-foreground/50">
          Stories, insights, and behind-the-scenes looks at the world of fortune cookies.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-gold/10 bg-gold/5 p-6 transition hover:border-gold/20 hover:bg-gold/10"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="mb-2 flex items-center gap-3 text-xs text-foreground/30">
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
                <p className="text-sm leading-relaxed text-foreground/50">{post.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
