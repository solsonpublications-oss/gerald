import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fallbackBlogPosts } from "@/lib/blog-data";

// GET /api/blog — list published posts (DB + fallbacks) or single post by slug
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const limit = Number(url.searchParams.get("limit") ?? 12);

    // Single post by slug
    if (slug) {
      const dbPost = await db.blogPost.findUnique({
        where: { slug, published: true },
      });
      if (dbPost) {
        return NextResponse.json({
          ok: true,
          post: {
            ...dbPost,
            publishedAt: dbPost.publishedAt?.toISOString() ?? null,
            isFallback: false,
          },
        });
      }
      const fb = fallbackBlogPosts.find((p) => p.slug === slug);
      if (fb) return NextResponse.json({ ok: true, post: fb });
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const dbPosts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    const merged = [
      ...dbPosts.map((p) => ({
        ...p,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        isFallback: false,
      })),
      ...fallbackBlogPosts,
    ].slice(0, limit);

    return NextResponse.json({ ok: true, posts: merged });
  } catch (err) {
    console.error("[blog] list error", err);
    return NextResponse.json({ ok: true, posts: fallbackBlogPosts });
  }
}
