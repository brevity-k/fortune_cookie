import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  ZODIAC_SIGNS,
  getWeeklyHoroscope,
  getWeeklyDate,
  formatWeekOf,
} from "@/lib/horoscopes";

export const revalidate = 43200;

type PageProps = { params: Promise<{ sign: string }> };

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);
  if (!zodiac) return { title: "Horoscope not found" };

  const formatted = formatWeekOf(getWeeklyDate());

  return {
    title: `${zodiac.name} Weekly Horoscope - Week of ${formatted}`,
    description: `${zodiac.name} weekly horoscope for the week of ${formatted}. Get your free weekly astrology reading with love, career insights, and advice.`,
    keywords: [
      `${zodiac.name.toLowerCase()} weekly horoscope`,
      `${zodiac.name.toLowerCase()} horoscope this week`,
      "weekly horoscope",
    ],
    openGraph: {
      title: `${zodiac.symbol} ${zodiac.name} Weekly Horoscope - Week of ${formatted} | Fortune Cookie`,
      description: `${zodiac.name} weekly horoscope with love, career, and life advice.`,
      url: `https://fortunecrack.com/horoscope/weekly/${sign}`,
    },
  };
}

export default async function WeeklyHoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);

  if (!zodiac) {
    return <div className="px-4 py-16 text-center text-foreground/50">Zodiac sign not found.</div>;
  }

  const weekly = getWeeklyHoroscope(sign);
  const formattedWeek = formatWeekOf(getWeeklyDate());
  const signTitle = zodiac.name;

  return (
    <div className="px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://fortunecrack.com" },
          { name: "Horoscopes", url: "https://fortunecrack.com/horoscope" },
          { name: `${signTitle} Weekly`, url: `https://fortunecrack.com/horoscope/weekly/${sign}` },
        ]}
      />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{zodiac.symbol}</div>
          <h1 className="text-golden-shimmer text-4xl font-bold mb-2">
            {signTitle} Weekly Horoscope
          </h1>
          <p className="text-foreground/40 text-sm">{zodiac.dateRange} · {zodiac.element} Sign</p>
          <p className="text-foreground/30 text-xs mt-1">Week of {formattedWeek}</p>
        </div>

        {weekly && (
          <div className="space-y-4 mb-8">
            <div
              className="relative overflow-hidden rounded-2xl border border-gold/15 p-8"
              style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)" }}
            >
              <div className="absolute left-3 top-3 text-gold/30">✦</div>
              <div className="absolute right-3 top-3 text-gold/30">✦</div>
              <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
              <div className="absolute bottom-3 right-3 text-gold/30">✦</div>
              <h2 className="text-lg font-semibold text-gold mb-3">Overview</h2>
              <p className="text-foreground/60 leading-relaxed">{weekly.overview}</p>
            </div>

            <div className="rounded-2xl border border-gold/10 p-6">
              <h2 className="text-lg font-semibold text-pink-400 mb-3">♥ Love & Relationships</h2>
              <p className="text-foreground/60 leading-relaxed">{weekly.love}</p>
            </div>

            <div className="rounded-2xl border border-gold/10 p-6">
              <h2 className="text-lg font-semibold text-blue-400 mb-3">★ Career & Finance</h2>
              <p className="text-foreground/60 leading-relaxed">{weekly.career}</p>
            </div>

            <div className="rounded-2xl border border-gold/10 bg-gold/5 p-6">
              <h2 className="text-lg font-semibold text-gold mb-3">Weekly Advice</h2>
              <p className="text-foreground/60 leading-relaxed italic">&ldquo;{weekly.advice}&rdquo;</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link href={`/horoscope/daily/${sign}`} className="flex-1 text-center rounded-full border border-gold/20 px-6 py-3 text-sm text-gold transition hover:bg-gold/10">
            {signTitle} Daily Horoscope
          </Link>
          <Link href={`/horoscope/monthly/${sign}`} className="flex-1 text-center rounded-full border border-gold/20 px-6 py-3 text-sm text-gold transition hover:bg-gold/10">
            {signTitle} Monthly Horoscope
          </Link>
        </div>

        <div className="text-center mb-12">
          <Link href="/" className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light">
            Break a Fortune Cookie for {signTitle}
          </Link>
        </div>

        <div className="border-t border-gold/10 pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">Other Zodiac Signs</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {ZODIAC_SIGNS.filter((s) => s.key !== sign).map((s) => (
              <Link key={s.key} href={`/horoscope/weekly/${s.key}`} className="flex items-center gap-2 rounded-lg border border-gold/10 px-3 py-2 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-gold">
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
