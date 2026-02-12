import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const VALID_CATEGORIES = [
  "wisdom", "love", "career", "humor",
  "motivation", "philosophy", "adventure", "mystery",
];

const VALID_RARITIES = ["common", "rare", "epic", "legendary"];

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  let text = searchParams.get("text") || "A fortune awaits you";
  const category = searchParams.get("category") || "wisdom";
  const rarity = searchParams.get("rarity") || "common";

  // Validate inputs
  if (text.length > 300) text = text.slice(0, 300);
  const validCategory = VALID_CATEGORIES.includes(category) ? category : "wisdom";
  const validRarity = VALID_RARITIES.includes(rarity) ? rarity : "common";

  const rarityColor = RARITY_COLORS[validRarity];
  const rarityLabel = RARITY_LABELS[validRarity];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a0e04 0%, #3d2216 50%, #1a0e04 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 24, display: "flex" }}>🥠</div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#f5e6d0",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: 900,
            marginBottom: 24,
            display: "flex",
          }}
        >
          {`"${text}"`}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              backgroundColor: rarityColor,
              color: "white",
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {rarityLabel}
          </div>
          <div
            style={{
              color: "rgba(245, 230, 208, 0.4)",
              fontSize: 14,
              textTransform: "capitalize",
              display: "flex",
            }}
          >
            {validCategory}
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#d4a04a",
            letterSpacing: 2,
            display: "flex",
          }}
        >
          fortunecrack.com
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
