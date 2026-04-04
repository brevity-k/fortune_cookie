import { NextRequest, NextResponse } from 'next/server';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ isPremium: false });
  }

  const payload = await verifyPremiumToken(token);
  if (!payload || payload.status !== 'active') {
    const response = NextResponse.json({ isPremium: false });
    response.cookies.delete(PREMIUM_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({ isPremium: true });
}
