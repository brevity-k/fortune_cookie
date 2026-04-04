import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';
import { signPremiumToken, PREMIUM_COOKIE_NAME, premiumCookieOptions } from '@/lib/saju/premium';

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

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing session ID.' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' || !session.customer) {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 400 });
    }

    const customerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer.id;

    const token = await signPremiumToken(customerId);
    const response = NextResponse.json({ success: true });
    response.cookies.set(PREMIUM_COOKIE_NAME, token, premiumCookieOptions());
    return response;
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
