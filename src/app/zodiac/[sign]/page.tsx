import type { Metadata } from "next";
import Link from "next/link";
import {
  seededRandom,
  dateSeed,
  getFortunesByCategory,
  getRarityColor,
  getRarityLabel,
  FortuneCategory,
} from "@/lib/fortuneEngine";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 43200; // 12 hours — refresh at least twice daily

const elementCategory: Record<string, FortuneCategory> = {
  Fire: "motivation",
  Earth: "career",
  Air: "philosophy",
  Water: "love",
};

const elementColors: Record<string, string> = {
  Fire: "#e74c3c",
  Earth: "#27ae60",
  Air: "#9b59b6",
  Water: "#3498db",
};

const SIGN_DESCRIPTIONS: Record<string, { personality: string; strengths: string; challenges: string; bestMatches: string }> = {
  aries: {
    personality: "Aries is the first sign of the zodiac, embodying the raw energy of new beginnings and bold initiative. Ruled by Mars, the planet of action and desire, Aries natives are natural-born leaders who thrive on competition and challenge. They possess an infectious enthusiasm that inspires those around them, often charging headfirst into situations where others hesitate. Their cardinal fire energy makes them pioneers who would rather forge a new path than follow an existing one.",
    strengths: "Courageous, determined, confident, enthusiastic, honest",
    challenges: "Impatient, short-tempered, impulsive, competitive to a fault",
    bestMatches: "Leo, Sagittarius, Gemini",
  },
  taurus: {
    personality: "Taurus is the zodiac's steadfast earth sign, ruled by Venus, the planet of love, beauty, and material comfort. Taureans are known for their unwavering determination and deep appreciation for life's sensory pleasures — fine food, art, music, and nature. They build their lives on stability and routine, preferring slow and steady progress over risky shortcuts. Once a Taurus commits to a goal or a relationship, their loyalty and persistence are virtually unshakeable.",
    strengths: "Reliable, patient, practical, devoted, responsible",
    challenges: "Stubborn, possessive, resistant to change, overly materialistic",
    bestMatches: "Virgo, Capricorn, Cancer",
  },
  gemini: {
    personality: "Gemini is the mutable air sign ruled by Mercury, the planet of communication and intellect. Geminis are endlessly curious, quick-witted, and socially versatile, able to adapt to any conversation or environment with remarkable ease. Often called the storytellers of the zodiac, they have a gift for language and a hunger for information that keeps them constantly learning. Their dual nature allows them to see multiple perspectives simultaneously, making them excellent mediators and creative thinkers.",
    strengths: "Adaptable, outgoing, intelligent, eloquent, versatile",
    challenges: "Indecisive, inconsistent, restless, prone to superficiality",
    bestMatches: "Libra, Aquarius, Aries",
  },
  cancer: {
    personality: "Cancer is the cardinal water sign ruled by the Moon, making its natives deeply intuitive, emotionally intelligent, and profoundly connected to home and family. Cancers possess an almost psychic ability to sense the moods and needs of those around them, often providing comfort before it is even requested. Beneath their protective shell lies a rich inner world of imagination and sentiment. They are the nurturers of the zodiac, creating safe spaces wherever they go and fiercely protecting those they love.",
    strengths: "Nurturing, intuitive, loyal, empathetic, tenacious",
    challenges: "Moody, overly sensitive, clingy, prone to holding grudges",
    bestMatches: "Scorpio, Pisces, Taurus",
  },
  leo: {
    personality: "Leo is the fixed fire sign ruled by the Sun, radiating warmth, charisma, and a magnetic presence that naturally draws others in. Leos are born performers with a generous heart and a strong desire to be recognized and appreciated for their contributions. Their creativity is boundless, and they approach life with a dramatic flair that turns everyday moments into memorable experiences. At their best, Leos are inspiring leaders who uplift everyone around them with genuine warmth and unwavering confidence.",
    strengths: "Creative, passionate, generous, warm-hearted, cheerful",
    challenges: "Arrogant, attention-seeking, inflexible, domineering",
    bestMatches: "Aries, Sagittarius, Libra",
  },
  virgo: {
    personality: "Virgo is the mutable earth sign ruled by Mercury, combining analytical intelligence with a deep desire to be of service. Virgos are the meticulous perfectionists of the zodiac, with an extraordinary eye for detail that allows them to spot flaws and inefficiencies others miss entirely. They express love through practical acts of care — organizing, problem-solving, and quietly ensuring everything runs smoothly. Behind their reserved exterior lies a sharp mind and a genuinely kind heart devoted to self-improvement and helping others thrive.",
    strengths: "Analytical, hardworking, practical, detail-oriented, kind",
    challenges: "Overly critical, perfectionist, worrisome, reserved",
    bestMatches: "Taurus, Capricorn, Cancer",
  },
  libra: {
    personality: "Libra is the cardinal air sign ruled by Venus, making its natives natural diplomats with a refined aesthetic sensibility and a deep longing for harmony in all things. Libras excel at seeing every side of an issue, which makes them fair-minded mediators but can also lead to prolonged indecision. They are drawn to beauty, partnership, and intellectual exchange, thriving in environments where collaboration and mutual respect are valued. Their social grace and charm make them some of the most beloved people in any group.",
    strengths: "Diplomatic, fair-minded, social, gracious, cooperative",
    challenges: "Indecisive, conflict-avoidant, people-pleasing, self-pitying",
    bestMatches: "Gemini, Aquarius, Leo",
  },
  scorpio: {
    personality: "Scorpio is the fixed water sign traditionally ruled by Mars and modernly by Pluto, giving its natives an intensity and emotional depth that few other signs can match. Scorpios are fiercely private, deeply perceptive, and driven by a relentless desire to uncover hidden truths beneath the surface. They experience life with extraordinary passion — when they love, they love completely, and when they commit to a purpose, they pursue it with laser-focused determination. Their transformative nature means they are constantly evolving, rising from challenges stronger than before.",
    strengths: "Resourceful, passionate, brave, strategic, loyal",
    challenges: "Jealous, secretive, controlling, prone to obsession",
    bestMatches: "Cancer, Pisces, Virgo",
  },
  sagittarius: {
    personality: "Sagittarius is the mutable fire sign ruled by Jupiter, the planet of expansion, abundance, and higher learning. Sagittarians are the adventurers and philosophers of the zodiac, driven by an insatiable curiosity about the world and a need for freedom and exploration. They are naturally optimistic, often seeing possibility where others see limitation, and their infectious enthusiasm makes them magnetic companions. Their love of truth and wisdom extends beyond physical travel into the realms of education, spirituality, and cross-cultural understanding.",
    strengths: "Optimistic, adventurous, honest, philosophical, generous",
    challenges: "Tactless, restless, overconfident, commitment-averse",
    bestMatches: "Aries, Leo, Aquarius",
  },
  capricorn: {
    personality: "Capricorn is the cardinal earth sign ruled by Saturn, the planet of discipline, structure, and long-term achievement. Capricorns are the master builders of the zodiac, approaching life with a strategic mindset and an unwavering work ethic that steadily carries them toward their ambitious goals. They value tradition, responsibility, and earned respect, often maturing into positions of authority and influence through sheer persistence. Beneath their serious exterior lies a dry wit and a deeply caring nature that reveals itself to those who earn their trust over time.",
    strengths: "Disciplined, responsible, ambitious, patient, resourceful",
    challenges: "Pessimistic, rigid, workaholic, emotionally guarded",
    bestMatches: "Taurus, Virgo, Pisces",
  },
  aquarius: {
    personality: "Aquarius is the fixed air sign traditionally ruled by Saturn and modernly by Uranus, the planet of innovation, rebellion, and sudden insight. Aquarians are the visionaries and humanitarians of the zodiac, driven by ideals of progress, equality, and collective well-being. They think in unconventional ways, often arriving at brilliant solutions that others would never consider, and they value intellectual freedom above almost everything else. Their detached perspective allows them to champion social causes with clarity, though it can sometimes make personal emotional connections feel more challenging.",
    strengths: "Progressive, original, independent, humanitarian, intellectual",
    challenges: "Emotionally detached, stubborn, contrarian, aloof",
    bestMatches: "Gemini, Libra, Sagittarius",
  },
  pisces: {
    personality: "Pisces is the mutable water sign ruled by Jupiter traditionally and Neptune in modern astrology, giving its natives a boundless imagination and a deeply compassionate, empathic nature. Pisceans are the dreamers and mystics of the zodiac, possessing an intuitive understanding of human emotion that borders on the psychic. They experience the world through feeling, often absorbing the energies and moods of those around them like an emotional sponge. Their creative gifts — in art, music, writing, or healing — flow from this profound connection to the unseen currents of life.",
    strengths: "Compassionate, artistic, intuitive, gentle, wise",
    challenges: "Escapist, overly trusting, fearful of confrontation, prone to martyrdom",
    bestMatches: "Cancer, Scorpio, Capricorn",
  },
};

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((z) => ({ sign: z.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((z) => z.key === sign);
  if (!zodiac) return { title: "Zodiac Fortune" };

  const title = `${zodiac.symbol} ${zodiac.name} Fortune Today`;
  const description = `Daily fortune cookie message for ${zodiac.name} (${zodiac.dateRange}). Lucky numbers, personalized fortune, and cosmic guidance updated daily.`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_URL}/zodiac/${sign}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/zodiac/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function ZodiacPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((z) => z.key === sign);

  if (!zodiac) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">
        Zodiac sign not found.
      </div>
    );
  }

  const signIndex = ZODIAC_SIGNS.indexOf(zodiac);
  const seed = dateSeed();
  const category = elementCategory[zodiac.element];
  const fortunes = getFortunesByCategory(category);

  // Today's zodiac fortune
  const rng = seededRandom(seed + signIndex);
  const fortuneIndex = Math.floor(rng() * fortunes.length);
  const fortune = fortunes[fortuneIndex];
  const rarityColor = getRarityColor(fortune.rarity);
  const rarityLabel = getRarityLabel(fortune.rarity);
  const elColor = elementColors[zodiac.element];

  // Lucky numbers: 6 unique numbers 1-49
  const numRng = seededRandom(seed * 300 + signIndex);
  const luckyNumbers: number[] = [];
  while (luckyNumbers.length < 6) {
    const n = Math.floor(numRng() * 49) + 1;
    if (!luckyNumbers.includes(n)) luckyNumbers.push(n);
  }
  luckyNumbers.sort((a, b) => a - b);

  const signTitle = zodiac.name;

  const faqs = [
    {
      q: `What is today's fortune for ${signTitle}?`,
      a: `Today's fortune for ${signTitle} is: "${fortune.text}" — a ${category} fortune drawn from your ${zodiac.element} element.`,
    },
    {
      q: `What are the lucky numbers for ${signTitle} today?`,
      a: `Today's lucky numbers for ${signTitle} are: ${luckyNumbers.join(", ")}. These refresh daily.`,
    },
    {
      q: `How are ${signTitle} fortunes selected?`,
      a: `${signTitle} is a ${zodiac.element} sign, so fortunes are drawn from the ${category} category. A date-based seed ensures everyone with the same sign sees the same fortune each day.`,
    },
  ];

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Zodiac", url: `${SITE_URL}/zodiac/aries` },
          { name: signTitle, url: `${SITE_URL}/zodiac/${sign}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{zodiac.symbol}</div>
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-2">
            {signTitle} Fortune Today
          </h1>
          <p className="text-foreground/40 text-sm">{zodiac.dateRange}</p>
          <span
            className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: elColor }}
          >
            {zodiac.element} Sign
          </span>
        </div>

        {/* Today's Fortune */}
        <div
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-8 text-center mb-10"
          style={{
            borderColor: rarityColor + "30",
            background: `radial-gradient(ellipse at center, ${rarityColor}08 0%, transparent 70%)`,
          }}
        >
          <div className="absolute left-3 top-3 text-gold/30">✦</div>
          <div className="absolute right-3 top-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 right-3 text-gold/30">✦</div>
          <p className="text-xs uppercase tracking-wider text-foreground/30 mb-4">
            Your {signTitle} Fortune
          </p>
          <p className="font-serif text-xl leading-relaxed text-cream">
            &ldquo;{fortune.text}&rdquo;
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: rarityColor }}
            >
              {rarityLabel}
            </span>
            <span className="text-xs text-foreground/30 capitalize">{category}</span>
          </div>
        </div>

        {/* About Sign */}
        {SIGN_DESCRIPTIONS[sign] && (
          <div className="rounded-2xl border border-border bg-background p-6 mb-10">
            <h2 className="text-lg font-semibold text-gold mb-3">About {signTitle}</h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              {SIGN_DESCRIPTIONS[sign].personality}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gold/70 font-medium mb-1">Strengths</p>
                <p className="text-muted">{SIGN_DESCRIPTIONS[sign].strengths}</p>
              </div>
              <div>
                <p className="text-gold/70 font-medium mb-1">Challenges</p>
                <p className="text-muted">{SIGN_DESCRIPTIONS[sign].challenges}</p>
              </div>
              <div>
                <p className="text-gold/70 font-medium mb-1">Best Matches</p>
                <p className="text-muted">{SIGN_DESCRIPTIONS[sign].bestMatches}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lucky Numbers */}
        <div className="rounded-2xl border border-border bg-background p-6 text-center mb-10">
          <h2 className="text-lg font-semibold text-gold mb-4">
            Lucky Numbers for {signTitle}
          </h2>
          <div className="flex justify-center gap-3">
            {luckyNumbers.map((n) => (
              <div
                key={n}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-gold"
              >
                {n}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-foreground/30">Refreshes daily</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break a Fortune Cookie
          </Link>
        </div>

        {/* Browse Other Signs */}
        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">
            Other Zodiac Signs
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {ZODIAC_SIGNS.filter((z) => z.key !== sign).map((z) => (
              <Link
                key={z.key}
                href={`/zodiac/${z.key}`}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-gold"
              >
                <span>{z.symbol}</span>
                <span>{z.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
