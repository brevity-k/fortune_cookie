import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import {
  ZODIAC_SIGNS,
  getWeeklyHoroscope,
  getWeeklyDate,
  formatWeekOf,
} from "@/lib/horoscopes";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 43200;

const SIGN_INSIGHTS: Record<string, { title: string; content: string[] }> = {
  aries: {
    title: "Aries Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Aries weekly horoscope captures the arc of Mars's ongoing journey through the zodiac and how it interacts with faster-moving planets like Mercury and Venus over the course of several days. Because Mars is your ruling planet, the week's tone is largely set by which sign Mars occupies and whether it is forming productive sextiles and trines or challenging squares and oppositions. Weeks when Mars enters a new sign often bring a noticeable shift in your energy, motivation, and approach to problems.",
      "Mercury's weekly transit is especially relevant for Aries, as it determines how effectively you can communicate your bold ideas and rally others behind your vision. When Mercury is in fire signs alongside Mars, your persuasiveness peaks and meetings, pitches, and negotiations tend to go your way. When Mercury moves through earth or water signs, the week asks you to slow down, listen more carefully, and refine your plans before charging forward. Venus's weekly position colors your romantic and social life, with fire-sign Venus weeks amplifying your natural magnetism and earth-sign Venus weeks encouraging deeper, more grounded connections.",
      "Each week also includes a key lunar event, whether a New Moon, Full Moon, or quarter Moon, that triggers a specific area of your chart. When the weekly lunar event falls in your first house or in fellow cardinal signs Cancer, Libra, or Capricorn, the week tends to feel pivotal, pushing you toward important decisions and new beginnings. Your weekly horoscope synthesizes all these movements into actionable guidance so you can plan your week with both ambition and awareness.",
    ],
  },
  taurus: {
    title: "Taurus Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Taurus weekly horoscope is anchored by Venus's ongoing transit and the aspects she forms with other planets throughout the week. Because Venus rules your sign, shifts in her position are felt personally. Weeks when Venus enters a new sign bring subtle but real changes to your aesthetic preferences, social appetites, and financial instincts. A Venus in Taurus or Pisces week feels indulgent and harmonious, while Venus in Aries or Scorpio weeks may push you toward uncomfortable honesty in relationships.",
      "Mercury's weekly journey determines how your week flows at a practical level. When Mercury moves through earth signs, your thinking is sharp, grounded, and productive. These are your best weeks for financial planning, contract reviews, and methodical projects. When Mercury is in air signs, the pace quickens and the week may feel scattered compared to your preferred rhythm, but it also opens doors for social networking and learning. Mars's weekly aspects reveal where you need to exert effort or defend boundaries, areas that Taurus sometimes avoids until the pressure becomes unavoidable.",
      "The weekly lunar phase has a particularly strong effect on Taurus through the second and eighth house axis, which governs personal resources and shared finances. Full Moons in Scorpio (your opposite sign) illuminate relationship dynamics and financial entanglements, while New Moons in Taurus or nearby signs invite you to set fresh intentions around self-worth and material security. Your weekly horoscope weaves these transits together to help you navigate each seven-day stretch with the steadiness and deliberate pacing that serves you best.",
    ],
  },
  gemini: {
    title: "Gemini Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Gemini weekly horoscope revolves around Mercury's position and velocity, since Mercury rules your sign and moves faster than any planet except the Moon. In a single week, Mercury can change signs, go retrograde, station direct, or form multiple aspects with outer planets. This makes your weekly reading uniquely dynamic. Weeks when Mercury is swift and direct tend to feel electric for Gemini, filled with stimulating conversations, new information, and social opportunities. Weeks when Mercury slows to station retrograde bring a tangible shift, asking you to review, revise, and reconnect rather than forge ahead.",
      "Venus's weekly transit shapes the social and romantic dimension of your week. When Venus is in air signs, your charm and conversational spark attract admirers and allies effortlessly. When Venus moves through water signs, the week encourages emotional vulnerability, a growth edge for intellectually oriented Gemini. Mars's weekly position reveals where you are investing your physical and mental energy. Weeks with Mars in mutable signs like Virgo, Sagittarius, or Pisces can feel restless and overscheduled, while Mars in fixed signs provides more sustained focus on a single project.",
      "The weekly lunar event activates different areas of your chart, and Gemini is particularly sensitive to the third and ninth house axis, which governs communication, learning, and beliefs. Weeks with lunar events in Gemini or Sagittarius tend to bring turning points in education, publishing, travel plans, or your fundamental worldview. Your weekly horoscope distills all these moving parts into a coherent narrative, helping you decide where to direct your curiosity and when to resist the pull of yet another interesting tangent.",
    ],
  },
  cancer: {
    title: "Cancer Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Cancer weekly horoscope is shaped by the Moon's complete journey through roughly three to four zodiac signs over the course of a week. Because the Moon rules your sign, you feel each lunar sign change as a distinct emotional shift. A week might begin with the Moon in analytical Virgo, creating a productive and detail-oriented Monday, then shift to social Libra by Wednesday, and settle into intense Scorpio energy by Friday. Your weekly reading maps these emotional tides to help you work with rather than against your natural rhythms.",
      "Mercury and Venus's weekly transits add important texture to your Cancer reading. When Mercury is in water signs, your communication becomes intuitively powerful, and you can sense what others mean beneath their words. When Venus transits your fourth house of home and family, the week's romantic and social energy draws inward, favoring intimate dinners over large gatherings. Mars's weekly position tells you where to direct your protective energy, whether toward advancing a career project, defending a family member's interests, or asserting your own emotional needs.",
      "The weekly lunar phase is more personally significant for Cancer than for any other sign. New Moons invite you to set intentions around nurturing, security, and emotional authenticity. Full Moons illuminate the balance between your private inner world and your public responsibilities. Quarter Moons signal adjustment points where you may need to let go of comfort in order to grow. Your weekly horoscope honors this sensitivity by tracking the Moon's journey in detail, giving you a reliable emotional weather forecast for the seven days ahead.",
    ],
  },
  leo: {
    title: "Leo Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Leo weekly horoscope tracks the Sun's ongoing aspects to other planets, which shift meaningfully over the course of each week. Because the Sun rules your sign, solar aspects set the backdrop of your weekly experience. Weeks when the Sun forms a trine to Jupiter feel expansive and lucky, with opportunities for recognition, creativity, and leadership. Weeks when the Sun squares Saturn or opposes Pluto can feel heavy, demanding that you prove your authority and discipline your ego in order to earn lasting respect.",
      "Mercury's weekly transit determines the intellectual flavor of your week. When Mercury is in fire signs, your ideas are bold, your speeches are compelling, and creative brainstorming sessions yield gold. When Mercury is in earth signs, the week slows to a practical pace, asking Leo to ground visions in actionable plans and budgets. Venus's weekly position is vital for your love life and creative output. Venus in Leo weeks are your annual peak of personal attractiveness and romantic confidence, while Venus in other signs asks you to appreciate different styles of beauty and affection.",
      "The weekly lunar event illuminates different chapters of your life story. Weeks with lunar events in your fifth house of creativity and romance are your most dramatic and self-expressive. Weeks with lunar events in your eleventh house of friendship and community ask you to share the spotlight and invest in collective goals. Mars's weekly aspects determine whether your fire is focused or scattered, with fire-sign Mars weeks amplifying your natural dynamism and water-sign Mars weeks asking you to channel passion into emotional depth. Your weekly horoscope synthesizes these threads into a narrative worthy of Leo's theatrical nature.",
    ],
  },
  virgo: {
    title: "Virgo Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Virgo weekly horoscope is shaped primarily by Mercury's transit, since Mercury rules your sign. However, unlike Gemini who shares this ruler, Virgo processes Mercury's influence through the lens of practical refinement and service. Weeks when Mercury moves through earth signs are your most productive, as your analytical abilities operate at peak efficiency and detailed work flows naturally. Weeks when Mercury is in fire signs may feel imprecise and rushed, pushing you to communicate more assertively rather than qualifying every statement with careful nuance.",
      "Venus's weekly journey affects your relationships and aesthetic sensibilities. When Venus transits your sixth house of daily routines, you find beauty in order, clean spaces, and well-crafted workflows. These are weeks when small acts of service deeply satisfy you and strengthen your closest bonds. When Venus moves through more flamboyant signs, the week challenges you to relax your standards and enjoy spontaneity. Mars's weekly aspects reveal where you need to apply effort, and Virgo responds best when that effort is directed toward improving systems, solving problems, or helping others overcome obstacles.",
      "The weekly lunar event has a pronounced effect on Virgo through the sixth and twelfth house axis, which governs health, work, and the unconscious mind. Full Moons in Pisces (your opposite sign) bring hidden emotions and spiritual questions to the surface, sometimes disrupting your carefully organized routine. New Moons near Virgo invite you to set intentions around wellness, productivity, and meaningful contribution. Your weekly horoscope accounts for all these movements, providing the structured, detail-oriented forecast that helps Virgo navigate each week with confidence and purpose.",
    ],
  },
  libra: {
    title: "Libra Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Libra weekly horoscope revolves around Venus's ongoing transit and the relational dynamics it creates over seven days. Because Venus rules your sign, her weekly aspects set the tone for your social life, romantic relationships, and creative endeavors. Weeks when Venus forms harmonious aspects to Jupiter or the Moon feel effortlessly charming, with invitations flowing in, conversations deepening, and artistic projects reaching beautiful completion. Weeks when Venus clashes with Mars or Pluto bring relationship intensity, power dynamics, and the need to choose authenticity over people-pleasing.",
      "Mercury's weekly position determines how you process and communicate your desire for fairness and partnership. When Mercury is in air signs, your natural diplomatic skill is at its sharpest, and you can mediate conflicts, draft agreements, and articulate complex ideas with elegant clarity. When Mercury moves through water signs, the week asks you to communicate feelings rather than concepts, an area where Libra sometimes struggles. Mars's weekly aspects reveal whether the week favors active negotiation or strategic patience, helping you calibrate your energy between assertiveness and accommodation.",
      "The weekly lunar event activates Libra's cardinal axis most powerfully when it falls in Aries, Cancer, or Capricorn. These weeks bring turning points in relationships, career direction, and family dynamics that demand decisive action from a sign that often prefers to weigh options indefinitely. Full Moons in Aries spotlight your partnership sector, asking whether your relationships truly balance giving and receiving. Your weekly horoscope tracks these transits to help you find the equilibrium you seek while also recognizing the weeks when the cosmos is inviting you to tip the scales deliberately and commit to a clear direction.",
    ],
  },
  scorpio: {
    title: "Scorpio Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Scorpio weekly horoscope is shaped by the dual influence of Mars and Pluto, your traditional and modern rulers. Mars moves through the zodiac in roughly two-year cycles, spending about six weeks in each sign, which means its sign placement colors your weeks with a consistent undertone of focused energy. When Mars changes signs during a given week, you feel the shift viscerally as a change in what drives and motivates you. Pluto moves so slowly that its influence is generational, but its aspects to faster planets activate deep transformation in specific weeks throughout the year.",
      "Mercury's weekly transit determines how your intense inner processing gets expressed outwardly. When Mercury is in water signs, your words carry emotional depth and penetrating insight that others find both compelling and unsettling. When Mercury transits air signs, the week encourages you to detach from emotional investment long enough to communicate your findings objectively. Venus's weekly position reveals whether the week favors passionate intimacy, creative obsession, or financial strategy, all areas where Scorpio's all-or-nothing approach can produce extraordinary results.",
      "The weekly lunar event is particularly potent for Scorpio when it activates your eighth house of transformation, shared resources, and hidden truths. Full Moons in Taurus illuminate your relationship to material security and comfort, asking whether your possessions own you or you own them. New Moons in Scorpio are your annual reset, the most powerful week of the year for setting intentions around personal power, intimacy, and the fearless pursuit of truth. Your weekly horoscope channels these potent energies into practical guidance, helping you navigate each week with strategic awareness of when to strike and when to wait.",
    ],
  },
  sagittarius: {
    title: "Sagittarius Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Sagittarius weekly horoscope is guided by Jupiter's expansive influence and how it interacts with the faster-moving planets each week. Jupiter spends about a year in each sign, creating a broad backdrop of growth and opportunity that your weekly reading narrows down to actionable seven-day windows. Weeks when the Sun, Mercury, or Venus form favorable aspects to Jupiter are your luckiest, often bringing unexpected travel opportunities, inspiring teachers, publishing breakthroughs, or philosophical epiphanies that reshape your worldview.",
      "Mercury's weekly transit determines whether your adventurous ideas gain traction or meet resistance. When Mercury is in fire signs, your enthusiasm is contagious and you can inspire others to join your quest. When Mercury moves through earth signs, the week grounds your grand visions in practical details, a necessary but sometimes frustrating process for a sign that prefers to think in sweeping strokes. Mars's weekly aspects reveal your physical and competitive energy level. Fire-sign Mars weeks ignite your athletic and exploratory spirit, while water-sign Mars weeks channel your drive into emotional and spiritual quests.",
      "The weekly lunar event resonates strongly with Sagittarius when it falls on the third and ninth house axis, governing short and long journeys, learning, and belief systems. Full Moons in Gemini (your opposite sign) challenge you to back up big claims with specific data and to listen as generously as you speak. New Moons in Sagittarius are your annual starting gate, the best week of the year to launch an adventure, enroll in a course, or publish your truth. Your weekly horoscope maps these celestial currents to help you aim your arrow with both enthusiasm and precision.",
    ],
  },
  capricorn: {
    title: "Capricorn Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Capricorn weekly horoscope is structured around Saturn's disciplined influence and how it intersects with the week's faster planetary movements. Saturn spends about two and a half years in each sign, defining the major lessons and responsibilities of each era of your life. Your weekly reading identifies the specific seven-day windows when those broader Saturnian themes become activated by the Sun, Mercury, or Mars forming aspects to Saturn. These are often the most productive and consequential weeks of the month, when sustained effort produces measurable results.",
      "Mercury's weekly transit shapes how you communicate authority and expertise. When Mercury is in earth signs, your natural command is enhanced by precise, well-organized communication. These are your strongest weeks for presentations, strategic planning, and establishing credibility. When Mercury moves through fire signs, the pace of information flow may feel uncomfortably fast, but it also pushes you to express your ambitions more boldly. Venus's weekly position reveals whether the week favors networking with power players, solidifying a committed relationship, or investing in quality possessions that reflect your status and taste.",
      "The weekly lunar event carries special weight for Capricorn when it activates your tenth and fourth house axis of career and home. Full Moons in Cancer spotlight your domestic life, asking whether your relentless professional climb has left enough room for family and emotional nourishment. New Moons in Capricorn are your annual foundation-setting week, ideal for defining professional goals, restructuring your schedule, and recommitting to the long-term plans that give your life its impressive trajectory. Your weekly horoscope provides the disciplined framework you appreciate, mapping out where effort pays off and where patience is more valuable than action.",
    ],
  },
  aquarius: {
    title: "Aquarius Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Aquarius weekly horoscope reflects the dynamic tension between your two rulers, Saturn and Uranus, and how the week's planetary aspects interact with each. Saturn provides the structural backbone of your ideals, asking you to build systems that support your progressive vision. Uranus injects flashes of revolutionary insight and unexpected disruption. Weeks when faster planets form aspects to both Saturn and Uranus simultaneously are your most electric, as the tension between order and chaos produces genuine innovation and breakthrough thinking.",
      "Mercury's weekly transit is crucial for Aquarius, a sign that processes the world primarily through intellect. When Mercury moves through air signs, your mental circuits fire at full capacity, and collaborative brainstorming, technological experimentation, and social activism flow naturally. When Mercury transits water signs, the week asks you to engage with emotions you might prefer to intellectualize, an uncomfortable but necessary practice for maintaining authentic relationships. Mars's weekly aspects determine whether your revolutionary energy is channeled productively into a cause or scattered across too many Twitter threads and protest plans.",
      "The weekly lunar event resonates powerfully with Aquarius when it falls in your eleventh house of community and future vision or your fifth house of personal creativity and joy. Full Moons in Leo (your opposite sign) challenge you to balance collective ideals with individual self-expression, reminding you that a visionary who neglects personal joy eventually burns out. New Moons in Aquarius are your annual innovation week, the best time to launch humanitarian projects, join new communities, or introduce a disruptive idea. Your weekly horoscope channels the Aquarian spirit of progress into a practical seven-day roadmap.",
    ],
  },
  pisces: {
    title: "Pisces Weekly Horoscope: Rhythms and Planetary Transits",
    content: [
      "The Pisces weekly horoscope flows from the dual influence of Jupiter and Neptune, your traditional and modern rulers. Jupiter's weekly aspects create windows of expansion, faith, and fortunate encounters that your horoscope highlights as action opportunities. Neptune's influence is more diffuse, subtly dissolving boundaries and heightening your already considerable intuition. Weeks when Neptune is activated by the Sun or Venus bring surges of artistic inspiration, spiritual connection, and empathic sensitivity so powerful that you may struggle to distinguish your emotions from those of the people around you.",
      "Mercury's weekly transit determines how effectively you translate your rich inner world into words others can understand. When Mercury is in water signs, your communication becomes poetic, intuitive, and deeply persuasive. When Mercury moves through earth signs, the week provides a grounding structure for your ideas, helping you organize creative visions into tangible plans and proposals. Mars's weekly aspects reveal where you need to assert yourself, an ongoing growth edge for gentle Pisces. Fire-sign Mars weeks lend you unexpected boldness, while earth-sign Mars weeks support steady, incremental progress on projects that matter to your soul.",
      "The weekly lunar event is especially meaningful for Pisces when it activates your twelfth house of the unconscious and spiritual life or your sixth house of health and daily service. Full Moons in Virgo (your opposite sign) illuminate the gap between your ideal vision and practical reality, pushing you to take concrete steps rather than dreaming indefinitely. New Moons in Pisces are your annual spiritual renewal, the most powerful week for meditation, artistic creation, forgiveness, and setting intentions that come from the deepest well of your being. Your weekly horoscope honors the complexity of your inner life while providing the gentle structure that helps Pisces navigate the material world.",
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

  const formatted = formatWeekOf(getWeeklyDate());

  return {
    title: `${zodiac.name} Weekly Horoscope - Week of ${formatted}`,
    description: `${zodiac.name} weekly horoscope for the week of ${formatted}. Get your free weekly astrology reading with love, career insights, and advice.`,
    keywords: [
      `${zodiac.name.toLowerCase()} weekly horoscope`,
      `${zodiac.name.toLowerCase()} horoscope this week`,
      "weekly horoscope",
    ],
    alternates: {
      canonical: `${SITE_URL}/horoscope/weekly/${sign}`,
    },
    openGraph: {
      title: `${zodiac.symbol} ${zodiac.name} Weekly Horoscope - Week of ${formatted} | Fortune Cookie`,
      description: `${zodiac.name} weekly horoscope with love, career, and life advice.`,
      url: `${SITE_URL}/horoscope/weekly/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${zodiac.symbol} ${zodiac.name} Weekly Horoscope - Week of ${formatted}`,
      description: `${zodiac.name} weekly horoscope with love, career, and life advice.`,
    },
  };
}

export default async function WeeklyHoroscopePage({ params }: PageProps) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((s) => s.key === sign);

  if (!zodiac) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">
        Zodiac sign not found.
      </div>
    );
  }

  const weekly = getWeeklyHoroscope(sign);
  const formattedWeek = formatWeekOf(getWeeklyDate());
  const signTitle = zodiac.name;

  const faqs = [
    {
      q: `What is ${signTitle}'s weekly horoscope?`,
      a: weekly ? `This week's ${signTitle} overview: "${weekly.overview.slice(0, 120)}..."` : `Check back for this week's ${signTitle} horoscope.`,
    },
    {
      q: `When do weekly horoscopes update?`,
      a: "Weekly horoscopes are updated every Sunday with fresh predictions for the coming week.",
    },
    {
      q: `How is a weekly horoscope different from a daily horoscope for ${signTitle}?`,
      a: `A daily horoscope focuses on the Moon's sign changes and fast aspects that affect your mood and energy hour by hour. A weekly horoscope for ${signTitle} takes a broader view, tracking how Mercury, Venus, and Mars interact with ${zodiac.element.toLowerCase()} energy over seven days. This gives you a better picture for planning important meetings, dates, or decisions rather than reacting to each day individually.`,
    },
    {
      q: `What planetary transits matter most for ${signTitle} this week?`,
      a: `${signTitle}'s weekly reading is shaped by the position and aspects of its ruling planet, the current lunar phase, and any sign changes by Mercury or Venus during the week. When faster-moving planets form aspects to the outer planets (Jupiter, Saturn, Uranus, Neptune, Pluto), those weeks tend to carry stronger themes for ${signTitle} — especially if the aspect activates ${zodiac.element.toLowerCase()} signs.`,
    },
    {
      q: `Should I read the weekly horoscope for my Sun sign or Rising sign?`,
      a: "Astrologers recommend reading both. Your Sun sign reflects your core identity and conscious goals, while your Rising sign (ascendant) describes how the world perceives you and how transiting planets move through your houses. Many people find the Rising sign horoscope more accurate for timing external events, while the Sun sign reading resonates more with internal themes and motivations.",
    },
  ];

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Horoscopes", url: `${SITE_URL}/horoscope` },
          { name: `${signTitle} Weekly`, url: `${SITE_URL}/horoscope/weekly/${sign}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{zodiac.symbol}</div>
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-2">
            {signTitle} Weekly Horoscope
          </h1>
          <p className="text-foreground/40 text-sm">{zodiac.dateRange} · {zodiac.element} Sign</p>
          <p className="text-foreground/30 text-xs mt-1">Week of {formattedWeek}</p>
        </div>

        {weekly && (
          <div className="space-y-4 mb-8">
            <div
              className="relative overflow-hidden rounded-2xl border border-border p-8"
              style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)" }}
            >
              <div className="absolute left-3 top-3 text-gold/30">✦</div>
              <div className="absolute right-3 top-3 text-gold/30">✦</div>
              <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
              <div className="absolute bottom-3 right-3 text-gold/30">✦</div>
              <h2 className="text-lg font-semibold text-gold mb-3">Overview</h2>
              <p className="text-foreground/60 leading-relaxed">{weekly.overview}</p>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-pink-400 mb-3">♥ Love & Relationships</h2>
              <p className="text-foreground/60 leading-relaxed">{weekly.love}</p>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-blue-400 mb-3">★ Career & Finance</h2>
              <p className="text-foreground/60 leading-relaxed">{weekly.career}</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <h2 className="text-lg font-semibold text-gold mb-3">Weekly Advice</h2>
              <p className="text-foreground/60 leading-relaxed italic">&ldquo;{weekly.advice}&rdquo;</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link href={`/horoscope/daily/${sign}`} className="flex-1 text-center rounded-full border border-border px-6 py-3 text-sm text-gold transition hover:bg-gold/10">
            {signTitle} Daily Horoscope
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
              <Link key={s.key} href={`/horoscope/weekly/${s.key}`} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-gold">
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
