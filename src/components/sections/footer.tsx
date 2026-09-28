"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import { HeartbeatLine } from "@/components/heartbeat-line";

const quickLinks = [
  { label: "The Book", href: "#about-the-book" },
  { label: "The Author", href: "#about-the-author" },
  { label: "Themes", href: "#themes" },
  { label: "Reviews", href: "#reviews" },
  { label: "Excerpt", href: "#excerpt" },
  { label: "Where to Buy", href: "#where-to-buy" },
  { label: "Newsletter", href: "#newsletter" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-auto overflow-hidden bg-navy text-white">
      {/* Top heartbeat line */}
      <div className="bg-white/5">
        <HeartbeatLine
          className="h-16 w-full text-violet"
          color="#8fcbe8"
          width={2}
          animate
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/author-logo.png"
                alt="Rounds of a Lifetime logo"
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-full border border-white/30 shadow-sm"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-wide">
                  ROUNDS OF A LIFETIME
                </span>
                <span className="font-serif text-xs italic text-white/60">
                  a memoir by Robert Y. Wright, MD
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-sm font-serif text-sm leading-relaxed text-white/70">
              A deeply personal account of survival, healing, and a life devoted
              to medicine — published under the name{" "}
              <span className="italic text-white/90">Robert Y. Wright, MD</span>.
            </p>
            <a
              href="mailto:hello@roundsofalifetime.com"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all hover:-translate-y-0.5 hover:border-violet hover:bg-violet hover:text-white"
            >
              <Mail className="h-4 w-4" />
              hello@roundsofalifetime.com
            </a>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-display text-lg tracking-wide text-sky-soft">
              EXPLORE
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-serif text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Book details */}
          <div>
            <p className="font-display text-lg tracking-wide text-sky-soft">
              THE BOOK
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">Format</dt>
                <dd className="text-right font-medium text-white/90">
                  Hardcover / eBook / Audio
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">ISBN</dt>
                <dd className="text-right font-medium text-white/90">
                  978-929-167-7346
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">Genre</dt>
                <dd className="text-right font-medium text-white/90">Memoir</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">Author</dt>
                <dd className="text-right font-medium text-white/90">
                  Robert Y. Wright, MD
                </dd>
              </div>
            </dl>
            <a
              href="#where-to-buy"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white shadow-violet-glow transition-colors hover:bg-violet-dark"
            >
              Buy the Book
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/60">
            © {year} Robert Y. Wright, MD. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <span className="h-3 w-px bg-white/20" />
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
            <span className="h-3 w-px bg-white/20" />
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
        </div>

        {/* Closing heartbeat + attribution */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <HeartbeatLine
            className="h-8 max-w-md opacity-50"
            color="#8fcbe8"
            width={1.5}
          />
          <p className="font-serif text-[11px] italic text-white/40">
            “Every round, a verse in the poetry of a life in medicine.”
          </p>
        </div>
      </div>
    </footer>
  );
}
