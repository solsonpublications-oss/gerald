import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fallbackBlogPosts } from "@/lib/blog-data";
import { BlogPostView } from "@/components/blog-post-view";

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch the post server-side: query Prisma directly for DB posts,
// fall back to the curated fallback posts for the default content.
async function getPost(slug: string) {
  // 1) Try the database first
  try {
    const dbPost = await db.blogPost.findUnique({
      where: { slug, published: true },
    });
    if (dbPost) {
      return {
        id: dbPost.id,
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        body: dbPost.body,
        category: dbPost.category,
        author: dbPost.author,
        readMinutes: dbPost.readMinutes,
        publishedAt: dbPost.publishedAt?.toISOString() ?? null,
        isFallback: false,
      };
    }
  } catch {
    /* ignore DB errors — fall through to fallbacks */
  }

  // 2) Fall back to curated posts
  const fb = fallbackBlogPosts.find((p) => p.slug === slug);
  return fb ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post not found · Rounds of a Lifetime" };
  }
  return {
    title: `${post.title} · Rounds of a Lifetime`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}
