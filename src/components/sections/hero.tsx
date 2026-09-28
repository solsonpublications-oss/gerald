"use client";

import { motion } from "framer-motion";
import { BookOpen, Play, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { ShareButton } from "@/components/share-button";

const stats = [
  { value: "40+", label: "Years in Medicine" },
  { value: "#1", label: "New Memoir Release" },
  { value: "5★", label: "Reader Rating" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-sky-gradient pt-24 md:pt-28"
    >
      {/* Background imagery + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-stethoscope.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        {/* Floating soft blobs */}
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
      </div>

      {/* Top EKG watermark */}
      <HeartbeatLine
        className="pointer-events-none absolute left-0 right-0 top-24 h-20 opacity-30"
        color="rgba(255,255,255,0.85)"
        width={2}
        glow
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:pb-32 lg:pt-16">
        {/* Left: copy */}
        <div className="relative z-10 text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            A New Medical Memoir
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-6xl leading-[0.92] tracking-wide text-white text-shadow-glow sm:text-7xl md:text-8xl"
          >
            Rounds of a
            <span className="block bg-gradient-to-r from-white via-white to-sky-soft bg-clip-text text-transparent">
              Lifetime
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 max-w-xl font-serif text-lg italic leading-relaxed text-white/90 sm:text-xl lg:mx-0"
          >
            A deeply personal memoir by{" "}
            <span className="font-semibold not-italic text-white">
              Robert Y. Wright, MD
            </span>{" "}
            — from a childhood of struggle to a life devoted to medicine.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
          >
            <a
              href="#where-to-buy"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet px-7 py-3.5 text-base font-semibold text-white shadow-violet-glow transition-all hover:-translate-y-0.5 hover:bg-violet-dark hover:shadow-[0_22px_60px_-12px_rgba(91,42,134,0.6)] sm:w-auto"
            >
              <ShoppingBag className="h-5 w-5" />
              Buy the Book Now
            </a>
            <a
              href="#excerpt"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20 sm:w-auto"
            >
              <BookOpen className="h-5 w-5" />
              Read an Excerpt
            </a>
            <a
              href="#trailer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-base font-semibold text-white/90 transition-colors hover:text-white sm:w-auto"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/10 transition-transform group-hover:scale-110">
                <Play className="h-4 w-4 fill-current" />
              </span>
              Watch the Trailer
            </a>
          </motion.div>

          {/* Rating row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start"
          >
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              ))}
              <span className="ml-1 text-sm font-medium text-white/90">
                4.9 / 5 from early readers
              </span>
            </div>
            <span className="hidden h-4 w-px bg-white/30 sm:block" />
            <ShareButton variant="light" label="Share" />
          </motion.div>
        </div>

        {/* Right: book cover with 3D effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex max-w-md items-center justify-center"
        >
          <div className="animate-float-slow [perspective:1600px]">
            <div className="book-3d relative">
              {/* Spine */}
              <div className="book-spine absolute left-0 top-0 h-full w-[36px] bg-gradient-to-r from-violet-dark to-violet" />
              {/* Cover */}
              <div className="relative aspect-[2/3] w-64 overflow-hidden rounded-r-lg rounded-l-sm border border-white/20 shadow-soft-lg sm:w-72 md:w-80">
                <Image
                  src="/images/book-front-cover.jpg"
                  alt="Front cover of 'Rounds of a Lifetime' showing a purple stethoscope on a white medical coat against a blue background"
                  fill
                  priority
                  sizes="(min-width: 1024px) 320px, 256px"
                  className="object-cover"
                />
                {/* gloss */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/15" />
              </div>
              {/* Page edges */}
              <div className="absolute -right-1 top-1 bottom-1 w-2 rounded-r-sm bg-gradient-to-r from-white/80 to-white/40" />
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-2 -top-4 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-violet text-center text-white shadow-violet-glow sm:h-24 sm:w-24"
          >
            <span className="font-display text-2xl leading-none sm:text-3xl">NEW</span>
            <span className="text-[9px] font-semibold uppercase tracking-widest sm:text-[10px]">
              Release
            </span>
          </motion.div>

          {/* Floating quote chip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-6 -left-2 max-w-[15rem] rounded-2xl border border-white/40 bg-white/85 p-3 text-left shadow-soft backdrop-blur-xl sm:-left-8"
          >
            <p className="font-serif text-xs italic leading-snug text-navy">
              “A calling discovered not in triumph, but in survival.”
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-violet">
              — Early Review
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="relative border-t border-white/20 bg-violet/20 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/20 px-4 sm:px-6 lg:px-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center gap-0.5 py-5 text-center"
            >
              <span className="font-display text-3xl text-white sm:text-4xl">
                {s.value}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-xs">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom EKG transition into next section */}
      <div className="relative -mb-px">
        <HeartbeatLine
          className="h-16 w-full text-violet"
          color="#5b2a86"
          width={2.5}
        />
      </div>
    </section>
  );
}
