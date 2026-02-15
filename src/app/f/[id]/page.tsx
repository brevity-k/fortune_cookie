import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface FortuneData {
  t: string; // text
  c: string; // category
  r: string; // rarity
}

const RARITY_COLORS: Record<string, string> = {
  common: "#d4a04a",
  rare: "#4a90d9",
  epic: "#9b59b6",
  legendary: "#e74c3c",
};

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const VALID_RARITIES = ["common", "rare", "epic", "legendary"];
const VALID_CATEGORIES = ["wisdom", "love", "career", "humor", "motivation", "philosophy", "adventure", "mystery"];

function decodeFortuneId(id: string): FortuneData | null {
  try {
    const base64 = id.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    const data = JSON.parse(json);
    if (!data.t || typeof data.t !== "string") return null;
    return {
      t: data.t.slice(0, 300),
      c: VALID_CATEGORIES.includes(data.c) ? data.c : "wisdom",
      r: VALID_RARITIES.includes(data.r) ? data.r : "common",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const fortune = decodeFortuneId(id);

  if (!fortune) {
    return { title: SITE_NAME };
  }

  const title = `"${fortune.t}" — ${SITE_NAME}`;
  const description = `I cracked a ${fortune.r} ${fortune.c} fortune cookie! Break your own at Fortune Cookie.`;
  const cardUrl = `${SITE_URL}/api/fortune-card?text=${encodeURIComponent(fortune.t)}&category=${encodeURIComponent(fortune.c)}&rarity=${encodeURIComponent(fortune.r)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/f/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/f/${id}`,
      images: [{ url: cardUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cardUrl],
    },
  };
}

export default async function FortuneSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fortune = decodeFortuneId(id);

  if (!fortune) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="text-6xl mb-4">🥠</div>
          <h1 className="text-golden-shimmer text-2xl font-bold mb-4">Fortune Not Found</h1>
          <p className="text-foreground/50 mb-8">This fortune link may be invalid or expired.</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break Your Own Cookie
          </Link>
        </div>
      </div>
    );
  }

  const rarityColor = RARITY_COLORS[fortune.r] || RARITY_COLORS.common;
  const rarityLabel = RARITY_LABELS[fortune.r] || "Common";

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="text-6xl mb-6">🥠</div>

        <p className="text-xs uppercase tracking-wider text-foreground/30 mb-6">
          Someone shared a fortune with you
        </p>

        <div
          className="relative overflow-hidden rounded-2xl border p-8 text-center mb-6"
          style={{
            borderColor: rarityColor + "30",
            background: `radial-gradient(ellipse at center, ${rarityColor}08 0%, transparent 70%)`,
          }}
        >
          <div className="absolute left-3 top-3 text-gold/30">✦</div>
          <div className="absolute right-3 top-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 right-3 text-gold/30">✦</div>

          <p className="font-serif text-2xl leading-relaxed text-cream mb-4">
            &ldquo;{fortune.t}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: rarityColor }}
            >
              {rarityLabel}
            </span>
            <span className="text-xs text-foreground/30 capitalize">{fortune.c}</span>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break Your Own Cookie
          </Link>
        </div>

        <p className="mt-6 text-xs text-foreground/30">
          Over 1,000 unique fortunes. How rare will yours be?
        </p>
      </div>
    </div>
  );
}
