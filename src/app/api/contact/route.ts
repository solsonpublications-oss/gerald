import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/contact — submit a contact / speaking request message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject =
      typeof body?.subject === "string" ? body.subject.trim().slice(0, 200) : "General Inquiry";
    const message =
      typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name, email, and a message." },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const record = await db.contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({
      ok: true,
      message: "Thank you for reaching out — Dr. Wright's team will be in touch.",
      id: record.id,
    });
  } catch (err) {
    console.error("[contact] submit error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}
