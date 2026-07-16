import { NextResponse } from "next/server";

/**
 * POST /api/contact
 *
 * Sends a portfolio contact-form submission via Resend.
 *
 * Required env vars (set in .env.local locally; in Vercel project settings
 * for production):
 *   RESEND_API_KEY     — get one at https://resend.com/api-keys
 *   CONTACT_TO_EMAIL   — your inbox; defaults to jashan@jashanveer.com
 *
 * Defaults to Resend's `onboarding@resend.dev` test sender so you can ship
 * without verifying a domain. Once jashanveer.com is verified at Resend,
 * change FROM_EMAIL below to e.g. "Jashanveer <hello@jashanveer.com>".
 */

const FROM_EMAIL = "Portfolio <onboarding@resend.dev>";
const DEFAULT_TO = "jashan@jashanveer.com";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Surface a specific error so the client can fall back to mailto:
    return NextResponse.json(
      { error: "Email backend not configured.", code: "NO_BACKEND" },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO;
  const subject = `Portfolio inquiry${name ? ` from ${name}` : ""}`;

  const text = [
    name ? `Name: ${name}` : "",
    `Reply-to: ${email}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = [
    name ? `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` : "",
    `<p><strong>Reply-to:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
    `<hr/>`,
    `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
  ]
    .filter(Boolean)
    .join("\n");

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => "");
    console.error("Resend error", resendRes.status, detail);
    return NextResponse.json(
      { error: "Couldn't send your message. Try the email link instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
