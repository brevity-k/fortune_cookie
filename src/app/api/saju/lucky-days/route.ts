import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/constants';
import { verifyPremiumToken } from '@/lib/saju/premium';
import { calculateDayPillar } from '@/lib/saju/day-pillar';
import { getStemElement } from '@/lib/saju/stems';
import { getBranchElement } from '@/lib/saju/branches';
import { formatPillar } from '@/lib/saju/format';
import type { Element } from '@/lib/saju/types';

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

    // Premium check
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Premium subscription required.' }, { status: 401 });
    }
    const payload = await verifyPremiumToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const { chart } = await req.json();
    if (!chart?.fiveElements) {
      return NextResponse.json({ error: 'Missing chart data.' }, { status: 400 });
    }

    const favorableElement: Element = chart.fiveElements.favorableElement;
    const unfavorableElement: Element = chart.fiveElements.unfavorableElement;

    const days: {
      date: string;
      pillar: { stem: number; branch: number };
      rating: 'favorable' | 'neutral' | 'challenging';
      stemElement: Element;
      branchElement: Element;
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
        pillar: { stem: pillar.stem, branch: pillar.branch },
        rating,
        stemElement: formatted.stemElement,
        branchElement: formatted.branchElement,
      });
    }

    return NextResponse.json({ days });
  } catch (error) {
    console.error('Lucky days calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate lucky days.' }, { status: 500 });
  }
}
