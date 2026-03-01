import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0b1a",
          borderRadius: "6px",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fortune cookie left half */}
          <path
            d="M4 14C4 14 5 8 12 8C12 8 8 10 7 14C6 18 4 14 4 14Z"
            fill="#d4a04a"
          />
          {/* Fortune cookie right half */}
          <path
            d="M20 14C20 14 19 8 12 8C12 8 16 10 17 14C18 18 20 14 20 14Z"
            fill="#f0d68a"
          />
          {/* Fortune paper strip */}
          <rect
            x="10"
            y="4"
            width="4"
            height="8"
            rx="1"
            fill="#fef3e0"
          />
          {/* Crack/fold line */}
          <path
            d="M12 8L11 14M12 8L13 14"
            stroke="#8b6914"
            strokeWidth="0.5"
          />
          {/* Cookie bottom curve */}
          <path
            d="M6 15C8 18 16 18 18 15"
            stroke="#8b6914"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
