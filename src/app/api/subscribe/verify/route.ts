import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isAllowedOrigin, parseJsonBody } from '@/lib/api-utils';
import { subscribeRatelimit } from '@/lib/rate-limit';
import { signPremiumToken, PREMIUM_COOKIE_NAME, premiumCookieOptions } from '@/lib/saju/premium';

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

    const body = await parseJsonBody(req);
    if (!body) return NextResponse.json({ error: 'Invalid or oversized request body.' }, { status: 400 });
    const { sessionId } = body;
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing session ID.' }, { status: 400 });
    }
    if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID format.' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' || !session.customer) {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 400 });
    }

    const customerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer.id;

    // Re-validate active subscription — prevents session replay after cancellation
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription.' }, { status: 403 });
    }

    const token = await signPremiumToken(customerId);
    const response = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(PREMIUM_COOKIE_NAME, token, premiumCookieOptions());
    return response;
  } catch (error) {
    console.error('Verify error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
