import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

// GET /api/admin/events — list all events (incl. inactive, for admin)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const events = await db.event.findMany({
      orderBy: { date: "asc" },
      take: 100,
    });
    return NextResponse.json({
      ok: true,
      events: events.map((e) => ({
        ...e,
        date: e.date.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[admin/events] list error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// POST /api/admin/events — create a new event
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim().slice(0, 200) : "";
    const type =
      typeof body?.type === "string" && body.type.trim()
        ? body.type.trim().slice(0, 60)
        : "Book Signing";
    const dateStr = typeof body?.date === "string" ? body.date.trim() : "";
    const time =
      typeof body?.time === "string" && body.time.trim()
        ? body.time.trim().slice(0, 40)
        : "7:00 PM";
    const city = typeof body?.city === "string" ? body.city.trim().slice(0, 120) : "";
    const venue = typeof body?.venue === "string" ? body.venue.trim().slice(0, 200) : "";
    const description =
      typeof body?.description === "string" ? body.description.trim().slice(0, 1000) : "";
    const ticketUrl =
      typeof body?.ticketUrl === "string" ? body.ticketUrl.trim().slice(0, 500) : "";
    const capacity =
      typeof body?.capacity === "number" && body.capacity >= 0
        ? Math.min(100000, Math.round(body.capacity))
        : 0;
    const soldOut = !!body?.soldOut;
    const active = body?.active !== false; // default true

    if (!title || !dateStr || !city || !venue) {
      return NextResponse.json(
        { ok: false, error: "Title, date, city, and venue are required." },
        { status: 400 }
      );
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Invalid date." },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        title,
        type,
        date,
        time,
        city,
        venue,
        description,
        ticketUrl,
        capacity,
        soldOut,
        active,
      },
    });

    return NextResponse.json({
      ok: true,
      event: { ...event, date: event.date.toISOString() },
    });
  } catch (err) {
    console.error("[admin/events] create error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/events?id=... — update an event
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const body = await req.json().catch(() => ({}));
    const data: Record<string, unknown> = {};
    if (typeof body.title === "string") data.title = body.title.trim().slice(0, 200);
    if (typeof body.type === "string") data.type = body.type.trim().slice(0, 60);
    if (typeof body.date === "string" && body.date.trim()) {
      const d = new Date(body.date);
      if (!isNaN(d.getTime())) data.date = d;
    }
    if (typeof body.time === "string") data.time = body.time.trim().slice(0, 40);
    if (typeof body.city === "string") data.city = body.city.trim().slice(0, 120);
    if (typeof body.venue === "string") data.venue = body.venue.trim().slice(0, 200);
    if (typeof body.description === "string") data.description = body.description.trim().slice(0, 1000);
    if (typeof body.ticketUrl === "string") data.ticketUrl = body.ticketUrl.trim().slice(0, 500);
    if (typeof body.capacity === "number") data.capacity = Math.max(0, Math.min(100000, Math.round(body.capacity)));
    if (typeof body.soldOut === "boolean") data.soldOut = body.soldOut;
    if (typeof body.active === "boolean") data.active = body.active;

    const event = await db.event.update({ where: { id }, data });
    return NextResponse.json({
      ok: true,
      event: { ...event, date: event.date.toISOString() },
    });
  } catch (err) {
    console.error("[admin/events] patch error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/admin/events?id=...
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    await db.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/events] delete error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
