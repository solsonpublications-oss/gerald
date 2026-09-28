"use client";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeartbeatLine } from "@/components/heartbeat-line";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            light
              ? "border-white/30 bg-white/10 text-white/90 backdrop-blur"
              : "border-violet/20 bg-violet/5 text-violet"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "max-w-3xl text-balance font-display text-4xl leading-[1.05] tracking-wide sm:text-5xl md:text-6xl",
          light ? "text-white text-shadow-glow" : "text-navy"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-balance font-serif text-base leading-relaxed sm:text-lg",
            light ? "text-white/85" : "text-navy/70"
          )}
        >
          {subtitle}
        </p>
      )}
      <HeartbeatLine
        className={cn("mt-2 h-10 max-w-xs", align === "center" && "mx-auto")}
        color={light ? "rgba(255,255,255,0.7)" : "#5b2a86"}
        width={2}
      />
    </ScrollReveal>
  );
}
