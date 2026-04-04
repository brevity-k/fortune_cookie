import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';

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

    const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'No token provided.' }, { status: 401 });
    }

    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.billingPortal.sessions.create({
      customer: payload.customerId,
      return_url: `${origin}/saju`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to open billing portal.' },
      { status: 500 }
    );
  }
}
