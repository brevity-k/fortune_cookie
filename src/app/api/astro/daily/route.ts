import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAllowedOrigin, parseJsonBody } from '@/lib/api-utils';
import { extractJsonObject } from '@/lib/json-utils';
import { premiumAIRatelimit } from '@/lib/rate-limit';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { getCurrentPlanetPositions } from '@/lib/astro/transits';
import { buildDailyTransitPrompt } from '@/lib/astro/prompts';
import { formatDegree } from '@/lib/astro/format';

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Premium check
    const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Premium subscription required.' }, { status: 401 });
    }
    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const { success } = await premiumAIRatelimit.limit(payload.customerId);
    if (!success) {
      return NextResponse.json({ error: 'Daily AI limit reached. Please try again tomorrow.' }, { status: 429 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service is not configured.' }, { status: 503 });
    }

    const body = await parseJsonBody(req);
    if (!body) return NextResponse.json({ error: 'Invalid or oversized request body.' }, { status: 400 });
    const { chart } = body;
    if (!chart?.planets || !chart?.ascendant) {
      return NextResponse.json({ error: 'Missing chart data.' }, { status: 400 });
    }

    // Get current transit positions
    const transits = getCurrentPlanetPositions();
    const transitData = transits
      .map((t) => `${t.planet}: ${t.sign} ${formatDegree(t.degree)}${t.retrograde ? ' (retrograde)' : ''}`)
      .join('\n');

    const prompt = buildDailyTransitPrompt(chart, transitData);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 512,
      system: prompt,
      messages: [{ role: 'user', content: 'Please provide my daily transit reading.' }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No reading generated.' }, { status: 500 });
    }

    const parsed = extractJsonObject(textBlock.text);
    if (!parsed) {
      return NextResponse.json({ error: 'Failed to parse reading.' }, { status: 500 });
    }

    const { energy, relationships, career, tip } = parsed;
    return NextResponse.json({ energy, relationships, career, tip });
  } catch (error) {
    console.error('Daily transit reading error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to generate daily reading.' }, { status: 500 });
  }
}
