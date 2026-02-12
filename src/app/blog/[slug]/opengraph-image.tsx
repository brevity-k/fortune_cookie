import { ImageResponse } from "next/og";

export const alt = "Fortune Cookie Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const titles: Record<string, string> = {
  "history-of-fortune-cookies": "The Surprising History of Fortune Cookies",
  "fortune-cookie-traditions": "Fortune Cookie Traditions Around the World",
  "building-interactive-web-games": "Building Interactive Web Games with Physics Engines",
  "psychology-of-fortune-telling": "The Psychology Behind Fortune Telling",
  "digital-fortune-cookies-future": "The Future of Digital Fortune Cookies",
  "lucky-numbers-superstitions-science": "Lucky Numbers, Superstitions & Science",
  "morning-rituals-around-the-world": "Morning Rituals Around the World",
  "famous-fortunes-that-came-true": "10 Fortune Cookie Predictions That Came True",
  "zodiac-fortune-cookies-astrology-meets-wisdom": "Your Zodiac Sign as a Fortune Cookie",
  "why-we-need-small-joys": "The Science of Small Joys",
};

export default async function BlogOGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = titles[slug] || "Fortune Cookie Blog";

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
        <div style={{ fontSize: 64, marginBottom: 24 }}>🥠</div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "#d4a04a",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(245, 230, 208, 0.5)",
            letterSpacing: 2,
          }}
        >
          fortunecrack.com/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
