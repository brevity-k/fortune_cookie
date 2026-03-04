import { Suspense } from "react";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import AstroDashboard from "./AstroDashboard";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Free Birth Chart Calculator | Personalized Natal Chart",
  description:
    "Calculate your natal birth chart for free. Enter your birth date, time, and city to discover your Sun, Moon, Rising sign, planet positions, houses, and aspects. Get a personalized AI interpretation.",
  keywords: [
    "birth chart",
    "natal chart",
    "birth chart calculator",
    "free natal chart",
    "astrology chart",
    "rising sign calculator",
    "sun moon rising",
    "planet positions",
    "house placements",
  ],
  alternates: {
    canonical: `${SITE_URL}/horoscope/birth-chart`,
  },
  openGraph: {
    title: `Free Birth Chart Calculator | ${SITE_NAME}`,
    description:
      "Calculate your personalized natal chart. Real astronomical calculations, not generic horoscopes.",
    url: `${SITE_URL}/horoscope/birth-chart`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Free Birth Chart Calculator | ${SITE_NAME}`,
    description:
      "Calculate your personalized natal chart with real astronomical data.",
  },
};

const FAQS = [
  {
    q: "What is a natal birth chart?",
    a: "A natal chart (also called a birth chart) is a map of where all the planets, the Sun, and the Moon were at the exact moment you were born, viewed from your birth location. It shows which zodiac sign each celestial body occupied, which astrological house it was in, and how they relate to each other through geometric angles called aspects. Think of it as a cosmic snapshot of the sky at the time of your birth.",
  },
  {
    q: "What information do I need to calculate my birth chart?",
    a: "You need three pieces of information: your birth date (month, day, year), your birth time (as precise as possible, ideally from a birth certificate), and your birth city. The birth time is especially important because it determines your Rising sign (Ascendant) and house placements. Without an accurate birth time, the Rising sign and house positions may be incorrect.",
  },
  {
    q: "What is a Rising sign (Ascendant) and why does it matter?",
    a: "Your Rising sign, or Ascendant, is the zodiac sign that was rising on the eastern horizon at the exact moment of your birth. It changes roughly every two hours, which is why birth time is so important. The Rising sign determines your 1st house cusp and sets the framework for all 12 houses in your chart. It influences your outward personality, first impressions, and physical appearance.",
  },
  {
    q: "How are the astrological houses calculated?",
    a: "This calculator uses the Placidus house system, the most widely used method in Western astrology. Houses are calculated by dividing the sky into 12 sections based on the intersection of the ecliptic with the horizon and meridian at your birth location and time. Each house governs different life areas: the 1st house rules self-image, the 7th rules partnerships, the 10th rules career, and so on.",
  },
  {
    q: "Is this birth chart calculator really free? What does premium add?",
    a: "Yes, the core birth chart is completely free: you get all planet positions, houses, aspects, element/modality balance, the natal chart wheel, and an AI-generated personality interpretation. Premium adds daily personalized transit readings, monthly forecasts, and compatibility analysis with another person's chart. The free chart alone gives you a thorough understanding of your natal astrology.",
  },
];

export default function BirthChartPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Horoscopes", url: `${SITE_URL}/horoscope` },
          { name: "Birth Chart", url: `${SITE_URL}/horoscope/birth-chart` },
        ]}
      />
      <FAQPageJsonLd faqs={FAQS} />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Suspense
          fallback={
            <div className="text-center py-10 text-foreground/30">
              Loading...
            </div>
          }
        >
          <AstroDashboard />
        </Suspense>

        {/* Educational content (always visible for SEO) */}
        <section className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-gold">
            What Is a Natal Chart?
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              A natal chart &mdash; also known as a birth chart or horoscope
              chart &mdash; is a detailed map of the heavens at the precise
              moment you were born. Ancient astrologers believed that the
              positions of the Sun, Moon, and planets at the time of birth shape
              personality, talents, and life direction. Modern astrology
              continues this tradition, combining real astronomical positions
              with centuries of interpretive wisdom.
            </p>
            <p>
              Unlike a Sun-sign horoscope, which only considers the zodiac sign
              occupied by the Sun, a full natal chart reveals the positions of
              all major celestial bodies across all 12 zodiac signs and 12
              houses. This creates a unique combination that is specific to your
              exact birth date, time, and location &mdash; no two charts are
              alike unless two people are born at the exact same moment in the
              same place.
            </p>
            <p>
              Our calculator uses the astronomy-engine library to compute real
              planetary positions from NASA-grade ephemeris data. The results are
              astronomically accurate, not approximated from lookup tables. You
              get the same precision that professional astrology software
              provides, entirely free.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            The Planets in Astrology
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                symbol: "\u2609",
                name: "Sun",
                desc: "Core identity, ego, life purpose, and conscious self-expression",
              },
              {
                symbol: "\u263D",
                name: "Moon",
                desc: "Emotions, instincts, inner world, and subconscious patterns",
              },
              {
                symbol: "\u263F",
                name: "Mercury",
                desc: "Communication, thinking style, learning, and information processing",
              },
              {
                symbol: "\u2640",
                name: "Venus",
                desc: "Love, beauty, values, pleasure, and how you attract others",
              },
              {
                symbol: "\u2642",
                name: "Mars",
                desc: "Drive, ambition, physical energy, anger, and how you take action",
              },
              {
                symbol: "\u2643",
                name: "Jupiter",
                desc: "Growth, luck, abundance, wisdom, and philosophical beliefs",
              },
              {
                symbol: "\u2644",
                name: "Saturn",
                desc: "Discipline, structure, responsibility, limits, and life lessons",
              },
              {
                symbol: "\u2645",
                name: "Uranus",
                desc: "Innovation, rebellion, sudden change, and individuality",
              },
              {
                symbol: "\u2646",
                name: "Neptune",
                desc: "Spirituality, dreams, imagination, illusion, and compassion",
              },
              {
                symbol: "\u2647",
                name: "Pluto",
                desc: "Transformation, power, rebirth, intensity, and deep change",
              },
              {
                symbol: "\u260A",
                name: "North Node",
                desc: "Karmic direction, soul purpose, and the growth path for this lifetime",
              },
            ].map((planet) => (
              <div
                key={planet.name}
                className="rounded-xl border border-border/30 bg-white/3 p-4"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl text-gold">{planet.symbol}</span>
                  <span className="font-medium text-foreground/80">
                    {planet.name}
                  </span>
                </div>
                <p className="text-sm text-foreground/50">{planet.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gold">
            Houses and Signs
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              The 12 astrological houses represent different areas of life, from
              self-identity (1st house) to subconscious patterns (12th house).
              Each house is associated with a zodiac sign and a planetary ruler.
              The sign on each house cusp colors how you experience that life
              area. For example, Cancer on the 7th house cusp suggests you seek
              emotional security in partnerships.
            </p>
            <p>
              The houses are calculated using your birth time and location. The
              Ascendant (Rising sign) marks the 1st house cusp, and the
              Midheaven marks the 10th house cusp. Together they anchor the
              entire house system. Angular houses (1st, 4th, 7th, 10th) are the
              most prominent and represent major life themes: identity, home,
              partnership, and career.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="rounded-xl border border-border/30 bg-white/3"
              >
                <summary className="cursor-pointer p-4 font-medium text-foreground/80 hover:text-gold transition">
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 text-sm text-foreground/50 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
