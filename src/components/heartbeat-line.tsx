"use client";

import { cn } from "@/lib/utils";

interface HeartbeatLineProps {
  className?: string;
  /** stroke color */
  color?: string;
  /** stroke width */
  width?: number;
  /** whether to animate the drawing effect */
  animate?: boolean;
  /** glow opacity for the pulse point */
  glow?: boolean;
}

/**
 * A reusable EKG / heartbeat pulse line graphic.
 * Used as a recurring motif: in the header, section dividers, and footer.
 */
export function HeartbeatLine({
  className,
  color = "currentColor",
  width = 2.5,
  animate = false,
  glow = false,
}: HeartbeatLineProps) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("h-[60px] w-full", className)}
      aria-hidden="true"
    >
      <path
        d="M0 60 L220 60 L260 60 L285 30 L310 92 L335 22 L360 104 L385 48 L410 60 L520 60 L560 60 L585 18 L610 102 L635 36 L660 86 L685 60 L780 60 L820 60 L845 30 L870 92 L895 22 L920 104 L945 48 L970 60 L1200 60"
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          animate && "ekg-path",
          glow && "ekg-glow"
        )}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Compact circular pulse-beat icon for inline use */
export function PulseBeat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-6 w-6", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.25"
      />
      <path
        d="M6 24 H16 L19 14 L24 34 L29 18 L32 24 H42"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
