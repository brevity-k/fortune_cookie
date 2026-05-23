import { NextRequest, NextResponse } from 'next/server';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { subscribeRatelimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const { success } = await subscribeRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ isPremium: false });
  }

  const payload = await verifyPremiumToken(token);
  if (!payload || payload.status !== 'active') {
    const response = NextResponse.json({ isPremium: false });
    response.cookies.delete(PREMIUM_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({ isPremium: true });
}
