import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isAllowedOrigin } from '@/lib/api-utils';
import { subscribeRatelimit } from '@/lib/rate-limit';
import { SITE_URL } from '@/lib/constants';

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
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!secretKey || !priceId) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/saju?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/saju`,
    });

    return NextResponse.json({ url: session.url }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Checkout error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
