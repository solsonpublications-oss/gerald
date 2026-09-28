"use client";

import Image from "next/image";
import { Quote, ShoppingBag, HeartPulse } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { HeartbeatLine } from "@/components/heartbeat-line";

export function AboutTheBook() {
  return (
    <section
      id="about-the-book"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      {/* soft backdrop accents */}
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Story"
          title="A Memoir of Survival, Healing & Calling"
          subtitle="From a painful childhood to the high-stakes world of medicine — one doctor's journey to discover that healing others was, first, how he healed himself."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left: back cover image card */}
          <ScrollReveal className="relative">
            <div className="relative mx-auto max-w-sm">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-violet/10 shadow-soft-lg">
                <Image
                  src="/images/book-back-cover.jpg"
                  alt="Back cover of 'Rounds of a Lifetime' featuring a sepia childhood portrait of the author and a heartbeat line"
                  fill
                  sizes="(min-width: 1024px) 400px, 80vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
              </div>

              {/* Floating spec card */}
              <div className="absolute -bottom-6 -right-4 w-44 rounded-2xl border border-violet/10 bg-white/95 p-4 shadow-soft backdrop-blur sm:-right-8">
                <div className="flex items-center gap-2 text-violet">
                  <HeartPulse className="h-5 w-5" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                    Hardcover
                  </span>
                </div>
                <p className="mt-1.5 font-display text-2xl text-navy">
                  Memoir
                </p>
                <p className="mt-1 text-xs text-navy/60">
                  ISBN 978-929-167-7346
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: copy */}
          <ScrollReveal delay={0.1} className="space-y-5">
            <p className="font-serif text-lg leading-relaxed text-navy/85">
              <span className="font-display text-5xl float-left mr-2 leading-none text-violet">
                R
              </span>
              ounds of a Lifetime is a deeply personal and emotionally charged
              memoir by Robert Y. Wright, MD — a vivid account of a life's
              journey from a childhood filled with physical and emotional
              challenges, through transformative years in medical school, and
              finally into the high-stakes world of medicine.
            </p>
            <p className="font-serif text-lg leading-relaxed text-navy/85">
              As Dr. Wright navigates the complexities of growing up with a
              challenging medical history, the pain of bullying, and the
              relentless pressures of academics, he discovers his path to
              medicine wasn't just a career choice — it was{" "}
              <span className="rounded-md bg-violet/10 px-1.5 font-semibold text-violet">
                a call for survival
              </span>
              .
            </p>
            <p className="font-serif text-lg leading-relaxed text-navy/85">
              Equal parts vulnerability and resolve, this is the story of a boy
              told he'd never measure up — and the physician he became when he
              refused to stop trying.
            </p>

            {/* Pull quote */}
            <div className="relative mt-6 rounded-2xl border border-violet/15 bg-mist p-6">
              <Quote className="absolute -top-3 left-5 h-7 w-7 rotate-180 fill-violet text-violet" />
              <p className="font-serif text-base italic leading-relaxed text-navy/90">
                “A calling discovered not in triumph, but in survival — every
                round, every patient, every scar a verse in the poetry of a life
                in medicine.”
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet">
                — From the Prologue
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#where-to-buy"
                className="inline-flex items-center gap-2 rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white shadow-violet-glow transition-all hover:-translate-y-0.5 hover:bg-violet-dark"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy Now on Amazon
              </a>
              <a
                href="#excerpt"
                className="inline-flex items-center gap-2 rounded-full border border-violet/30 px-6 py-3 text-sm font-semibold text-violet transition-colors hover:bg-violet/5"
              >
                Read an Excerpt
              </a>
            </div>
          </ScrollReveal>
        </div>

        <HeartbeatLine
          className="mx-auto mt-16 h-10 max-w-5xl opacity-60"
          color="#5b2a86"
          width={1.5}
        />
      </div>
    </section>
  );
}
