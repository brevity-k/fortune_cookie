import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { SITE_DOMAIN } from "@/lib/constants";

export const runtime = "edge";

const VALID_CATEGORIES = [
  "wisdom", "love", "career", "humor",
  "motivation", "philosophy", "adventure", "mystery",
];

const VALID_RARITIES = ["common", "rare", "epic", "legendary"];

const CATEGORY_COLORS: Record<string, string> = {
  wisdom: "#0d7377",
  love: "#e8475f",
  career: "#d4870e",
  humor: "#ff6b6b",
  motivation: "#f77f00",
  philosophy: "#4a3f8a",
  adventure: "#2d6a4f",
  mystery: "#5a189a",
};

const RARITY_STARS: Record<string, string> = {
  common: "★★☆☆☆",
  rare: "★★★☆☆",
  epic: "★★★★☆",
  legendary: "★★★★★",
};

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  let text = searchParams.get("text") || "A fortune awaits you";
  const category = searchParams.get("category") || "wisdom";
  const rarity = searchParams.get("rarity") || "common";
  const num = searchParams.get("num") || "1";

  if (text.length > 300) text = text.slice(0, 300);
  const validCategory = VALID_CATEGORIES.includes(category) ? category : "wisdom";
  const validRarity = VALID_RARITIES.includes(rarity) ? rarity : "common";
  const bgColor = CATEGORY_COLORS[validCategory];
  const stars = RARITY_STARS[validRarity];
  const rarityLabel = RARITY_LABELS[validRarity];

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 50%, ${bgColor}bb 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          padding: 60,
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 400,
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 900,
            marginBottom: 40,
            display: "flex",
          }}
        >
          {`\u201C${text}\u201D`}
        </div>
        <div
          style={{
            width: 100,
            height: 1,
            backgroundColor: "rgba(255,255,255,0.3)",
            marginBottom: 30,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 30,
            fontSize: 18,
          }}
        >
          <span style={{ display: "flex", opacity: 0.9 }}>{stars}</span>
          <span style={{ display: "flex", opacity: 0.7 }}>{rarityLabel}</span>
          <span style={{ display: "flex", opacity: 0.3 }}>&middot;</span>
          <span style={{ display: "flex", opacity: 0.7, textTransform: "capitalize" }}>{validCategory}</span>
        </div>
        <div
          style={{
            fontSize: 14,
            letterSpacing: 2,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.5,
          }}
        >
          <span style={{ display: "flex" }}>🥠</span>
          <span style={{ display: "flex" }}>Fortune Crack #{num}</span>
          <span style={{ display: "flex" }}>&middot;</span>
          <span style={{ display: "flex" }}>{SITE_DOMAIN}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, immutable",
      },
    }
  );
}
