"use client";

import Image from "next/image";
import { GraduationCap, Stethoscope, Heart, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";

const timeline = [
  {
    icon: Heart,
    year: "Childhood",
    title: "A Difficult Beginning",
    text:
      "Born into hardship, navigating physical and emotional challenges — and the loneliness of being bullied for being different.",
  },
  {
    icon: GraduationCap,
    year: "Medical School",
    title: "The Crucible of Study",
    text:
      "Relentless academic pressure, doubt, and the discovery that medicine was not chosen — it was a calling answered in survival.",
  },
  {
    icon: Stethoscope,
    year: "Residency & Practice",
    title: "Becoming the Healer",
    text:
      "Decades devoted to patients, high-stakes decisions, and the quiet lessons only a lifetime of rounds can teach.",
  },
  {
    icon: ShieldCheck,
    year: "Today",
    title: "Sharing the Story",
    text:
      "Now an author, Dr. Wright turns his lifetime of rounds into a memoir so others might find their own resilience in his.",
  },
];

export function AboutTheAuthor() {
  return (
    <section
      id="about-the-author"
      className="relative overflow-hidden bg-mist py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Author"
          title="Meet Robert Y. Wright, MD"
          subtitle="A physician, a survivor, a storyteller — writing the memoir he needed to read as a boy."
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Author portrait card */}
          <ScrollReveal className="lg:sticky lg:top-28">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-violet/20 via-sky/20 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-white shadow-soft-lg">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/author-portrait.jpg"
                    alt="A portrait of a young Robert Y. Wright, MD from his earlier years — the young man whose journey the memoir traces"
                    fill
                    sizes="(min-width: 1024px) 420px, 80vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                </div>
                {/* Name plate */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-display text-3xl leading-none tracking-wide">
                    ROBERT Y. WRIGHT, MD
                  </p>
                  <p className="mt-1.5 font-serif text-[11px] italic text-white/70">
                    A portrait from his earlier years — the boy at the start of
                    the journey this memoir traces.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                      Physician
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                      Memoirist
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                      Speaker
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bio + timeline */}
          <ScrollReveal delay={0.1} className="space-y-8">
            <div className="space-y-4">
              <p className="font-serif text-lg leading-relaxed text-navy/85">
                Robert Y. Wright, MD has spent more than four decades in the
                practice of medicine — a career forged not in privilege, but in
                perseverance. Raised in circumstances that tested him early and
                often, he carried the weight of a difficult childhood, the sting
                of bullying, and the silent burden of a challenging medical
                history into every chapter of his life.
              </p>
              <p className="font-serif text-lg leading-relaxed text-navy/85">
                Medical school nearly broke him. Instead, it became the
                crucible that revealed his calling: that medicine was never
                simply a profession to pursue, but a vocation to answer — a way
                to transform his own pain into purpose, and his own survival
                into a lifetime of healing others.
              </p>
              <p className="font-serif text-lg leading-relaxed text-navy/85">
                In <span className="italic">Rounds of a Lifetime</span>, Dr.
                Wright offers not only the story of a physician, but the
                confession of a human being — written for every reader who has
                ever been told they would not make it, and chose to keep going
                anyway.
              </p>
            </div>

            {/* Timeline using heartbeat line as the visual thread */}
            <div className="relative mt-10 rounded-3xl border border-violet/10 bg-white p-6 shadow-soft sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/10 text-violet">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <h3 className="font-display text-2xl tracking-wide text-navy">
                  A Life, in Rounds
                </h3>
              </div>

              <ol className="relative space-y-6 border-l-2 border-dashed border-violet/25 pl-6 sm:pl-8">
                {/* Animated heartbeat thread */}
                <svg
                  viewBox="0 0 24 300"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -left-[14px] top-0 h-full w-4 text-violet"
                  aria-hidden="true"
                >
                  <path
                    d="M12 0 L12 60 L6 75 L18 95 L4 120 L20 145 L12 165 L12 300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="ekg-glow"
                  />
                </svg>

                {timeline.map((item, i) => (
                  <ScrollReveal
                    as="li"
                    key={item.title}
                    delay={i * 0.08}
                    className="relative"
                  >
                    <span className="absolute -left-[2.15rem] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet text-white shadow-soft sm:-left-[2.6rem]">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="rounded-2xl border border-violet/10 bg-mist/60 p-4 transition-colors hover:bg-mist">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">
                        {item.year}
                      </span>
                      <p className="mt-1 font-semibold text-navy">
                        {item.title}
                      </p>
                      <p className="mt-1 font-serif text-sm leading-relaxed text-navy/70">
                        {item.text}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
