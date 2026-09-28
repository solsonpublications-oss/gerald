import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/app/api/admin/stats/route";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// GET /api/admin/blog — list all blog posts (including unpublished)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const posts = await db.blogPost.findMany({
      orderBy: [{ published: "asc" }, { createdAt: "desc" }],
      take: 100,
    });
    return NextResponse.json({
      ok: true,
      posts: posts.map((p) => ({
        ...p,
        publishedAt: p.publishedAt?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    console.error("[admin/blog] list error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// POST /api/admin/blog — create a new blog post
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim().slice(0, 200) : "";
    const excerpt =
      typeof body?.excerpt === "string" ? body.excerpt.trim().slice(0, 500) : "";
    const bodyText = typeof body?.body === "string" ? body.body.slice(0, 50000) : "";
    const category =
      typeof body?.category === "string" && body.category.trim()
        ? body.category.trim().slice(0, 60)
        : "Update";
    const readMinutes =
      typeof body?.readMinutes === "number" && body.readMinutes > 0
        ? Math.min(60, Math.round(body.readMinutes))
        : 3;
    const published = !!body?.published;
    const featured = !!body?.featured;

    if (!title || !excerpt || !bodyText) {
      return NextResponse.json(
        { ok: false, error: "Title, excerpt, and body are required." },
        { status: 400 }
      );
    }

    // generate a unique slug
    let slug = slugify(body?.slug && typeof body.slug === "string" ? body.slug : title);
    if (!slug) slug = `post-${Date.now()}`;
    let suffix = 0;
    while (await db.blogPost.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${slugify(title)}-${suffix}`;
    }

    const post = await db.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        body: bodyText,
        category,
        readMinutes,
        published,
        featured,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json({
      ok: true,
      post: { ...post, publishedAt: post.publishedAt?.toISOString() ?? null },
    });
  } catch (err) {
    console.error("[admin/blog] create error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/blog?id=... — update an existing post
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const body = await req.json().catch(() => ({}));
    const data: Record<string, unknown> = {};
    if (typeof body.title === "string") data.title = body.title.trim().slice(0, 200);
    if (typeof body.excerpt === "string") data.excerpt = body.excerpt.trim().slice(0, 500);
    if (typeof body.body === "string") data.body = body.body.slice(0, 50000);
    if (typeof body.category === "string") data.category = body.category.trim().slice(0, 60);
    if (typeof body.readMinutes === "number") data.readMinutes = Math.min(60, Math.round(body.readMinutes));
    if (typeof body.slug === "string" && body.slug.trim()) {
      const newSlug = slugify(body.slug);
      if (newSlug) {
        const existing = await db.blogPost.findUnique({ where: { slug: newSlug } });
        if (existing && existing.id !== id) {
          return NextResponse.json(
            { ok: false, error: "Slug already in use." },
            { status: 400 }
          );
        }
        data.slug = newSlug;
      }
    }
    if (typeof body.published === "boolean") {
      data.published = body.published;
      if (body.published) {
        const current = await db.blogPost.findUnique({ where: { id } });
        if (current && !current.publishedAt) data.publishedAt = new Date();
      }
    }
    if (typeof body.featured === "boolean") data.featured = body.featured;

    const post = await db.blogPost.update({ where: { id }, data });
    return NextResponse.json({
      ok: true,
      post: { ...post, publishedAt: post.publishedAt?.toISOString() ?? null },
    });
  } catch (err) {
    console.error("[admin/blog] patch error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

// DELETE /api/admin/blog?id=...
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
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/blog] delete error", err);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
