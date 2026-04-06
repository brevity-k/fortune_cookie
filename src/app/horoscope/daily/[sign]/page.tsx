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

const SIGN_INSIGHTS: Record<string, { title: string; content: string[] }> = {
  aries: {
    title: "Understanding Your Aries Daily Horoscope",
    content: [
      "As the first sign of the zodiac, Aries is ruled by Mars, the planet of action, drive, and physical energy. This means your daily horoscope is strongly influenced by Mars's current position and the aspects it forms with other planets throughout the day. When Mars is in a fire sign or making harmonious trines, you may notice your readings reflect heightened confidence, bold opportunities, and a green light for initiative. On days when Mars faces squares or oppositions, your horoscope is more likely to caution against impulsive decisions or conflicts.",
      "Aries daily horoscopes are particularly relevant during the early morning hours, as your cardinal fire energy tends to peak at the start of the day. Pay close attention to your love rating when Venus is transiting your fifth or seventh house, as these periods amplify romantic encounters and deepen existing connections. Your career rating often surges when the Moon passes through fellow fire signs Leo and Sagittarius, creating a trine that fuels ambition and leadership.",
      "Because Aries is a cardinal sign, you are naturally attuned to beginnings and turning points. Your daily horoscope will frequently highlight moments when decisive action matters most. The health rating for Aries often reflects your tendency to push physical limits. Mars governs the head and muscles, so on days when your health score dips, consider channeling your abundant energy into structured exercise rather than impulsive overexertion. Trust the days when all three ratings align highly. Those are your power days for making lasting progress.",
    ],
  },
  taurus: {
    title: "Understanding Your Taurus Daily Horoscope",
    content: [
      "Taurus is ruled by Venus, the planet of love, beauty, and material comfort. Your daily horoscope is deeply shaped by Venus's ongoing transit and the aspects she forms each day. When Venus is well-aspected in earth or water signs, your readings tend to emphasize financial gains, deepening relationships, and sensory pleasures. When Venus faces tense aspects from Saturn or Pluto, your horoscope may warn of stubbornness in relationships or unexpected expenses.",
      "As a fixed earth sign, Taurus thrives on stability and routine, which means your daily horoscope often reflects the tension between comfort and necessary change. Pay special attention to days when the Moon transits your second house of finances and values, as these are your strongest days for making sound monetary decisions. Your love rating climbs when Venus harmonizes with the Moon, creating an atmosphere where emotional connection and physical affection align naturally.",
      "The health section of your Taurus daily reading frequently relates to the throat and neck, the body areas governed by your sign. On lower-rated health days, consider vocal rest, neck stretches, and grounding activities like gardening or cooking. Taurus responds especially well to Earth-element days, when the Moon is in Virgo or Capricorn. These are the days when your natural patience and persistence become your greatest assets, and your horoscope is most likely to point toward tangible, lasting accomplishments.",
    ],
  },
  gemini: {
    title: "Understanding Your Gemini Daily Horoscope",
    content: [
      "Gemini is ruled by Mercury, the planet of communication, intellect, and swift movement. Your daily horoscope is uniquely sensitive to Mercury's speed, direction, and sign placement. When Mercury is direct and moving through air signs, your readings tend to highlight brilliant conversations, successful negotiations, and flashes of insight. During Mercury retrograde periods, your horoscope will often advise caution with contracts, technology, and miscommunication, as these retrogrades affect Gemini more personally than most signs.",
      "As a mutable air sign, Gemini possesses remarkable mental agility, and your daily readings reflect this duality. Pay attention to days when the Moon transits your third house of communication and short-distance travel, as these are when your natural wit and charm reach their peak. Your career rating tends to soar during Mercury-Jupiter aspects, which expand your thinking and attract opportunities through networking and idea-sharing. Your love rating is most telling when Mercury aspects Venus, revealing days when intellectual connection deepens into genuine romance.",
      "Gemini's health readings are connected to the nervous system, lungs, and hands. On days when your health rating is lower, the horoscope is signaling that mental overstimulation may be draining your energy. These are ideal days for journaling, breathing exercises, or taking a walk to process your many thoughts. Your strongest days come when air-sign Moons in Libra or Aquarius form harmonious aspects, activating your social intelligence and creative thinking simultaneously.",
    ],
  },
  cancer: {
    title: "Understanding Your Cancer Daily Horoscope",
    content: [
      "Cancer is ruled by the Moon, which makes your daily horoscope more dynamic than any other sign's. While other signs are influenced by their ruling planet's relatively slow movement, the Moon changes signs every two to two and a half days and shifts aspects every few hours. This means your Cancer daily reading is genuinely different each day, reflecting the Moon's exact position and emotional coloring. When the Moon is in water signs, your intuition and emotional depth are amplified. When it passes through fire or air signs, you may feel pushed outside your comfort zone.",
      "As a cardinal water sign, Cancer initiates through feeling and nurturing. Your love rating is especially significant because the Moon governs emotions and domestic life. Days when the Moon forms a trine to Venus or Jupiter are your golden windows for deepening intimacy, resolving family matters, and creating warmth in your home. Your career rating often peaks during the Moon's transit through your tenth house of public life, a time when your empathetic leadership style is recognized and rewarded.",
      "Cancer's health readings are tied to the stomach, chest, and emotional wellbeing. Because your sign is so Moon-sensitive, your physical health is closely linked to your emotional state. On days with lower health ratings, your horoscope is encouraging you to prioritize emotional self-care, nourishing meals, and time near water. The strongest Cancer days arrive during the New Moon and Full Moon in Cancer or its opposite sign Capricorn, when the lunar cycle directly activates your personal axis and invites powerful reflection on who you are and where you are headed.",
    ],
  },
  leo: {
    title: "Understanding Your Leo Daily Horoscope",
    content: [
      "Leo is ruled by the Sun, the center of our solar system and the source of vitality, self-expression, and creative power. Your daily horoscope is fundamentally shaped by the Sun's aspects to other planets, which shift subtly day by day. When the Sun forms trines or conjunctions with Jupiter, your readings overflow with optimism, generosity, and recognition. When the Sun meets Saturn or Pluto in hard aspects, your horoscope may address themes of ego challenges, authority dynamics, and the need for disciplined self-expression.",
      "As a fixed fire sign, Leo radiates consistent warmth and determination. Your love rating is particularly meaningful during Venus transits through your fifth house of romance, creativity, and joy. These periods bring magnetic attraction, playful courtship, and a renewed sense of passion. Your career rating tends to climb when the Sun or Mars activates your tenth house, putting your leadership abilities on full display and attracting professional opportunities where your charisma and vision are valued.",
      "Leo governs the heart, spine, and upper back, and your daily health rating reflects the vitality of these areas. On days with high health scores, your stamina and radiance are exceptional, making it an ideal time for performance, public speaking, or vigorous exercise. On lower-rated days, your horoscope is gently reminding you that even the Sun needs rest behind the clouds. Creative outlets like art, music, or dance can replenish your fire on these days. Your most powerful daily readings come when fellow fire-sign Moons in Aries or Sagittarius light up your chart, igniting your natural confidence and generosity.",
    ],
  },
  virgo: {
    title: "Understanding Your Virgo Daily Horoscope",
    content: [
      "Virgo is ruled by Mercury, sharing this planetary ruler with Gemini but expressing Mercury's energy through an earth-sign lens. While Gemini's Mercury is about gathering and sharing information, Virgo's Mercury is about analyzing, refining, and perfecting it. Your daily horoscope is shaped by Mercury's current sign and aspects, but with a focus on practical application rather than abstract ideas. When Mercury is in earth or water signs, your readings tend to emphasize productive organization, health improvements, and meaningful service. During Mercury retrograde, Virgo feels the effects deeply as systems you have carefully built may need revisiting.",
      "As a mutable earth sign, Virgo possesses rare adaptability combined with practical wisdom. Your love rating is most insightful when Mercury aspects Venus, revealing days when your thoughtful gestures and attention to detail deeply touch the people you care about. Your career rating peaks during transits through your sixth house of daily work and service, when your exceptional analytical skills and work ethic are recognized. Days when the Moon is in Taurus or Capricorn create a supportive earth trine that amplifies your efficiency and brings tangible results to your efforts.",
      "Virgo governs the digestive system and the nervous interface between mind and body. Your daily health reading is especially worth noting because Virgo is the sign most connected to health and wellness routines. On lower-rated health days, your horoscope is signaling that stress may be manifesting physically, often through digestive discomfort or tension headaches. These are days to simplify your diet, practice mindfulness, and resist the urge to overwork. Your strongest days emerge when Mercury is direct and well-aspected, allowing your natural precision and conscientiousness to flow without overthinking.",
    ],
  },
  libra: {
    title: "Understanding Your Libra Daily Horoscope",
    content: [
      "Libra is ruled by Venus, the planet of harmony, partnership, and aesthetic beauty. Your daily horoscope is shaped by Venus's current transit and the aspects she forms with other planets. When Venus is in air or fire signs and well-aspected, your readings tend to highlight social success, romantic opportunities, and creative inspiration. When Venus faces squares from Mars or Saturn, your horoscope may address relationship tensions, indecision, and the challenge of maintaining balance under pressure.",
      "As a cardinal air sign, Libra initiates through ideas, diplomacy, and partnership. Your love rating carries special weight because Venus governs your sign directly, making relationships central to your daily experience. Pay close attention to days when Venus trines the Moon or Jupiter, as these are your moments of greatest relational harmony and attractiveness. Your career rating often climbs when the Moon transits your tenth house or when Mercury forms favorable aspects to Jupiter, supporting your natural talent for negotiation, mediation, and collaborative leadership.",
      "Libra governs the kidneys, lower back, and the body's internal sense of balance. Your daily health rating often reflects how well you are maintaining equilibrium between giving and receiving, work and rest, social life and solitude. On lower-rated days, your horoscope is encouraging you to address imbalances before they accumulate. Gentle yoga, spending time in beautiful surroundings, and honest conversations about your needs can restore your center. Your most powerful days come when air-sign Moons in Gemini or Aquarius activate your chart, sharpening your social intelligence and helping you see every situation from multiple perspectives with clarity.",
    ],
  },
  scorpio: {
    title: "Understanding Your Scorpio Daily Horoscope",
    content: [
      "Scorpio is traditionally ruled by Mars and modernly co-ruled by Pluto, the planet of transformation, depth, and hidden power. Your daily horoscope is influenced by both planets, creating readings that are uniquely intense and layered. When Pluto forms positive aspects to inner planets, your readings tend to highlight breakthroughs, deep emotional insights, and periods of personal reinvention. When Mars is agitated by hard aspects, your horoscope may address power struggles, jealousy, or the need to channel intensity constructively.",
      "As a fixed water sign, Scorpio possesses extraordinary emotional depth and unwavering determination. Your love rating is most revealing during Pluto or Mars aspects to Venus, when relationships undergo transformation, old patterns surface for healing, and true intimacy becomes possible. Your career rating tends to peak when Mars is in compatible water or earth signs, fueling your strategic thinking and relentless focus. Days when the Moon transits fellow water signs Cancer and Pisces create a supportive trine that enhances your already powerful intuition and emotional intelligence.",
      "Scorpio governs the reproductive system and the body's processes of elimination and regeneration. Your daily health reading often reflects the state of your emotional processing. Scorpio has a tendency to internalize stress, and lower health ratings signal days when holding onto resentment or anxiety may manifest physically. Deep breathing, vigorous exercise, or even a cold shower can help release stored tension. Your most transformative days arrive during the Scorpio New Moon and Full Moon periods, when the lunar cycle directly activates your sign and invites you to shed what no longer serves you and emerge renewed.",
    ],
  },
  sagittarius: {
    title: "Understanding Your Sagittarius Daily Horoscope",
    content: [
      "Sagittarius is ruled by Jupiter, the largest planet in our solar system and the astrological symbol of expansion, wisdom, and good fortune. Your daily horoscope is shaped by Jupiter's sign placement and aspects, which tend to amplify whatever they touch. When Jupiter forms trines or sextiles with personal planets, your readings are filled with optimism, adventure, and unexpected lucky breaks. When Jupiter is challenged by squares from Saturn or Neptune, your horoscope may caution against overcommitment, unrealistic expectations, or scattering your considerable energy across too many pursuits.",
      "As a mutable fire sign, Sagittarius is the explorer and philosopher of the zodiac. Your love rating becomes especially significant when Jupiter aspects Venus, creating windows of romantic expansion, cross-cultural connections, and the deepening of relationships through shared adventures and ideas. Your career rating tends to soar when Jupiter activates your tenth house or when the Moon transits fellow fire signs Aries and Leo, igniting your natural enthusiasm, teaching ability, and visionary leadership.",
      "Sagittarius governs the hips, thighs, and liver, all areas connected to movement and metabolic processing. Your daily health rating reflects how well you are balancing your love of indulgence with physical activity. On lower-rated health days, your horoscope is encouraging you to move your body freely through hiking, sports, or dancing rather than sitting still with restlessness. Your most fortunate days arrive when Jupiter is direct and forming harmonious aspects, aligning your optimism with genuine opportunity. These are the days when your bold leaps of faith are most likely to land exactly where you intended.",
    ],
  },
  capricorn: {
    title: "Understanding Your Capricorn Daily Horoscope",
    content: [
      "Capricorn is ruled by Saturn, the planet of discipline, structure, time, and earned achievement. Your daily horoscope is deeply influenced by Saturn's slow but powerful transits and the aspects it forms with faster-moving planets. When Saturn is well-aspected, your readings emphasize steady progress, recognition of your hard work, and the rewards of patience. When Saturn faces oppositions or squares, your horoscope may highlight delays, increased responsibilities, and the need to build resilience. Unlike signs ruled by benefic planets, Capricorn's strength lies in the wisdom that comes from meeting challenges directly.",
      "As a cardinal earth sign, Capricorn is the natural strategist and builder of the zodiac. Your love rating is most informative when Saturn aspects Venus, revealing periods when relationships are tested but also strengthened through commitment and honest communication. Your career rating, often Capricorn's primary focus, peaks when Mars transits earth signs or when the Moon activates your tenth house of public achievement. Days when the Moon is in Taurus or Virgo create a grounding earth trine that supports your methodical approach and delivers concrete results.",
      "Capricorn governs the skeletal system, knees, and skin, all structures that bear weight and provide support. Your daily health rating reflects the cumulative effects of stress and responsibility on your body. On lower-rated health days, your horoscope is reminding you that even the most disciplined climber needs to rest at base camp. Joint care, adequate calcium, and deliberate relaxation are essential. Your most productive days emerge when Saturn is direct and supported by Jupiter or the Sun, combining your natural discipline with genuine opportunity. These are the days when decades of effort crystallize into visible, lasting achievement.",
    ],
  },
  aquarius: {
    title: "Understanding Your Aquarius Daily Horoscope",
    content: [
      "Aquarius is traditionally ruled by Saturn and modernly co-ruled by Uranus, the planet of innovation, sudden change, and collective progress. Your daily horoscope reflects the creative tension between these two rulers: Saturn's need for structure and Uranus's drive to break free from it. When Uranus forms positive aspects to inner planets, your readings highlight breakthroughs, exciting social connections, and flashes of genius. When Uranus is challenged, your horoscope may address unexpected disruptions, nervous energy, or the temptation to rebel without a constructive purpose.",
      "As a fixed air sign, Aquarius combines intellectual consistency with progressive thinking. Your love rating is particularly meaningful when Uranus or Venus is activated in your chart, revealing periods when unconventional connections spark, friendships deepen into romance, or existing partnerships need more freedom and authenticity. Your career rating tends to climb when Mercury or Jupiter aspects Uranus, opening doors to technology, humanitarian work, or innovative projects that align with your vision of a better future. Days when the Moon transits Gemini or Libra create a harmonious air trine that sharpens your already formidable intellect.",
      "Aquarius governs the circulatory system, ankles, and the electrical impulses of the nervous system. Your daily health rating often reflects your need for mental stimulation balanced with physical grounding. On lower-rated health days, your horoscope is signaling that excessive screen time, social overstimulation, or detachment from your body may be draining you. Walking barefoot, stretching, or engaging in group fitness can help. Your most electrifying days arrive when Uranus is well-aspected and the Moon supports your sign, combining your humanitarian ideals with the practical energy to act on them and inspire others in the process.",
    ],
  },
  pisces: {
    title: "Understanding Your Pisces Daily Horoscope",
    content: [
      "Pisces is traditionally ruled by Jupiter and modernly co-ruled by Neptune, the planet of dreams, intuition, spirituality, and the dissolution of boundaries. Your daily horoscope is shaped by Neptune's subtle and pervasive influence alongside Jupiter's expansiveness. When Neptune forms harmonious aspects to personal planets, your readings emphasize heightened intuition, creative inspiration, spiritual connection, and compassionate encounters. When Neptune is challenged, your horoscope may warn of confusion, escapism, boundary issues, or the temptation to idealize situations beyond their reality.",
      "As a mutable water sign, Pisces is the most empathic and adaptable sign in the zodiac. Your love rating is deeply significant when Neptune or Venus is activated, as these transits dissolve barriers to intimacy and create an almost telepathic connection with loved ones. Your career rating tends to rise when Jupiter aspects your midheaven or when the Moon transits fellow water signs Cancer and Scorpio, supporting your creative vision, healing abilities, and intuitive understanding of what others need. These water trines are your natural element, amplifying gifts that other signs can only approximate.",
      "Pisces governs the feet, the lymphatic system, and the immune response, all systems that operate quietly below conscious awareness. Your daily health rating reflects the state of your subtle energy and emotional boundaries. On lower-rated health days, your horoscope is encouraging you to step back from absorbing the emotions of others and replenish your own reserves through time near water, meditation, music, or sleep. Your most transcendent days arrive during Pisces New Moons and when Neptune forms trines to the Sun or Venus, opening channels of creativity and spiritual awareness that connect you to something far larger than daily concerns.",
    ],
  },
};

