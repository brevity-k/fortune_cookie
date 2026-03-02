import { ImageResponse } from "next/og";
import { SITE_DOMAIN } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Four Pillars of Destiny (사주) — Personalized Fortune Reading";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
        {/* Pillar symbols */}
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          {["甲", "丙", "壬", "庚"].map((char, i) => (
            <div
              key={i}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                border: "2px solid rgba(212,160,74,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: ["#4ade80", "#f87171", "#60a5fa", "#e2e8f0"][i],
              }}
            >
              {char}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#d4a04a",
            marginBottom: 8,
          }}
        >
          Four Pillars of Destiny
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "rgba(212,160,74,0.7)",
            marginBottom: 16,
          }}
        >
          사주 (四柱推命)
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(245, 230, 208, 0.5)",
            marginBottom: 32,
          }}
        >
          Personalized Fortune Reading Based on Your Birth Chart
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
