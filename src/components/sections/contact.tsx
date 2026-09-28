"use client";

import { useState, type FormEvent } from "react";
import {
  Loader2,
  Send,
  Mail,
  User,
  MessageSquare,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const subjects = [
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Speaking Engagement", label: "Speaking Engagement" },
  { value: "Book Club / Bulk Order", label: "Book Club / Bulk Order" },
  { value: "Press / Media", label: "Press / Media" },
];

export function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || done) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: "Couldn't send message",
          description: data?.error ?? "Please try again shortly.",
          variant: "destructive",
        });
        return;
      }
      setDone(true);
      toast({
        title: "Message sent!",
        description:
          data.message ?? "Thank you — Dr. Wright's team will be in touch.",
      });
      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Left: invitation copy */}
          <ScrollReveal>
            <SectionHeading
              align="left"
              eyebrow="Get in Touch"
              title="Invite Dr. Wright to Your Next Round"
              subtitle="Speaking engagements, book clubs, press inquiries, or simply a note — every message is read."
            />
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: CalendarDays,
                  title: "Speaking Engagements",
                  text: "Available for medical schools, conferences, and resilience-themed keynotes.",
                },
                {
                  icon: MessageSquare,
                  title: "Book Clubs & Bulk Orders",
                  text: "Special pricing & signed copies available for reading groups and institutions.",
                },
                {
                  icon: Mail,
                  title: "Press & Media",
                  text: "Interviews, excerpts, and review copy requests welcome.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-violet/10 bg-mist/50 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy">{item.title}</p>
                    <p className="font-serif text-sm text-navy/70">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Right: contact form */}
          <ScrollReveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-violet/10 bg-white p-6 shadow-soft sm:p-8">
              {done ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="font-display text-3xl tracking-wide text-navy">
                      Message Sent
                    </p>
                    <p className="mt-1 font-serif text-sm text-navy/70">
                      Thank you for reaching out. Dr. Wright's team will be in
                      touch shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDone(false)}
                    className="text-xs font-semibold uppercase tracking-wider text-violet underline-offset-4 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="c-name"
                        className="text-xs font-semibold uppercase tracking-wider text-navy/70"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                        <Input
                          id="c-name"
                          required
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          placeholder="Your name"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="c-email"
                        className="text-xs font-semibold uppercase tracking-wider text-navy/70"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                        <Input
                          id="c-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="you@example.com"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
                      Subject
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => set("subject", s.value)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            form.subject === s.value
                              ? "border-violet bg-violet text-white"
                              : "border-violet/20 bg-white text-navy/70 hover:bg-violet/5"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="c-message"
                      className="text-xs font-semibold uppercase tracking-wider text-navy/70"
                    >
                      Message
                    </label>
                    <Textarea
                      id="c-message"
                      required
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tell us about your event, request, or note for Dr. Wright…"
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Sending…" : "Send Message"}
                  </Button>
                  <p className="text-center text-xs text-navy/50">
                    Typical response time: 2–3 business days.
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
