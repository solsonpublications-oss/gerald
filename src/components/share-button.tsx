"use client";

import { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Link2, Check, X } from "lucide-react";

interface ShareButtonProps {
  className?: string;
  variant?: "light" | "dark";
  label?: string;
}

export function ShareButton({
  className = "",
  variant = "dark",
  label = "Share",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : "https://roundsofalifetime.com";
  const shareText =
    "Rounds of a Lifetime — a deeply personal memoir by Robert Y. Wright, MD. From a difficult childhood to a life devoted to medicine.";
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const socials = [
    {
      name: "Twitter / X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      tone: "hover:bg-black hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      tone: "hover:bg-[#1877F2] hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      tone: "hover:bg-[#0A66C2] hover:text-white",
    },
  ];

  async function onNativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Rounds of a Lifetime", text: shareText, url });
        return;
      } catch {
        /* user cancelled — fall through to popup */
      }
    }
    setOpen((v) => !v);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={onNativeShare}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
          variant === "light"
            ? "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            : "border-violet/30 bg-white text-violet hover:bg-violet/5"
        }`}
      >
        <Share2 className="h-4 w-4" />
        {label}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close share menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-transparent"
          />
          {/* popup */}
          <div className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-2xl border border-violet/15 bg-white p-2 shadow-soft-lg">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
                Share
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-0.5 text-navy/40 hover:bg-mist hover:text-navy"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-0.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-navy transition-colors ${s.tone}`}
                >
                  <s.icon className="h-4 w-4" />
                  {s.name}
                </a>
              ))}
              <button
                type="button"
                onClick={copyLink}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-navy transition-colors hover:bg-violet/5 hover:text-violet"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
