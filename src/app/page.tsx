import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import {
  getDailyFortune,
  getDailyFortuneNumber,
  getAllFortunes,
  seededRandom,
  dateSeed,
  getRarityColor,
  getRarityLabel,
  Fortune,
} from "@/lib/fortuneEngine";
import { ZODIAC_SIGNS, getDailyHoroscope } from "@/lib/horoscopes";
import FortuneCard from "@/components/FortuneCard";
import CookieGameSection from "@/components/CookieGameSection";
import { FAQPageJsonLd } from "@/components/JsonLd";

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
  {
    q: "What are fortune cookie categories?",
    a: "Fortunes are organized into eight categories: wisdom, love, career, humor, motivation, philosophy, adventure, and mystery. Each category has its own rarity tier.",
  },
  {
    q: "How do lucky numbers work?",
    a: "Lucky numbers are generated daily using a date-seeded algorithm. Everyone sees the same 6 numbers plus a power number each day. They refresh at midnight UTC.",
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
  const posts = getAllPosts().slice(0, 6);

  const now = new Date();
  const today = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Featured sign rotates daily
  const seed = dateSeed();
  const featuredSignIndex = Math.floor(seededRandom(seed)() * 12);
  const featuredSign = ZODIAC_SIGNS[featuredSignIndex];
  const featuredHoroscope = getDailyHoroscope(featuredSign.key);

  // Lucky numbers for featured card (same logic as /lucky-numbers)
  const luckyRng = seededRandom(seed * 500);
  const luckyNumbers: number[] = [];
  while (luckyNumbers.length < 6) {
    const n = Math.floor(luckyRng() * 49) + 1;
    if (!luckyNumbers.includes(n)) luckyNumbers.push(n);
  }
  luckyNumbers.sort((a, b) => a - b);

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

      {/* Hero */}
      <section className="px-4 pb-4 pt-8 sm:pt-12 text-center">
        <h1 className="text-golden-shimmer mb-2 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
          Crack Open Today&apos;s Fortune
        </h1>
        <p className="text-muted text-sm">
          Fortune Crack #{dailyNumber.toLocaleString()} &middot; {today}
        </p>
      </section>

      {/* Featured Today */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <h2 className="text-xs font-semibold text-foreground/60 mb-4 text-center tracking-wide uppercase">
          Featured Today
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Today's Fortune */}
          <Link
            href="/daily"
            className="group rounded-xl border border-border bg-background p-5 transition hover:border-gold/30 hover:shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">&#x1F960;</span>
              <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                Daily Fortune
              </span>
            </div>
            <p className="text-sm text-foreground/80 line-clamp-2 mb-2" style={{ fontFamily: "var(--font-lora), Georgia, serif" }}>
              &ldquo;{dailyFortune.text}&rdquo;
            </p>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: getRarityColor(dailyFortune.rarity) }}
            >
              {getRarityLabel(dailyFortune.rarity)} &middot; {dailyFortune.category}
            </span>
          </Link>

          {/* Today's Horoscope Highlight */}
          <Link
            href={`/horoscope/daily/${featuredSign.key}`}
            className="group rounded-xl border border-border bg-background p-5 transition hover:border-gold/30 hover:shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{featuredSign.symbol}</span>
              <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                {featuredSign.name} Today
              </span>
            </div>
            {featuredHoroscope ? (
              <>
                <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
                  {featuredHoroscope.text}
                </p>
                <span className="text-[10px] text-muted">
                  Mood: {featuredHoroscope.mood} &middot; Lucky #{featuredHoroscope.luckyNumber}
                </span>
              </>
            ) : (
              <p className="text-sm text-muted">
                Check today&apos;s horoscope for {featuredSign.name}
              </p>
            )}
          </Link>

          {/* Today's Lucky Numbers */}
          <Link
            href="/lucky-numbers"
            className="group rounded-xl border border-border bg-background p-5 transition hover:border-gold/30 hover:shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">&#x1F340;</span>
              <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                Lucky Numbers
              </span>
            </div>
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {luckyNumbers.map((n) => (
                <span
                  key={n}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 text-xs font-bold text-gold"
                >
                  {n}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-muted">
              Refreshes at midnight UTC
            </span>
          </Link>
        </div>
      </section>

      {/* Cookie Game (client component) */}
      <section className="mx-auto max-w-2xl px-4 pt-6 pb-2">
        <h2 className="text-2xl font-bold text-foreground/80 mb-2 text-center">
          Break Your Fortune Cookie
        </h2>
        <p className="text-sm text-muted text-center max-w-lg mx-auto">
          Our interactive fortune cookie uses real-time 2D physics powered by Matter.js and WebGL
          rendering through Pixi.js. Try five different breaking methods — tap, drag, shake,
          double-tap, or squeeze — each producing unique crack patterns, particle effects, and
          sounds. Break a cookie to reveal one of over 1,000 original fortunes across eight
          categories and four rarity tiers. Your daily streak improves your odds of finding rare
          and legendary fortunes.
        </p>
      </section>
      <CookieGameSection />

      {/* Explore Fortune & Astrology */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="text-2xl font-bold text-foreground/80 mb-6 text-center">
          Explore Fortune &amp; Astrology
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { emoji: "\u2648", title: "Zodiac Signs", href: "/learn/zodiac-signs" },
            { emoji: "\uD83D\uDD2E", title: "Daily Horoscopes", href: "/horoscope" },
            { emoji: "\uD83D\uDD22", title: "Lucky Numbers", href: "/lucky-numbers" },
            { emoji: "\uD83E\uDE90", title: "Planets Guide", href: "/learn/planets" },
            { emoji: "\uD83C\uDF19", title: "Moon Phases", href: "/learn/moon-phases" },
            { emoji: "\uD83C\uDCCF", title: "Tarot Basics", href: "/learn/tarot-basics" },
            { emoji: "\uD83D\uDC09", title: "Chinese Zodiac", href: "/learn/chinese-zodiac" },
            { emoji: "\uD83E\uDD60", title: "Cookie History", href: "/learn/fortune-cookie-history" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center transition hover:border-gold/30 hover:bg-gold/5"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs font-medium text-foreground/70 group-hover:text-gold transition">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto my-2 max-w-xs border-t border-border" />

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

      {/* Latest Articles */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground/80">Latest Articles</h2>
            <Link href="/blog" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  {post.readTime && ` \u00B7 ${post.readTime}`}
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

      {/* About Fortune Cookies */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold text-foreground/80 mb-4 text-center">
          The Story Behind the Cookie
        </h2>
        <div className="rounded-2xl border border-border bg-background p-8 space-y-4">
          <p className="leading-relaxed text-muted">
            Despite being synonymous with Chinese restaurants in America, fortune cookies were
            actually invented in California. Japanese immigrant Makoto Hagiwara is widely credited
            with introducing them at San Francisco&apos;s Japanese Tea Garden in the early 1900s. The
            cookies drew from the Japanese tradition of <em>tsujiura senbei</em> — crackers containing
            paper fortunes sold at temples in Kyoto. During World War II, Japanese-American bakers
            were interned, and Chinese-American manufacturers took over production, cementing the
            cookie&apos;s association with Chinese cuisine.
          </p>
          <p className="leading-relaxed text-muted">
            Psychologists call it the <em>Barnum effect</em> — our tendency to find personal meaning
            in vague statements. Fortune cookies tap into this beautifully. A message like &ldquo;A
            calm mind hears what a busy mind cannot&rdquo; feels uncannily relevant because our brains
            naturally search for connections to our current circumstances. This isn&apos;t a flaw in
            thinking — it&apos;s a feature. Studies show that brief moments of reflection, even prompted
            by a cookie, can improve mood and encourage mindful pauses in our day.
          </p>
          <p className="leading-relaxed text-muted">
            Fortune Crack recreates this experience digitally with real-time physics simulation.
            Every cookie shatters into unique fragments powered by Matter.js rigid-body dynamics,
            rendered through Pixi.js WebGL, and animated with GSAP. We offer five distinct breaking
            methods — click, drag, shake, double-tap, and squeeze — each producing different crack
            patterns and sound responses via Howler.js. Our collection of over 1,000 handcrafted
            fortunes spans eight categories and four rarity tiers, with streak bonuses that reward
            daily visitors with rarer discoveries.
          </p>
          <p className="leading-relaxed text-muted">
            Every day at midnight UTC, a date-seeded algorithm selects one fortune for everyone on
            Earth. This shared Daily Fortune turns a personal moment into a communal one — friends
            compare notes, couples check if they got a love fortune, and strangers bond over the
            same message across time zones.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold text-foreground/80 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-border bg-background p-5"
            >
              <h3 className="text-sm font-semibold text-foreground/80 mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
