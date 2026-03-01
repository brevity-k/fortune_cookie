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
                className="group rounded-2xl border border-border p-5 transition hover:border-gold/30 hover:bg-gold/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{sign.symbol}</span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground/90 group-hover:text-gold transition">
                      {sign.name}
                    </h2>
                    <p className="text-xs text-foreground/40">{sign.dateRange}</p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full border border-border text-foreground/40">
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

        <div className="rounded-2xl border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gold mb-3">
            About Our Horoscopes
          </h2>
          <p className="leading-relaxed text-muted mb-3">
            Horoscopes have been part of human culture for thousands of years, tracing back to the ancient Babylonians who first mapped the movements of celestial bodies and connected them to earthly events. The practice of daily horoscope reading evolved from these early astronomical observations into the rich astrological tradition we know today. Western astrology divides the sky into twelve zodiac signs, each spanning approximately 30 degrees of the ecliptic, and each governed by a ruling planet that shapes its core energy and expression.
          </p>
          <p className="leading-relaxed text-muted mb-3">
            Our horoscopes are written by analyzing the current positions of the Sun, Moon, and planets as they transit through the zodiac. Each day, the Moon moves through a new sign roughly every two and a half days, coloring the emotional atmosphere for everyone while interacting uniquely with each zodiac sign. The Sun spends about a month in each sign, setting the broader seasonal theme. Meanwhile, faster-moving planets like Mercury and Venus shift the focus of communication, relationships, and personal values on a week-to-week basis, while slower planets like Jupiter and Saturn define the larger arcs of growth and challenge that unfold over months and years.
          </p>
          <p className="leading-relaxed text-muted mb-3">
            When you read your horoscope, you are essentially receiving a snapshot of how the sky&apos;s current configuration relates to your birth sign. We offer three timeframes to match different needs. Daily horoscopes focus on the Moon&apos;s position and fast-moving planetary aspects, giving you a sense of the day&apos;s emotional tone and best timing for decisions. Weekly horoscopes zoom out to capture Mercury and Venus transits, highlighting shifts in communication style, social energy, and financial opportunities across several days. Monthly horoscopes take the widest view, incorporating the influence of the New Moon and Full Moon cycles, major planetary sign changes, and retrograde periods that define the overarching themes of each month.
          </p>
          <p className="leading-relaxed text-muted mb-3">
            Each of our readings includes love, career, and health ratings on a five-star scale. The love rating reflects Venus&apos;s current relationship to your sign and the Moon&apos;s passage through romantic houses. Career ratings draw from the positions of Mars, Jupiter, and Saturn relative to your professional sectors. Health ratings consider the overall planetary stress on your sign, particularly hard aspects from Mars or Saturn that might suggest periods of lower energy or higher tension. These ratings are meant as a general guide, not a prescription. They highlight favorable and challenging windows so you can plan with greater awareness.
          </p>
          <p className="leading-relaxed text-muted mb-3">
            For a more complete picture, astrologers recommend reading horoscopes for both your Sun sign and your Rising sign (also called your Ascendant). Your Sun sign represents your core identity and conscious self, while your Rising sign governs how you experience and interact with the external world. Many people find that their Rising sign horoscope resonates more strongly with the practical events of daily life, while their Sun sign reading captures their inner emotional landscape. If you know your Moon sign as well, reading that horoscope can offer additional insight into your emotional needs and instinctive reactions.
          </p>
          <p className="leading-relaxed text-muted mb-3">
            Beyond personal readings, horoscopes connect us to a shared sense of cosmic rhythm. The turning of the zodiac wheel through the year mirrors the seasonal cycle: Aries energy arrives with spring&apos;s boldness, Cancer with summer&apos;s nurturing warmth, Libra with autumn&apos;s search for balance, and Capricorn with winter&apos;s disciplined ambition. By following the horoscope calendar, you participate in an ancient practice of aligning personal intention with natural timing, something people across every culture have found valuable for millennia.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 mb-8">
          <h2 className="text-lg font-semibold text-gold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-foreground/70 mb-1">{faq.q}</h3>
                <p className="text-sm text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Link href="/daily" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            Daily Fortune →
          </Link>
          <Link href="/lucky-numbers" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            Lucky Numbers →
          </Link>
          <Link href="/blog" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            Read Articles →
          </Link>
        </div>
      </div>
    </div>
  );
}
