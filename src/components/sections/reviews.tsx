"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Star,
  Quote,
  Loader2,
  PenLine,
  CheckCircle2,
  X,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  isFallback?: boolean;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Reviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // submit-form state
  const [form, setForm] = useState({ name: "", role: "", email: "", quote: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.ok && Array.isArray(d.reviews)) setReviews(d.reviews);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  function set<K extends keyof typeof form>(key: K, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting || done) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: "Couldn't submit review",
          description: data?.error ?? "Please try again shortly.",
          variant: "destructive",
        });
        return;
      }
      setDone(true);
      toast({
        title: "Review submitted!",
        description: data.message,
      });
      setForm({ name: "", role: "", email: "", quote: "", rating: 5 });
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // lock body scroll when dialog open
  useEffect(() => {
    document.body.style.overflow = dialogOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialogOpen]);

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-violet-gradient py-20 text-white md:py-28"
    >
      {/* Decorative EKG watermarks */}
      <svg
        className="pointer-events-none absolute left-0 top-10 h-24 w-full text-white/10"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 60 L220 60 L260 60 L285 30 L310 92 L335 22 L360 104 L385 48 L410 60 L520 60 L560 60 L585 18 L610 102 L635 36 L660 86 L685 60 L780 60 L820 60 L845 30 L870 92 L895 22 L920 104 L945 48 L970 60 L1200 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-10 left-0 h-24 w-full rotate-180 text-white/10"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 60 L220 60 L260 60 L285 30 L310 92 L335 22 L360 104 L385 48 L410 60 L520 60 L560 60 L585 18 L610 102 L635 36 L660 86 L685 60 L780 60 L820 60 L845 30 L870 92 L895 22 L920 104 L945 48 L970 60 L1200 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Early Praise"
          title="What Readers Are Saying"
          subtitle="A memoir that is already moving readers — physicians, students, and storytellers alike."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full flex items-center justify-center gap-3 py-12 text-white/80">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading reviews…
            </div>
          ) : (
            reviews.map((r, i) => (
              <ScrollReveal key={r.id ?? i} delay={i * 0.06} className="h-full">
                <figure className="group relative flex h-full flex-col rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 sm:p-8">
                  <Quote className="h-9 w-9 fill-white/80 text-white/80" />
                  <div className="mt-3 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= r.rating
                            ? "fill-yellow-300 text-yellow-300"
                            : "fill-white/20 text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 font-serif text-[15px] italic leading-relaxed text-white/95">
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/15 pt-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 font-display text-base tracking-wide text-white">
                      {getInitials(r.name)}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-semibold text-white">{r.name}</span>
                      <span className="text-xs text-white/70">{r.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))
          )}
        </div>

        {/* Share your review CTA */}
        <ScrollReveal className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="font-serif text-sm italic text-white/80">
            Have you read the memoir? Share what it meant to you.
          </p>
          <button
            type="button"
            onClick={() => {
              setDialogOpen(true);
              setDone(false);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/90"
          >
            <PenLine className="h-4 w-4" />
            Write a Review
          </button>
        </ScrollReveal>
      </div>

      {/* Review dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Write a review"
        >
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => setDialogOpen(false)}
            className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-violet/15 bg-white p-6 shadow-soft-lg dark:bg-[#1e2a38] sm:p-8">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-mist dark:text-white/50 dark:hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <div>
                  <p className="font-display text-3xl tracking-wide text-navy dark:text-white">
                    Thank You
                  </p>
                  <p className="mt-1 font-serif text-sm text-navy/70 dark:text-white/70">
                    Your review has been submitted and will appear here once
                    approved by Dr. Wright's team.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="mt-2 rounded-full bg-violet px-6 py-2.5 text-sm font-semibold text-white shadow-violet-glow hover:bg-violet-dark"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
                    <PenLine className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl tracking-wide text-navy dark:text-white">
                      Write a Review
                    </h3>
                    <p className="text-xs text-navy/60 dark:text-white/60">
                      Share your thoughts with fellow readers.
                    </p>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                        Your Name *
                      </label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                        Role / Title
                      </label>
                      <Input
                        value={form.role}
                        onChange={(e) => set("role", e.target.value)}
                        placeholder="Reader, Medical Student, etc."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => set("rating", s)}
                          aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              s <= form.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-navy/10 text-navy/20 dark:fill-white/10 dark:text-white/20"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-medium text-navy/70 dark:text-white/70">
                        {form.rating} / 5
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                      Your Review *
                    </label>
                    <Textarea
                      required
                      rows={4}
                      value={form.quote}
                      onChange={(e) => set("quote", e.target.value)}
                      placeholder="What did this memoir mean to you?"
                      className="resize-none"
                    />
                    <p className="text-right text-[11px] text-navy/40 dark:text-white/40">
                      {form.quote.length} / 1000
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                      Email <span className="opacity-50">(optional, for verification)</span>
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PenLine className="mr-2 h-4 w-4" />
                    )}
                    {submitting ? "Submitting…" : "Submit Review"}
                  </Button>
                  <p className="text-center text-xs text-navy/50 dark:text-white/50">
                    Reviews are moderated and appear once approved.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
