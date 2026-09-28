import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

// POST /api/admin/reviews/approve?id=... — approve or unapprove a review
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const body = await req.json().catch(() => ({}));
    const approved = body?.approved !== false; // default true
    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const review = await db.review.update({
      where: { id },
      data: { approved },
    });
    return NextResponse.json({ ok: true, review });
  } catch (err) {
    console.error("[admin/reviews/approve] error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
