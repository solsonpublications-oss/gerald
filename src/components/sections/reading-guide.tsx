"use client";

import { useState } from "react";
import {
  BookHeart,
  Download,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { useToast } from "@/hooks/use-toast";

const guides = [
  {
    category: "Opening the Conversation",
    questions: [
      "The memoir opens with the line about 'the first round.' What does the word 'round' come to mean across the book — in medicine, and in life?",
      "Before reading, what did you assume a doctor's memoir would be about? How did this one surprise or challenge that expectation?",
    ],
  },
  {
    category: "Childhood & Identity",
    questions: [
      "Dr. Wright writes that 'a body can be both a home and a battleground.' Where do you see this tension play out most powerfully in his childhood?",
      "How did the experience of being bullied shape the physician he later became — for better and for worse?",
      "What role does silence play in his early life? Is it a refuge, a weapon, or both?",
    ],
  },
  {
    category: "Medical School & Calling",
    questions: [
      "Dr. Wright describes medicine as 'a call for survival, not a career choice.' Do you agree that callings can be born from hardship? Have you experienced this?",
      "What does the book reveal about the hidden emotional cost of becoming a doctor that isn't taught in medical school?",
      "The night he nearly quit is a turning point. What do you think kept him walking forward instead of away?",
    ],
  },
  {
    category: "Family & Healing",
    questions: [
      "How does Dr. Wright's relationship with his family evolve across the memoir? Where do you see forgiveness, and where do you see unresolved weight?",
      "In what ways does healing others become a path to healing himself? Are there limits to that equation?",
      "What does the book suggest about the difference between being cured and being healed?",
    ],
  },
  {
    category: "Themes & Takeaways",
    questions: [
      "The heartbeat motif runs through the whole book. What does it symbolize to you by the final chapter?",
      "If you could ask Dr. Wright one question after reading, what would it be?",
      "Who in your life would you most want to read this memoir — and why?",
    ],
  },
];

export function ReadingGuide() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onDownload(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !email) return;
    setLoading(true);
    // Register the guide request as a newsletter subscriber tagged from the guide
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: "Reading Guide Request",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: "Couldn't send guide",
          description: data?.error ?? "Please try again shortly.",
          variant: "destructive",
        });
        return;
      }
      // Download the polished, branded PDF guide (served from /public)
      const a = document.createElement("a");
      a.href = "/downloads/Rounds-of-a-Lifetime-Reading-Guide.pdf";
      a.download = "Rounds-of-a-Lifetime-Reading-Guide.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({
        title: "Guide downloaded!",
        description:
          "Check your downloads for the printable PDF. You're also on the newsletter list.",
      });
      setEmail("");
    } catch {
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="reading-guide"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-sky/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left: heading + download card */}
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="For Book Clubs & Classrooms"
              title="Reading Group Discussion Guide"
              subtitle="Curated questions to spark meaningful conversation around the memoir's themes of resilience, identity, and the call to medicine."
            />

            <div className="mt-8 overflow-hidden rounded-3xl border border-violet/15 bg-mist p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet/10 text-violet">
                  <BookHeart className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl tracking-wide text-navy">
                    Download the Guide
                  </p>
                  <p className="font-serif text-sm text-navy/70">
                    Printable PDF · 5 sections · 13 questions
                  </p>
                </div>
              </div>
              <p className="mt-4 font-serif text-sm leading-relaxed text-navy/70">
                Enter your email to receive the printable discussion guide (PDF). We'll
                also add you to the newsletter so you hear about new resources
                and author Q&As.
              </p>
              <form onSubmit={onDownload} className="mt-4 space-y-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@bookclub.com"
                  className="w-full rounded-xl border border-violet/20 bg-white px-4 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-white shadow-violet-glow transition-colors hover:bg-violet-dark disabled:opacity-60"
                >
                  {loading ? (
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {loading ? "Preparing…" : "Download Guide"}
                </button>
              </form>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-navy/50">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet" />
                Free · unsubscribe anytime
              </p>
            </div>
          </ScrollReveal>

          {/* Right: questions accordion */}
          <ScrollReveal delay={0.1}>
            <Accordion
              type="single"
              collapsible
              defaultValue="guide-0"
              className="space-y-3"
            >
              {guides.map((g, i) => (
                <AccordionItem
                  key={g.category}
                  value={`guide-${i}`}
                  className="overflow-hidden rounded-2xl border border-violet/10 bg-white shadow-soft transition-colors data-[state=open]:border-violet/25"
                >
                  <AccordionTrigger className="px-5 py-4 text-left hover:no-underline sm:px-6 sm:py-5">
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky/20 font-display text-sm text-violet">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-lg tracking-wide text-navy">
                        {g.category}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="pl-10 space-y-3">
                      <HeartbeatLine
                        className="mb-2 h-4 w-20 opacity-50"
                        color="#5b2a86"
                        width={1.5}
                      />
                      {g.questions.map((q, qi) => (
                        <div
                          key={qi}
                          className="flex gap-3 rounded-xl bg-mist/50 p-3"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/10 text-xs font-bold text-violet">
                            {qi + 1}
                          </span>
                          <p className="font-serif text-[15px] leading-relaxed text-navy/80">
                            {q}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
