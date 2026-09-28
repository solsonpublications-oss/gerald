"use client";

import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Users,
  Video,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Heart,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/footer";
import { BackToTop } from "@/components/back-to-top";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { SpeakingInquiry } from "@/components/speaking-inquiry";

const topics = [
  {
    icon: ShieldCheck,
    title: "Resilience in Medicine",
    duration: "45–60 min keynote",
    description:
      "Drawing on his own journey from a difficult childhood to a lifetime in medicine, Dr. Wright speaks on the resilience required to become — and remain — a healer. Perfect for medical-school orientations, residency programs, and physician-wellness events.",
    audience: "Medical schools · Residency programs · Health systems",
  },
  {
    icon: Heart,
    title: "The Call to Medicine",
    duration: "30–45 min talk",
    description:
      "An honest, emotionally rich talk about discovering that medicine was not a career choice but a calling — and how the hardships that threatened to derail him became the very things that prepared him for it.",
    audience: "Pre-med students · Career days · Faith communities",
  },
  {
    icon: BookOpen,
    title: "Reading + Q&A",
    duration: "60–90 min event",
    description:
      "Dr. Wright reads from Rounds of a Lifetime and takes open questions from the audience. Warm, candid, and conversational — ideal for bookstores, libraries, and reading groups.",
    audience: "Bookstores · Libraries · Book clubs",
  },
  {
    icon: Stethoscope,
    title: "Listening for the Story",
    duration: "45–60 min workshop",
    description:
      "A practical session on narrative medicine — how clinicians can hear the story beneath the symptom, and why the silence after a question matters as much as the answer.",
    audience: "Grand rounds · CME events · Interdisciplinary teams",
  },
];

const formats = [
  {
    icon: Building2,
    title: "In-Person Keynotes",
    text: "Available for conferences, medical schools, and institutional events worldwide.",
  },
  {
    icon: Video,
    title: "Virtual Talks",
    text: "Live video sessions for classrooms, book clubs, and remote teams — anywhere with a screen.",
  },
  {
    icon: Users,
    title: "Small-Group Sessions",
    text: "Intimate workshops and fireside chats for book clubs, residencies, and leadership cohorts.",
  },
  {
    icon: GraduationCap,
    title: "Student Programs",
    text: "Special rates for medical schools and pre-med societies; slides + Q&A included.",
  },
];

const includes = [
  "Customized talk tailored to your audience",
  "Slides + a signed copy of the book for the host",
  "Open Q&A with attendees",
  "Optional book signing (in-person events)",
  "Promotional materials for your event",
];

export function SpeakingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#16212c]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pt-24">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-sky-gradient py-16 text-white md:py-20">
          <div className="absolute inset-0 -z-10 bg-hero-overlay opacity-90" />
          <div className="absolute inset-0 -z-10 bg-grid-soft opacity-30" />
          <HeartbeatLine
            className="pointer-events-none absolute left-0 right-0 top-12 h-16 opacity-30"
            color="rgba(255,255,255,0.85)"
            glow
          />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
              <Stethoscope className="h-3.5 w-3.5" />
              Speaking Engagements
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-wide text-shadow-glow sm:text-6xl md:text-7xl">
              Bring Dr. Wright to Your Stage
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-serif text-base leading-relaxed text-white/90 sm:text-lg">
              Keynotes, readings, and workshops on resilience, medicine, and the
              long art of listening — for medical schools, conferences, book clubs,
              and anywhere people gather to hear an honest story.
            </p>
          </div>
        </section>

        {/* Topics */}
        <section className="bg-white py-16 dark:bg-[#16212c] md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet/20 bg-violet/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Signature Talks
              </span>
              <h2 className="mt-3 font-display text-4xl tracking-wide text-navy dark:text-white sm:text-5xl">
                Topics & Sessions
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {topics.map((t, i) => (
                <article
                  key={t.title}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-violet/10 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-violet/25 hover:shadow-soft-lg dark:bg-[#1e2a38]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet transition-transform group-hover:scale-110">
                      <t.icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-mist px-3 py-1 text-[11px] font-semibold text-violet dark:bg-white/5">
                      {t.duration}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl tracking-wide text-navy dark:text-white">
                    {t.title}
                  </h3>
                  <p className="mt-3 flex-1 font-serif text-[15px] leading-relaxed text-navy/70 dark:text-white/70">
                    {t.description}
                  </p>
                  <div className="mt-4 border-t border-violet/10 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet/70">
                      Best for
                    </p>
                    <p className="mt-1 text-sm text-navy/60 dark:text-white/60">
                      {t.audience}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="bg-mist py-16 dark:bg-[#1e2a38] md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-display text-4xl tracking-wide text-navy dark:text-white sm:text-5xl">
                Formats
              </h2>
              <p className="mt-3 font-serif text-navy/60 dark:text-white/60">
                Every engagement is tailored to your audience and setting.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {formats.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-violet/10 bg-white p-5 text-center shadow-soft dark:bg-[#16212c]"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky/20 text-violet">
                    <f.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 font-semibold text-navy dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 font-serif text-sm leading-relaxed text-navy/60 dark:text-white/60">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-white py-16 dark:bg-[#16212c] md:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-violet/10 bg-mist/40 p-6 shadow-soft dark:bg-white/5 sm:p-8">
              <h2 className="text-center font-display text-3xl tracking-wide text-navy dark:text-white">
                What's Included
              </h2>
              <HeartbeatLine
                className="mx-auto mt-4 h-6 max-w-xs opacity-50"
                color="#5b2a86"
                width={1.5}
              />
              <ul className="mt-6 space-y-3">
                {includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm dark:bg-[#1e2a38]"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="font-serif text-sm text-navy/80 dark:text-white/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-violet-gradient py-16 text-white md:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-4xl tracking-wide text-shadow-glow sm:text-5xl">
              Ready to Book?
            </h2>
            <p className="mt-4 font-serif text-base leading-relaxed text-white/90 sm:text-lg">
              Tell us about your event — date, audience, and format — and Dr.
              Wright's team will respond within a few business days. The form
              is just below.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/90"
              >
                Request an Appearance
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/#events"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                View Upcoming Events
              </Link>
            </div>
          </div>
        </section>

        {/* Speaking inquiry form */}
        <div id="inquiry">
          <SpeakingInquiry />
        </div>

        {/* Back link */}
        <div className="bg-white py-8 dark:bg-[#16212c]">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet transition-colors hover:text-violet-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
