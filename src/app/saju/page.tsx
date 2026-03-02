import type { Metadata } from "next";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import SajuDashboard from "./SajuDashboard";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Four Pillars of Destiny (사주) | Personalized Fortune Reading",
  description:
    "Discover your Korean Four Pillars of Destiny (사주). Enter your birth date for a personalized fortune reading based on real 사주 calculations with five elements analysis and life cycle timeline.",
  keywords: [
    "사주",
    "four pillars of destiny",
    "korean fortune telling",
    "saju",
    "four pillars",
    "오행",
    "five elements",
    "personalized fortune",
    "birth chart",
  ],
  alternates: {
    canonical: `${SITE_URL}/saju`,
  },
  openGraph: {
    title: `Four Pillars of Destiny (사주) | ${SITE_NAME}`,
    description:
      "Get your personalized fortune reading based on the Korean Four Pillars of Destiny. Real calculations, not random text.",
    url: `${SITE_URL}/saju`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Four Pillars of Destiny (사주) | ${SITE_NAME}`,
    description:
      "Get your personalized fortune reading based on the Korean Four Pillars of Destiny.",
  },
};

const FAQS = [
  {
    q: "What is 사주 (Four Pillars of Destiny)?",
    a: "사주 (also known as Four Pillars of Destiny or 四柱推命) is a traditional Korean and East Asian fortune-telling system. It uses the year, month, day, and hour of your birth to create four \"pillars,\" each consisting of a Heavenly Stem and Earthly Branch. These pillars reveal your elemental balance, personality traits, and fortune cycles.",
  },
  {
    q: "How are the Four Pillars calculated?",
    a: "Each pillar is derived from the 60-year sexagenary cycle (육십갑자). The year and month use solar term boundaries (절기), not calendar months. The day pillar comes from a continuous cycle, and the hour pillar maps your birth hour to one of 12 two-hour periods. All calculations are deterministic — the same birth data always produces the same chart.",
  },
  {
    q: "What are the Five Elements (오행)?",
    a: "The Five Elements — Wood (木), Fire (火), Earth (土), Metal (金), and Water (水) — form the foundation of 사주 analysis. Each of the eight characters in your four pillars carries an element. The balance between these elements, especially relative to your Day Master (일간), determines your favorable and unfavorable elements.",
  },
  {
    q: "What is a Day Master (일간)?",
    a: "Your Day Master is the Heavenly Stem of your Day Pillar. It represents your core self and determines how all other elements in your chart interact with you. A strong Day Master means the element of the self is well-supported; a weak one benefits from support from generating elements.",
  },
  {
    q: "What are Major Luck Cycles (대운)?",
    a: "대운 (Major Luck Cycles) are 10-year periods that influence your life fortune. They are calculated from your month pillar and progress forward or backward based on your gender and year stem. Each cycle brings different elemental energies that interact with your birth chart.",
  },
];

export default function SajuPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Saju (사주)", url: `${SITE_URL}/saju` },
        ]}
      />
      <FAQPageJsonLd faqs={FAQS} />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <SajuDashboard />

        {/* Educational content (always visible for SEO) */}
        <section className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-gold">
            What Is 사주 (Four Pillars of Destiny)?
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              사주 (四柱推命), also known as the Four Pillars of Destiny, is one of the oldest
              fortune-telling systems in East Asia. Originating from ancient Chinese metaphysics
              and deeply integrated into Korean culture, it maps your birth date and time to
              four &quot;pillars&quot; &mdash; year, month, day, and hour &mdash; each consisting of a
              Heavenly Stem (천간) and Earthly Branch (지지).
            </p>
            <p>
              Together, these eight characters (사주팔자) create a unique blueprint of your
              elemental makeup, revealing insights about personality, career tendencies,
              relationships, and fortune cycles spanning your entire life.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            The Five Elements (오행)
          </h2>
          <div className="grid gap-4 sm:grid-cols-5">
            {[
              { hanja: "木", name: "Wood", color: "#4ade80", desc: "Growth, flexibility, creativity" },
              { hanja: "火", name: "Fire", color: "#f87171", desc: "Passion, action, leadership" },
              { hanja: "土", name: "Earth", color: "#fbbf24", desc: "Stability, nurture, reliability" },
              { hanja: "金", name: "Metal", color: "#e2e8f0", desc: "Precision, clarity, determination" },
              { hanja: "水", name: "Water", color: "#60a5fa", desc: "Wisdom, flow, adaptability" },
            ].map((el) => (
              <div key={el.name} className="rounded-xl border border-border/30 bg-white/3 p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: el.color }}>{el.hanja}</div>
                <div className="text-sm font-medium text-foreground/70">{el.name}</div>
                <div className="text-xs text-foreground/40 mt-1">{el.desc}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gold">
            How 사주 Compares to Western Astrology
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-foreground/70">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="py-2 text-left text-gold/70">Aspect</th>
                  <th className="py-2 text-left text-gold/70">사주 (Four Pillars)</th>
                  <th className="py-2 text-left text-gold/70">Western Astrology</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <tr>
                  <td className="py-2">System</td>
                  <td className="py-2">Five Elements (오행)</td>
                  <td className="py-2">12 Zodiac Signs</td>
                </tr>
                <tr>
                  <td className="py-2">Key Identity</td>
                  <td className="py-2">Day Master (일간)</td>
                  <td className="py-2">Sun Sign</td>
                </tr>
                <tr>
                  <td className="py-2">Time Scale</td>
                  <td className="py-2">10-year major cycles (대운)</td>
                  <td className="py-2">Planetary transits</td>
                </tr>
                <tr>
                  <td className="py-2">Calculation</td>
                  <td className="py-2">Sexagenary cycle (60-year)</td>
                  <td className="py-2">Planetary ephemeris</td>
                </tr>
                <tr>
                  <td className="py-2">Cultural Origin</td>
                  <td className="py-2">East Asian (Korean/Chinese)</td>
                  <td className="py-2">Greco-Roman/Babylonian</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="rounded-xl border border-border/30 bg-white/3">
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
