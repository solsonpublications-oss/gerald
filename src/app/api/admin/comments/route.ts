import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

// GET /api/admin/comments — list all comments (pending first)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const comments = await db.comment.findMany({
      orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
      take: 100,
    });
    return NextResponse.json({
      ok: true,
      comments: comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[admin/comments] list error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/admin/comments?id=...
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
    await db.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/comments] delete error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
