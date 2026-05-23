import { NextRequest, NextResponse } from 'next/server';
import { isAllowedOrigin, parseJsonBody } from '@/lib/api-utils';
import { premiumAIRatelimit } from '@/lib/rate-limit';
import { verifyPremiumToken, PREMIUM_COOKIE_NAME } from '@/lib/saju/premium';
import { calculateDayPillar } from '@/lib/saju/day-pillar';
import { getStemElement } from '@/lib/saju/stems';
import { getBranchElement } from '@/lib/saju/branches';
import { formatPillar } from '@/lib/saju/format';
import type { Element } from '@/lib/saju/types';

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Premium check
    const token = req.cookies.get(PREMIUM_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Premium subscription required.' }, { status: 401 });
    }
    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const { success } = await premiumAIRatelimit.limit(payload.customerId);
    if (!success) {
      return NextResponse.json({ error: 'Daily limit reached. Please try again tomorrow.' }, { status: 429 });
    }

    const body = await parseJsonBody(req);
    if (!body) return NextResponse.json({ error: 'Invalid or oversized request body.' }, { status: 400 });
    const { chart } = body;
    if (!chart?.fiveElements) {
      return NextResponse.json({ error: 'Missing chart data.' }, { status: 400 });
    }

    const VALID_ELEMENTS = new Set<string>(["wood", "fire", "earth", "metal", "water"]);
    const favorableElement: Element = chart.fiveElements.favorableElement;
    const unfavorableElement: Element = chart.fiveElements.unfavorableElement;
    if (!VALID_ELEMENTS.has(favorableElement) || !VALID_ELEMENTS.has(unfavorableElement)) {
      return NextResponse.json({ error: 'Invalid element data.' }, { status: 400 });
    }

    const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days: {
      date: string;
      dayOfWeek: string;
      stemBranch: string;
      element: Element;
      rating: 'favorable' | 'neutral' | 'challenging';
    }[] = [];

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);

      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();

      const pillar = calculateDayPillar(year, month, day);
      const formatted = formatPillar(pillar);
      const stemElement = getStemElement(pillar.stem);
      const branchElement = getBranchElement(pillar.branch);

      let rating: 'favorable' | 'neutral' | 'challenging' = 'neutral';
      if (stemElement === favorableElement || branchElement === favorableElement) {
        rating = 'favorable';
      } else if (stemElement === unfavorableElement || branchElement === unfavorableElement) {
        rating = 'challenging';
      }

      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      days.push({
        date: dateStr,
        dayOfWeek: DAY_ABBR[d.getDay()],
        stemBranch: `${formatted.stemElement}/${formatted.branchElement}`,
        element: stemElement,
        rating,
      });
    }

    return NextResponse.json({ days });
  } catch (error) {
    console.error('Lucky days calculation error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to calculate lucky days.' }, { status: 500 });
  }
}
