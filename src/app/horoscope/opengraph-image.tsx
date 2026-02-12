import { ImageResponse } from "next/og";
import { SITE_DOMAIN } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Daily Horoscopes for All Zodiac Signs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
        <div style={{ fontSize: 100, marginBottom: 16 }}>✨</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#d4a04a",
            marginBottom: 12,
          }}
        >
          Daily Horoscopes
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(245, 230, 208, 0.5)",
            marginBottom: 32,
          }}
        >
          Free Daily, Weekly & Monthly Astrology Readings
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
