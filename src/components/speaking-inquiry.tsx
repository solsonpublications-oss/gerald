"use client";

import { useState, type FormEvent } from "react";
import {
  Loader2,
  Send,
  CheckCircle2,
  User,
  Mail,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeartbeatLine } from "@/components/heartbeat-line";

const eventTypes = [
  "Keynote",
  "Reading + Q&A",
  "Workshop",
  "Book Club / Small Group",
  "Virtual Talk",
  "Other",
];

export function SpeakingInquiry() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    eventType: "Keynote",
    date: "",
    location: "",
    audience: "",
    message: "",
  });

  function set<K extends keyof typeof form>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || done) return;
    setLoading(true);
    try {
      // Compose a structured message and send via the contact API
      const subject = "Speaking Engagement";
      const message = [
        `Organization: ${form.organization || "—"}`,
        `Event type: ${form.eventType}`,
        `Proposed date: ${form.date || "—"}`,
        `Location: ${form.location || "—"}`,
        `Expected audience: ${form.audience || "—"}`,
        ``,
        form.message,
      ].join("\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: "Couldn't send inquiry",
          description: data?.error ?? "Please try again shortly.",
          variant: "destructive",
        });
        return;
      }
      setDone(true);
      toast({
        title: "Inquiry sent!",
        description:
          "Thank you — Dr. Wright's team will respond within a few business days.",
      });
      setForm({
        name: "",
        email: "",
        organization: "",
        eventType: "Keynote",
        date: "",
        location: "",
        audience: "",
        message: "",
      });
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
    <section className="bg-mist py-16 dark:bg-[#1e2a38] md:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-violet/10 bg-white p-6 shadow-soft-lg dark:bg-[#16212c] sm:p-8">
          <h2 className="text-center font-display text-3xl tracking-wide text-navy dark:text-white">
            Request an Appearance
          </h2>
          <p className="mt-2 text-center font-serif text-sm text-navy/60 dark:text-white/60">
            Tell us about your event and we'll be in touch within a few business
            days.
          </p>
          <HeartbeatLine
            className="mx-auto mt-4 h-5 max-w-xs opacity-50"
            color="#5b2a86"
            width={1.5}
          />

          {done ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <div>
                <p className="font-display text-3xl tracking-wide text-navy dark:text-white">
                  Inquiry Sent
                </p>
                <p className="mt-1 font-serif text-sm text-navy/60 dark:text-white/60">
                  Thank you for reaching out. Dr. Wright's team will respond
                  shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-2 rounded-full bg-violet px-6 py-2.5 text-sm font-semibold text-white shadow-violet-glow hover:bg-violet-dark"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Jane Doe"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@org.com"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                  Organization
                </label>
                <Input
                  value={form.organization}
                  onChange={(e) => set("organization", e.target.value)}
                  placeholder="Harvard Medical School / Tattered Cover Books / …"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                    Event Type
                  </label>
                  <select
                    value={form.eventType}
                    onChange={(e) => set("eventType", e.target.value)}
                    className="w-full rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 text-sm text-navy outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 dark:bg-[#1e2a38] dark:text-white"
                  >
                    {eventTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                    Proposed Date
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => set("date", e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
                    <Input
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="Boston, MA (or Virtual)"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                    Expected Audience
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
                    <Input
                      value={form.audience}
                      onChange={(e) => set("audience", e.target.value)}
                      placeholder="~120 medical students"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                  Tell us about your event *
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={4}
                  placeholder="What would you like Dr. Wright to speak about? Any theme, format, or special request…"
                  className="w-full resize-none rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20 dark:bg-[#1e2a38] dark:text-white dark:placeholder:text-white/40"
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
                {loading ? "Sending…" : "Send Inquiry"}
              </Button>
              <p className="text-center text-xs text-navy/50 dark:text-white/50">
                Typical response time: 2–3 business days.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
