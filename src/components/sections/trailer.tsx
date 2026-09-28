"use client";

import Image from "next/image";
import { Play, Clock } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeartbeatLine } from "@/components/heartbeat-line";

export function Trailer() {
  return (
    <section
      id="trailer"
      className="relative isolate overflow-hidden bg-navy py-20 text-white md:py-28"
    >
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hospital-corridor.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/60" />
        <div className="absolute inset-0 bg-grid-soft opacity-20" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
            </span>
            Book Trailer
          </span>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-wide text-shadow-glow sm:text-5xl md:text-6xl">
            Watch the Story Come Alive
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-base leading-relaxed text-white/80 sm:text-lg">
            A 90-second glimpse into the rounds that shaped a lifetime — the
            childhood, the calling, and the medicine in between.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-12">
          <div className="group relative mx-auto aspect-video max-w-4xl cursor-pointer overflow-hidden rounded-3xl border border-white/15 shadow-soft-lg">
            <Image
              src="/images/hero-stethoscope.jpg"
              alt="Book trailer preview — a stethoscope on a white medical coat"
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-navy/40" />

            {/* Play button with pulse ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                aria-label="Play book trailer"
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-300 hover:scale-110 sm:h-24 sm:w-24"
              >
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/30" />
                <span className="absolute inset-0 rounded-full border border-white/40" />
                <Play className="h-8 w-8 fill-white text-white sm:h-10 sm:w-10" />
              </button>
            </div>

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 sm:p-6">
              <div>
                <p className="font-display text-xl tracking-wide text-white">
                  ROUNDS OF A LIFETIME — Official Trailer
                </p>
                <p className="font-serif text-sm italic text-white/70">
                  Narrated by Robert Y. Wright, MD
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
                <Clock className="h-3.5 w-3.5" />
                1:32
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-white/50">
            Trailer coming soon — subscribe to the newsletter to be notified the
            moment it premieres.
          </p>
        </ScrollReveal>

        <HeartbeatLine
          className="mx-auto mt-14 h-10 max-w-3xl opacity-40"
          color="#8fcbe8"
          width={1.5}
        />
      </div>
    </section>
  );
}
