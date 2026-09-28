"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
  BookOpen,
  PenLine,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { HeartbeatLine } from "@/components/heartbeat-line";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  readMinutes: number;
  publishedAt: string;
  isFallback?: boolean;
}

const categoryTones: Record<string, string> = {
  "On Writing": "bg-violet/15 text-violet",
  "Medical School": "bg-sky/25 text-sky-700",
  "On Medicine": "bg-emerald-500/15 text-emerald-600",
  Update: "bg-amber-500/15 text-amber-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog?limit=6", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.ok && Array.isArray(d.posts)) setPosts(d.posts);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-sky/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="From the Author"
          title="Notes & Reflections"
          subtitle="Occasional writing from Dr. Wright — on medicine, memoir, and the long art of listening."
        />

        {loading ? (
          <div className="mt-14 flex items-center justify-center gap-3 text-navy/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading posts…
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-violet/10 bg-mist p-10 text-center">
            <p className="font-serif text-lg text-navy/70">
              No posts yet. Join the newsletter to be the first to read new
              reflections.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const tone =
                categoryTones[post.category] ?? categoryTones["Update"];
              return (
                <ScrollReveal key={post.id} delay={i * 0.06} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-violet/10 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-violet/25 hover:shadow-soft-lg">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="absolute inset-0 z-10"
                      aria-label={`Read: ${post.title}`}
                    />
                    {/* category + read time */}
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone}`}
                      >
                        {post.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-navy/50">
                        <Clock className="h-3 w-3" />
                        {post.readMinutes} min
                      </span>
                    </div>

                    {/* title */}
                    <h3 className="mt-4 font-display text-2xl leading-tight tracking-wide text-navy transition-colors group-hover:text-violet">
                      {post.title}
                    </h3>

                    {/* excerpt */}
                    <p className="mt-3 flex-1 font-serif text-[15px] leading-relaxed text-navy/70">
                      {post.excerpt}
                    </p>

                    {/* footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-violet/10 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-navy/50">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet">
                        Read
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <HeartbeatLine
            className="h-8 max-w-md opacity-50"
            color="#5b2a86"
            width={1.5}
          />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-violet px-6 py-2.5 text-sm font-semibold text-white shadow-violet-glow transition-colors hover:bg-violet-dark"
            >
              <BookOpen className="h-4 w-4" />
              View All Posts
            </Link>
            <a
              href="#newsletter"
              className="inline-flex items-center gap-2 rounded-full border border-violet/30 px-6 py-2.5 text-sm font-semibold text-violet transition-colors hover:bg-violet/5"
            >
              <PenLine className="h-4 w-4" />
              Get New Posts by Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
