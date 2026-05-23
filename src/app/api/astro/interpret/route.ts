import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAllowedOrigin } from '@/lib/api-utils';
import { extractJsonObject } from '@/lib/json-utils';
import { buildInterpretationPrompt } from '@/lib/astro/prompts';
import { astroAIRatelimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Rate limiting
    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const { success } = await astroAIRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI interpretation is not configured.' },
        { status: 503 }
      );
    }

    const { chart } = await req.json();

    if (!chart?.planets || !chart?.ascendant) {
      return NextResponse.json(
        { error: 'Missing chart data.' },
        { status: 400 }
      );
    }

    const prompt = buildInterpretationPrompt(chart);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: prompt,
      messages: [{ role: 'user', content: 'Please provide my natal chart personality reading.' }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No interpretation generated.' }, { status: 500 });
    }

    const parsed = extractJsonObject(textBlock.text);
    if (!parsed) {
      return NextResponse.json({ error: 'Failed to parse interpretation.' }, { status: 500 });
    }

    const { emotions, communication, love, ambition, career, balance } = parsed;
    return NextResponse.json({ emotions, communication, love, ambition, career, balance });
  } catch (error) {
    console.error('Astro interpretation error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to generate interpretation.' },
      { status: 500 }
    );
  }
}
