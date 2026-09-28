import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/blog/comments/react?commentId=...&fingerprint=...
// Returns the count of reactions for a comment + whether this fingerprint has reacted
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    const fingerprint = url.searchParams.get("fingerprint");

    if (!commentId) {
      return NextResponse.json(
        { ok: false, error: "commentId is required" },
        { status: 400 }
      );
    }

    const reactions = await db.reaction.findMany({
      where: { commentId },
    });
    const count = reactions.length;
    const hasReacted = fingerprint
      ? reactions.some((r) => r.fingerprint === fingerprint)
      : false;

    return NextResponse.json({ ok: true, count, hasReacted });
  } catch (err) {
    console.error("[blog/comments/react] GET error", err);
    return NextResponse.json({ ok: true, count: 0, hasReacted: false });
  }
}

// POST /api/blog/comments/react — toggle a reaction (like) on a comment
// Uses a fingerprint (anonymous, browser-generated) to prevent duplicates.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const commentId =
      typeof body?.commentId === "string" ? body.commentId.trim() : "";
    const fingerprint =
      typeof body?.fingerprint === "string"
        ? body.fingerprint.trim().slice(0, 120)
        : "";
    const type =
      typeof body?.type === "string" && body.type.trim()
        ? body.type.trim().slice(0, 30)
        : "like";

    if (!commentId || !fingerprint) {
      return NextResponse.json(
        { ok: false, error: "commentId and fingerprint are required." },
        { status: 400 }
      );
    }

    // Verify the comment exists
    const comment = await db.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return NextResponse.json(
        { ok: false, error: "Comment not found." },
        { status: 404 }
      );
    }

    // Toggle: if a reaction exists for this (commentId, fingerprint, type), delete it; otherwise create it
    const existing = await db.reaction.findUnique({
      where: {
        commentId_fingerprint_type: { commentId, fingerprint, type },
      },
    });

    if (existing) {
      await db.reaction.delete({ where: { id: existing.id } });
      const count = await db.reaction.count({ where: { commentId } });
      return NextResponse.json({
        ok: true,
        action: "removed",
        count,
        hasReacted: false,
      });
    }

    await db.reaction.create({
      data: { commentId, fingerprint, type },
    });
    const count = await db.reaction.count({ where: { commentId } });
    return NextResponse.json({
      ok: true,
      action: "added",
      count,
      hasReacted: true,
    });
  } catch (err) {
    console.error("[blog/comments/react] POST error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
