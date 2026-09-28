import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET /api/events/rsvp?eventId=... — return attendee count for an event
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId")?.trim();
    if (!eventId) {
      return NextResponse.json(
        { ok: false, error: "eventId is required." },
        { status: 400 }
      );
    }
    const rsvps = await db.rsvp.findMany({ where: { eventId } });
    const count = rsvps.reduce((sum, r) => sum + r.count, 0);
    return NextResponse.json({
      ok: true,
      eventId,
      count,
      attendees: rsvps.length,
    });
  } catch (err) {
    console.error("[rsvp] count error", err);
    return NextResponse.json({ ok: true, count: 0, attendees: 0 });
  }
}

// POST /api/events/rsvp — create or update an RSVP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const eventId =
      typeof body?.eventId === "string" ? body.eventId.trim() : "";
    const name =
      typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const count =
      typeof body?.count === "number" && body.count >= 1 && body.count <= 10
        ? Math.round(body.count)
        : 1;

    if (!eventId || !name || !email) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide your name, email, and the event.",
        },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Look up the event capacity (DB event or fallback)
    let capacity = 0; // 0 = unlimited
    const dbEvent = await db.event.findUnique({ where: { id: eventId } });
    if (dbEvent) {
      capacity = dbEvent.capacity ?? 0;
    } else {
      // fallback events: derive capacity from the events API fallback list
      try {
        const eventsRes = await fetch(
          new URL("/api/events", req.url).toString(),
          { cache: "no-store" }
        );
        const eventsData = await eventsRes.json();
        const fb = (eventsData.events ?? []).find(
          (e: { id: string }) => e.id === eventId
        );
        if (fb) capacity = fb.capacity ?? 0;
      } catch {
        /* ignore — treat as unlimited */
      }
    }

    // existing RSVP for this email (for upsert delta calculation)
    const existing = await db.rsvp.findUnique({
      where: { eventId_email: { eventId, email } },
    });
    const existingCount = existing?.count ?? 0;

    // total count EXCLUDING this email's current RSVP
    const others = await db.rsvp.findMany({ where: { eventId } });
    const otherTotal = others
      .filter((r) => r.email !== email)
      .reduce((sum, r) => sum + r.count, 0);

    // enforce capacity (0 = unlimited)
    if (capacity > 0 && otherTotal + count > capacity) {
      const remaining = Math.max(0, capacity - otherTotal);
      return NextResponse.json(
        {
          ok: false,
          error:
            remaining > 0
              ? `Only ${remaining} seat${remaining === 1 ? "" : "s"} left for this event.`
              : "This event is at full capacity. Please join the waitlist.",
          capacity,
          remaining,
        },
        { status: 409 }
      );
    }

    // upsert by (eventId, email) unique constraint
    const rsvp = await db.rsvp.upsert({
      where: { eventId_email: { eventId, email } },
      update: { name, count },
      create: { eventId, name, email, count },
    });

    // total count after this RSVP
    const all = await db.rsvp.findMany({ where: { eventId } });
    const total = all.reduce((sum, r) => sum + r.count, 0);

    return NextResponse.json({
      ok: true,
      message: "You're on the list! We'll see you there.",
      rsvpId: rsvp.id,
      count: total,
      attendees: all.length,
      capacity,
    });
  } catch (err) {
    console.error("[rsvp] create error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}

// DELETE /api/events/rsvp — cancel an RSVP
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const eventId =
      typeof body?.eventId === "string" ? body.eventId.trim() : "";
    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!eventId || !email) {
      return NextResponse.json(
        { ok: false, error: "eventId and email are required." },
        { status: 400 }
      );
    }

    await db.rsvp.deleteMany({ where: { eventId, email } });

    const all = await db.rsvp.findMany({ where: { eventId } });
    const total = all.reduce((sum, r) => sum + r.count, 0);

    return NextResponse.json({
      ok: true,
      message: "Your RSVP has been cancelled.",
      count: total,
      attendees: all.length,
    });
  } catch (err) {
    console.error("[rsvp] delete error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}
