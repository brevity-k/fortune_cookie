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

const CATEGORY_DESCRIPTIONS: Record<FortuneCategory, string> = {
  wisdom:
    "Wisdom fortune cookies draw from centuries of human insight, distilling the teachings of Eastern and Western philosophical traditions into brief, memorable phrases. Rooted in the Confucian, Taoist, and Buddhist proverbs that inspired the earliest fortune cookie messages in early twentieth-century America, these fortunes carry forward a long lineage of oral wisdom. They touch on patience, self-knowledge, humility, and the art of living well. What makes wisdom fortunes resonate so deeply is their universality — a single sentence about letting go or embracing change can feel startlingly relevant to someone facing a career crossroads, a difficult relationship, or an ordinary Tuesday afternoon. These messages work because they bypass analytical thinking and speak directly to lived experience. A good wisdom fortune does not lecture; it offers a gentle reframe that lingers in the mind long after the cookie is cracked.",

  love:
    "Love fortune cookies explore the full spectrum of human connection — the flutter of new attraction, the quiet comfort of long partnership, the courage required to be vulnerable, and the resilience needed after heartbreak. The tradition of seeking romantic guidance from oracles, astrologers, and divination tools stretches back thousands of years, from the love poetry of Rumi to the matchmaking rituals of ancient China. Fortune cookies inherited this impulse and made it casual and accessible. Love fortunes resonate because romantic uncertainty is one of the most universal human experiences; a short, hopeful message can provide reassurance when someone is deciding whether to confess feelings, repair a rift, or simply appreciate what they already have. The best love fortunes avoid sentimentality and instead capture an emotional truth — the kind of line you might underline in a novel and carry in your wallet.",

  career:
    "Career fortune cookies address the ambitions, anxieties, and daily realities of professional life. They draw on a rich tradition of proverbial guidance about hard work, opportunity, and perseverance found in cultures worldwide — from the industriousness celebrated in Benjamin Franklin's Poor Richard's Almanack to the Confucian emphasis on self-cultivation through disciplined effort. In the context of fortune cookies, career messages serve as miniature pep talks that arrive at exactly the right moment: before a job interview, during a difficult project, or in the quiet doubt of wondering whether your work matters. These fortunes resonate because work occupies a central place in modern identity, and a concise, well-timed reminder about patience, leadership, or creative risk-taking can shift someone's mindset for the rest of the day. The most effective career fortunes balance aspiration with realism, acknowledging struggle while pointing toward growth.",

  humor:
    "Humor fortune cookies honor the playful, irreverent side of the fortune cookie tradition. While many people associate fortune cookies with solemn proverbs, humor has always been part of the experience — from intentionally absurd predictions to fortunes that break the fourth wall. Comedy in fortune cookies draws on the long human tradition of using laughter as wisdom delivery: Aesop's fables used wit to teach morals, Zen masters told jokes to trigger insight, and court jesters spoke truths that advisors could not. A funny fortune works because it defuses the pretense of prophecy while still offering a small, genuine moment of delight. The surprise of unfolding a cookie and finding something that makes you laugh out loud is memorable in a way that earnest advice sometimes is not. Humor fortunes remind us that joy itself is a form of good fortune, and that not every message needs to be profound to be meaningful.",

  motivation:
    "Motivation fortune cookies tap into the human need for encouragement at moments of doubt, fatigue, or indecision. This category inherits a tradition that runs from ancient Stoic exercises in mental resilience through modern positive psychology research on self-efficacy and growth mindset. The power of a motivational fortune lies in its brevity and timing — a single sentence urging you to persist, to start, or to believe in your capacity for change can function like a psychological nudge at a pivotal moment. Research on implementation intentions and affirmations suggests that short, concrete statements of possibility genuinely influence behavior. Motivational fortunes resonate because they meet people in the gap between intention and action, offering not a plan but a push. The best ones avoid hollow cheerfulness and instead name the difficulty honestly before pointing toward what lies on the other side of effort and persistence.",

  philosophy:
    "Philosophy fortune cookies condense millennia of human inquiry into thought-provoking fragments. They draw from the traditions of Socratic questioning, existentialist reflection, Zen koans, and Taoist paradox — all modes of thinking that use brevity and surprise to unsettle habitual assumptions. Unlike wisdom fortunes, which tend to offer guidance, philosophy fortunes ask questions or present ideas that resist easy resolution: the nature of time, the paradox of choice, the relationship between self and other. This category connects to the ancient practice of philosophical aphorisms, from Heraclitus and Epictetus to Nietzsche and Wittgenstein, where a single sentence could reorient an entire worldview. Philosophy fortunes resonate because they invite active participation — the reader must sit with the idea, turn it over, and decide what it means. They appeal to people who enjoy intellectual play and who find comfort not in answers but in the quality of the questions themselves.",

  adventure:
    "Adventure fortune cookies speak to the restless, curious part of human nature that longs for novelty, exploration, and the thrill of the unfamiliar. This category draws from a deep cultural wellspring — the hero's journey described by Joseph Campbell, the wanderlust poetry of Basho and Whitman, and the traveler traditions of cultures from the Polynesian wayfinders to the Silk Road merchants. Adventure fortunes encourage stepping beyond the boundaries of routine, whether that means booking a trip, trying a new skill, or simply taking an unfamiliar route home. They resonate because modern life, for all its comforts, often feels constrained, and a brief, bold message about embracing the unknown can rekindle a sense of possibility. The most compelling adventure fortunes balance excitement with depth, suggesting that the real discovery is not the destination but the transformation that comes from saying yes to uncertainty.",

  mystery:
    "Mystery fortune cookies occupy the most enigmatic corner of the fortune cookie tradition, offering cryptic messages that resist immediate interpretation. They connect to humanity's oldest relationship with the unknown — the oracle at Delphi delivering ambiguous prophecies, the I Ching presenting hexagrams that demand contemplation, and the tarot reader laying out symbols that mean different things to different seekers. Mystery fortunes are deliberately open-ended; they work not by providing clarity but by creating a space for the reader's own intuition to surface. This category resonates because certainty is rarer than we pretend, and there is genuine comfort in a message that acknowledges the unknowable rather than papering over it with false confidence. A mysterious fortune invites you to sit with ambiguity, to notice what your mind reaches for when given an incomplete map. These are the fortunes people photograph, share, and return to — precisely because their meaning keeps shifting as the reader's life unfolds.",
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
    robots: {
      index: false,
      follow: true,
    },
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

        {/* Category Description */}
        <div className="rounded-2xl border border-border bg-background p-6 mb-12">
          <h2 className="text-lg font-semibold text-gold mb-3">About {catTitle} Fortunes</h2>
          <p className="text-sm text-muted leading-relaxed">
            {CATEGORY_DESCRIPTIONS[cat]}
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
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground/70"
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
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.filter((c) => c !== cat).map((c) => (
              <Link
                key={c}
                href={`/fortune/${c}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/50 transition hover:border-gold/40 hover:text-gold capitalize"
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
