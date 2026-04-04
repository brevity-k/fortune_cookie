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
    return payload as unknown as PremiumPayload;
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
