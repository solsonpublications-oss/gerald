"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const FINGERPRINT_KEY = "rol_react_fp";

// Generate + cache an anonymous fingerprint in localStorage so a user
// can toggle their reaction without needing an account.
function getFingerprint(): string {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem(FINGERPRINT_KEY);
  if (!fp) {
    // simple random id — sufficient for preventing casual duplicate reactions
    fp =
      "fp-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 10);
    localStorage.setItem(FINGERPRINT_KEY, fp);
  }
  return fp;
}

export function CommentReactions({ commentId }: { commentId: string }) {
  const [count, setCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fp = getFingerprint();
    if (!fp) return;
    fetch(
      `/api/blog/comments/react?commentId=${encodeURIComponent(commentId)}&fingerprint=${encodeURIComponent(fp)}`,
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.ok) {
          setCount(d.count ?? 0);
          setHasReacted(!!d.hasReacted);
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [commentId]);

  async function toggle() {
    if (toggling) return;
    const fp = getFingerprint();
    if (!fp) return;
    setToggling(true);
    // optimistic update
    const prevCount = count;
    const prevReacted = hasReacted;
    setHasReacted(!prevReacted);
    setCount(prevReacted ? Math.max(0, prevCount - 1) : prevCount + 1);
    try {
      const res = await fetch("/api/blog/comments/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, fingerprint: fp, type: "like" }),
      });
      const d = await res.json();
      if (d?.ok) {
        setCount(d.count ?? 0);
        setHasReacted(!!d.hasReacted);
      } else {
        // revert on failure
        setCount(prevCount);
        setHasReacted(prevReacted);
      }
    } catch {
      setCount(prevCount);
      setHasReacted(prevReacted);
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return (
      <span className="inline-flex h-7 w-12 items-center">
        <Loader2 className="h-3 w-3 animate-spin text-navy/30" />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={toggling}
      aria-label={hasReacted ? "Remove like" : "Like this comment"}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
        hasReacted
          ? "border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/15"
          : "border-violet/15 bg-white text-navy/60 hover:border-violet/30 hover:bg-violet/5 hover:text-violet dark:bg-[#1e2a38] dark:text-white/60"
      )}
    >
      <Heart
        className={cn(
          "h-3.5 w-3.5 transition-transform group-hover:scale-110",
          hasReacted && "fill-rose-500 text-rose-500"
        )}
      />
      <span>{count}</span>
    </button>
  );
}
