import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isAllowedOrigin, parseJsonBody } from '@/lib/api-utils';
import { subscribeRatelimit } from '@/lib/rate-limit';
import { verifyPremiumToken, verifyPremiumTokenWithGracePeriod, signPremiumToken, PREMIUM_COOKIE_NAME, premiumCookieOptions } from '@/lib/saju/premium';

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const { success } = await subscribeRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'No token provided.' }, { status: 401 });
    }

    // Decode token even if expired to get customerId
    let customerId: string;
    try {
      const payload = await verifyPremiumToken(token);
      if (payload) {
        customerId = payload.customerId;
      } else {
        // Token expired — verify signature but tolerate expiry; Stripe re-validates subscription below
        const expiredPayload = await verifyPremiumTokenWithGracePeriod(token);
        if (!expiredPayload?.customerId) {
          return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
        }
        customerId = expiredPayload.customerId;
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    if (!customerId) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Check Stripe subscription status
    const stripe = new Stripe(secretKey);
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription.' }, { status: 403 });
    }

    const newToken = await signPremiumToken(customerId);
    const response = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(PREMIUM_COOKIE_NAME, newToken, premiumCookieOptions());
    return response;
  } catch (error) {
    console.error('Refresh error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to refresh token.' },
      { status: 500 }
    );
  }
}
