import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken } from '@/lib/saju/premium';
import { getCurrentPlanetPositions } from '@/lib/astro/transits';
import { buildMonthlyForecastPrompt } from '@/lib/astro/prompts';
import { formatDegree } from '@/lib/astro/format';

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
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Premium check
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Premium subscription required.' }, { status: 401 });
    }
    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
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

    let parsed;
    try {
      const jsonStr = textBlock.text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Failed to parse forecast.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Monthly forecast error:', error);
    return NextResponse.json({ error: 'Failed to generate monthly forecast.' }, { status: 500 });
  }
}
