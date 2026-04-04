import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { getCurrentMonthPillar } from '@/lib/saju/current-luck';
import { formatPillar } from '@/lib/saju/format';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000')));
    if (!isAllowedOrigin) {
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service is not configured.' }, { status: 503 });
    }

    const { chart } = await req.json();
    if (!chart?.fourPillars || !chart?.fiveElements) {
      return NextResponse.json({ error: 'Missing chart data.' }, { status: 400 });
    }

    const monthPillar = getCurrentMonthPillar();
    const monthFormatted = formatPillar(monthPillar);
    const dayMaster = formatPillar(chart.fourPillars.day);

    const prompt = `You are a Korean 사주 career and love timing advisor. Based on the user's birth chart and current cosmic energy, provide timing advice.

User's Day Master: ${dayMaster.stemHanja} (${dayMaster.stemElement}, ${dayMaster.yinYang})
Favorable Element: ${chart.fiveElements.favorableElement}
Day Master Strength: ${chart.fiveElements.isStrong ? 'Strong' : 'Weak'}

Current Month's Pillar: ${monthFormatted.combined} (${monthFormatted.stemElement} ${monthFormatted.branchAnimal})

Focus on:
1. Career timing — Is this a good time for job changes, negotiations, or new projects? (2-3 sentences)
2. Love timing — Is this a good time for new relationships, deepening existing ones, or taking space? (2-3 sentences)
3. Financial timing — Investment, saving, or spending trends (1-2 sentences)
4. Best action to take this month (1 sentence)

Respond in JSON:
{
  "career": "...",
  "love": "...",
  "financial": "...",
  "action": "..."
}`;

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 768,
      system: prompt,
      messages: [
        {
          role: 'user',
          content: 'Please provide my career and love timing advice for this month.',
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No reading generated.' }, { status: 500 });
    }

    let parsed;
    try {
      const jsonStr = textBlock.text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Failed to parse reading.' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Timing reading error:', error);
    return NextResponse.json({ error: 'Failed to generate timing advice.' }, { status: 500 });
  }
}
