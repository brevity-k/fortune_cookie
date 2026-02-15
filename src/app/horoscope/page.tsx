import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { StarRatingCompact } from "@/components/StarRating";
import {
  ZODIAC_SIGNS,
  getDailyHoroscope,
  getDailyDate,
  formatDailyDate,
} from "@/lib/horoscopes";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Daily Horoscopes & Zodiac Readings",
  description:
    "Read your free daily, weekly, and monthly horoscope for all 12 zodiac signs. Get personalized astrology readings with love, career, and health predictions.",
  keywords: [
    "horoscope today",
    "daily horoscope",
    "zodiac signs",
    "astrology",
    "free horoscope",
    "weekly horoscope",
    "monthly horoscope",
  ],
  alternates: {
    canonical: `${SITE_URL}/horoscope`,
  },
  openGraph: {
    title: `Daily Horoscopes & Zodiac Readings | ${SITE_NAME}`,
    description:
      "Free daily, weekly, and monthly horoscopes for all 12 zodiac signs. Discover what the stars have in store for you.",
    url: `${SITE_URL}/horoscope`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Daily Horoscopes & Zodiac Readings | ${SITE_NAME}`,
    description:
      "Free daily, weekly, and monthly horoscopes for all 12 zodiac signs.",
  },
};

const faqs = [
  {
    q: "How often are horoscopes updated?",
    a: "Daily horoscopes are refreshed every day. Weekly horoscopes update on Sundays, and monthly horoscopes update on the 1st of each month.",
  },
  {
    q: "Should I read my Sun sign or Rising sign?",
    a: "We recommend reading both! Your Sun sign reflects your core identity, while your Rising sign reveals how you present yourself to the world.",
  },
  {
    q: "Can I also get a fortune cookie reading?",
    a: "Absolutely! Visit our homepage to break a virtual fortune cookie and receive a personalized fortune message with lucky numbers and colors.",
  },
];

export default function HoroscopeHub() {
  const dailyDate = getDailyDate();
  const formattedDate = formatDailyDate(dailyDate);

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Horoscopes", url: `${SITE_URL}/horoscope` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-3">
            Daily Horoscopes
          </h1>
          <p className="text-sm text-foreground/40 mb-2">{formattedDate}</p>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Discover what the stars have in store for you. Choose your zodiac
            sign for your personalized daily, weekly, or monthly horoscope
            reading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {ZODIAC_SIGNS.map((sign) => {
            const daily = getDailyHoroscope(sign.key);
            return (
              <Link
                key={sign.key}
                href={`/horoscope/daily/${sign.key}`}
                className="group rounded-2xl border border-gold/10 p-5 transition hover:border-gold/30 hover:bg-gold/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{sign.symbol}</span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground/90 group-hover:text-gold transition">
                      {sign.name}
                    </h2>
                    <p className="text-xs text-foreground/40">{sign.dateRange}</p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full border border-gold/10 text-foreground/40">
                    {sign.element}
                  </span>
                </div>

                {daily && (
                  <>
                    <p className="text-sm text-foreground/50 line-clamp-2 mb-3">
                      {daily.text}
                    </p>
                    <div className="space-y-1">
                      <StarRatingCompact rating={daily.love} label="Love" />
                      <StarRatingCompact rating={daily.career} label="Career" />
                      <StarRatingCompact rating={daily.health} label="Health" />
                    </div>
                  </>
                )}

                <div className="mt-3">
                  <span className="text-xs text-gold/60 group-hover:text-gold transition">
                    Read full horoscope →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {ZODIAC_SIGNS.map((sign) => (
            <div key={sign.key} className="flex gap-1">
              <Link
                href={`/horoscope/weekly/${sign.key}`}
                className="text-xs text-foreground/40 hover:text-gold transition"
              >
                {sign.name} Weekly
              </Link>
              <span className="text-foreground/10">|</span>
              <Link
                href={`/horoscope/monthly/${sign.key}`}
                className="text-xs text-foreground/40 hover:text-gold transition"
              >
                Monthly
              </Link>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gold/10 p-6">
          <h2 className="text-lg font-semibold text-gold mb-3">
            About Our Horoscopes
          </h2>
          <p className="text-sm text-foreground/50 leading-relaxed mb-4">
            Our daily horoscopes are crafted with care, blending traditional
            astrological wisdom with modern interpretations. Each reading
            considers planetary transits, house placements, and elemental
            influences to provide you with meaningful guidance for love,
            career, and health.
          </p>
          <h3 className="text-sm font-semibold text-foreground/70 mb-2">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <p className="text-sm text-foreground/60 font-medium">{faq.q}</p>
                <p className="text-xs text-foreground/40">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
