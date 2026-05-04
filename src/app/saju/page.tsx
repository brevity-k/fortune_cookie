import { Suspense } from "react";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import SajuDashboard from "./SajuDashboard";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Saju (사주) — Korean Four Pillars of Destiny Fortune Reading",
  description:
    "Free Saju reading. Saju (Korean: 사주, Hanja: 四柱) is the Korean Four Pillars of Destiny — an ancient East Asian fortune-telling system that maps your birth year, month, day, and hour to four pillars made of Heavenly Stems and Earthly Branches. Enter your birth data for a real Saju calculation with Five Elements (Wuxing) balance, Day Master analysis, and 10-year Major Luck Cycles.",
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
        <Suspense fallback={<div className="text-center py-10 text-foreground/30">Loading...</div>}>
          <SajuDashboard />
        </Suspense>

        {/* Educational content (always visible for SEO) */}
        <section className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-gold">
            What Is Saju? The Korean Four Pillars of Destiny
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              Saju &mdash; written in Korean as <span lang="ko">사주</span> and in Hanja as{" "}
              <span lang="zh-Hant">四柱</span> &mdash; literally means &ldquo;four pillars.&rdquo; It is
              the centuries-old Korean adaptation of an East Asian fortune-telling system that
              maps the moment of your birth to four time-based pillars: <strong>year</strong>,{" "}
              <strong>month</strong>, <strong>day</strong>, and <strong>hour</strong>. Each pillar
              contains two characters &mdash; one Heavenly Stem (<span lang="ko">천간</span>,{" "}
              <span lang="zh-Hant">天干</span>) and one Earthly Branch (<span lang="ko">지지</span>,{" "}
              <span lang="zh-Hant">地支</span>) &mdash; producing a total of eight characters known as{" "}
              <em>Saju Palja</em> (<span lang="ko">사주팔자</span>, &ldquo;the eight characters of the
              four pillars&rdquo;).
            </p>
            <p>
              Saju draws on the Chinese system known as <em>Bazi</em> (八字), which has been
              practiced for more than a thousand years. While the underlying calculation method
              is shared across China, Korea, and Japan, Korean Saju developed distinct
              interpretive traditions during the Joseon Dynasty (1392&ndash;1897), when court
              astrologers used the system to advise on royal marriages, agricultural timing, and
              affairs of state. Today it remains a routine part of Korean cultural life: many
              Korean couples consult a Saju reader before setting a wedding date, parents review
              a child&apos;s pillars to choose an auspicious name, and entrepreneurs check Major
              Luck Cycles before launching a new business.
            </p>
            <p>
              In recent years, the global rise of Korean popular culture &mdash; K-pop, K-drama,
              Korean cinema, and Korean food &mdash; has introduced Saju to international
              audiences. Search interest in &ldquo;saju&rdquo; outside Korea has grown
              substantially, particularly in the United States, Southeast Asia, and Latin
              America, as fans seek to understand the philosophical traditions that shape
              characters and storylines in shows like <em>Reply 1988</em>, <em>Goblin</em>, and{" "}
              <em>My Mister</em>. This page calculates a real Saju chart using the same
              sexagenary cycle (60-year stem-and-branch cycle) and solar-term boundaries that a
              traditional Korean reader would use &mdash; not a randomized horoscope.
            </p>
            <p>
              Together, the eight characters of your Saju Palja form a unique elemental
              blueprint. Reading them reveals which of the Five Elements your nature is built on,
              which elements support or drain you, when your decade-long luck cycles shift, and
              how the personalities of the Heavenly Stems and Earthly Branches interact in
              specific areas of life such as career, relationships, finances, and health.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            The Five Elements (Wuxing, <span lang="ko">오행</span>)
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              At the heart of Saju is the theory of the Five Elements &mdash; <em>Wuxing</em> in
              Chinese, <em>Ohaeng</em> (<span lang="ko">오행</span>) in Korean. Each of the eight
              characters in your chart carries one of these elements, and the balance among them
              forms the foundation of every interpretation. The elements are not literal
              substances but archetypal patterns of energy that interact through two cycles: the{" "}
              <strong>Generating Cycle</strong> (Wood feeds Fire, Fire creates Earth, Earth
              produces Metal, Metal carries Water, Water nourishes Wood) and the{" "}
              <strong>Controlling Cycle</strong> (Wood breaks Earth, Earth absorbs Water, Water
              extinguishes Fire, Fire melts Metal, Metal cuts Wood). A skilled Saju reader does
              not simply count elements &mdash; they trace these cycles through your chart to
              identify which elements strengthen you and which drain you.
            </p>
          </div>
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
            How a Saju Chart Is Calculated
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              Saju calculation is fully deterministic: the same birth date, time, and location
              always produce the same chart. There is no randomness, no astrologer&apos;s
              improvisation, and no daily variation. Each of the four pillars is derived from a
              specific source:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Year Pillar</strong> &mdash; determined by the lunar/solar new year
                boundary (<em>Lichun</em>, around February 4 each year). This pillar represents
                your ancestral influences and the early years of life (roughly birth to age 16).
              </li>
              <li>
                <strong>Month Pillar</strong> &mdash; based on the 24 solar terms (<em>jeolgi</em>,{" "}
                <span lang="ko">절기</span>), not calendar months. The month pillar speaks to your
                relationships with parents and siblings, and the years of young adulthood
                (roughly 17 to 32).
              </li>
              <li>
                <strong>Day Pillar</strong> &mdash; calculated from a continuous 60-day cycle
                that has been recorded in East Asia for more than two millennia. The Heavenly
                Stem of the Day Pillar is your <strong>Day Master</strong>, the single most
                important character in the entire chart.
              </li>
              <li>
                <strong>Hour Pillar</strong> &mdash; mapped from your birth hour to one of
                twelve two-hour periods, each named after one of the twelve Earthly Branches.
                The hour pillar speaks to children, late-life fortune, and your innermost
                aspirations.
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            The Day Master (<span lang="ko">일간</span>)
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              Your <strong>Day Master</strong> &mdash; the Heavenly Stem of your Day Pillar &mdash;
              is the lens through which everything else in your chart is interpreted. It
              represents the core self, the &ldquo;you&rdquo; that engages with the rest of the
              chart. Each of the ten Heavenly Stems carries one of the Five Elements in either
              its yang or yin form. A Day Master of Yang Wood (<span lang="zh-Hant">甲</span>) is
              often described as the towering tree: principled, upright, and slow to bend. A Day
              Master of Yin Fire (<span lang="zh-Hant">丁</span>) is the candle flame: warm,
              attentive, and moved easily by surrounding conditions.
            </p>
            <p>
              The first task of any Saju reading is to evaluate the strength of the Day Master.
              Is it well-supported by other elements in the chart, or does it stand alone? A
              strong Day Master benefits from elements that drain or balance it (often called
              the &ldquo;useful god,&rdquo; <span lang="ko">용신</span>). A weak Day Master
              benefits from elements that generate or reinforce it. This polarity &mdash;
              strength versus weakness, support versus drain &mdash; is the engine that drives
              every concrete prediction in Saju about career, finances, relationships, and
              health.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            Major Luck Cycles (<span lang="ko">대운</span>, Daewoon)
          </h2>
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              Saju is not a static chart. It progresses through a sequence of ten-year periods
              called <strong>Daewoon</strong> (<span lang="ko">대운</span>) or Major Luck Cycles.
              Each cycle introduces a new pair of stem-and-branch characters that interact with
              your birth chart, creating periods that may favor certain elements and challenge
              others. Whether your Daewoon counts forward or backward through the sexagenary
              cycle depends on your gender and the polarity of your year stem &mdash; one of the
              details that distinguishes a real Saju calculation from a generic horoscope.
            </p>
            <p>
              Within each Daewoon, faster yearly cycles called <em>Sewoon</em> (
              <span lang="ko">세운</span>) provide further texture. A favorable Daewoon paired
              with a challenging Sewoon may indicate a strong decade with one or two difficult
              years; the opposite combination may produce a quiet decade with one breakthrough
              year. Together, these layers explain why Saju practitioners can speak to questions
              of timing &mdash; <em>when</em> a partnership or career move is most likely to
              succeed &mdash; with a precision that purely personality-based systems cannot
              easily match.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gold">
            How Saju Compares to Western Astrology
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
