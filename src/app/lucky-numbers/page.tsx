import type { Metadata } from "next";
import Link from "next/link";
import { seededRandom, dateSeed } from "@/lib/fortuneEngine";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";

export const revalidate = 43200; // 12 hours — refresh at least twice daily

export const metadata: Metadata = {
  title: "Lucky Numbers Today",
  description:
    "Get your daily lucky numbers! 6 lottery-style numbers plus a power number, refreshed every day. Free daily lucky numbers from Fortune Cookie.",
  openGraph: {
    title: "Lucky Numbers Today | Fortune Cookie",
    description: "Get your daily lucky numbers! 6 lottery-style numbers refreshed every day.",
    url: "https://fortunecrack.com/lucky-numbers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucky Numbers Today | Fortune Cookie",
    description: "Get your daily lucky numbers! 6 lottery-style numbers refreshed every day.",
  },
};

const LUCKY_COLORS = [
  { name: "Gold", hex: "#d4a04a" },
  { name: "Ruby Red", hex: "#e74c3c" },
  { name: "Sapphire Blue", hex: "#3498db" },
  { name: "Emerald Green", hex: "#27ae60" },
  { name: "Amethyst Purple", hex: "#9b59b6" },
  { name: "Amber Orange", hex: "#f39c12" },
  { name: "Rose Pink", hex: "#e91e8a" },
];

const faqs = [
  {
    q: "How are the lucky numbers generated?",
    a: "Our lucky numbers use a date-based seed algorithm, meaning everyone sees the same numbers each day. They refresh automatically at midnight UTC.",
  },
  {
    q: "Can I use these numbers for the lottery?",
    a: "Our lucky numbers are generated for fun and entertainment. While you can use them however you like, they are randomly generated and do not predict lottery outcomes.",
  },
  {
    q: "What is the power number?",
    a: "The power number is a special bonus number between 1 and 26, generated separately from the main six numbers. Think of it as your extra lucky charm for the day.",
  },
];

export default function LuckyNumbersPage() {
  const seed = dateSeed();
  const rng = seededRandom(seed * 500);

  // 6 unique numbers 1-49
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const n = Math.floor(rng() * 49) + 1;
    if (!numbers.includes(n)) numbers.push(n);
  }
  numbers.sort((a, b) => a - b);

  // Power number 1-26
  const powerNumber = Math.floor(rng() * 26) + 1;

  // Lucky color
  const colorIndex = Math.floor(rng() * LUCKY_COLORS.length);
  const luckyColor = LUCKY_COLORS[colorIndex];

  // Format today's date
  const today = new Date();
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
          { name: "Home", url: "https://fortunecrack.com" },
          { name: "Lucky Numbers", url: "https://fortunecrack.com/lucky-numbers" },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🍀</div>
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-2">Lucky Numbers Today</h1>
          <p className="text-foreground/40 text-sm">{dateStr}</p>
        </div>

        {/* Main Numbers */}
        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5 sm:p-8 text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-foreground/30 mb-6">
            Your Lucky Numbers
          </p>
          <div className="flex justify-center gap-2.5 sm:gap-4 flex-wrap mb-8">
            {numbers.map((n) => (
              <div
                key={n}
                className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-gold/40 bg-gold/10 text-lg sm:text-xl font-bold text-gold"
              >
                {n}
              </div>
            ))}
          </div>

          {/* Power Number */}
          <div className="border-t border-gold/10 pt-6">
            <p className="text-xs uppercase tracking-wider text-foreground/30 mb-3">
              Power Number
            </p>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber bg-amber/15 text-2xl font-bold text-amber">
              {powerNumber}
            </div>
          </div>
        </div>

        {/* Lucky Color */}
        <div className="rounded-2xl border border-gold/15 bg-gold/5 p-6 text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-foreground/30 mb-3">
            Lucky Color of the Day
          </p>
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-8 w-8 rounded-full"
              style={{ backgroundColor: luckyColor.hex }}
            />
            <span className="text-lg font-semibold text-foreground/70">{luckyColor.name}</span>
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-foreground/30 mb-10">
          Numbers refresh daily at midnight UTC. Everyone sees the same numbers each day.
        </p>

        {/* CTA */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break a Fortune Cookie
          </Link>
        </div>

        {/* Related Links */}
        <div className="border-t border-gold/10 pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">
            More Fortune Fun
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/daily"
              className="rounded-full border border-gold/20 px-4 py-2.5 text-sm text-foreground/50 transition hover:border-gold/40 hover:text-gold"
            >
              Daily Fortune
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
