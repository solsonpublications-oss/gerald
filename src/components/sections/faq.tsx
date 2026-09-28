"use client";

import { HelpCircle, BookHeart, Mail, ShoppingBag } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { HeartbeatLine } from "@/components/heartbeat-line";

const faqs = [
  {
    q: "Is Rounds of a Lifetime a true story?",
    a: "Yes. It is a deeply personal, non-fiction memoir recounting Robert Y. Wright, MD's own life — from a challenging childhood and the pain of bullying, through medical school, and into a decades-long career in medicine. Some names and identifying details have been changed to protect the privacy of patients and family.",
  },
  {
    q: "Who is this book for?",
    a: "Anyone moved by stories of resilience. It's written for medical students who need to remember why they started, for patients who want to see the human behind the white coat, for anyone who has ever been told they wouldn't make it — and for the readers who love them.",
  },
  {
    q: "What formats is the book available in?",
    a: "Rounds of a Lifetime is available in hardcover, eBook (Kindle, Apple Books, Nook), and audiobook narrated by Dr. Wright himself. See the Where to Buy section for all retailers.",
  },
  {
    q: "Can I get a signed copy?",
    a: "Signed first-edition hardcovers are available through select independent bookstores and at in-person events. Join the newsletter to be notified when signed batches are released, or use the contact form to request one directly.",
  },
  {
    q: "Is there a discussion guide for book clubs?",
    a: "Yes. We've prepared a reading-group discussion guide with questions covering the memoir's major themes — resilience, identity, and the call to medicine. You'll find it just below this FAQ.",
  },
  {
    q: "Is Dr. Wright available for speaking engagements?",
    a: "He is. Dr. Wright speaks at medical schools, resilience conferences, and book clubs — in person and virtually. Use the contact form with the subject 'Speaking Engagement' and his team will respond within a few business days.",
  },
  {
    q: "Will there be an audiobook?",
    a: "The audiobook is available now on Audible, Apple Books, and other major audio retailers, narrated by Dr. Wright. Many readers say hearing it in his own voice adds an extra dimension to the story.",
  },
  {
    q: "How can my book club or class order in bulk?",
    a: "Bulk orders for classrooms, book clubs, and institutions receive special pricing. Reach out through the contact form with 'Book Club / Bulk Order' and the quantity you need, and we'll send you a quote with shipping options.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-sky/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Left: heading + CTA card */}
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Questions & Answers"
              title="Frequently Asked"
              subtitle="Everything you might want to know about the book, the author, and how to bring Dr. Wright to your next event."
            />

            <div className="mt-8 overflow-hidden rounded-3xl border border-violet/15 bg-mist p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet/10 text-violet">
                  <HelpCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl tracking-wide text-navy">
                    Still have a question?
                  </p>
                  <p className="font-serif text-sm text-navy/70">
                    We're happy to help.
                  </p>
                </div>
              </div>
              <p className="mt-4 font-serif text-sm leading-relaxed text-navy/70">
                If your question isn't answered here, send us a note through
                the contact form and Dr. Wright's team will get back to you
                within a few business days.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-violet px-4 py-2 text-xs font-semibold text-white shadow-violet-glow transition-colors hover:bg-violet-dark"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Ask a Question
                </a>
                <a
                  href="#where-to-buy"
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 px-4 py-2 text-xs font-semibold text-violet transition-colors hover:bg-violet/5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Buy the Book
                </a>
              </div>
            </div>

            {/* Reading guide teaser */}
            <a
              href="#reading-guide"
              className="group mt-4 flex items-center gap-3 rounded-2xl border border-violet/10 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-violet/25"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/15 text-violet transition-transform group-hover:scale-110">
                <BookHeart className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy">
                  For Book Clubs
                </p>
                <p className="font-serif text-xs text-navy/60">
                  Download the discussion guide →
                </p>
              </div>
            </a>
          </ScrollReveal>

          {/* Right: accordion */}
          <ScrollReveal delay={0.1}>
            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
              className="space-y-3"
            >
              {faqs.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="overflow-hidden rounded-2xl border border-violet/10 bg-white shadow-soft transition-colors data-[state=open]:border-violet/25"
                >
                  <AccordionTrigger className="px-5 py-4 text-left font-semibold text-navy hover:no-underline sm:px-6 sm:py-5">
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet/10 font-display text-sm text-violet">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-sans text-[15px] leading-snug sm:text-base">
                        {item.q}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="pl-10">
                      <HeartbeatLine
                        className="mb-3 h-5 w-24 opacity-50"
                        color="#5b2a86"
                        width={1.5}
                      />
                      <p className="font-serif text-[15px] leading-relaxed text-navy/75">
                        {item.a}
                      </p>
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
