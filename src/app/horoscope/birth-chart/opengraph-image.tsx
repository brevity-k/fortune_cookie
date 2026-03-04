import { ImageResponse } from "next/og";
import { SITE_DOMAIN } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Free Birth Chart Calculator - Personalized Natal Chart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ZODIAC_RING = [
  "\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D",
  "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653",
];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f0b1a 0%, #1a1230 40%, #251545 70%, #0f0b1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative zodiac symbols scattered around */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            display: "flex",
            gap: 24,
            fontSize: 28,
            color: "rgba(212, 160, 74, 0.15)",
          }}
        >
          {ZODIAC_RING.slice(0, 6).map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 60,
            display: "flex",
            gap: 24,
            fontSize: 28,
            color: "rgba(212, 160, 74, 0.15)",
          }}
        >
          {ZODIAC_RING.slice(6).map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            fontSize: 72,
            marginBottom: 8,
            display: "flex",
          }}
        >
          <span style={{ marginRight: 12 }}>{"\u2609"}</span>
          <span style={{ marginRight: 12 }}>{"\u263D"}</span>
          <span>{"\u2648"}</span>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#d4a04a",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Personalized Natal Chart
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(245, 230, 208, 0.5)",
            marginBottom: 36,
            textAlign: "center",
          }}
        >
          Discover your Sun, Moon & Rising sign
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
