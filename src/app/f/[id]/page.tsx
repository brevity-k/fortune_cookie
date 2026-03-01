import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, CATEGORY_COLORS } from "@/lib/constants";
import { getRarityLabel, getFortuneNumber } from "@/lib/fortuneEngine";
import CookieGameSection from "@/components/CookieGameSection";

interface FortuneData {
  t: string;
  c: string;
  r: string;
}

const RARITY_STARS: Record<string, string> = {
  common: "★★☆☆☆",
  rare: "★★★☆☆",
  epic: "★★★★☆",
  legendary: "★★★★★",
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

  const fortuneNumber = getFortuneNumber(fortune.t);
  const rarityLabel = getRarityLabel(fortune.r as "common" | "rare" | "epic" | "legendary");
  const title = `Fortune Crack #${fortuneNumber.toLocaleString()} — ${rarityLabel} ${fortune.c} fortune`;
  const description = `Someone cracked a ${rarityLabel} ${fortune.c} fortune! Can you get a rarer one?`;
  const cardUrl = `${SITE_URL}/api/fortune-card?text=${encodeURIComponent(fortune.t)}&category=${encodeURIComponent(fortune.c)}&rarity=${encodeURIComponent(fortune.r)}&num=${fortuneNumber}`;

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
          <h1 className="text-2xl font-bold text-foreground/80 mb-4">Fortune Not Found</h1>
          <p className="text-muted mb-8">This fortune link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[fortune.c] || "#d4a04a";
  const rarityLabel = getRarityLabel(fortune.r as "common" | "rare" | "epic" | "legendary");
  const stars = RARITY_STARS[fortune.r] || RARITY_STARS.common;
  const fortuneNumber = getFortuneNumber(fortune.t);

  // Calculate competitive nudge based on rarity
  const rarerPercent = fortune.r === "common" ? 85 : fortune.r === "rare" ? 62 : fortune.r === "epic" ? 15 : 5;

  return (
    <div className="bg-warm-gradient min-h-screen">
      <div className="px-4 py-12">
        <div className="mx-auto max-w-lg text-center mb-10">
          <p className="text-sm text-muted mb-6">
            Someone cracked a fortune for you
          </p>

          {/* The shared fortune card */}
          <div
            className="relative overflow-hidden rounded-2xl p-8 sm:p-10 text-center mb-6"
            style={{
              background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 50%, ${categoryColor}bb 100%)`,
              color: "#fff",
            }}
          >
            <p
              className="text-xl sm:text-2xl leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            >
              &ldquo;{fortune.t}&rdquo;
            </p>
            <div className="h-px w-24 mx-auto mb-4 bg-white/30" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>{stars}</span>
              <span className="text-sm text-white/70">{rarityLabel}</span>
              <span className="text-white/30">&middot;</span>
              <span className="text-sm text-white/70 capitalize">{fortune.c}</span>
            </div>
            <div className="text-xs text-white/50 tracking-wider">
              🥠 Fortune Crack #{fortuneNumber.toLocaleString()}
            </div>
          </div>

          {/* Competitive nudge */}
          <p className="text-sm text-muted">
            {rarerPercent}% of people get a rarer fortune than this one. Can you?
          </p>
        </div>

        {/* YOUR TURN — embedded game */}
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-foreground/80 mb-2">
            Your Turn
          </h2>
          <CookieGameSection />
        </div>
      </div>
    </div>
  );
}
