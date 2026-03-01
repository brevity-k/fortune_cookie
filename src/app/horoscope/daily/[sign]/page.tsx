import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { StarRating } from "@/components/StarRating";
import {
  ZODIAC_SIGNS,
  getDailyHoroscope,
  getDailyDate,
  formatDailyDate,
} from "@/lib/horoscopes";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 43200;

type PageProps = { params: Promise<{ sign: string }> };

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);
  if (!zodiac) return { title: "Horoscope not found" };

  const formatted = formatDailyDate(getDailyDate());

  return {
    title: `${zodiac.name} Daily Horoscope Today - ${formatted}`,
    description: `Read today's ${zodiac.name} horoscope (${zodiac.dateRange}). Get your free daily astrology reading with love, career, and health predictions. Updated daily.`,
    robots: {
      index: false,
      follow: true,
    },
    keywords: [
      `${zodiac.name.toLowerCase()} horoscope today`,
      `${zodiac.name.toLowerCase()} daily horoscope`,
      "daily horoscope",
      "horoscope today",
    ],
    alternates: {
      canonical: `${SITE_URL}/horoscope/daily/${sign}`,
    },
    openGraph: {
      title: `${zodiac.symbol} ${zodiac.name} Daily Horoscope - ${formatted} | Fortune Cookie`,
      description: `Today's ${zodiac.name} horoscope: love, career, and health predictions.`,
      url: `${SITE_URL}/horoscope/daily/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${zodiac.symbol} ${zodiac.name} Daily Horoscope - ${formatted}`,
      description: `Today's ${zodiac.name} horoscope: love, career, and health predictions.`,
    },
  };
}

export default async function DailyHoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);

  if (!zodiac) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">
        Zodiac sign not found.
      </div>
    );
  }

  const daily = getDailyHoroscope(sign);
  const formattedDate = formatDailyDate(getDailyDate());
  const signTitle = zodiac.name;

  const faqs = [
    {
      q: `What is today's horoscope for ${signTitle}?`,
      a: daily ? `Today's ${signTitle} horoscope: "${daily.text.slice(0, 120)}..."` : `Check back for today's ${signTitle} horoscope.`,
    },
    {
      q: `What are ${signTitle}'s lucky numbers today?`,
      a: daily ? `Today's lucky number for ${signTitle} is ${daily.luckyNumber}. Lucky color: ${daily.luckyColor}.` : "Check back daily for updated lucky numbers.",
    },
  ];

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Horoscopes", url: `${SITE_URL}/horoscope` },
          { name: `${signTitle} Daily`, url: `${SITE_URL}/horoscope/daily/${sign}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{zodiac.symbol}</div>
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-2">
            {signTitle} Daily Horoscope
          </h1>
          <p className="text-foreground/40 text-sm">{zodiac.dateRange} · {zodiac.element} Sign</p>
          <p className="text-foreground/30 text-xs mt-1">{formattedDate}</p>
        </div>

        {daily && (
          <div
            className="relative overflow-hidden rounded-2xl border border-border p-8 text-center mb-8"
            style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)" }}
          >
            <div className="absolute left-3 top-3 text-gold/30">✦</div>
            <div className="absolute right-3 top-3 text-gold/30">✦</div>
            <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
            <div className="absolute bottom-3 right-3 text-gold/30">✦</div>

            <p className="font-serif text-lg leading-relaxed text-cream mb-6">
              {daily.text}
            </p>

            <div className="inline-flex flex-col gap-2 text-left mb-6">
              <StarRating rating={daily.love} label="Love" />
              <StarRating rating={daily.career} label="Career" />
              <StarRating rating={daily.health} label="Health" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-foreground/30 mb-1">Lucky Number</p>
                <p className="text-xl font-bold text-gold">{daily.luckyNumber}</p>
              </div>
              <div className="text-center rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-foreground/30 mb-1">Lucky Color</p>
                <p className="text-sm font-semibold text-gold capitalize">{daily.luckyColor}</p>
              </div>
              <div className="text-center rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-foreground/30 mb-1">Mood</p>
                <p className="text-sm font-semibold text-gold capitalize">{daily.mood}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link href={`/horoscope/weekly/${sign}`} className="flex-1 text-center rounded-full border border-border px-6 py-3 text-sm text-gold transition hover:bg-gold/10">
            {signTitle} Weekly Horoscope
          </Link>
          <Link href={`/horoscope/monthly/${sign}`} className="flex-1 text-center rounded-full border border-border px-6 py-3 text-sm text-gold transition hover:bg-gold/10">
            {signTitle} Monthly Horoscope
          </Link>
        </div>

        <div className="text-center mb-12">
          <Link href="/" className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light">
            Break a Fortune Cookie for {signTitle}
          </Link>
        </div>

        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">Other Zodiac Signs</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {ZODIAC_SIGNS.filter((s) => s.key !== sign).map((s) => (
              <Link
                key={s.key}
                href={`/horoscope/daily/${s.key}`}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-gold"
              >
                <span>{s.symbol}</span>
                <span>{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
