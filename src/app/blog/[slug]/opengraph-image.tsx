import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";
import { SITE_DOMAIN } from "@/lib/constants";

export const alt = "Fortune Cookie Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogOGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title || "Fortune Cookie Blog";

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
          {`${SITE_DOMAIN}/blog`}
        </div>
      </div>
    ),
    { ...size }
  );
}
