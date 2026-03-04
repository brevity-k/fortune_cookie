import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { isSubscribed } from '@/lib/subscription';
import { premiumFortuneRatelimit } from '@/lib/rate-limit';
import { SITE_URL } from '@/lib/constants';
import {
  buildSajuFortunePrompt,
  buildAstroFortunePrompt,
  type FortuneTrack,
  type FortuneCategory,
} from '@/lib/premium/prompts';

export const runtime = 'nodejs';

const VALID_TRACKS: FortuneTrack[] = ['saju', 'astro'];
const VALID_CATEGORIES: FortuneCategory[] = ['daily', 'love', 'career', 'health', 'monthly'];

function getTodayDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export async function POST(request: Request) {
  // CSRF origin check
  const origin = request.headers.get('origin');
  const isAllowedOrigin =
    origin &&
    (origin === SITE_URL ||
      (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
  if (!isAllowedOrigin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service is currently unavailable.' }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 });
  }

  const subscribed = await isSubscribed(supabase, user.id);
  if (!subscribed) {
    return NextResponse.json({ error: 'Premium subscription required.' }, { status: 403 });
  }

  // Rate limit by user ID (30 req/day) — fail closed if limiter unavailable
  if (!premiumFortuneRatelimit) {
    console.error('Premium fortune rate limiter not initialized — Upstash may be misconfigured');
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }
  const { success, reset } = await premiumFortuneRatelimit.limit(user.id);
  if (!success) {
    return NextResponse.json(
      { error: 'Daily request limit reached. Please try again tomorrow.' },
      { status: 429, headers: { 'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString() } },
    );
  }

  let body: { track?: string; category?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const track = body.track as FortuneTrack;
  const category = (body.category || 'daily') as FortuneCategory;

  if (!VALID_TRACKS.includes(track)) {
    return NextResponse.json({ error: 'Invalid track.' }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
  }

  // Check cache
  const today = new Date().toISOString().split('T')[0];
  const { data: cached } = await supabase
    .from('daily_fortunes')
    .select('content')
    .eq('user_id', user.id)
    .eq('track', track)
    .eq('fortune_date', today)
    .eq('category', category)
    .single();

  if (cached) {
    return NextResponse.json({ fortune: cached.content });
  }

  // Fetch user chart
  const { data: chartRow } = await supabase
    .from('user_charts')
    .select('chart_data, birth_info')
    .eq('user_id', user.id)
    .eq('track', track)
    .single();

  if (!chartRow) {
    return NextResponse.json({ error: 'No chart data found. Please enter your birth details first.' }, { status: 404 });
  }

  // Fetch recent user context (last 20 entries)
  const { data: contextRows } = await supabase
    .from('user_context')
    .select('id, content, context_type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const contextEntries = (contextRows || []).map((r) => ({
    content: r.content,
    context_type: r.context_type,
    created_at: r.created_at,
  }));

  // Build prompt — truncate chart data to limit prompt injection surface
  const currentDate = getTodayDateString();
  const rawChart = typeof chartRow.chart_data === 'string'
    ? chartRow.chart_data
    : JSON.stringify(chartRow.chart_data, null, 2);
  const chartDescription = rawChart.slice(0, 3000);

  const { system, user: userMessage } = track === 'saju'
    ? buildSajuFortunePrompt(chartDescription, category, contextEntries, currentDate)
    : buildAstroFortunePrompt(chartDescription, category, contextEntries, currentDate);

  // Generate fortune
  const client = new Anthropic({ apiKey });

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        temperature: 0.8,
        system,
        messages: [{ role: 'user', content: userMessage }],
      });

      const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const fortune = JSON.parse(cleaned);

      // Validate structure and ranges
      if (
        typeof fortune.title !== 'string' || !fortune.title ||
        typeof fortune.content !== 'string' || !fortune.content ||
        typeof fortune.intensity !== 'number' ||
        fortune.intensity < 1 || fortune.intensity > 5
      ) {
        return NextResponse.json({ error: 'AI response format error.' }, { status: 500 });
      }
      // Clamp intensity and truncate strings for safety
      fortune.intensity = Math.round(Math.min(5, Math.max(1, fortune.intensity)));
      fortune.title = String(fortune.title).slice(0, 100);
      fortune.content = String(fortune.content).slice(0, 1000);

      // Cache
      const contextIds = (contextRows || []).map((r) => r.id);
      await supabase.from('daily_fortunes').insert({
        user_id: user.id,
        track,
        fortune_date: today,
        category,
        content: fortune,
        context_snapshot: contextIds,
      });

      return NextResponse.json({ fortune });
    } catch (error) {
      lastError = error;
      if (error instanceof Anthropic.RateLimitError) {
        return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
      }
      if (error instanceof Anthropic.AuthenticationError) {
        return NextResponse.json({ error: 'AI service authentication error.' }, { status: 503 });
      }
      const status = (error as { status?: number }).status;
      if ((status === 529 || status === 500 || status === 502 || status === 503) && attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      break;
    }
  }

  console.error('Premium fortune generation error:', lastError);
  return NextResponse.json({ error: 'Failed to generate fortune. Please try again.' }, { status: 500 });
}
