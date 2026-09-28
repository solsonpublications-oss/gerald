"use client";

import { useEffect, useState } from "react";

/**
 * A fixed reading-progress bar at the top of the viewport that fills
 * based on how far the user has scrolled through the article body.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector("article");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const viewport = window.innerHeight;
      // progress: how much of the article has been scrolled past
      const scrolled = window.scrollY - articleTop;
      const max = articleHeight - viewport * 0.5;
      const p = Math.min(1, Math.max(0, scrolled / max));
      setProgress(p);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[55] h-1 bg-transparent">
      <div
        className="h-full origin-left bg-gradient-to-r from-violet via-sky to-violet transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
