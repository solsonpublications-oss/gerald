import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/newsletter/unsubscribe — mark a subscriber inactive
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    // Also allow lookup by the URL search param ?email=
    const url = new URL(req.url);
    const emailParam = url.searchParams.get("email")?.trim().toLowerCase();
    const target = email || emailParam;

    if (!target || !isValidEmail(target)) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required." },
        { status: 400 }
      );
    }

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: target },
    });

    if (!existing) {
      // Don't leak whether an email exists — return success regardless
      return NextResponse.json({
        ok: true,
        message: "You've been unsubscribed. We're sorry to see you go.",
      });
    }

    if (!existing.active) {
      return NextResponse.json({
        ok: true,
        message: "You're already unsubscribed.",
      });
    }

    await db.newsletterSubscriber.update({
      where: { email: target },
      data: { active: false },
    });

    return NextResponse.json({
      ok: true,
      message: "You've been unsubscribed. We're sorry to see you go.",
    });
  } catch (err) {
    console.error("[newsletter] unsubscribe error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}

// GET /api/newsletter/unsubscribe?email=... — convenience for email link clicks
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.redirect(new URL("/?unsubscribed=invalid", url.origin));
  }

  try {
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing?.active) {
      await db.newsletterSubscriber.update({
        where: { email },
        data: { active: false },
      });
    }
    return NextResponse.redirect(new URL("/?unsubscribed=success", url.origin));
  } catch (err) {
    console.error("[newsletter] unsubscribe GET error", err);
    return NextResponse.redirect(new URL("/?unsubscribed=error", url.origin));
  }
}
