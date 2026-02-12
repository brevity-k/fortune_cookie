import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Fortune Cookie - Break Your Virtual Fortune Cookie";
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
        <div style={{ fontSize: 120, marginBottom: 20 }}>🥠</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            background: "linear-gradient(90deg, #d4a04a, #f0d68a, #d4a04a)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 16,
          }}
        >
          Fortune Cookie
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(245, 230, 208, 0.6)",
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          Break a virtual fortune cookie and discover your destiny
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#d4a04a",
            marginTop: 32,
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
