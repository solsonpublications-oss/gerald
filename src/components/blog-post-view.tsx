"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/footer";
import { BackToTop } from "@/components/back-to-top";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { CommentsSection } from "@/components/comments-section";
import { ReadingProgress } from "@/components/reading-progress";

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

export function BlogPostView({ post }: { post: Post }) {
  // Esc to go back to blog index
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        window.location.href = "/blog";
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tone = categoryTones[post.category] ?? categoryTones["Update"];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#16212c]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <ReadingProgress />
      <main id="main-content" className="flex-1 pt-24">
        <article className="bg-white py-12 dark:bg-[#16212c] md:py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-violet transition-colors hover:text-violet-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              All posts
            </Link>

            {/* header */}
            <div className="flex flex-wrap items-center gap-3">
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

            <h1 className="mt-4 font-display text-4xl leading-tight tracking-wide text-navy dark:text-white sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-navy/60 dark:text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-violet" />
                {post.author}
              </span>
              <span className="h-3 w-px bg-navy/20 dark:bg-white/20" />
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt)}
              </span>
            </div>

            <HeartbeatLine
              className="mt-6 h-6 w-full opacity-40"
              color="#5b2a86"
              width={1.5}
            />

            {/* body */}
            <div className="mt-6 space-y-5">
              {post.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className={`font-serif text-[17px] leading-[1.85] text-navy/85 dark:text-white/85 ${
                    i === 0
                      ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-violet"
                      : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* closer */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <HeartbeatLine
                className="h-5 w-32 opacity-50"
                color="#5b2a86"
                width={1.5}
              />
              <span className="font-display text-lg text-violet">❧</span>
              <HeartbeatLine
                className="h-5 w-32 opacity-50"
                color="#5b2a86"
                width={1.5}
              />
            </div>

            {/* Comments */}
            <CommentsSection postSlug={post.slug} />

            {/* footer nav */}
            <div className="mt-10 flex flex-col gap-3 border-t border-violet/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-serif text-sm italic text-navy/60 dark:text-white/60">
                Press <kbd className="rounded border border-violet/20 bg-mist px-1.5 py-0.5 font-mono text-xs text-violet">Esc</kbd> to return to all posts.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet transition-colors hover:text-violet-dark"
              >
                Back to notes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
