import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

// GET /api/admin/reviews — list reviews with search + pagination
// Query params: status (pending|approved|all), q (search), page, pageSize
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const q = url.searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get("pageSize") ?? 20)));

    const statusFilter =
      status === "pending"
        ? { approved: false }
        : status === "approved"
          ? { approved: true }
          : {};

    const searchFilter = q
      ? {
          OR: [
            { name: { contains: q } },
            { quote: { contains: q } },
            { role: { contains: q } },
          ],
        }
      : {};

    const where = { ...statusFilter, ...searchFilter };

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      reviews,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error("[admin/reviews] list error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/admin/reviews?id=... — delete a review
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
    await db.review.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/reviews] delete error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
