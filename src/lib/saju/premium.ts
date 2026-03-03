// src/lib/saju/premium.ts
import { SignJWT, jwtVerify } from 'jose';

const STORAGE_KEY = 'saju_premium_token';
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

export function savePremiumToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, token);
  }
}

export function getPremiumToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function clearPremiumToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
