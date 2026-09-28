import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

// GET /api/admin/rsvps — list all RSVPs (optionally filtered by ?eventId=)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const where = eventId ? { eventId } : {};
    const rsvps = await db.rsvp.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ ok: true, rsvps });
  } catch (err) {
    console.error("[admin/rsvps] error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/admin/rsvps?id=...
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
    await db.rsvp.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/rsvps] delete error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
