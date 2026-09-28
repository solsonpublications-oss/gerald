"use client";

import { motion, useInView, type Variant } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "article" | "li" | "span";
}

/**
 * Wraps children in a fade-in + slide-up animation that triggers
 * when the element scrolls into view.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  as = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px 0px -80px 0px" });

  const hidden: Variant = { opacity: 0, y };
  const visible: Variant = {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? visible : hidden}
    >
      {children}
    </MotionTag>
  );
}
