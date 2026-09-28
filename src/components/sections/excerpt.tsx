"use client";

import { BookOpenText, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";

const pages = [
  {
    pageNum: "Prologue",
    title: "The First Round",
    body: [
      "They told me I would never make it. Not in so many words — doctors rarely speak that plainly to children — but I learned to read the silence between their syllables the way other children learned to read storybooks.",
      "I was seven years old the first time a heartbeat other than my own filled a room I was lying in. The cold disc of a stethoscope, the hush of a corridor, my mother's hand tight around mine. That was the round that began a lifetime of rounds.",
      "I did not understand, then, that the boy on the table and the doctor bending over him were already the same person — separated only by decades, by doubt, and by a stubborn refusal to stop.",
    ],
  },
  {
    pageNum: "Chapter One",
    title: "A House of Quiet Storms",
    body: [
      "Childhood, for me, was a country with two climates: the bright, loud weather of the schoolyard, and the close, watchful silence of home. I lived for the silence. I feared it too.",
      "The other children could smell difference the way animals smell fear. They called me the names that children invent when they have not yet learned the sharper ones. I learned early that a body can be both a home and a battleground.",
      "What no one tells you about being bullied is that the bruises fade long before the words do. The words take up residence. They become the voice in your head for years — until, one day, you find a voice louder than all of them.",
    ],
  },
  {
    pageNum: "Chapter Seven",
    title: "The Call",
    body: [
      "Medical school was not where I found medicine. Medical school was where medicine finally caught up with the boy who had been running toward it all along.",
      "I remember the night I nearly quit. The exam scores posted like a verdict. The hallway fluorescent buzzing above me like a heart that had lost its rhythm. I stood there a long time, holding the doorframe the way you hold a hand.",
      "And then I did the thing that would define the rest of my life: I let go of the doorframe, and I walked on. Not because I was brave. Because by then, I understood — stopping had never been one of my options.",
    ],
  },
];

export function Excerpt() {
  const [page, setPage] = useState(0);
  const current = pages[page];

  return (
    <section
      id="excerpt"
      className="relative overflow-hidden bg-mist py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="A Taste of the Memoir"
          title="Read an Excerpt"
          subtitle="Turn the page on a few selected passages from the opening rounds of the book."
        />

        <ScrollReveal className="mt-14">
          <div className="mx-auto max-w-3xl">
            {/* Book page design */}
            <div className="relative">
              {/* spine shadow */}
              <div className="pointer-events-none absolute -left-3 top-6 bottom-6 w-6 rounded-l bg-gradient-to-r from-violet/15 to-transparent" />

              <article className="relative overflow-hidden rounded-2xl border border-violet/10 bg-white shadow-soft-lg">
                {/* page header */}
                <header className="relative border-b border-violet/10 bg-mist/50 px-6 py-4 sm:px-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-violet">
                      <BookOpenText className="h-5 w-5" />
                      <span className="font-display text-lg tracking-wide text-navy">
                        ROUNDS OF A LIFETIME
                      </span>
                    </div>
                    <span className="font-serif text-sm italic text-navy/60">
                      {current.pageNum}
                    </span>
                  </div>
                  {/* reading progress bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
                      Page {page + 1} / {pages.length}
                    </span>
                    <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-violet/10">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet to-sky transition-all duration-500"
                        style={{
                          width: `${((page + 1) / pages.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </header>

                {/* page body */}
                <div className="max-h-[28rem] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 scroll-elegant">
                  <h3 className="font-display text-3xl tracking-wide text-violet sm:text-4xl">
                    {current.title}
                  </h3>
                  <div className="mt-5 space-y-4">
                    {current.body.map((para, i) => (
                      <p
                        key={i}
                        className={`font-serif text-[15px] leading-[1.85] text-navy/85 sm:text-base ${
                          i === 0 && page === 0 ? "drop-cap" : ""
                        }`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* decorative ornament */}
                  <div className="mt-8 flex items-center justify-center gap-3 text-violet/40">
                    <span className="h-px w-12 bg-current" />
                    <span className="font-display text-lg">❧</span>
                    <span className="h-px w-12 bg-current" />
                  </div>
                </div>

                {/* page footer / nav */}
                <footer className="flex items-center justify-between border-t border-violet/10 bg-mist/50 px-6 py-3 sm:px-10">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-violet transition-colors hover:bg-violet/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1.5">
                    {pages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Go to page ${i + 1}`}
                        onClick={() => setPage(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === page
                            ? "w-6 bg-violet"
                            : "w-2 bg-violet/25 hover:bg-violet/50"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(pages.length - 1, p + 1))
                    }
                    disabled={page === pages.length - 1}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-violet transition-colors hover:bg-violet/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </footer>
              </article>
            </div>

            <p className="mt-5 text-center font-serif text-sm italic text-navy/60">
              Selected passages. The full memoir is available in print &
              digital.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