const SIGN_DAILY_CONTEXT: Record<string, string> = {
  aries: "Aries daily readings are driven by Mars, which shifts aspects every few days. When Mars is well-aspected, expect your horoscope to highlight bold opportunities. When Mars faces tension, the reading will steer you toward patience — a word Aries hears often but rarely enjoys.",
  taurus: "Your daily horoscope tracks Venus closely. Because Venus moves through each sign for about a month, Taurus readings tend to have a consistent emotional undertone that shifts gradually rather than dramatically from day to day.",
  gemini: "Mercury, your ruler, is the fastest-moving planet in astrology. This makes Gemini's daily horoscope more variable than most — the tone and focus can shift noticeably from one day to the next as Mercury forms and dissolves aspects rapidly.",
  cancer: "No other sign's daily horoscope changes as frequently as Cancer's. The Moon, your ruler, shifts signs every two to two and a half days and changes aspects every few hours, making each day's reading genuinely distinct.",
  leo: "The Sun moves about one degree per day, forming subtle but meaningful aspects with other planets. Leo's daily horoscope reflects these gradual shifts — small changes in energy and focus that build toward larger themes over weeks.",
  virgo: "Like Gemini, Virgo is ruled by Mercury, but your daily horoscope filters Mercury's energy through an earth-sign lens. Where Gemini's readings emphasize ideas, yours tend to focus on practical improvements and health.",
  libra: "Venus shapes your daily reading much as it does Taurus, but through an air-sign filter. Libra's horoscope tends to emphasize social dynamics, aesthetic choices, and the balance between your needs and others'.",
  scorpio: "Scorpio's daily horoscope draws from both Mars (traditional ruler) and Pluto (modern ruler). This dual influence creates readings with both surface-level action guidance and deeper undercurrents about transformation.",
  sagittarius: "Jupiter, your ruler, moves slowly — spending about a year in each sign. This gives Sagittarius daily readings a consistent philosophical backdrop, with day-to-day variation coming from faster-moving planets interacting with Jupiter's position.",
  capricorn: "Saturn, your ruler, is the slowest of the traditional planets. Capricorn's daily readings carry a steady, disciplined undertone that shifts only gradually, with daily variation coming from the Moon and inner planets.",
  aquarius: "Uranus, your modern ruler, moves so slowly that its influence is generational. Your daily horoscope gets its day-to-day variation from faster planets, but Uranus provides an underlying theme of innovation that colors every reading.",
  pisces: "Neptune's influence on your daily horoscope is subtle and pervasive rather than sharp and specific. Pisces readings often have a dreamlike quality, with practical guidance woven into more intuitive, feeling-based language.",
};

