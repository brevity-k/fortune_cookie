import type { Metadata } from "next";
import Link from "next/link";
import {
  getDailyFortune,
  getAllFortunes,
  seededRandom,
  getRarityColor,
  getRarityLabel,
  Fortune,
} from "@/lib/fortuneEngine";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 43200; // 12 hours — refresh at least twice daily

export const metadata: Metadata = {
  title: "Daily Fortune Cookie",
  description:
    `Today's fortune cookie message — the same fortune for everyone, every day. Come back tomorrow for a new one! Free daily fortune at ${SITE_NAME}.`,
  alternates: {
    canonical: `${SITE_URL}/daily`,
  },
  openGraph: {
    title: `Daily Fortune Cookie | ${SITE_NAME}`,
    description: "Today's fortune cookie message — the same fortune for everyone, every day.",
    url: `${SITE_URL}/daily`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Daily Fortune Cookie | ${SITE_NAME}`,
    description: "Today's fortune cookie message — the same fortune for everyone, every day.",
  },
};

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

export default function DailyPage() {
  const today = new Date();
  const fortune = getDailyFortune();
  const rarityColor = getRarityColor(fortune.rarity);
  const rarityLabel = getRarityLabel(fortune.rarity);

  // Past 7 days
  const pastFortunes: { date: string; fortune: Fortune }[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const f = getFortuneForDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    pastFortunes.push({
      date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      fortune: f,
    });
  }

  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Daily Fortune", url: `${SITE_URL}/daily` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥠</div>
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-2">Daily Fortune Cookie</h1>
          <p className="text-foreground/40 text-sm">{dateStr}</p>
        </div>

        {/* Today's Fortune */}
        <div
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-8 text-center mb-6"
          style={{
            borderColor: rarityColor + "30",
            background: `radial-gradient(ellipse at center, ${rarityColor}08 0%, transparent 70%)`,
          }}
        >
          <div className="absolute left-3 top-3 text-gold/30">✦</div>
          <div className="absolute right-3 top-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 right-3 text-gold/30">✦</div>

          <p className="text-xs uppercase tracking-wider text-foreground/30 mb-4">
            Today&apos;s Fortune
          </p>
          <p className="font-serif text-2xl leading-relaxed text-cream mb-4">
            &ldquo;{fortune.text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: rarityColor }}
            >
              {rarityLabel}
            </span>
            <span className="text-xs text-foreground/30 capitalize">{fortune.category}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gold/10 bg-gold/5 p-6 mb-10">
          <h2 className="text-lg font-semibold text-gold mb-3">About Your Daily Fortune</h2>
          <p className="text-sm text-foreground/50 leading-relaxed mb-3">
            Every day at midnight UTC, a single fortune is chosen from our collection of over 1,000
            messages using a date-based algorithm. The result is the same for everyone — no matter
            where you are in the world, you and millions of others share the same fortune today.
          </p>
          <p className="text-sm text-foreground/50 leading-relaxed mb-3">
            This is what makes the Daily Fortune special. It turns a personal moment into a communal
            one. Friends compare notes, couples check if they got a love fortune, and strangers on
            social media bond over the same message. Come back tomorrow — your next fortune is
            already waiting.
          </p>
          <p className="text-sm text-foreground/40">
            The past 7 days of fortunes are shown below so you never miss one.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break Your Own Cookie
          </Link>
        </div>

        {/* Past 7 Days */}
        <div className="border-t border-gold/10 pt-8 mb-12">
          <h2 className="text-xl font-semibold text-gold mb-6 text-center">Past 7 Days</h2>
          <div className="space-y-3">
            {pastFortunes.map(({ date, fortune: f }) => {
              const rc = getRarityColor(f.rarity);
              return (
                <div
                  key={date}
                  className="flex items-start gap-4 rounded-lg border border-gold/10 bg-gold/5 p-4"
                >
                  <div className="shrink-0 text-xs text-foreground/30 w-20 pt-0.5">{date}</div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground/70">&ldquo;{f.text}&rdquo;</p>
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
        </div>

        {/* Related Links */}
        <div className="border-t border-gold/10 pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">More to Explore</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/lucky-numbers"
              className="rounded-full border border-gold/20 px-4 py-2.5 text-sm text-foreground/50 transition hover:border-gold/40 hover:text-gold"
            >
              Lucky Numbers
            </Link>
            <Link
              href="/zodiac/aries"
              className="rounded-full border border-gold/20 px-4 py-2.5 text-sm text-foreground/50 transition hover:border-gold/40 hover:text-gold"
            >
              Zodiac Fortunes
            </Link>
            <Link
              href="/fortune/wisdom"
              className="rounded-full border border-gold/20 px-4 py-2.5 text-sm text-foreground/50 transition hover:border-gold/40 hover:text-gold"
            >
              Fortune Categories
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
