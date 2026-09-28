"use client";

import Image from "next/image";
import { ShoppingBag, BookOpen, ExternalLink, Check, Clock } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";

const retailers = [
  {
    name: "Amazon",
    desc: "Hardcover, Kindle & Audiobook",
    href: "https://www.amazon.com/Rounds-lifetime-Robert-Wright-MD/dp/B0FHBBRXCT",
    badge: "Best for Prime",
    tone: "bg-[#FF9900]/15 text-[#B87600] border-[#FF9900]/30",
    comingSoon: false,
  },
  {
    name: "Barnes & Noble",
    desc: "Hardcover & Nook Edition",
    href: "https://www.barnesandnoble.com/w/rounds-of-a-lifetime-robert-c-wade/1151266972?ean=9798182738682",
    badge: "Signed Copies",
    tone: "bg-[#2A6235]/15 text-[#2A6235] border-[#2A6235]/30",
    comingSoon: false,
  },
  {
    name: "Bookshop.org",
    desc: "Supports Local Bookstores",
    href: "https://bookshop.org/p/books/rounds-of-a-lifetime/75f7652be0657d21",
    badge: "Independent",
    tone: "bg-violet/15 text-violet border-violet/30",
    comingSoon: false,
  },
  {
    name: "Apple Books",
    desc: "Digital Audiobook Edition",
    href: "",
    badge: "Coming Soon",
    tone: "bg-navy/10 text-navy border-navy/20",
    comingSoon: true,
  },
];

const guarantees = [
  "Free shipping on Hardcover (Prime)",
  "Audiobook narrated by the author",
  "Signed first-edition available",
];

export function WhereToBuy() {
  return (
    <section
      id="where-to-buy"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get Your Copy"
          title="Where to Buy"
          subtitle="Available now in hardcover, digital, and audiobook — wherever you love to read."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* 3D Book mockup */}
          <ScrollReveal className="order-2 lg:order-1">
            <div className="relative mx-auto flex max-w-md items-center justify-center">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-violet/15 via-sky/20 to-transparent blur-2xl" />
              <div className="relative [perspective:1600px]">
                <div className="book-3d relative">
                  <div className="book-spine absolute left-0 top-0 h-full w-[40px] bg-gradient-to-r from-violet-dark to-violet" />
                  <div className="relative aspect-[2/3] w-72 overflow-hidden rounded-r-lg rounded-l-sm border border-white/30 shadow-soft-lg sm:w-80">
                    <Image
                      src="/images/book-front-cover.jpg"
                      alt="'Rounds of a Lifetime' book cover"
                      fill
                      sizes="(min-width: 1024px) 360px, 288px"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20" />
                  </div>
                  <div className="absolute -right-1.5 top-1.5 bottom-1.5 w-3 rounded-r-sm bg-gradient-to-r from-white/90 via-white/60 to-white/30 shadow-inner" />
                </div>
              </div>

              {/* floating price tag */}
              <div className="absolute -right-3 top-8 rotate-6 rounded-2xl border border-violet/10 bg-white px-4 py-3 text-center shadow-soft sm:-right-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet">
                  Hardcover
                </p>
                <p className="font-display text-3xl text-navy">$24.99</p>
                <p className="text-[10px] text-navy/50 line-through">$29.99</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Retailer list */}
          <ScrollReveal delay={0.1} className="order-1 space-y-4 lg:order-2">
            <div className="flex flex-wrap gap-2">
              {guarantees.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet/15 bg-mist px-3 py-1.5 text-xs font-medium text-navy/80"
                >
                  <Check className="h-3.5 w-3.5 text-violet" />
                  {g}
                </span>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {retailers.map((r) =>
                r.comingSoon ? (
                  <div
                    key={r.name}
                    className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-dashed border-navy/15 bg-mist/40 p-4 opacity-75"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xl tracking-wide text-navy/60">
                          {r.name}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${r.tone}`}
                        >
                          {r.badge}
                        </span>
                      </div>
                      <span className="font-serif text-xs text-navy/50">
                        {r.desc}
                      </span>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy/40">
                      <Clock className="h-4 w-4" />
                    </span>
                  </div>
                ) : (
                  <a
                    key={r.name}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-violet/10 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-violet/25 hover:shadow-soft-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xl tracking-wide text-navy">
                          {r.name}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${r.tone}`}
                        >
                          {r.badge}
                        </span>
                      </div>
                      <span className="font-serif text-xs text-navy/60">
                        {r.desc}
                      </span>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet transition-all group-hover:bg-violet group-hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                )
              )}
            </div>

            {/* Primary CTA */}
            <a
              href="https://www.amazon.com/Rounds-lifetime-Robert-Wright-MD/dp/B0FHBBRXCT"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-2 flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-violet-gradient p-5 text-white shadow-violet-glow transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-semibold">Buy Now on Amazon</span>
              <span className="text-sm text-white/70">— from $24.99</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-navy/50">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                ISBN: 978-929-167-7346
              </span>
              <span className="h-3 w-px bg-navy/20" />
              <span>Also available at your local bookstore</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
