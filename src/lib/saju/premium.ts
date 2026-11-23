// src/lib/saju/premium.ts — server-side only (JWT signing/verification)
import { SignJWT, jwtVerify } from 'jose';

export const PREMIUM_COOKIE_NAME = 'saju_premium_token';
const TOKEN_EXPIRY = '24h';

function getSecret(): Uint8Array {
  const secret = process.env.PREMIUM_JWT_SECRET;
  if (!secret) throw new Error('PREMIUM_JWT_SECRET not set');
  return new TextEncoder().encode(secret);
}

export interface PremiumPayload {
  customerId: string;
  status: 'active' | 'cancelled';
}

const RESTORE_PURPOSE = 'restore';
const RESTORE_TOKEN_EXPIRY = '15m';

// Premium session tokens carry no `purpose` claim; any token that does
// (e.g. an emailed restore link) must never be accepted as a session.
function toPremiumPayload(payload: Record<string, unknown>): PremiumPayload | null {
  if (payload.purpose !== undefined) return null;
  if (typeof payload.customerId !== 'string' || !payload.customerId) return null;
  return payload as unknown as PremiumPayload;
}

export async function signPremiumToken(customerId: string): Promise<string> {
  return new SignJWT({ customerId, status: 'active' } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());
}

export async function verifyPremiumToken(token: string): Promise<PremiumPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return toPremiumPayload(payload);
  } catch {
    return null;
  }
}

// Verifies signature but tolerates up to 7 days past expiry — use only when Stripe re-validates the subscription
export async function verifyPremiumTokenWithGracePeriod(token: string): Promise<PremiumPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { clockTolerance: 7 * 24 * 60 * 60 });
    return toPremiumPayload(payload);
  } catch {
    return null;
  }
}

/** Short-lived, single-purpose token embedded in the emailed restore link. */
export async function signRestoreToken(customerId: string): Promise<string> {
  return new SignJWT({ customerId, purpose: RESTORE_PURPOSE })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(RESTORE_TOKEN_EXPIRY)
    .sign(getSecret());
}

export async function verifyRestoreToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.purpose !== RESTORE_PURPOSE) return null;
    return typeof payload.customerId === 'string' && payload.customerId ? payload.customerId : null;
  } catch {
    return null;
  }
}

export function premiumCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  };
}
