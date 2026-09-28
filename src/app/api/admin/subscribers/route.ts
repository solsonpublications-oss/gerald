import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

// GET /api/admin/subscribers — list subscribers with search + pagination
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get("pageSize") ?? 20)));

    const where = q
      ? {
          OR: [
            { email: { contains: q } },
            { name: { contains: q } },
          ],
        }
      : {};

    const [subscribers, total] = await Promise.all([
      db.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.newsletterSubscriber.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      subscribers,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error("[admin/subscribers] error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/admin/subscribers?id=...
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
    await db.newsletterSubscriber.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/subscribers] delete error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
