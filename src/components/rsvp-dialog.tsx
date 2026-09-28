"use client";

import { useState, type FormEvent } from "react";
import {
  Loader2,
  CheckCircle2,
  X,
  CalendarCheck,
  Users,
  Mail,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RsvpDialogProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    city: string;
    venue: string;
  } | null;
  onClose: () => void;
  onSubmitted?: (eventId: string, count: number) => void;
}

export function RsvpDialog({ event, onClose, onSubmitted }: RsvpDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // lock body scroll when open
  if (typeof document !== "undefined") {
    document.body.style.overflow = event ? "hidden" : "";
  }

  if (!event) return null;

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || done || !event) return;
    setLoading(true);
    try {
      const res = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          name,
          email,
          count,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: "Couldn't RSVP",
          description: data?.error ?? "Please try again shortly.",
          variant: "destructive",
        });
        return;
      }
      setDone(true);
      toast({
        title: "You're on the list!",
        description: data.message,
      });
      onSubmitted?.(event.id, data.count);
      setName("");
      setEmail("");
      setCount(1);
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

  function close() {
    setDone(false);
    document.body.style.overflow = "";
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`RSVP to ${event.title}`}
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={close}
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-violet/15 bg-white p-6 shadow-soft-lg dark:bg-[#1e2a38] sm:p-7">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-navy/50 transition-colors hover:bg-mist dark:text-white/50 dark:hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <div>
              <p className="font-display text-3xl tracking-wide text-navy dark:text-white">
                You're on the list!
              </p>
              <p className="mt-1 font-serif text-sm text-navy/70 dark:text-white/70">
                We'll send a reminder to <strong>{email}</strong> closer to the
                date. See you there.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="mt-2 rounded-full bg-violet px-6 py-2.5 text-sm font-semibold text-white shadow-violet-glow hover:bg-violet-dark"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-2xl tracking-wide text-navy dark:text-white">
                  RSVP
                </h3>
                <p className="text-xs text-navy/60 dark:text-white/60">
                  Reserve your spot
                </p>
              </div>
            </div>

            {/* event summary */}
            <div className="mt-5 rounded-2xl border border-violet/10 bg-mist/60 p-4 dark:bg-white/5">
              <p className="font-semibold text-navy dark:text-white">
                {event.title}
              </p>
              <p className="mt-1 font-serif text-xs text-navy/70 dark:text-white/70">
                {dateStr} · {event.time}
              </p>
              <p className="font-serif text-xs text-navy/60 dark:text-white/60">
                {event.venue}, {event.city}
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40 dark:text-white/40" />
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                  How many spots?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCount((c) => Math.max(1, c - 1))}
                    aria-label="Decrease"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/20 text-violet transition-colors hover:bg-violet/5"
                  >
                    −
                  </button>
                  <div className="flex h-10 w-14 items-center justify-center rounded-xl border border-violet/20 bg-white font-display text-xl text-navy dark:bg-[#1e2a38] dark:text-white">
                    {count}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCount((c) => Math.min(10, c + 1))}
                    aria-label="Increase"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/20 text-violet transition-colors hover:bg-violet/5"
                  >
                    +
                  </button>
                  <span className="ml-1 flex items-center gap-1 text-xs text-navy/50 dark:text-white/50">
                    <Users className="h-3.5 w-3.5" />
                    seats
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CalendarCheck className="mr-2 h-4 w-4" />
                )}
                {loading ? "Reserving…" : "Confirm RSVP"}
              </Button>
              <p className="text-center text-xs text-navy/50 dark:text-white/50">
                We'll only email you about this event.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
