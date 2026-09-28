"use client";

import {
  Shield,
  HeartHandshake,
  GraduationCap,
  Users,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";

interface Theme {
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string;
}

const themes: Theme[] = [
  {
    icon: Shield,
    title: "Resilience",
    text: "Finding the strength to keep going when every round tells you to stop — and learning that endurance is its own kind of healing.",
    accent: "from-violet/15 to-violet/5 text-violet",
  },
  {
    icon: HeartHandshake,
    title: "Bullying & Healing",
    text: "The long shadow of cruelty, and the slow, deliberate work of turning wounds into wisdom and compassion for others.",
    accent: "from-sky/25 to-sky/5 text-sky-foreground",
  },
  {
    icon: GraduationCap,
    title: "Medical School Journey",
    text: "The crucible of late nights, brutal exams, and self-doubt — where a struggling student became a physician in the making.",
    accent: "from-violet/15 to-violet/5 text-violet",
  },
  {
    icon: Users,
    title: "Family & Identity",
    text: "How family shapes, breaks, and rebuilds us — and the search for an identity strong enough to carry a calling.",
    accent: "from-sky/25 to-sky/5 text-sky-foreground",
  },
  {
    icon: Stethoscope,
    title: "The Call to Medicine",
    text: "More than a career — a vocation answered in survival. The moment medicine stops being a choice and becomes a destiny.",
    accent: "from-violet/15 to-violet/5 text-violet",
  },
];

export function Themes() {
  return (
    <section
      id="themes"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What You'll Find Inside"
          title="Themes That Beat Through Every Page"
          subtitle="Five threads run through this memoir — together they trace a single, stubborn heartbeat of a life in medicine."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme, i) => (
            <ScrollReveal
              key={theme.title}
              delay={i * 0.07}
              className={
                i === themes.length - 1
                  ? "sm:col-span-2 lg:col-span-1"
                  : undefined
              }
            >
              <article className="group relative h-full overflow-hidden rounded-3xl border border-violet/10 bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-violet/25 hover:shadow-soft-lg">
                {/* gradient wash on hover */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <theme.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl tracking-wide text-navy">
                    {theme.title}
                  </h3>
                  <p className="mt-2 font-serif text-[15px] leading-relaxed text-navy/70">
                    {theme.text}
                  </p>
                </div>
                {/* corner pulse */}
                <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-violet/30 transition-transform duration-500 group-hover:scale-150" />
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
