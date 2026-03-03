import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken, signPremiumToken } from '@/lib/saju/premium';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isAllowedOrigin =
      origin &&
      (SITE_URL.startsWith(origin) ||
        (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')));
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

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
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
        // Token expired — try to decode without verification
        const parts = token.split('.');
        const decoded = JSON.parse(atob(parts[1]));
        customerId = decoded.customerId;
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
    return NextResponse.json({ token: newToken });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token.' },
      { status: 500 }
    );
  }
}
