import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SITE_URL } from '@/lib/constants';
import { buildInterpretationPrompt } from '@/lib/astro/prompts';
import { astroAIRatelimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // CSRF protection — exact origin matching
    const origin = req.headers.get('origin');
    const allowedOrigins = [SITE_URL];
    if (SITE_URL.includes('www.')) {
      allowedOrigins.push(SITE_URL.replace('www.', ''));
    } else {
      allowedOrigins.push(SITE_URL.replace('://', '://www.'));
    }
    const isAllowedOrigin =
      origin &&
      (allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV === 'development' && (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Rate limiting
    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (astroAIRatelimit) {
      const { success } = await astroAIRatelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
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

    // Parse JSON from response (handle potential markdown code blocks)
    let parsed;
    try {
      const jsonStr = textBlock.text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Failed to parse interpretation.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Astro interpretation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interpretation.' },
      { status: 500 }
    );
  }
}
