import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken } from '@/lib/saju/premium';
import { buildCompatibilityPrompt } from '@/lib/astro/prompts';

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

    const { chartA, chartB } = await req.json();
    if (!chartA?.planets || !chartA?.ascendant || !chartB?.planets || !chartB?.ascendant) {
      return NextResponse.json({ error: 'Missing chart data for one or both people.' }, { status: 400 });
    }

    const prompt = buildCompatibilityPrompt(chartA, chartB);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: prompt,
      messages: [{ role: 'user', content: 'Please analyze our astrological compatibility.' }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No compatibility analysis generated.' }, { status: 500 });
    }

    let parsed;
    try {
      const jsonStr = textBlock.text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Failed to parse compatibility analysis.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Compatibility analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate compatibility analysis.' }, { status: 500 });
  }
}