const DAILY_SIGN_FAQS: Record<string, { q: string; a: string }[]> = {
  aries: [
    { q: "When is the best time to read an Aries daily horoscope?", a: "Aries energy peaks in the morning. Reading your horoscope early helps you channel Mars-driven initiative into the day's first decisions." },
    { q: "How does Mars retrograde affect Aries daily readings?", a: "Mars retrograde (roughly every two years) slows Aries' natural momentum. During these periods, daily horoscopes often shift focus from action to reflection and strategy." },
  ],
  taurus: [
    { q: "Why do Taurus daily horoscopes often mention finances?", a: "Taurus rules the second house of money and values. Venus, your ruler, connects material comfort with personal worth, making financial themes a natural part of your daily reading." },
    { q: "How do Moon transits affect Taurus daily readings?", a: "When the Moon transits earth signs (Taurus, Virgo, Capricorn), your daily horoscope tends to be more grounded and productive. Water sign Moons bring out your emotional depth." },
  ],
  gemini: [
    { q: "Why does Gemini's daily horoscope change so much?", a: "Mercury, your ruler, is the fastest planet in the solar system. It forms and dissolves aspects rapidly, giving Gemini the most variable daily readings of any sign." },
    { q: "How does Mercury retrograde affect Gemini specifically?", a: "Mercury retrogrades hit Gemini harder than most signs because Mercury is your personal ruler. Daily readings during these periods emphasize reviewing, revising, and reconnecting rather than starting new projects." },
  ],
  cancer: [
    { q: "Why are Cancer horoscopes so emotionally specific?", a: "The Moon, Cancer's ruler, governs emotions and changes signs every 2-3 days. This lunar sensitivity makes Cancer's daily reading the most emotionally nuanced in the zodiac." },
    { q: "Do Full Moons affect Cancer more than other signs?", a: "Yes. As a Moon-ruled sign, Cancer feels Full Moon energy more intensely. Daily horoscopes around the Full Moon often address emotional release, relationship clarity, and heightened intuition." },
  ],
  leo: [
    { q: "What does it mean when Leo's career rating is high?", a: "High career ratings for Leo typically coincide with the Sun forming positive aspects to Jupiter or Mars. These are days when your natural leadership and charisma are especially effective." },
    { q: "How does Leo season (July-August) affect daily readings?", a: "During Leo season, the Sun is in your home sign, amplifying your natural confidence and vitality. Daily horoscopes during this period tend to be more empowering and action-oriented." },
  ],
  virgo: [
    { q: "Why does the Virgo daily horoscope mention health so often?", a: "Virgo rules the sixth house of health and daily routines. Mercury, your ruler, connects your mental state to physical wellbeing, making health a consistent theme in your readings." },
    { q: "When is Virgo's daily horoscope most accurate?", a: "Virgo readings tend to be most resonant when Mercury is direct and moving through earth or water signs. These periods align Mercury's analytical energy with Virgo's practical nature." },
  ],
  libra: [
    { q: "Why do Libra horoscopes focus on relationships?", a: "Libra rules the seventh house of partnerships. Venus, your ruler, orients your daily experience around connection, balance, and how you relate to others." },
    { q: "How do Venus transits affect Libra's daily reading?", a: "When Venus is in a compatible sign (air or fire), Libra daily horoscopes emphasize social success and creative flow. Challenging Venus aspects bring relationship lessons to the foreground." },
  ],
  scorpio: [
    { q: "Why are Scorpio horoscopes more intense than other signs?", a: "Scorpio is co-ruled by Mars (action, desire) and Pluto (transformation, depth). This dual rulership gives Scorpio readings a layered quality that addresses both surface events and deeper psychological currents." },
    { q: "How do Pluto transits affect Scorpio daily readings?", a: "Pluto moves slowly, so its influence creates long background themes in Scorpio's daily horoscope. Day-to-day variation comes from faster planets, but Pluto sets the deeper transformative context." },
  ],
  sagittarius: [
    { q: "Why do Sagittarius horoscopes mention travel and learning?", a: "Sagittarius rules the ninth house of long-distance travel, higher education, and philosophical exploration. Jupiter, your ruler, expands whatever it touches, making these themes central to your daily reading." },
    { q: "What makes Jupiter transits significant for Sagittarius?", a: "Jupiter spends about a year in each sign. When it enters a new sign, the background theme of your daily horoscope shifts noticeably, coloring your readings for the entire year." },
  ],
  capricorn: [
    { q: "Why do Capricorn daily horoscopes emphasize long-term thinking?", a: "Saturn, your ruler, is the planet of time, discipline, and earned achievement. Capricorn daily readings naturally reflect Saturn's orientation toward sustainable progress rather than quick wins." },
    { q: "How does Saturn return affect Capricorn readings?", a: "Saturn return (around ages 29 and 58) is especially significant for Capricorn. During these periods, daily horoscopes carry extra weight around themes of maturity, responsibility, and life structure." },
  ],
  aquarius: [
    { q: "Why does the Aquarius horoscope mention innovation?", a: "Uranus, your modern ruler, governs sudden insight, technology, and unconventional thinking. Daily readings for Aquarius often highlight moments where breaking from routine leads to breakthroughs." },
    { q: "How is Aquarius different from other air signs in daily readings?", a: "While Gemini's readings emphasize communication and Libra's focus on relationships, Aquarius daily horoscopes center on collective progress, intellectual independence, and systemic thinking." },
  ],
  pisces: [
    { q: "Why do Pisces daily horoscopes feel dreamlike?", a: "Neptune, your modern ruler, governs dreams, intuition, and the dissolution of boundaries. This gives Pisces readings a more poetic, feeling-based quality compared to other signs." },
    { q: "How does Neptune retrograde affect Pisces daily readings?", a: "Neptune retrograde (about five months each year) brings clarity to areas where Pisces may have been idealizing. Daily horoscopes during this period tend to be more grounded and reality-focused." },
  ],
};

type PageProps = { params: Promise<{ sign: string }> };

export const dynamicParams = false;

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

  const baseFaq = {
    q: `What is today's horoscope for ${signTitle}?`,
    a: daily ? `Today's ${signTitle} horoscope: "${daily.text.slice(0, 120)}..."` : `Check back for today's ${signTitle} horoscope.`,
  };
  const signSpecificFaqs = DAILY_SIGN_FAQS[sign] || [];
  const faqs = [baseFaq, ...signSpecificFaqs];

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

        {SIGN_DAILY_CONTEXT[sign] && (
          <p className="text-xs text-muted leading-relaxed text-center mb-6">
            {SIGN_DAILY_CONTEXT[sign]}
          </p>
        )}

        <p className="text-xs text-foreground/30 text-center mb-6">
          Based on traditional Western astrology and current planetary positions
        </p>

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
