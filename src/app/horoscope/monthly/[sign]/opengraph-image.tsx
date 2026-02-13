import { ImageResponse } from "next/og";
import { SITE_DOMAIN } from "@/lib/constants";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";

export const alt = "Monthly Horoscope";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((z) => z.key === sign);
  const name = zodiac?.name ?? sign.charAt(0).toUpperCase() + sign.slice(1);
  const symbol = zodiac?.symbol ?? "✨";

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
        <div style={{ fontSize: 120, marginBottom: 16 }}>{symbol}</div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#d4a04a",
            marginBottom: 8,
            display: "flex",
          }}
        >
          {`${name} Monthly Horoscope`}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(245, 230, 208, 0.5)",
            marginBottom: 32,
            display: "flex",
          }}
        >
          {`${zodiac?.element ?? ""} Sign · Monthly Astrology Forecast`}
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
