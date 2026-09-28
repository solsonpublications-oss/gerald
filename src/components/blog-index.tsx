"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  BookOpen,
  Search,
  X,
  Rss,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/footer";
import { BackToTop } from "@/components/back-to-top";
import { HeartbeatLine } from "@/components/heartbeat-line";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
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
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog?limit=20", { cache: "no-store" })
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

  // derive the list of categories from the posts
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  // filtered posts by search query + active category
  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.body?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, activeCategory]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#16212c]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pt-24">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-sky-gradient py-16 text-white md:py-20">
          <div className="absolute inset-0 -z-10 bg-hero-overlay opacity-90" />
          <div className="absolute inset-0 -z-10 bg-grid-soft opacity-30" />
          <HeartbeatLine
            className="pointer-events-none absolute left-0 right-0 top-12 h-16 opacity-30"
            color="rgba(255,255,255,0.85)"
            glow
          />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
              <BookOpen className="h-3.5 w-3.5" />
              From the Author
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-wide text-shadow-glow sm:text-6xl md:text-7xl">
              Notes & Reflections
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-serif text-base leading-relaxed text-white/90 sm:text-lg">
              Occasional writing from Robert Y. Wright, MD — on medicine, memoir,
              and the long art of listening.
            </p>
            <a
              href="/blog/rss"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <Rss className="h-3.5 w-3.5" />
              RSS Feed
            </a>
          </div>
        </section>

        {/* Posts list */}
        <section className="bg-white py-16 dark:bg-[#16212c] md:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/#blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet transition-colors hover:text-violet-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>

            {/* Search + category filter */}
            {!loading && posts.length > 0 && (
              <div className="mb-8 space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts…"
                    className="w-full rounded-full border border-violet/20 bg-white py-2.5 pl-10 pr-10 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20 dark:bg-[#1e2a38] dark:text-white dark:placeholder:text-white/40"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-navy/40 hover:bg-mist hover:text-violet dark:hover:bg-white/10"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        activeCategory === cat
                          ? "bg-violet text-white shadow-violet-glow"
                          : "border border-violet/20 bg-white text-navy/70 hover:bg-violet/5 hover:text-violet dark:bg-[#1e2a38] dark:text-white/70"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-navy/60 dark:text-white/60">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading posts…
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-lg text-navy/60 dark:text-white/60">
                  {posts.length === 0
                    ? "No posts yet. Check back soon."
                    : "No posts match your search."}
                </p>
                {(query || activeCategory !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                    }}
                    className="mt-3 text-sm font-semibold text-violet hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {filteredPosts.map((post, i) => {
                  const tone =
                    categoryTones[post.category] ?? categoryTones["Update"];
                  return (
                    <article
                      key={post.id}
                      className="group border-b border-violet/10 pb-8 last:border-b-0"
                    >
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone}`}
                          >
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-navy/50 dark:text-white/50">
                            <Clock className="h-3 w-3" />
                            {post.readMinutes} min read
                          </span>
                        </div>
                        <h2 className="mt-3 font-display text-3xl leading-tight tracking-wide text-navy transition-colors group-hover:text-violet dark:text-white sm:text-4xl">
                          {post.title}
                        </h2>
                        <p className="mt-3 font-serif text-base leading-relaxed text-navy/70 dark:text-white/70">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-xs text-navy/50 dark:text-white/50">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-violet">
                            Read post
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
