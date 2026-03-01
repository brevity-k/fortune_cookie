import { ImageResponse } from "next/og";
import { CATEGORIES, FortuneCategory } from "@/lib/fortuneEngine";
import { SITE_DOMAIN } from "@/lib/constants";

export const alt = "Fortune Cookie Category";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

const categoryEmojis: Record<FortuneCategory, string> = {
  wisdom: "🧠",
  love: "❤️",
  career: "💼",
  humor: "😄",
  motivation: "🔥",
  philosophy: "🤔",
  adventure: "🌍",
  mystery: "🔮",
};

export default async function OGImage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = category as FortuneCategory;
  const emoji = categoryEmojis[cat] || "🥠";
  const title = cat.charAt(0).toUpperCase() + cat.slice(1);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0b1a 0%, #1a1230 50%, #0f0b1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 16 }}>{emoji}</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#d4a04a",
            marginBottom: 12,
            display: "flex",
          }}
        >
          {`${title} Fortunes`}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(245, 230, 208, 0.5)",
            marginBottom: 32,
            display: "flex",
          }}
        >
          {`Fortune Cookie Messages About ${title}`}
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#d4a04a",
            letterSpacing: 2,
          }}
        >
          {SITE_DOMAIN}
        </div>
      </div>
    ),
    { ...size }
  );
}
