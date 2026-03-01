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

const SIGN_INSIGHTS: Record<string, { title: string; content: string[] }> = {
  aries: {
    title: "Aries Monthly Themes and Lunar Influence",
    content: [
      "Each month presents Aries with a distinct chapter shaped by the New Moon and Full Moon falling in specific areas of your chart. The New Moon sets your monthly intention, offering a fresh starting point for one life area, while the Full Moon two weeks later illuminates what needs completion or release. Because Aries is a cardinal fire sign, you respond to lunar cycles with action rather than contemplation. When the New Moon falls in a fire sign, you may feel an irresistible urge to launch new projects within days. When it falls in earth signs, the month asks you to build foundations before sprinting forward.",
      "Mars, your ruling planet, defines the overarching energy and drive of each month based on which sign it occupies. Mars spends roughly six weeks in each sign, so a single month is usually dominated by one Martian flavor. When Mars is in Aries or fellow fire signs Leo and Sagittarius, the month pulses with competitive energy, athletic drive, and the courage to tackle obstacles head-on. When Mars transits water signs, the month calls for strategic patience, emotional honesty, and channeling your warrior energy into protecting rather than conquering. The intersection of the month's lunar cycle with Mars's sign position creates a unique monthly signature that your horoscope decodes.",
      "Monthly planetary retrogrades significantly shape Aries' experience. Mercury retrograde months slow your typically fast-paced communication and decision-making, redirecting your energy toward revision and reconsideration. Venus retrograde months, occurring roughly every eighteen months, bring past relationships and financial decisions back for review. Mars retrograde, happening every two years, is the most personally significant for Aries, as it turns your external drive inward and asks you to redefine what you are fighting for. Your monthly horoscope identifies which retrograde influences are active and how they interact with the lunar cycle to shape the month ahead.",
    ],
  },
  taurus: {
    title: "Taurus Monthly Themes and Lunar Influence",
    content: [
      "Each month unfolds for Taurus as a gradual building process, shaped by Venus's ongoing sign placement and the lunar cycle's activation of your financial, sensory, and relational houses. The New Moon sets your monthly seed of intention, often in areas connected to material security, self-worth, or creative pleasure. Because Taurus is a fixed earth sign, you take longer than most to respond to lunar shifts, but once you commit to a monthly intention, your follow-through is unmatched. Full Moons tend to bring culminations in partnerships and shared resources, especially when they fall in Scorpio, your opposite sign.",
      "Venus determines the aesthetic and relational tone of each month for Taurus. When Venus is in earth signs, the month feels naturally aligned with your values: sensual pleasures are heightened, financial instincts are sharp, and relationships deepen through physical presence and reliability. When Venus moves through air signs, the month nudges you toward intellectual connection and social experimentation. Fire-sign Venus months bring passion and spontaneity that can feel exciting but destabilizing for a sign that values predictability. Your monthly horoscope maps these Venus dynamics to help you maximize the month's romantic and creative potential.",
      "The slower-moving planets create monthly themes that build over several months into larger life chapters. Jupiter transiting a key area of your chart can define an entire year of growth, but each month within that transit offers specific windows when Jupiter's beneficence is amplified by lunar or solar aspects. Similarly, Saturn's monthly interactions with the Moon reveal when discipline and structure serve you and when rigidity needs softening. Your Taurus monthly horoscope integrates these long-range planetary patterns with the immediate lunar cycle, giving you both the big picture and the practical month-by-month steps that align with your patient, methodical nature.",
    ],
  },
  gemini: {
    title: "Gemini Monthly Themes and Lunar Influence",
    content: [
      "Each month offers Gemini a fresh intellectual and social landscape, shaped by Mercury's rapid movement through one or two zodiac signs and the lunar cycle's activation of your communication and learning houses. Mercury typically spends about three weeks in each sign, so many months include a Mercury sign change that shifts your mental processing style midstream. The New Moon sets your monthly intention, and Gemini is particularly energized by New Moons in air signs, which spark new ideas, writing projects, and social connections. Full Moons bring realizations about the gap between what you know and what you believe.",
      "The monthly lunar cycle has a pronounced effect on Gemini through the third and ninth house axis. When the New Moon falls in your third house or in Gemini itself, the month is ripe for starting a blog, course, or communication project. When the Full Moon illuminates your ninth house in Sagittarius, it challenges you to commit to a philosophy or long-term vision rather than endlessly gathering more data. These lunar polarities are the heartbeat of each Gemini month, pushing you to balance curiosity with conviction and breadth with depth.",
      "Retrograde months are especially transformative for Mercury-ruled Gemini. During Mercury retrograde, which occurs three to four times per year for roughly three weeks each time, the month takes on a reflective quality that can feel foreign to your forward-moving nature. Old friends reappear, old projects demand revision, and communication snags force you to slow down and listen more carefully. Venus retrograde months invite you to reconsider what and whom you truly value. Your monthly horoscope navigates these retrograde periods with specific guidance on when to push forward and when to honor the cosmic invitation to pause, reconsider, and refine.",
    ],
  },
  cancer: {
    title: "Cancer Monthly Themes and Lunar Influence",
    content: [
      "No sign is more deeply affected by the monthly lunar cycle than Cancer. Each month contains two pivotal lunar events: the New Moon, which plants an emotional seed, and the Full Moon, which brings something to harvest or release. Because the Moon rules your sign, these events are not just cosmic background noise but visceral emotional experiences. New Moons in water signs feel like coming home, inviting you to set intentions around family, emotional security, and creative nurturing. New Moons in fire signs push you out of your shell, asking you to take visible action in the world.",
      "The monthly Full Moon is Cancer's moment of truth. Full Moons in your opposite sign Capricorn illuminate the balance between private life and public ambition, asking whether you have been neglecting one for the other. Full Moons in other signs light up different areas, but the emotional intensity is always heightened for Cancer. You may find that the days surrounding each Full Moon bring clarity about relationships, projects, or living situations that have been building pressure for weeks. Your monthly horoscope tracks the exact position of each lunation to help you prepare emotionally and practically.",
      "Beyond the lunar cycle, the monthly transits of Mars and Venus shape Cancer's experience of motivation and love. Mars months in water signs feel natural and purposeful, giving you the emotional fuel to fight for your family, home, and creative vision. Mars in fire signs can feel agitating, pushing you toward confrontations you would rather avoid. Venus months in Cancer or compatible signs deepen your capacity for tenderness and draw nurturing people into your orbit. Your monthly horoscope weaves together the lunar tide and planetary weather into a complete emotional forecast, honoring the depth and complexity of Cancer's inner world.",
    ],
  },
  leo: {
    title: "Leo Monthly Themes and Lunar Influence",
    content: [
      "Each month presents Leo with a stage on which the Sun's aspects to major planets create the backdrop for your performance. The Sun moves through one zodiac sign per month, and the sign it occupies defines the broader theme, which your monthly reading translates into personal guidance. When the Sun is in fellow fire signs, the month radiates confidence, creative output, and leadership opportunities. When the Sun transits water signs, the month turns inward, asking Leo to explore emotional depth and vulnerabilities that you do not always show to the world.",
      "The monthly lunar cycle activates Leo's fifth and eleventh house axis most powerfully. New Moons in your fifth house of creativity, romance, and self-expression are your most personally significant, inviting you to launch creative projects, declare romantic intentions, or step into a spotlight. Full Moons in Aquarius, your opposite sign, illuminate your social networks and collective responsibilities, asking whether you are shining for yourself alone or illuminating the path for others. These lunation cycles create the dramatic arcs that give each month its narrative shape, and Leo is uniquely equipped to live them fully.",
      "Jupiter's monthly interactions with the Sun reveal your expansion windows, the specific weeks within each month when generosity, abundance, and recognition flow most freely. Saturn's monthly aspects to the Sun mark the weeks when discipline, accountability, and delayed gratification are the path to lasting achievement. Mars's monthly position determines your competitive fire and physical energy level. Fire-sign Mars months are your peak performance periods, ideal for athletics, presentations, and bold creative risks. Your monthly horoscope synthesizes these planetary conversations into a grand monthly narrative that matches the scale of Leo's ambitions and heart.",
    ],
  },
  virgo: {
    title: "Virgo Monthly Themes and Lunar Influence",
    content: [
      "Each month offers Virgo a fresh opportunity to refine, heal, and serve, guided by Mercury's transit and the lunar cycle's activation of your health and work houses. Because Mercury rules your sign and moves through one to two signs per month, the intellectual and practical character of each month can shift noticeably around the second or third week. Your monthly horoscope tracks these Mercury sign changes to help you anticipate when your analytical powers are sharpest and when you need to adapt to a different communication style.",
      "The monthly lunar cycle resonates with Virgo through the sixth and twelfth house axis, which governs daily routines, health, and the unconscious mind. New Moons in your sixth house or in Virgo itself are ideal for starting new health regimens, reorganizing your workspace, or committing to a skill-building practice. Full Moons in Pisces, your opposite sign, pull you away from lists and logic toward imagination, spirituality, and surrender. These polarities define the monthly rhythm for Virgo: build structure with the New Moon, then release control with the Full Moon, allowing something larger than your plans to emerge.",
      "The outer planets create monthly themes that unfold gradually over Virgo's methodical timeline. Jupiter transiting a supportive area of your chart creates months of expanding expertise and professional recognition, while Saturn's presence demands months of concentrated effort and sometimes uncomfortable accountability. Neptune's monthly aspects to Mercury can bring both creative inspiration and mental fog, and your monthly horoscope identifies which influence is stronger in any given month. Pluto's monthly interactions with your chart mark the months when deep transformation is possible if you are willing to let go of perfectionistic control. Your reading integrates all these cycles into a practical monthly action plan.",
    ],
  },
  libra: {
    title: "Libra Monthly Themes and Lunar Influence",
    content: [
      "Each month unfolds for Libra as a dance between relationship dynamics and personal development, shaped by Venus's transit and the lunar cycle's activation of your partnership and self-identity houses. The New Moon sets your monthly intention, and Libra responds most eagerly to New Moons in air signs, which stimulate social connection, intellectual partnership, and collaborative creativity. Earth-sign New Moons ground your ideals in practical action, while fire-sign New Moons push you to make independent decisions rather than endlessly consulting others.",
      "The monthly Full Moon is a key moment for Libra's relational awareness. Full Moons in Aries, your opposite sign, illuminate the balance between accommodating others and honoring your own needs, a lifelong theme for your sign. Other Full Moons activate different partnerships and creative dynamics, but they all tend to reveal where relationships have become imbalanced. Venus's monthly sign position determines whether the month favors new romantic encounters, deepening existing bonds, creative beauty projects, or financial consolidation. When Venus and the lunar cycle align harmoniously, the month flows with grace, which is precisely how Libra prefers to live.",
      "The slower planets create monthly backdrops that evolve over seasons and years. Jupiter months in favorable positions bring social expansion, beneficial partnerships, and a sense of abundance in both love and finances. Saturn months in challenging aspects demand that you take responsibility for relationship patterns you have avoided examining. Pluto's monthly influence can surface power dynamics in partnerships that need honest renegotiation. Your Libra monthly horoscope maps these long-range themes onto the specific month ahead, helping you navigate the interplay between cosmic timing and personal choice with the elegance and fairness that define your sign.",
    ],
  },
  scorpio: {
    title: "Scorpio Monthly Themes and Lunar Influence",
    content: [
      "Each month is an opportunity for Scorpio to transform, and the lunar cycle provides the rhythm for this ongoing metamorphosis. The New Moon is your monthly seed of intention, planted in the dark and nurtured by your sign's comfort with hidden processes. Scorpio thrives on New Moons in water signs, when emotional depth and psychic sensitivity are amplified, making it easier to set intentions that come from your deepest truth rather than surface-level desires. Fire-sign New Moons challenge you to make your inner transformations visible, bringing private power into public expression.",
      "The monthly Full Moon is Scorpio's mirror, reflecting what you have been cultivating in the shadows. Full Moons in Taurus, your opposite sign, illuminate questions of material attachment, comfort, and whether your possessions and routines genuinely serve your evolution or have become crutches. Other Full Moons activate different areas of your chart, but they all carry the same essential Scorpio question: what must be released so that something more authentic can emerge? Mars's monthly sign position determines whether you pursue transformation through direct confrontation, strategic patience, physical intensity, or emotional excavation.",
      "Pluto's monthly interactions with faster planets create the deepest transformation windows. Weeks within a month when the Sun or Mars aspects Pluto are your most powerful, carrying the potential for breakthroughs in therapy, financial restructuring, intimate relationships, and personal power. These are not comfortable periods, but they are productive for a sign that equates growth with depth. Saturn's monthly aspects bring structure and accountability to your transformations, ensuring that change is sustainable rather than just dramatic. Your Scorpio monthly horoscope navigates these intense energies with the directness and depth your sign demands, never sugarcoating the truth but always pointing toward genuine empowerment.",
    ],
  },
  sagittarius: {
    title: "Sagittarius Monthly Themes and Lunar Influence",
    content: [
      "Each month presents Sagittarius with a new horizon to explore, shaped by Jupiter's ongoing sign placement and the lunar cycle's activation of your adventure and belief houses. Jupiter spends about a year in each sign, creating a broad canvas of growth that your monthly reading zooms into week by week. The New Moon sets your monthly intention, and Sagittarius is most energized by New Moons in fire signs, which ignite your desire for travel, learning, and philosophical expansion. Earth-sign New Moons ask you to convert your grand visions into concrete, achievable monthly goals.",
      "The monthly Full Moon brings Sagittarian themes to culmination or crisis. Full Moons in Gemini, your opposite sign, challenge you to reconcile your big-picture thinking with the details, facts, and data that support or undermine your beliefs. These lunations often coincide with publishing deadlines, travel decisions, or moments when you must either commit to a stated truth or admit you were wrong. Other Full Moons illuminate different life areas but always carry the Sagittarian tension between exploration and commitment, between the freedom to wander and the depth that comes from staying in one place long enough to truly learn.",
      "The monthly interplay between Jupiter and Saturn is particularly significant for Sagittarius, as it reflects the balance between expansion and contraction, optimism and realism that defines your growth edge. Months when Jupiter dominates bring abundance, fortunate encounters, and the sense that the universe is conspiring in your favor. Months when Saturn is stronger demand discipline, accountability, and the mature recognition that lasting wisdom requires structured effort, not just inspired leaps. Your monthly horoscope reads this balance point and offers guidance on when to aim high and when to build the ladder that will actually get you there.",
    ],
  },
  capricorn: {
    title: "Capricorn Monthly Themes and Lunar Influence",
    content: [
      "Each month is a building block in Capricorn's long-term architecture, and the lunar cycle provides the monthly blueprint. The New Moon sets your intention for the weeks ahead, and Capricorn responds most productively to New Moons in earth signs, which support goal-setting, career planning, and financial strategy. Water-sign New Moons invite you to set intentions around emotional security and family bonds, areas that ambitious Capricorn sometimes defers in pursuit of professional achievement. Air-sign New Moons open networking and intellectual opportunities that serve your goals from unexpected angles.",
      "The monthly Full Moon is Capricorn's checkpoint, revealing whether your disciplined efforts are producing the results you intended. Full Moons in Cancer, your opposite sign, are the most emotionally significant lunations of the year, illuminating the relationship between your professional identity and your emotional roots. These Full Moons often bring family matters, housing decisions, or emotional realizations that cannot be managed with spreadsheets and timelines. Other Full Moons activate different areas, but they all carry the Capricorn question: is this structure still serving growth, or has it become a limitation?",
      "Saturn's monthly aspects to faster planets create the specific weeks within each month when your effort is most likely to be rewarded. These are the weeks to schedule important meetings, submit applications, and make commitments that will age well. Jupiter's monthly interactions with your chart reveal windows of expansion within Saturn's framework, the months when hard work and good fortune overlap to create genuine advancement. Mars's monthly position determines your competitive edge and physical stamina. Your Capricorn monthly horoscope respects your preference for strategic planning by providing a clear, honest assessment of each month's structure, challenges, and optimal timing for action.",
    ],
  },
  aquarius: {
    title: "Aquarius Monthly Themes and Lunar Influence",
    content: [
      "Each month presents Aquarius with a fresh cycle of innovation and community engagement, shaped by the creative tension between Saturn's structure and Uranus's disruption. The New Moon sets your monthly intention, and Aquarius responds most powerfully to New Moons in air signs, which activate your intellectual networks, spark technological experimentation, and inspire collective action. Fire-sign New Moons push you to express your ideals with personal passion rather than detached analysis, while water-sign New Moons ask you to connect your progressive vision to genuine emotional needs.",
      "The monthly Full Moon brings Aquarian themes to a head. Full Moons in Leo, your opposite sign, spotlight the tension between individuality and community, between leading a movement and hogging the spotlight. These lunations often reveal whether your commitment to the group is truly selfless or whether it masks a need for recognition dressed in humanitarian clothing. This is uncomfortable self-examination for a sign that identifies strongly with its ideals, but it is essential for authentic growth. Other Full Moons illuminate different dynamics, but they all challenge Aquarius to integrate thinking and feeling.",
      "Uranus's monthly interactions with faster planets create windows of unexpected change and breakthrough. These are the weeks within each month when routine cracks open and something genuinely new enters your life, whether a technology, a person, an idea, or a sudden awareness that a long-held plan needs radical revision. Saturn's monthly aspects provide the counterbalance, marking the weeks when commitments must be honored, structures maintained, and innovative ideas tested against practical reality. Your Aquarius monthly horoscope maps the rhythm between revolution and responsibility, helping you channel your unique vision into changes that actually last.",
    ],
  },
  pisces: {
    title: "Pisces Monthly Themes and Lunar Influence",
    content: [
      "Each month unfolds for Pisces as a dreamlike journey shaped by Neptune's subtle currents and the lunar cycle's ebb and flow through your chart. The New Moon is your monthly portal for intention-setting, and Pisces responds most deeply to New Moons in water signs, when your intuition, creativity, and spiritual connection are amplified to their full capacity. Earth-sign New Moons ground your visions in material reality, helping you convert inspiration into tangible progress on creative, financial, or health-related goals. Fire-sign New Moons lend you assertive energy that your gentle nature sometimes struggles to access on its own.",
      "The monthly Full Moon is Pisces' moment of illumination, when the unconscious becomes conscious. Full Moons in Virgo, your opposite sign, are particularly significant, revealing the practical steps, health habits, and organizational systems that your dreams require to take physical form. These lunations often bring a reckoning between your ideal vision and the real-world effort needed to manifest it, a tension that is uncomfortable but ultimately productive for a sign that can otherwise remain floating in potential. Other Full Moons activate different areas but always ask Pisces to balance transcendence with presence.",
      "Neptune's monthly aspects to faster planets create windows of heightened creativity and spiritual awareness but also periods of confusion and boundary dissolution. Weeks when Neptune is harmoniously aspected by Venus or the Sun are your most artistically and romantically inspired. Weeks when Neptune squares Mars or Mercury can bring deception, disillusionment, or the need to confront escapist tendencies honestly. Jupiter's monthly interactions with your chart reveal where faith and expansion are working in your favor. Your Pisces monthly horoscope navigates these subtle energies with care, offering guidance that honors your depth while gently anchoring you in the practical rhythms of each month.",
    ],
  },
};

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

        {SIGN_INSIGHTS[sign] && (
          <section className="rounded-2xl border border-border bg-background p-6 mb-8">
            <h2 className="text-lg font-semibold text-gold mb-3">{SIGN_INSIGHTS[sign].title}</h2>
            {SIGN_INSIGHTS[sign].content.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-muted mb-3 last:mb-0">{paragraph}</p>
            ))}
          </section>
        )}

        <section className="rounded-2xl border border-border bg-background p-6 mb-8">
          <h2 className="text-lg font-semibold text-gold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-foreground/70 mb-1">{faq.q}</h3>
                <p className="text-sm text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/zodiac/${sign}`} className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            {signTitle} Fortune →
          </Link>
          <Link href="/blog" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            Read Articles →
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
