import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/blog/comments?postSlug=... — list approved comments for a post
// Returns a flat list; replies have parentCommentId set for client-side threading.
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postSlug = url.searchParams.get("postSlug");
    if (!postSlug) {
      return NextResponse.json(
        { ok: false, error: "postSlug is required" },
        { status: 400 }
      );
    }
    const comments = await db.comment.findMany({
      where: { postSlug, approved: true },
      orderBy: { createdAt: "asc" },
      take: 200,
    });
    return NextResponse.json({
      ok: true,
      comments: comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[blog/comments] list error", err);
    return NextResponse.json({ ok: true, comments: [] });
  }
}

// POST /api/blog/comments — submit a comment (pending approval)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const postSlug =
      typeof body?.postSlug === "string" ? body.postSlug.trim() : "";
    const name =
      typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
    const text =
      typeof body?.body === "string" ? body.body.trim().slice(0, 1000) : "";
    const parentCommentId =
      typeof body?.parentCommentId === "string" && body.parentCommentId.trim()
        ? body.parentCommentId.trim()
        : null;

    if (!postSlug || !name || !text) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide your name and a comment.",
        },
        { status: 400 }
      );
    }
    if (text.length < 3) {
      return NextResponse.json(
        { ok: false, error: "Comment is too short." },
        { status: 400 }
      );
    }

    // If replying, verify the parent comment exists
    if (parentCommentId) {
      const parent = await db.comment.findUnique({
        where: { id: parentCommentId },
      });
      if (!parent) {
        return NextResponse.json(
          { ok: false, error: "Parent comment not found." },
          { status: 400 }
        );
      }
    }

    const comment = await db.comment.create({
      data: { postSlug, name, body: text, approved: false, parentCommentId },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Thank you! Your comment will appear once approved by Dr. Wright's team.",
      id: comment.id,
    });
  } catch (err) {
    console.error("[blog/comments] submit error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}
