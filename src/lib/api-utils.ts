import { NextRequest } from 'next/server';
import { SITE_URL } from '@/lib/constants';

const allowedOrigins = (() => {
  const { protocol, hostname } = new URL(SITE_URL);
  const wwwHost = hostname.startsWith('www.') ? hostname.slice(4) : `www.${hostname}`;
  return [SITE_URL, `${protocol}//${wwwHost}`];
})();

const MAX_BODY_LENGTH = 16 * 1024; // 16 KB

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parseJsonBody(req: NextRequest): Promise<any> {
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_LENGTH) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  if (process.env.NODE_ENV === 'development') {
    if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') return true;
  }
  return allowedOrigins.includes(origin);
}
