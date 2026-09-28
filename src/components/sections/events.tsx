"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Loader2,
  Video,
  Mic,
  BookMarked,
  Users,
  Heart,
  LayoutGrid,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { RsvpDialog } from "@/components/rsvp-dialog";

interface EventItem {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  description?: string;
  ticketUrl?: string;
  soldOut?: boolean;
  capacity?: number;
  isFallback?: boolean;
}

type ViewMode = "list" | "calendar";

const typeMeta: Record<
  string,
  { icon: typeof Video; tone: string; label: string }
> = {
  "Book Signing": { icon: BookMarked, tone: "bg-violet/15 text-violet", label: "Signing" },
  Speaking: { icon: Mic, tone: "bg-sky/25 text-navy", label: "Keynote" },
  Virtual: { icon: Video, tone: "bg-emerald-500/15 text-emerald-600", label: "Virtual" },
  "Author Talk": { icon: Mic, tone: "bg-violet/15 text-violet", label: "Talk" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate(),
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    full: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [rsvpEvent, setRsvpEvent] = useState<EventItem | null>(null);
  const [view, setView] = useState<ViewMode>("list");
  const [calMonth, setCalMonth] = useState(() => {
    // start at the month of the first upcoming event, or current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/events", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.ok && Array.isArray(d.events)) {
          setEvents(d.events);
          // fetch RSVP counts for each event
          d.events.forEach((ev: EventItem) => {
            fetch(`/api/events/rsvp?eventId=${encodeURIComponent(ev.id)}`)
              .then((r) => r.json())
              .then((c) => {
                if (!cancelled && c?.ok) {
                  setCounts((prev) => ({ ...prev, [ev.id]: c.count }));
                }
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  function onRsvpSubmitted(eventId: string, newCount: number) {
    setCounts((prev) => ({ ...prev, [eventId]: newCount }));
  }

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-mist py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-50" />
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="On Tour"
          title="Upcoming Events & Appearances"
          subtitle="Come meet Dr. Wright in person — at readings, signings, keynotes, and virtual book-club nights."
        />

        {/* View toggle */}
        {!loading && events.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-violet/15 bg-white p-1 shadow-soft">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  view === "list"
                    ? "bg-violet text-white shadow-violet-glow"
                    : "text-navy/70 hover:bg-violet/5 hover:text-violet"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                List
              </button>
              <button
                type="button"
                onClick={() => setView("calendar")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  view === "calendar"
                    ? "bg-violet text-white shadow-violet-glow"
                    : "text-navy/70 hover:bg-violet/5 hover:text-violet"
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Calendar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="mt-14 flex items-center justify-center gap-3 text-navy/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading events…
          </div>
        ) : events.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-violet/10 bg-white p-10 text-center shadow-soft">
            <p className="font-serif text-lg text-navy/70">
              No events scheduled at the moment. Join the newsletter to be the
              first to hear about new appearances.
            </p>
            <a
              href="#newsletter"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white shadow-violet-glow hover:bg-violet-dark"
            >
              Join the Newsletter
            </a>
          </div>
        ) : view === "calendar" ? (
          <CalendarView
            events={events}
            counts={counts}
            calMonth={calMonth}
            setCalMonth={setCalMonth}
            onRsvp={(ev) => setRsvpEvent(ev)}
          />
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {events.map((ev, i) => {
              const d = formatDate(ev.date);
              const meta = typeMeta[ev.type] ?? typeMeta["Book Signing"];
              const Icon = meta.icon;
              const attendeeCount = counts[ev.id] ?? 0;
              return (
                <ScrollReveal key={ev.id} delay={i * 0.06} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-violet/10 bg-white p-5 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-violet/25 hover:shadow-soft-lg sm:p-6">
                    {/* top row: date block + type */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-violet-gradient text-white shadow-violet-glow">
                          <span className="font-display text-xs tracking-widest">
                            {d.month}
                          </span>
                          <span className="font-display text-2xl leading-none">
                            {d.day}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.tone}`}
                          >
                            <Icon className="h-3 w-3" />
                            {meta.label}
                          </span>
                          <p className="mt-1 text-xs font-medium text-navy/60">
                            {d.weekday} · {ev.time}
                          </p>
                        </div>
                      </div>
                      {ev.soldOut && (
                        <span className="shrink-0 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* title */}
                    <h3 className="mt-4 font-display text-2xl leading-tight tracking-wide text-navy">
                      {ev.title}
                    </h3>

                    {/* location */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-navy/70">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-violet" />
                        {ev.city} · {ev.venue}
                      </span>
                    </div>

                    {/* description */}
                    {ev.description && (
                      <p className="mt-3 flex-1 font-serif text-[15px] leading-relaxed text-navy/70">
                        {ev.description}
                      </p>
                    )}

                    {/* attendee count + capacity chip */}
                    {(attendeeCount > 0 || (ev.capacity ?? 0) > 0) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {attendeeCount > 0 && (
                          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                            <Users className="h-3.5 w-3.5" />
                            {attendeeCount} attending
                          </div>
                        )}
                        {(ev.capacity ?? 0) > 0 && (
                          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet/10 px-3 py-1 text-[11px] font-semibold text-violet">
                            <Ticket className="h-3.5 w-3.5" />
                            {attendeeCount}/{ev.capacity} seats
                          </div>
                        )}
                      </div>
                    )}

                    {/* footer CTA */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-violet/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="inline-flex items-center gap-1.5 font-serif text-xs italic text-navy/50">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{d.full}</span>
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRsvpEvent(ev)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/5 px-3.5 py-2 text-xs font-semibold text-violet transition-all hover:bg-violet/10"
                        >
                          <Heart className="h-3.5 w-3.5" />
                          RSVP
                        </button>
                        {ev.soldOut ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy/50">
                            Waitlist
                          </span>
                        ) : (
                          <a
                            href={ev.ticketUrl ?? "#newsletter"}
                            target={ev.ticketUrl ? "_blank" : undefined}
                            rel={ev.ticketUrl ? "noopener noreferrer" : undefined}
                            className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-violet px-4 py-2 text-xs font-semibold text-white shadow-violet-glow transition-all hover:bg-violet-dark"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            Tickets
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <HeartbeatLine
            className="h-8 max-w-md opacity-50"
            color="#5b2a86"
            width={1.5}
          />
          <p className="font-serif text-sm italic text-navy/60">
            Want Dr. Wright at your school, conference, or book club?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-violet/30 px-6 py-2.5 text-sm font-semibold text-violet transition-colors hover:bg-violet/5"
          >
            <Calendar className="h-4 w-4" />
            Request an Appearance
          </a>
        </div>
      </div>

      <RsvpDialog
        event={rsvpEvent}
        onClose={() => setRsvpEvent(null)}
        onSubmitted={onRsvpSubmitted}
      />
    </section>
  );
}

/* ── Calendar View ─────────────────────────────────────────────── */
function CalendarView({
  events,
  counts,
  calMonth,
  setCalMonth,
  onRsvp,
}: {
  events: EventItem[];
  counts: Record<string, number>;
  calMonth: Date;
  setCalMonth: (d: Date) => void;
  onRsvp: (ev: EventItem) => void;
}) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const monthLabel = calMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // first day of month + total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // build grid cells (leading blanks + days)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  // map events to day-of-month
  const eventsByDay: Record<number, EventItem[]> = {};
  events.forEach((ev) => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  });

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  return (
    <div className="mt-14 overflow-hidden rounded-3xl border border-violet/10 bg-white p-4 shadow-soft sm:p-6">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCalMonth(new Date(year, month - 1, 1))}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/20 text-violet transition-colors hover:bg-violet/5"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-display text-2xl tracking-wide text-navy">
          {monthLabel}
        </h3>
        <button
          type="button"
          onClick={() => setCalMonth(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/20 text-violet transition-colors hover:bg-violet/5"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekdays.map((wd) => (
          <div
            key={wd}
            className="pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-navy/40 sm:text-xs"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* day cells */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="min-h-[60px] sm:min-h-[88px]" />;
          }
          const dayEvents = eventsByDay[day] ?? [];
          return (
            <div
              key={day}
              className={`relative min-h-[60px] rounded-xl border p-1 sm:min-h-[88px] sm:p-1.5 ${
                isToday(day)
                  ? "border-violet bg-violet/5"
                  : "border-violet/10 bg-mist/30"
              }`}
            >
              <span
                className={`text-[11px] font-bold sm:text-sm ${
                  isToday(day) ? "text-violet" : "text-navy/60"
                }`}
              >
                {day}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((ev) => {
                  const meta = typeMeta[ev.type] ?? typeMeta["Book Signing"];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onRsvp(ev)}
                      className={`block w-full truncate rounded-md px-1 py-0.5 text-left text-[9px] font-semibold transition-colors hover:opacity-80 sm:text-[10px] ${meta.tone}`}
                      title={ev.title}
                    >
                      <Icon className="mr-0.5 inline h-2.5 w-2.5" />
                      {ev.title}
                    </button>
                  );
                })}
                {dayEvents.length > 2 && (
                  <span className="block px-1 text-[9px] text-navy/40">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-violet/10 pt-3 text-[10px] text-navy/50">
        <span className="font-semibold uppercase tracking-wider">Types:</span>
        {Object.entries(typeMeta).map(([key, m]) => (
          <span
            key={key}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${m.tone}`}
          >
            <m.icon className="h-2.5 w-2.5" />
            {m.label}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-violet bg-violet/5" />
          Today
        </span>
      </div>
    </div>
  );
}
