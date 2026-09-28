import { db } from "@/lib/db";
import { fallbackBlogPosts } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

// GET /blog/rss — RSS 2.0 feed of published blog posts
export async function GET() {
  const base = "https://roundsofalifetime.com";

  let posts: { title: string; slug: string; excerpt: string; body: string; publishedAt: string | null; author: string; isFallback: boolean }[] = [];

  try {
    const dbPosts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
    posts = dbPosts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      author: p.author,
      isFallback: false,
    }));
  } catch {
    /* ignore */
  }

  // Append fallbacks if there's room
  posts = [
    ...posts,
    ...fallbackBlogPosts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      publishedAt: p.publishedAt,
      author: p.author,
      isFallback: true,
    })),
  ].slice(0, 20);

  const lastBuildDate = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${base}/blog/${p.slug}`;
      const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : lastBuildDate;
      const plainBody = p.body
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const description = p.excerpt
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `    <item>
      <title>${p.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <content:encoded><![CDATA[<p>${plainBody.split("\n\n").join("</p><p>")}</p>]]></content:encoded>
      <dc:creator>${p.author}</dc:creator>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Notes &amp; Reflections — Rounds of a Lifetime</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/blog/rss" rel="self" type="application/rss+xml" />
    <description>Occasional writing from Robert Y. Wright, MD — on medicine, memoir, and the long art of listening.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <copyright>© ${new Date().getFullYear()} Robert Y. Wright, MD</copyright>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
