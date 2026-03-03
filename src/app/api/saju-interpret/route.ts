import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SITE_URL } from "@/lib/constants";

// In-memory rate limiting (per serverless instance)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // CSRF protection
    const origin = req.headers.get("origin");
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost")));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI interpretation is not configured." },
        { status: 503 }
      );
    }

    const { fourPillars, fiveElements, birthInfo } = await req.json();

    if (!fourPillars || !fiveElements || !birthInfo) {
      return NextResponse.json(
        { error: "Missing chart data." },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });

    const chartSummary = JSON.stringify({ fourPillars, fiveElements, birthInfo }, null, 2);

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: `You are interpreting a Korean 사주 (Four Pillars of Destiny) chart. The user's chart data is provided as JSON. Write a warm, accessible interpretation covering these sections:
1. **Overall Fortune** — general life energy reading
2. **Career Outlook** — work and professional tendencies
3. **Love & Relationships** — romantic and interpersonal dynamics
4. **Health** — physical and mental well-being tendencies
5. **Practical Advice** — actionable suggestion based on the chart

Reference specific elements and pillars from the chart data. Write 2-3 sentences per section. No jargon — explain concepts in plain English. Be warm and encouraging while staying grounded in the chart data.

Also provide:
- luckyElement: the element that benefits this person most
- luckyColor: a color associated with their lucky element

Respond in JSON format:
{
  "overall": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "advice": "...",
  "luckyElement": "wood|fire|earth|metal|water",
  "luckyColor": "..."
}`,
      messages: [
        {
          role: "user",
          content: `Please interpret this 사주 chart:\n\n${chartSummary}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No interpretation generated." }, { status: 500 });
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let parsed;
    try {
      const jsonStr = textBlock.text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: "Failed to parse interpretation." }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Saju interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to generate interpretation." },
      { status: 500 }
    );
  }
}
