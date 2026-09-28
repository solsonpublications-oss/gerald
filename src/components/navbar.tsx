"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { label: "The Book", href: "#about-the-book" },
  { label: "The Author", href: "#about-the-author" },
  { label: "Themes", href: "#themes" },
  { label: "Reviews", href: "#reviews" },
  { label: "Excerpt", href: "#excerpt" },
  { label: "Events", href: "#events" },
  { label: "Blog", href: "#blog" },
  { label: "Guide", href: "#reading-guide" },
  { label: "FAQ", href: "#faq" },
  { label: "Buy", href: "#where-to-buy" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        // scroll-spy: pick the section whose top is closest to (and just
        // above) the trigger line. This correctly tracks the section
        // currently in view at the top of the viewport.
        const offset = 140;
        let best: { href: string; top: number } | null = null;
        for (const link of NAV_LINKS) {
          const el = document.querySelector(link.href) as HTMLElement | null;
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          // section has started (its top is at/above the trigger line)
          if (top - offset <= 0) {
            if (!best || top > best.top) {
              best = { href: link.href, top };
            }
          }
        }
        setActive(best ? best.href : "");
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/85 dark:bg-[#16212c]/85 backdrop-blur-xl shadow-[0_6px_30px_-12px_rgba(30,42,56,0.18)] border-b border-violet/10"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
        {/* Brand */}
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="Rounds of a Lifetime — home"
        >
          <Image
            src="/images/author-logo.png"
            alt="Rounds of a Lifetime logo"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full border border-white/30 shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-lg tracking-wide transition-colors sm:text-xl",
                scrolled ? "text-navy" : "text-white"
              )}
            >
              ROUNDS OF A LIFETIME
            </span>
            <span
              className={cn(
                "font-serif text-[10px] italic tracking-wide transition-colors sm:text-xs",
                scrolled ? "text-violet/70" : "text-white/80"
              )}
            >
              a memoir by Robert Y. Wright, MD
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                  "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:transition-transform after:duration-300",
                  isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                  scrolled
                    ? isActive
                      ? "text-violet after:bg-violet"
                      : "text-navy/70 hover:text-violet after:bg-violet"
                    : isActive
                      ? "text-white after:bg-white"
                      : "text-white/80 hover:text-white after:bg-white"
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* CTA + theme toggle + mobile toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle
            variant={scrolled ? "light" : "dark"}
            className="hidden sm:inline-flex"
          />
          <Button
            asChild
            size="sm"
            className="hidden bg-violet text-white shadow-violet-glow hover:bg-violet-dark md:inline-flex"
          >
            <a href="#where-to-buy">Buy the Book</a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors xl:hidden",
              scrolled
                ? "text-navy hover:bg-violet/5"
                : "text-white hover:bg-white/10"
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "xl:hidden overflow-y-auto border-t border-violet/10 bg-white/95 dark:bg-[#16212c]/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 max-h-[80vh]",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1 px-4 py-4 sm:px-6">
          <div className="mb-2 flex items-center justify-between px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-navy/50 dark:text-white/50">
              Menu
            </span>
            <ThemeToggle variant="light" />
          </div>
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 font-medium transition-colors",
                  isActive
                    ? "bg-violet/10 text-violet"
                    : "text-navy/80 dark:text-white/80 hover:bg-mist dark:hover:bg-white/5 hover:text-violet"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                )}
              </a>
            );
          })}
          <a
            href="#where-to-buy"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-xl bg-violet px-4 py-3 text-center font-semibold text-white shadow-violet-glow"
          >
            Buy the Book
          </a>
        </div>
      </div>
    </header>
  );
}
