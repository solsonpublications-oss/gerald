"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** SSR-safe "is this running on the client?" check without setState-in-effect. */
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface ThemeToggleProps {
  className?: string;
  /** "light" = for use on light/transparent backgrounds; "dark" = on dark backgrounds */
  variant?: "light" | "dark";
}

export function ThemeToggle({ className, variant = "light" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  const current = (resolvedTheme ?? theme) === "dark";
  const isDarkVariant = variant === "dark";

  const iconColor = hydrated
    ? isDarkVariant
      ? current
        ? "text-white"
        : "text-navy"
      : current
        ? "text-navy"
        : "text-white"
    : "text-transparent";

  return (
    <button
      type="button"
      aria-label={hydrated ? (current ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      onClick={() => setTheme(current ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors",
        isDarkVariant
          ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
          : "border-violet/20 bg-violet/5 text-violet hover:bg-violet/10",
        className
      )}
    >
      {/* Sun icon (shown in light mode) */}
      <Sun
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500",
          hydrated && !current
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
          iconColor
        )}
      />
      {/* Moon icon (shown in dark mode) */}
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500",
          hydrated && current
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
          iconColor
        )}
      />
    </button>
  );
}
