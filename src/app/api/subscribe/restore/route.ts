import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isAllowedOrigin, parseJsonBody } from '@/lib/api-utils';
import { restoreRatelimit } from '@/lib/rate-limit';
import { signPremiumToken, PREMIUM_COOKIE_NAME, premiumCookieOptions } from '@/lib/saju/premium';

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const { success } = await restoreRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
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
    const { email } = body;
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'No subscription found for this email.' },
        { status: 404 }
      );
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found.' },
        { status: 404 }
      );
    }

    const token = await signPremiumToken(customer.id);
    const response = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(PREMIUM_COOKIE_NAME, token, premiumCookieOptions());
    return response;
  } catch (error) {
    console.error('Restore error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to restore subscription.' },
      { status: 500 }
    );
  }
}
