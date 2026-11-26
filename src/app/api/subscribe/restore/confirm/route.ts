import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/api-utils';
import { subscribeRatelimit } from '@/lib/rate-limit';
import { SITE_URL } from '@/lib/constants';
import {
  verifyRestoreToken,
  signPremiumToken,
  PREMIUM_COOKIE_NAME,
  premiumCookieOptions,
} from '@/lib/saju/premium';
import { hasActiveSubscription } from '@/lib/saju/subscription';

function redirectTo(status: 'success' | 'expired' | 'error'): NextResponse {
  const res = NextResponse.redirect(`${SITE_URL}/saju?restore=${status}`, 303);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

/**
 * Landing point for the emailed restore link. GET is required because the
 * user arrives from an email client; the signed, 15-minute, purpose-scoped
 * token is the authorization (no Origin header exists on this navigation).
 */
export async function GET(req: NextRequest) {
  try {
    const { success } = await subscribeRatelimit.limit(getClientIp(req));
    if (!success) return redirectTo('error');

    const token = req.nextUrl.searchParams.get('token');
    const customerId = token ? await verifyRestoreToken(token) : null;
    if (!customerId) return redirectTo('expired');

    if (!(await hasActiveSubscription(customerId))) return redirectTo('expired');

    const response = redirectTo('success');
    response.cookies.set(PREMIUM_COOKIE_NAME, await signPremiumToken(customerId), premiumCookieOptions());
    return response;
  } catch (error) {
    console.error('Restore confirm error:', error instanceof Error ? error.message : 'Unknown error');
    return redirectTo('error');
  }
}
