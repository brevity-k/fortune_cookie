import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import {
  getDailyFortune,
  getDailyFortuneNumber,
  getAllFortunes,
  seededRandom,
  getRarityColor,
  getRarityLabel,
  Fortune,
} from "@/lib/fortuneEngine";
import FortuneCard from "@/components/FortuneCard";
import TodayStats from "@/components/TodayStats";
import CookieGameSection from "@/components/CookieGameSection";
import AdUnit from "@/components/AdUnit";
import { FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

const faqs = [
  {
    q: "How does the daily fortune work?",
    a: "Every day, a single fortune is selected using a date-based algorithm. Everyone around the world sees the same fortune on the same day. It changes at midnight UTC.",
  },
  {
    q: "Can I see yesterday's fortune?",
    a: "Yes! We show the past 7 days of fortunes on this page so you can catch up on any you missed.",
  },
  {
    q: "Is the daily fortune different from breaking a cookie?",
    a: "Yes. The daily fortune is the same for everyone. When you break a cookie on the homepage, you get a random fortune based on rarity weights and your streak level.",
  },
];

function getFortuneForDate(year: number, month: number, day: number): Fortune {
  const seed = year * 10000 + month * 100 + day;
  const rng = seededRandom(seed);
  const allFortunes = getAllFortunes();
  const index = Math.floor(rng() * allFortunes.length);
  return allFortunes[index];
}

export default function Home() {
  const dailyFortune = getDailyFortune();
  const dailyNumber = getDailyFortuneNumber();
  const posts = getAllPosts().slice(0, 3);

  const now = new Date();
  const today = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Past 7 days
  const pastFortunes: { date: string; fortune: Fortune }[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const f = getFortuneForDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    pastFortunes.push({
      date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      fortune: f,
    });
  }

  return (
    <div className="bg-warm-gradient">
      <FAQPageJsonLd faqs={faqs} />

      {/* Top Ad */}
      <div className="mx-auto max-w-4xl px-4 pt-4">
        <AdUnit slot="top-leaderboard" format="horizontal" />
      </div>

      {/* Hero */}
      <section className="px-4 pb-4 pt-8 sm:pt-12 text-center">
        <h1 className="text-golden-shimmer mb-2 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
          Crack Open Today&apos;s Fortune
        </h1>
        <p className="text-muted text-sm">
          Fortune Crack #{dailyNumber.toLocaleString()} &middot; {today}
        </p>
      </section>

      {/* Cookie Game (client component) */}
      <CookieGameSection />

      {/* Post-reveal Ad */}
      <div className="mx-auto max-w-lg px-4 pt-4">
        <AdUnit slot="post-reveal-rectangle" format="rectangle" />
      </div>

      {/* Divider */}
      <div className="mx-auto my-10 max-w-xs border-t border-border" />

      {/* Today's Fortune of the Day */}
      <section className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground/80 mb-1">
            Today&apos;s Fortune
          </h2>
          <p className="text-sm text-muted">
            Everyone sees this same fortune today
          </p>
        </div>
        <FortuneCard fortune={dailyFortune} />
      </section>

      {/* Past 7 Days */}
      <section className="mx-auto max-w-2xl px-4 pb-8">
        <h2 className="text-xl font-semibold text-gold mb-6 text-center">Past 7 Days</h2>
        <div className="space-y-3">
          {pastFortunes.map(({ date, fortune: f }) => {
            const rc = getRarityColor(f.rarity);
            return (
              <div
                key={date}
                className="flex items-start gap-4 rounded-lg border border-border bg-background p-4"
              >
                <div className="shrink-0 text-xs text-muted w-20 pt-0.5">{date}</div>
                <div className="flex-1">
                  <p className="text-sm text-foreground/80">&ldquo;{f.text}&rdquo;</p>
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: rc }}
                  >
                    {getRarityLabel(f.rarity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Today's Stats */}
      <TodayStats />

      {/* Latest Articles */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground/80">Latest Articles</h2>
            <Link href="/blog" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-border bg-background p-5 transition hover:border-gold/30 hover:shadow-sm"
              >
                <p className="text-xs text-muted mb-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {post.readTime && ` · ${post.readTime}`}
                </p>
                <h3 className="text-sm font-semibold text-foreground/80 group-hover:text-gold transition mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Fortune Crack */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold text-foreground/80 mb-4 text-center">
          Why Fortune Crack?
        </h2>
        <div className="rounded-2xl border border-border bg-background p-8 space-y-4">
          <p className="leading-relaxed text-muted">
            Fortune Crack is not just another fortune cookie website. We built something you can
            actually <em>feel</em>. Using real-time physics simulation and WebGL rendering, every
            cookie you break shatters into unique fragments that bounce, spin, and settle naturally.
            The crack sounds, the particle effects, the slow reveal of your fortune — it all comes
            together to recreate the tactile satisfaction of breaking a real cookie.
          </p>
          <p className="leading-relaxed text-muted">
            Most fortune cookie sites give you a random quote and call it a day. We wanted more.
            Fortune Crack features over 1,000 handcrafted fortunes across eight categories — from
            ancient wisdom and philosophical musings to career motivation and laugh-out-loud humor.
            Each fortune carries a rarity tier, and the longer your daily streak, the better your
            chances of discovering something truly legendary.
          </p>
          <p className="leading-relaxed text-muted">
            We also believe fortune cookies are better shared. Every day, everyone in the world
            receives the same Daily Fortune — a shared moment of serendipity that connects strangers
            across time zones. You can share any fortune to social media with a single tap, compare
            lucky numbers with friends, or quietly save your favorites to a personal journal that
            lives right in your browser.
          </p>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <AdUnit slot="bottom-leaderboard" format="horizontal" />
      </div>
    </div>
  );
}
