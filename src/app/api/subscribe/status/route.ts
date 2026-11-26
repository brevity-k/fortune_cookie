import { NextRequest, NextResponse } from 'next/server';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { hasActiveSubscription } from '@/lib/saju/subscription';
import { subscribeRatelimit } from '@/lib/rate-limit';
import { isAllowedOrigin, getClientIp } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const ip = getClientIp(req);
  const { success } = await subscribeRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ isPremium: false });
  }

  const payload = await verifyPremiumToken(token);
  let active = false;
  if (payload && payload.status === 'active') {
    try {
      active = await hasActiveSubscription(payload.customerId);
    } catch (error) {
      // Stripe unavailable: trust the signed token rather than locking users out
      console.error('Status check error:', error instanceof Error ? error.message : 'Unknown error');
      active = true;
    }
  }
  if (!active) {
    const response = NextResponse.json({ isPremium: false });
    response.cookies.delete(PREMIUM_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({ isPremium: true }, { headers: { 'Cache-Control': 'private, no-store' } });
}
