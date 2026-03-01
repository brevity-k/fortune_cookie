import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getDailyFortune, getDailyFortuneNumber } from "@/lib/fortuneEngine";
import FortuneCard from "@/components/FortuneCard";
import TodayStats from "@/components/TodayStats";
import CookieGameSection from "@/components/CookieGameSection";
import AdUnit from "@/components/AdUnit";

export default function Home() {
  const dailyFortune = getDailyFortune();
  const dailyNumber = getDailyFortuneNumber();
  const posts = getAllPosts().slice(0, 3);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-warm-gradient">
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
