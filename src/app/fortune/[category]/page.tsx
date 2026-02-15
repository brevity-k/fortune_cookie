import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORIES,
  FortuneCategory,
  getFortunesByCategory,
  seededRandom,
  dateSeed,
  getRarityColor,
  getRarityLabel,
} from "@/lib/fortuneEngine";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 43200; // 12 hours — refresh at least twice daily

const categoryDescriptions: Record<FortuneCategory, string> = {
  wisdom: "Timeless wisdom and profound insights to guide your journey through life.",
  love: "Heartfelt fortunes about love, relationships, and matters of the heart.",
  career: "Fortune cookie messages about work, ambition, and professional success.",
  humor: "Lighthearted and funny fortune cookie messages to brighten your day.",
  motivation: "Inspiring fortunes to fuel your drive and keep you moving forward.",
  philosophy: "Deep philosophical fortunes that challenge your perspective on life.",
  adventure: "Bold fortunes encouraging you to explore, take risks, and seek new experiences.",
  mystery: "Enigmatic and mysterious fortunes that spark wonder and curiosity.",
};

const categoryFAQs: Record<FortuneCategory, { q: string; a: string }[]> = {
  wisdom: [
    { q: "What are wisdom fortune cookies?", a: "Wisdom fortune cookies contain timeless proverbs and insights drawn from traditions around the world. They offer thoughtful guidance for everyday decisions." },
    { q: "How often do wisdom fortunes change?", a: "Our featured wisdom fortunes rotate daily using a date-based system, so everyone sees the same selection each day. Come back tomorrow for fresh wisdom." },
    { q: "How many wisdom fortunes are there?", a: "We have 200 curated wisdom fortunes in our collection, each one carefully selected for its depth and relevance." },
  ],
  love: [
    { q: "What are love fortune cookies?", a: "Love fortune cookies contain messages about romance, relationships, and emotional connections. They range from sweet to profound." },
    { q: "Can I share my love fortune?", a: "Yes! Break a fortune cookie on our homepage and share your love fortune on Twitter, Facebook, WhatsApp, or copy it to your clipboard." },
    { q: "How many love fortunes are available?", a: "Our collection includes 150 unique love fortunes, covering everything from new romance to lasting partnerships." },
  ],
  career: [
    { q: "What are career fortune cookies?", a: "Career fortune cookies offer motivational messages about work, professional growth, and achieving your ambitions." },
    { q: "Are career fortunes good for Monday motivation?", a: "Absolutely! Many people check their career fortune at the start of the week for a boost of professional inspiration." },
    { q: "How many career fortunes exist?", a: "We have 150 career-focused fortunes covering success, ambition, teamwork, and professional wisdom." },
  ],
  humor: [
    { q: "What are funny fortune cookies?", a: "Humor fortune cookies contain witty, playful, and lighthearted messages designed to make you smile or laugh." },
    { q: "Are the humor fortunes family-friendly?", a: "Yes, all our humor fortunes are clean and family-friendly — perfect for sharing with anyone." },
    { q: "How many funny fortunes are there?", a: "Our humor collection features 150 unique funny fortunes, from clever wordplay to unexpected punchlines." },
  ],
  motivation: [
    { q: "What are motivation fortune cookies?", a: "Motivation fortune cookies deliver inspiring messages to fuel your drive, boost confidence, and encourage action." },
    { q: "Can I get a daily motivational fortune?", a: "Yes! Visit our daily fortune page every day for a fresh motivational message powered by our seeded random system." },
    { q: "How many motivational fortunes are available?", a: "We have 150 motivational fortunes designed to inspire action and positive thinking." },
  ],
  philosophy: [
    { q: "What are philosophy fortune cookies?", a: "Philosophy fortune cookies contain thought-provoking messages that challenge your perspective and invite deeper reflection." },
    { q: "What makes philosophy fortunes different from wisdom?", a: "While wisdom fortunes offer practical life guidance, philosophy fortunes explore abstract concepts like existence, truth, and meaning." },
    { q: "How many philosophy fortunes exist?", a: "Our collection includes 101 philosophy fortunes, each one crafted to spark contemplation." },
  ],
  adventure: [
    { q: "What are adventure fortune cookies?", a: "Adventure fortune cookies contain bold messages encouraging you to explore, take risks, and embrace new experiences." },
    { q: "Are adventure fortunes good for travelers?", a: "Absolutely! Many people crack an adventure fortune before a trip for an extra dose of wanderlust and courage." },
    { q: "How many adventure fortunes are there?", a: "We have 80 unique adventure fortunes that celebrate exploration, courage, and the thrill of the unknown." },
  ],
  mystery: [
    { q: "What are mystery fortune cookies?", a: "Mystery fortune cookies contain enigmatic and cryptic messages that spark curiosity and invite interpretation." },
    { q: "Why are mystery fortunes so rare?", a: "Mystery fortunes are our legendary rarity tier — the hardest to find. Their scarcity makes each one feel special." },
    { q: "How many mystery fortunes exist?", a: "We have 50 carefully crafted mystery fortunes, making them our rarest and most exclusive category." },
  ],
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = category as FortuneCategory;
  const title = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Fortune Cookies`;
  const description = categoryDescriptions[cat] || `Discover ${category} fortune cookie messages.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/fortune/${category}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/fortune/${category}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = category as FortuneCategory;
  const fortunes = getFortunesByCategory(cat);
  if (fortunes.length === 0) {
    return <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">Category not found.</div>;
  }

  const rarityColor = getRarityColor(fortunes[0].rarity);
  const rarityLabel = getRarityLabel(fortunes[0].rarity);
  const description = categoryDescriptions[cat];
  const faqs = categoryFAQs[cat] || [];

  // Daily featured fortune for this category
  const seed = dateSeed();
  const rng = seededRandom(seed * 100 + CATEGORIES.indexOf(cat));
  const featuredIndex = Math.floor(rng() * fortunes.length);
  const featured = fortunes[featuredIndex];

  // 12 sample fortunes (seeded by date)
  const sampleRng = seededRandom(seed * 200 + CATEGORIES.indexOf(cat));
  const shuffled = [...fortunes].sort(() => sampleRng() - 0.5);
  const samples = shuffled.slice(0, 12);

  const catTitle = cat.charAt(0).toUpperCase() + cat.slice(1);

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Fortunes", url: `${SITE_URL}/fortune/wisdom` },
          { name: catTitle, url: `${SITE_URL}/fortune/${category}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-2 text-3xl sm:text-4xl font-bold text-center">
          {catTitle} Fortune Cookies
        </h1>
        <p className="text-center text-foreground/50 mb-8">{description}</p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: rarityColor }}
          >
            {rarityLabel}
          </span>
          <span className="text-sm text-foreground/40">
            {fortunes.length} fortunes
          </span>
        </div>

        {/* Featured Fortune */}
        <div
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-8 text-center mb-12"
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
            Today&apos;s {catTitle} Fortune
          </p>
          <p className="font-serif text-xl leading-relaxed text-cream">
            &ldquo;{featured.text}&rdquo;
          </p>
        </div>

        {/* Sample Fortunes */}
        <h2 className="text-xl font-semibold text-gold mb-6">
          Sample {catTitle} Fortunes
        </h2>
        <div className="grid gap-3 mb-12">
          {samples.map((f, i) => (
            <div
              key={i}
              className="rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-sm text-foreground/70"
            >
              &ldquo;{f.text}&rdquo;
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break a Cookie for Your {catTitle} Fortune
          </Link>
        </div>

        {/* Browse other categories */}
        <div className="mt-16 border-t border-gold/10 pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.filter((c) => c !== cat).map((c) => (
              <Link
                key={c}
                href={`/fortune/${c}`}
                className="rounded-full border border-gold/20 px-4 py-1.5 text-sm text-foreground/50 transition hover:border-gold/40 hover:text-gold capitalize"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
