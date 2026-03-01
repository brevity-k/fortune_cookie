import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import {
  ZODIAC_SIGNS,
  getMonthlyHoroscope,
  getMonthlyDate,
  formatMonthYear,
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

  const formatted = formatMonthYear(getMonthlyDate());

  return {
    title: `${zodiac.name} Monthly Horoscope - ${formatted}`,
    description: `${zodiac.name} horoscope for ${formatted}. Get your free monthly astrology reading with love, career, health predictions, and advice.`,
    robots: {
      index: false,
      follow: true,
    },
    keywords: [
      `${zodiac.name.toLowerCase()} monthly horoscope`,
      `${zodiac.name.toLowerCase()} horoscope ${formatted.toLowerCase()}`,
      "monthly horoscope",
    ],
    alternates: {
      canonical: `${SITE_URL}/horoscope/monthly/${sign}`,
    },
    openGraph: {
      title: `${zodiac.symbol} ${zodiac.name} Monthly Horoscope - ${formatted} | Fortune Cookie`,
      description: `${zodiac.name} monthly horoscope with love, career, health, and life advice for ${formatted}.`,
      url: `${SITE_URL}/horoscope/monthly/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${zodiac.symbol} ${zodiac.name} Monthly Horoscope - ${formatted}`,
      description: `${zodiac.name} monthly horoscope with love, career, health, and life advice for ${formatted}.`,
    },
  };
}

export default async function MonthlyHoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);

  if (!zodiac) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">
        Zodiac sign not found.
      </div>
    );
  }

  const monthly = getMonthlyHoroscope(sign);
  const formattedMonth = formatMonthYear(getMonthlyDate());
  const signTitle = zodiac.name;

  const faqs = [
    {
      q: `What is ${signTitle}'s monthly horoscope for ${formattedMonth}?`,
      a: monthly ? `${signTitle}'s ${formattedMonth} overview: "${monthly.overview.slice(0, 120)}..."` : `Check back for ${signTitle}'s ${formattedMonth} horoscope.`,
    },
    {
      q: `When do monthly horoscopes update?`,
      a: "Monthly horoscopes are updated on the 1st of each month with fresh predictions for the entire month.",
    },
  ];

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Horoscopes", url: `${SITE_URL}/horoscope` },
          { name: `${signTitle} Monthly`, url: `${SITE_URL}/horoscope/monthly/${sign}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{zodiac.symbol}</div>
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-2">
            {signTitle} Monthly Horoscope
          </h1>
          <p className="text-foreground/40 text-sm">{zodiac.dateRange} · {zodiac.element} Sign</p>
          <p className="text-foreground/30 text-xs mt-1">{formattedMonth}</p>
        </div>

        {monthly && (
          <div className="space-y-4 mb-8">
            <div
              className="relative overflow-hidden rounded-2xl border border-border p-8"
              style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)" }}
            >
              <div className="absolute left-3 top-3 text-gold/30">✦</div>
              <div className="absolute right-3 top-3 text-gold/30">✦</div>
              <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
              <div className="absolute bottom-3 right-3 text-gold/30">✦</div>
              <h2 className="text-lg font-semibold text-gold mb-3">{formattedMonth} Overview</h2>
              <p className="text-foreground/60 leading-relaxed">{monthly.overview}</p>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-pink-400 mb-3">♥ Love & Relationships</h2>
              <p className="text-foreground/60 leading-relaxed">{monthly.love}</p>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-blue-400 mb-3">★ Career & Finance</h2>
              <p className="text-foreground/60 leading-relaxed">{monthly.career}</p>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-green-400 mb-3">✚ Health & Wellness</h2>
              <p className="text-foreground/60 leading-relaxed">{monthly.health}</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <h2 className="text-lg font-semibold text-gold mb-3">Monthly Advice</h2>
              <p className="text-foreground/60 leading-relaxed italic">&ldquo;{monthly.advice}&rdquo;</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link href={`/horoscope/daily/${sign}`} className="flex-1 text-center rounded-full border border-border px-6 py-3 text-sm text-gold transition hover:bg-gold/10">
            {signTitle} Daily Horoscope
          </Link>
          <Link href={`/horoscope/weekly/${sign}`} className="flex-1 text-center rounded-full border border-border px-6 py-3 text-sm text-gold transition hover:bg-gold/10">
            {signTitle} Weekly Horoscope
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
              <Link key={s.key} href={`/horoscope/monthly/${s.key}`} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-gold">
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
