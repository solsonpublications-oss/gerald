import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/newsletter — subscribe an email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : null;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Upsert: if they already subscribed, just mark active again
    const subscriber = await db.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true, name: name ?? undefined },
      create: { email, name: name ?? undefined, source: "website" },
    });

    return NextResponse.json({
      ok: true,
      message: "You're on the list! Watch your inbox for updates.",
      id: subscriber.id,
    });
  } catch (err) {
    console.error("[newsletter] subscribe error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}

// GET /api/newsletter — subscriber count (for the social proof chip)
export async function GET() {
  try {
    const count = await db.newsletterSubscriber.count({
      where: { active: true },
    });
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    console.error("[newsletter] count error", err);
    return NextResponse.json({ ok: true, count: 0 });
  }
}
