import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAllowedOrigin, parseJsonBody } from '@/lib/api-utils';
import { extractJsonObject } from "@/lib/json-utils";
import { premiumAIRatelimit } from "@/lib/rate-limit";
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from "@/lib/saju/premium";

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Premium check
    const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Premium subscription required." }, { status: 401 });
    }
    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    const { success } = await premiumAIRatelimit.limit(payload.customerId);
    if (!success) {
      return NextResponse.json(
        { error: "Daily AI limit reached. Please try again tomorrow." },
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

    const body = await parseJsonBody(req);
    if (!body) return NextResponse.json({ error: 'Invalid or oversized request body.' }, { status: 400 });
    const { fourPillars, fiveElements, birthInfo } = body;

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

    const parsed = extractJsonObject(textBlock.text);
    if (!parsed) {
      return NextResponse.json({ error: "Failed to parse interpretation." }, { status: 500 });
    }

    const { overall, career, love, health, advice, luckyElement, luckyColor } = parsed;
    return NextResponse.json({ overall, career, love, health, advice, luckyElement, luckyColor });
  } catch (error) {
    console.error("Saju interpretation error:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: "Failed to generate interpretation." },
      { status: 500 }
    );
  }
}
