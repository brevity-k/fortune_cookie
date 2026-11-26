import { NextRequest, NextResponse, after } from 'next/server';
import { Resend } from 'resend';
import { isAllowedOrigin, parseJsonBody, getClientIp, isValidEmail } from '@/lib/api-utils';
import { restoreRatelimit } from '@/lib/rate-limit';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { signRestoreToken } from '@/lib/saju/premium';
import { findActiveCustomerByEmail } from '@/lib/saju/subscription';

// Identical response whether or not a subscription exists, so this endpoint
// cannot be used to discover which emails belong to subscribers.
const GENERIC_MESSAGE =
  "If there's an active subscription for that email, we've sent a sign-in link. It expires in 15 minutes.";

/**
 * Restore premium access on a new device. Never grants access directly —
 * it emails a short-lived sign-in link to the subscriber's address, proving
 * ownership of the email before a session cookie is issued (see ./confirm).
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const ip = getClientIp(req);
    const { success } = await restoreRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!process.env.STRIPE_SECRET_KEY || !resendKey) {
      return NextResponse.json(
        { error: 'Subscription restore is not configured.' },
        { status: 503 }
      );
    }

    const body = await parseJsonBody(req);
    if (!body) return NextResponse.json({ error: 'Invalid or oversized request body.' }, { status: 400 });
    const rawEmail = body.email;
    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    const email = rawEmail.trim().toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Lookup and send run after the response is sent, so neither timing nor
    // a send failure distinguishes subscriber emails from unknown ones.
    after(() => sendRestoreLink(email, resendKey));

    return NextResponse.json(
      { success: true, message: GENERIC_MESSAGE },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Restore error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to restore subscription.' },
      { status: 500 }
    );
  }
}

async function sendRestoreLink(email: string, resendKey: string): Promise<void> {
  try {
    const customer = await findActiveCustomerByEmail(email);
    if (!customer) return;
    const token = await signRestoreToken(customer.id);
    const link = `${SITE_URL}/api/subscribe/restore/confirm?token=${encodeURIComponent(token)}`;
    const fromEmail = process.env.FROM_EMAIL || `${SITE_NAME} <onboarding@resend.dev>`;
    const { error } = await new Resend(resendKey).emails.send({
      from: fromEmail,
      to: customer.email,
      subject: `Your ${SITE_NAME} premium sign-in link`,
      html: `
        <p>Someone (hopefully you) asked to restore ${SITE_NAME} premium on a new device.</p>
        <p><a href="${link}">Click here to sign in</a>. This link expires in 15 minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });
    if (error) console.error('Restore email error:', error.message);
  } catch (error) {
    console.error('Restore link error:', error instanceof Error ? error.message : 'Unknown error');
  }
}
