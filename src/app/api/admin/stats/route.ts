import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(req: Request): boolean {
  const auth = req.headers.get("authorization") ?? "";
  // Simple token check — in production use NextAuth or a proper session.
  // The token is read from the ADMIN_TOKEN env var (defaults to "demo").
  const expected = process.env.ADMIN_TOKEN ?? "demo";
  return auth === `Bearer ${expected}`;
}

export { checkAuth };

// GET /api/admin/stats — dashboard overview counts
export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const [
      subscribers,
      pendingReviews,
      approvedReviews,
      unhandledMessages,
      rsvps,
      events,
    ] = await Promise.all([
      db.newsletterSubscriber.count({ where: { active: true } }),
      db.review.count({ where: { approved: false } }),
      db.review.count({ where: { approved: true } }),
      db.contactMessage.count({ where: { handled: false } }),
      db.rsvp.count(),
      db.event.count({ where: { active: true } }),
    ]);

    const rsvpAgg = await db.rsvp.aggregate({ _sum: { count: true } });

    return NextResponse.json({
      ok: true,
      stats: {
        subscribers,
        pendingReviews,
        approvedReviews,
        unhandledMessages,
        rsvps,
        totalAttendees: rsvpAgg._sum.count ?? 0,
        events,
      },
    });
  } catch (err) {
    console.error("[admin/stats] error", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
