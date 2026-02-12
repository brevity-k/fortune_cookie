import { ImageResponse } from "next/og";

export const alt = "Zodiac Fortune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ZODIAC_DATA: Record<string, { symbol: string; element: string }> = {
  aries: { symbol: "♈", element: "Fire" },
  taurus: { symbol: "♉", element: "Earth" },
  gemini: { symbol: "♊", element: "Air" },
  cancer: { symbol: "♋", element: "Water" },
  leo: { symbol: "♌", element: "Fire" },
  virgo: { symbol: "♍", element: "Earth" },
  libra: { symbol: "♎", element: "Air" },
  scorpio: { symbol: "♏", element: "Water" },
  sagittarius: { symbol: "♐", element: "Fire" },
  capricorn: { symbol: "♑", element: "Earth" },
  aquarius: { symbol: "♒", element: "Air" },
  pisces: { symbol: "♓", element: "Water" },
};

export function generateStaticParams() {
  return Object.keys(ZODIAC_DATA).map((sign) => ({ sign }));
}

export default async function OGImage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  const data = ZODIAC_DATA[sign] || { symbol: "🥠", element: "" };
  const title = sign.charAt(0).toUpperCase() + sign.slice(1);

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
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 16 }}>{data.symbol}</div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#d4a04a",
            marginBottom: 8,
            display: "flex",
          }}
        >
          {`${title} Fortune Today`}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(245, 230, 208, 0.5)",
            marginBottom: 32,
            display: "flex",
          }}
        >
          {`${data.element} Sign · Daily Fortune & Lucky Numbers`}
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#d4a04a",
            letterSpacing: 2,
          }}
        >
          fortunecrack.com
        </div>
      </div>
    ),
    { ...size }
  );
}
