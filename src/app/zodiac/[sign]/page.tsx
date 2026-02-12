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

export const revalidate = 43200; // 12 hours — refresh at least twice daily

interface ZodiacSign {
  sign: string;
  symbol: string;
  element: "fire" | "earth" | "air" | "water";
  dateRange: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { sign: "aries", symbol: "♈", element: "fire", dateRange: "Mar 21 – Apr 19" },
  { sign: "taurus", symbol: "♉", element: "earth", dateRange: "Apr 20 – May 20" },
  { sign: "gemini", symbol: "♊", element: "air", dateRange: "May 21 – Jun 20" },
  { sign: "cancer", symbol: "♋", element: "water", dateRange: "Jun 21 – Jul 22" },
  { sign: "leo", symbol: "♌", element: "fire", dateRange: "Jul 23 – Aug 22" },
  { sign: "virgo", symbol: "♍", element: "earth", dateRange: "Aug 23 – Sep 22" },
  { sign: "libra", symbol: "♎", element: "air", dateRange: "Sep 23 – Oct 22" },
  { sign: "scorpio", symbol: "♏", element: "water", dateRange: "Oct 23 – Nov 21" },
  { sign: "sagittarius", symbol: "♐", element: "fire", dateRange: "Nov 22 – Dec 21" },
  { sign: "capricorn", symbol: "♑", element: "earth", dateRange: "Dec 22 – Jan 19" },
  { sign: "aquarius", symbol: "♒", element: "air", dateRange: "Jan 20 – Feb 18" },
  { sign: "pisces", symbol: "♓", element: "water", dateRange: "Feb 19 – Mar 20" },
];

const elementCategory: Record<string, FortuneCategory> = {
  fire: "motivation",
  earth: "career",
  air: "philosophy",
  water: "love",
};

const elementColors: Record<string, string> = {
  fire: "#e74c3c",
  earth: "#27ae60",
  air: "#9b59b6",
  water: "#3498db",
};

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((z) => ({ sign: z.sign }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((z) => z.sign === sign);
  if (!zodiac) return { title: "Zodiac Fortune" };

  const title = `${zodiac.symbol} ${zodiac.sign.charAt(0).toUpperCase() + zodiac.sign.slice(1)} Fortune Today`;
  const description = `Daily fortune cookie message for ${zodiac.sign.charAt(0).toUpperCase() + zodiac.sign.slice(1)} (${zodiac.dateRange}). Lucky numbers, personalized fortune, and cosmic guidance updated daily.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Fortune Cookie`,
      description,
      url: `https://fortunecrack.com/zodiac/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Fortune Cookie`,
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
  const zodiac = ZODIAC_SIGNS.find((z) => z.sign === sign);

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

  const signTitle = zodiac.sign.charAt(0).toUpperCase() + zodiac.sign.slice(1);

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
          { name: "Home", url: "https://fortunecrack.com" },
          { name: "Zodiac", url: "https://fortunecrack.com/zodiac/aries" },
          { name: signTitle, url: `https://fortunecrack.com/zodiac/${sign}` },
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
            {zodiac.element.charAt(0).toUpperCase() + zodiac.element.slice(1)} Sign
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

        {/* Lucky Numbers */}
        <div className="rounded-2xl border border-gold/15 bg-gold/5 p-6 text-center mb-10">
          <h2 className="text-lg font-semibold text-gold mb-4">
            Lucky Numbers for {signTitle}
          </h2>
          <div className="flex justify-center gap-3">
            {luckyNumbers.map((n) => (
              <div
                key={n}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-sm font-bold text-gold"
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
        <div className="border-t border-gold/10 pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">
            Other Zodiac Signs
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {ZODIAC_SIGNS.filter((z) => z.sign !== sign).map((z) => (
              <Link
                key={z.sign}
                href={`/zodiac/${z.sign}`}
                className="flex items-center gap-2 rounded-lg border border-gold/10 px-3 py-2 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-gold"
              >
                <span>{z.symbol}</span>
                <span className="capitalize">{z.sign}</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
