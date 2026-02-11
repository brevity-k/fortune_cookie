import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const ownerEmail = process.env.CONTACT_EMAIL || "brevity1s.wos@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "Fortune Cookie <onboarding@resend.dev>";

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Send notification to site owner
    await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: `[Fortune Cookie] ${subject || "New Contact Form Message"}`,
      html: `
        <h2>New message from ${name}</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    // Send auto-response to the user
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Thanks for reaching out to Fortune Cookie!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a0e04; color: #f5e6d0; padding: 32px; border-radius: 12px;">
          <h1 style="color: #d4a04a; font-size: 24px; margin-bottom: 16px;">Thank you, ${name}!</h1>
          <p style="color: #f5e6d0cc; line-height: 1.6;">
            We've received your message and will get back to you as soon as possible, usually within 24-48 hours.
          </p>
          <div style="background: #2d1810; border: 1px solid rgba(212,160,74,0.2); border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #d4a04a; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">Your message:</p>
            <p style="color: #f5e6d0aa; font-size: 14px; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #f5e6d0cc; line-height: 1.6;">
            In the meantime, why not <a href="https://fortunecrack.com" style="color: #d4a04a;">break another fortune cookie</a>?
          </p>
          <hr style="border: none; border-top: 1px solid rgba(212,160,74,0.15); margin: 24px 0;" />
          <p style="color: #f5e6d088; font-size: 12px; margin: 0;">
            Fortune Cookie | fortunecrack.com<br/>
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
