import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_URL, SITE_NAME, SITE_DOMAIN } from "@/lib/constants";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// In-memory rate limiting (per serverless instance)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // CSRF protection: verify request origin
    const origin = req.headers.get("origin");
    if (!origin || !SITE_URL.startsWith(origin)) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const ownerEmail = process.env.CONTACT_EMAIL;
    if (!ownerEmail) {
      return NextResponse.json(
        { error: "Contact email is not configured." },
        { status: 503 }
      );
    }
    const fromEmail = process.env.FROM_EMAIL || `${SITE_NAME} <onboarding@resend.dev>`;

    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 254 || message.length > 5000 || (subject && subject.length > 200)) {
      return NextResponse.json(
        { error: "Input exceeds maximum allowed length." },
        { status: 400 }
      );
    }

    await Promise.all([
      // Send notification to site owner
      resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        subject: `[${SITE_NAME}] ${subject || "New Contact Form Message"}`,
        html: `
          <h2>New message from ${escapeHtml(name)}</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject || "N/A")}</p>
          <hr />
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        `,
      }),
      // Send auto-response to the user
      resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Thanks for reaching out to ${SITE_NAME}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0b1a; color: #e8e0f0; padding: 32px; border-radius: 12px;">
            <h1 style="color: #d4a04a; font-size: 24px; margin-bottom: 16px;">Thank you, ${escapeHtml(name)}!</h1>
            <p style="color: #f5e6d0cc; line-height: 1.6;">
              We've received your message and will get back to you as soon as possible, usually within 24-48 hours.
            </p>
            <div style="background: #1a1528; border: 1px solid rgba(212,160,74,0.2); border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="color: #d4a04a; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">Your message:</p>
              <p style="color: #f5e6d0aa; font-size: 14px; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>
            <p style="color: #f5e6d0cc; line-height: 1.6;">
              In the meantime, why not <a href="${SITE_URL}" style="color: #d4a04a;">break another fortune cookie</a>?
            </p>
            <hr style="border: none; border-top: 1px solid rgba(212,160,74,0.15); margin: 24px 0;" />
            <p style="color: #f5e6d088; font-size: 12px; margin: 0;">
              ${SITE_NAME} | ${SITE_DOMAIN}<br/>
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
