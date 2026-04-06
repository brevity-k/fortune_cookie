import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Learn Astrology & Fortune Traditions",
  description:
    "Explore our guides on zodiac signs, planets, numerology, tarot, moon phases, Chinese zodiac, and fortune cookie history. Free astrology education.",
  alternates: { canonical: `${SITE_URL}/learn` },
  openGraph: {
    title: `Learn Astrology & Fortune Traditions | ${SITE_NAME}`,
    description:
      "Free astrology guides: zodiac signs, planets, numerology, tarot, and more.",
    url: `${SITE_URL}/learn`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Learn Astrology & Fortune Traditions | ${SITE_NAME}`,
    description:
      "Free astrology guides: zodiac signs, planets, numerology, tarot, and more.",
  },
};

const guides = [
  {
    title: "Zodiac Signs",
    description:
      "Zodiac sign profiles with daily fortunes, personality insights, and compatibility",
    href: "/zodiac/aries",
    emoji: "\u2648",
  },
  {
    title: "The Four Elements",
    description:
      "Fire, Earth, Air, and Water — how elements shape zodiac personality",
    href: "/learn/elements",
    emoji: "\uD83D\uDD25",
  },
  {
    title: "Planets in Astrology",
    description:
      "The meaning of Sun, Moon, Mercury, Venus, Mars, and the outer planets",
    href: "/learn/planets",
    emoji: "\uD83E\uDE90",
  },
  {
    title: "Astrological Houses",
    description:
      "The 12 houses and what each governs in your birth chart",
    href: "/learn/houses",
    emoji: "\uD83C\uDFE0",
  },
  {
    title: "Numerology",
    description:
      "The power of lucky numbers — Pythagorean, Chinese, and Vedic traditions",
    href: "/learn/numerology",
    emoji: "\uD83D\uDD22",
  },
  {
    title: "Fortune Cookie History",
    description:
      "The surprising true origin of fortune cookies and their cultural journey",
    href: "/learn/fortune-cookie-history",
    emoji: "\uD83E\uDD60",
  },
  {
    title: "Tarot Basics",
    description:
      "Introduction to tarot cards — Major and Minor Arcana explained",
    href: "/learn/tarot-basics",
    emoji: "\uD83C\uDCCF",
  },
  {
    title: "Moon Phases",
    description:
      "The 8 lunar phases and their spiritual and astrological significance",
    href: "/learn/moon-phases",
    emoji: "\uD83C\uDF19",
  },
  {
    title: "Chinese Zodiac",
    description:
      "The 12 animal signs, five elements, and 60-year cycle of Chinese astrology",
    href: "/learn/chinese-zodiac",
    emoji: "\uD83D\uDC09",
  },
];

export default function LearnHub() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Learn", url: `${SITE_URL}/learn` },
        ]}
      />

      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-3">
            Learn Astrology &amp; Fortune Traditions
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Explore our in-depth guides on astrology, numerology, tarot, and the
            rich cultural history of fortune-telling traditions from around the
            world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group rounded-2xl border border-border bg-background p-5 transition hover:border-gold/30 hover:bg-gold/5"
            >
              <div className="text-3xl mb-3">{guide.emoji}</div>
              <h2 className="text-lg font-semibold text-foreground/90 group-hover:text-gold transition mb-2">
                {guide.title}
              </h2>
              <p className="text-sm text-muted">{guide.description}</p>
              <span className="mt-3 inline-block text-xs text-gold/60 group-hover:text-gold transition">
                Read guide &rarr;
              </span>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gold mb-3">
            Why Learn About Astrology?
          </h2>
          <p className="leading-relaxed text-muted">
            Astrology is one of humanity&apos;s oldest systems for finding
            meaning in the cosmos. Whether you approach it as psychology,
            mythology, cultural history, or personal reflection, understanding
            astrological concepts enriches your relationship with time, seasons,
            and self-awareness. Our guides are designed for curious beginners and
            seasoned enthusiasts alike — grounded in tradition, written for
            modern readers.
          </p>
          <p className="leading-relaxed text-muted">
            Each guide covers the essential knowledge you need, from the basics
            of zodiac signs to the nuances of planetary transits. We draw on
            Western tropical astrology, Chinese astrological traditions, Vedic
            numerology, and the rich history of divination practices across
            cultures.
          </p>
        </div>
      </div>
    </div>
  );
}
