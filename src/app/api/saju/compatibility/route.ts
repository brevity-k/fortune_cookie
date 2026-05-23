import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAllowedOrigin } from '@/lib/api-utils';
import { extractJsonObject } from '@/lib/json-utils';
import { premiumAIRatelimit } from '@/lib/rate-limit';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { buildCompatibilityPrompt } from '@/lib/saju/prompts';

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

    const { chartA, chartB } = await req.json();
    if (!chartA?.fourPillars || !chartA?.fiveElements) {
      return NextResponse.json({ error: 'Missing chart data for Person A.' }, { status: 400 });
    }
    if (!chartB?.fourPillars || !chartB?.fiveElements) {
      return NextResponse.json({ error: 'Missing chart data for Person B.' }, { status: 400 });
    }

    const prompt = buildCompatibilityPrompt(chartA, chartB);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 768,
      system: prompt,
      messages: [
        {
          role: 'user',
          content: 'Please analyze the compatibility between these two birth charts.',
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No reading generated.' }, { status: 500 });
    }

    const parsed = extractJsonObject(textBlock.text);
    if (!parsed) {
      return NextResponse.json({ error: 'Failed to parse reading.' }, { status: 500 });
    }

    const { emotional, challenges, advice, score } = parsed;
    return NextResponse.json({ emotional, challenges, advice, score });
  } catch (error) {
    console.error('Compatibility reading error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to generate compatibility reading.' },
      { status: 500 }
    );
  }
}
