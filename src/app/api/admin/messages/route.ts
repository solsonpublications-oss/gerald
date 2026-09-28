import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

// GET /api/admin/messages — list contact messages with search + pagination
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
            { name: { contains: q } },
            { email: { contains: q } },
            { subject: { contains: q } },
            { message: { contains: q } },
          ],
        }
      : {};

    const [messages, total] = await Promise.all([
      db.contactMessage.findMany({
        where,
        orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.contactMessage.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      messages,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error("[admin/messages] error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// PATCH /api/admin/messages?id=... — toggle handled flag
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const body = await req.json().catch(() => ({}));
    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const message = await db.contactMessage.update({
      where: { id },
      data: { handled: body?.handled !== false },
    });
    return NextResponse.json({ ok: true, message });
  } catch (err) {
    console.error("[admin/messages] patch error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/admin/messages?id=...
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
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/messages] delete error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
