"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Mail, Send, Loader2, MailCheck, Users, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/newsletter", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d?.ok && typeof d.count === "number" && setCount(d.count))
      .catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || done) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: "Couldn't subscribe",
          description: data?.error ?? "Please try again shortly.",
          variant: "destructive",
        });
        return;
      }
      setDone(true);
      setCount((c) => (typeof c === "number" ? c + 1 : 1));
      toast({
        title: "You're on the list!",
        description: data.message ?? "Watch your inbox for updates from Dr. Wright.",
      });
      setEmail("");
      setName("");
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
      id="newsletter"
      className="relative isolate overflow-hidden bg-sky-gradient py-20 md:py-28"
    >
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-overlay opacity-90" />
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
      </div>

      <HeartbeatLine
        className="pointer-events-none absolute left-0 right-0 top-12 h-16 opacity-30"
        color="rgba(255,255,255,0.85)"
        glow
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Stay Connected
          </span>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-wide text-shadow-glow sm:text-5xl md:text-6xl">
            Join the Reader's Round
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-base leading-relaxed text-white/90 sm:text-lg">
            Get early news on events, book signings, audiobook excerpts, and the
            occasional letter from Dr. Wright himself. No spam — just the rounds
            worth making.
          </p>

          {count !== null && count > 0 && (
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Users className="h-3.5 w-3.5" />
              {count.toLocaleString()} reader{count === 1 ? "" : "s"} already on the list
            </span>
          )}
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-10">
          {done ? (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-white/30 bg-white/15 p-8 text-center backdrop-blur-xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <MailCheck className="h-7 w-7 text-white" />
              </span>
              <div>
                <p className="font-display text-2xl tracking-wide text-white">
                  You're subscribed!
                </p>
                <p className="mt-1 font-serif text-sm text-white/85">
                  Thank you for joining the reader's round. Welcome aboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="text-xs font-semibold uppercase tracking-wider text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto flex max-w-xl flex-col gap-3 rounded-3xl border border-white/30 bg-white/15 p-5 backdrop-blur-xl sm:flex-row sm:items-end sm:p-6"
            >
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <label
                    htmlFor="nl-name"
                    className="mb-1 block text-left text-[11px] font-semibold uppercase tracking-wider text-white/80"
                  >
                    Your Name <span className="text-white/50">(optional)</span>
                  </label>
                  <Input
                    id="nl-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    className="border-white/40 bg-white/15 text-white placeholder:text-white/60 focus:border-white focus-visible:ring-white/40"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="nl-email"
                    className="mb-1 block text-left text-[11px] font-semibold uppercase tracking-wider text-white/80"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                    <Input
                      id="nl-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="border-white/40 bg-white/15 pl-9 text-white placeholder:text-white/60 focus:border-white focus-visible:ring-white/40"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-white px-6 text-violet hover:bg-white/90 sm:w-auto"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {loading ? "Subscribing" : "Subscribe"}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-xs text-white/70">
            By subscribing you agree to receive occasional emails. Unsubscribe
            anytime.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
