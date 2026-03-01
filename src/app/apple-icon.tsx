import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1230 0%, #0f0b1a 100%)",
          borderRadius: "40px",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fortune paper strip */}
          <rect
            x="48"
            y="12"
            width="24"
            height="42"
            rx="4"
            fill="#fef3e0"
          />
          {/* Paper lines */}
          <line x1="53" y1="22" x2="67" y2="22" stroke="#d4a04a" strokeWidth="1.5" />
          <line x1="53" y1="28" x2="67" y2="28" stroke="#d4a04a" strokeWidth="1.5" />
          <line x1="53" y1="34" x2="63" y2="34" stroke="#d4a04a" strokeWidth="1.5" />

          {/* Fortune cookie left half */}
          <path
            d="M16 72C16 72 22 38 60 38C60 38 36 48 32 72C28 96 16 72 16 72Z"
            fill="#d4a04a"
          />
          {/* Left half highlight */}
          <path
            d="M22 68C22 68 26 46 52 40C52 40 36 48 33 66C30 84 22 68 22 68Z"
            fill="#f0d68a"
            opacity="0.4"
          />

          {/* Fortune cookie right half */}
          <path
            d="M104 72C104 72 98 38 60 38C60 38 84 48 88 72C92 96 104 72 104 72Z"
            fill="#f0d68a"
          />
          {/* Right half shadow */}
          <path
            d="M98 68C98 68 94 46 68 40C68 40 84 48 87 66C90 84 98 68 98 68Z"
            fill="#d4a04a"
            opacity="0.4"
          />

          {/* Center fold lines */}
          <path
            d="M60 40L56 74"
            stroke="#8b6914"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M60 40L64 74"
            stroke="#8b6914"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cookie bottom curve */}
          <path
            d="M28 78C38 94 82 94 92 78"
            stroke="#8b6914"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Sparkle dots */}
          <circle cx="24" cy="28" r="2" fill="#f0d68a" opacity="0.6" />
          <circle cx="96" cy="24" r="1.5" fill="#f0d68a" opacity="0.5" />
          <circle cx="14" cy="52" r="1.5" fill="#f0d68a" opacity="0.4" />
          <circle cx="106" cy="48" r="2" fill="#f0d68a" opacity="0.5" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
