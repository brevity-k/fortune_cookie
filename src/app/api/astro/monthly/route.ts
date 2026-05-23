import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAllowedOrigin } from '@/lib/api-utils';
import { extractJsonObject } from '@/lib/json-utils';
import { premiumAIRatelimit } from '@/lib/rate-limit';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { getCurrentPlanetPositions } from '@/lib/astro/transits';
import { buildMonthlyForecastPrompt } from '@/lib/astro/prompts';
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

    const { chart } = await req.json();
    if (!chart?.planets || !chart?.ascendant) {
      return NextResponse.json({ error: 'Missing chart data.' }, { status: 400 });
    }

    // Get current transit positions for this month
    const transits = getCurrentPlanetPositions();
    const transitData = transits
      .map((t) => `${t.planet}: ${t.sign} ${formatDegree(t.degree)}${t.retrograde ? ' (retrograde)' : ''}`)
      .join('\n');

    const prompt = buildMonthlyForecastPrompt(chart, transitData);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: prompt,
      messages: [{ role: 'user', content: 'Please provide my monthly astrological forecast.' }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No forecast generated.' }, { status: 500 });
    }

    const parsed = extractJsonObject(textBlock.text);
    if (!parsed) {
      return NextResponse.json({ error: 'Failed to parse forecast.' }, { status: 500 });
    }

    const { theme, career, love, health, keyDates, advice } = parsed;
    return NextResponse.json({ theme, career, love, health, keyDates, advice });
  } catch (error) {
    console.error('Monthly forecast error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to generate monthly forecast.' }, { status: 500 });
  }
}
