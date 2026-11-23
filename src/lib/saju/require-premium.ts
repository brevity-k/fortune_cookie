// src/lib/saju/require-premium.ts — server-side only
import { NextRequest, NextResponse } from 'next/server';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME, type PremiumPayload } from './premium';
import { hasActiveSubscription } from './subscription';

/**
 * Gate for premium API routes. Verifies the session cookie AND that the
 * Stripe subscription is still active, so cancellations revoke access
 * without waiting for the 24h token to expire.
 *
 * Returns the payload on success, or a NextResponse to return as-is.
 */
export async function requirePremium(req: NextRequest): Promise<PremiumPayload | NextResponse> {
  const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Premium subscription required.' }, { status: 401 });
  }

  const payload = await verifyPremiumToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
  }

  if (!(await hasActiveSubscription(payload.customerId))) {
    const response = NextResponse.json({ error: 'No active subscription.' }, { status: 403 });
    response.cookies.delete(PREMIUM_COOKIE_NAME);
    return response;
  }

  return payload;
}
