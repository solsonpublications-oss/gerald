import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://roundsofalifetime.com";
  const now = new Date();

  const sections = [
    "",
    "/blog",
    "#about-the-book",
    "#about-the-author",
    "#themes",
    "#reviews",
    "#excerpt",
    "#trailer",
    "#where-to-buy",
    "#events",
    "#reading-guide",
    "#faq",
    "#newsletter",
    "#contact",
  ];

  const sectionEntries: MetadataRoute.Sitemap = sections.map((path) => ({
    url: path.startsWith("/") ? `${base}${path}` : `${base}/${path}`,
    lastModified: now,
    changeFrequency:
      path === "" ? ("weekly" as const) : path === "/blog" ? ("daily" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/blog" ? 0.9 : path === "#where-to-buy" ? 0.9 : 0.7,
  }));

  // Add published blog post permalinks
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });
    postEntries = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.publishedAt ?? p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* ignore DB errors in sitemap */
  }

  return [...sectionEntries, ...postEntries];
}
