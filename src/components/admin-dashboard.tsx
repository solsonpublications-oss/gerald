"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Star,
  Mail,
  Users,
  CalendarCheck,
  Trash2,
  Check,
  X,
  LogOut,
  Loader2,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Inbox,
  PenLine,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { AdminSearchAndPagination } from "@/components/admin-search-pagination";

const TOKEN_KEY = "rol_admin_token";
const DEFAULT_TOKEN = "demo";

type Tab = "stats" | "reviews" | "messages" | "subscribers" | "rsvps" | "blog" | "comments" | "events";

interface Stats {
  subscribers: number;
  pendingReviews: number;
  approvedReviews: number;
  unhandledMessages: number;
  rsvps: number;
  totalAttendees: number;
  events: number;
}

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  approved: boolean;
  createdAt: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  createdAt: string;
}

interface Rsvp {
  id: string;
  eventId: string;
  name: string;
  email: string;
  count: number;
  createdAt: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  published: boolean;
  featured: boolean;
  readMinutes: number;
  publishedAt: string | null;
  createdAt: string;
}

interface Comment {
  id: string;
  postSlug: string;
  name: string;
  body: string;
  approved: boolean;
  createdAt: string;
}

interface AdminEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  description: string | null;
  ticketUrl: string | null;
  capacity: number;
  soldOut: boolean;
  active: boolean;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("stats");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [showEventEditor, setShowEventEditor] = useState(false);

  // search + pagination state for the main admin tables
  const PAGE_SIZE = 20;
  const [reviewsQuery, setReviewsQuery] = useState("");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [messagesQuery, setMessagesQuery] = useState("");
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [messagesTotalPages, setMessagesTotalPages] = useState(1);
  const [subscribersQuery, setSubscribersQuery] = useState("");
  const [subscribersPage, setSubscribersPage] = useState(1);
  const [subscribersTotal, setSubscribersTotal] = useState(0);
  const [subscribersTotalPages, setSubscribersTotalPages] = useState(1);

  // Restore token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      setAuthed(true);
    }
  }, []);

  const api = useCallback(
    async (path: string, opts?: RequestInit) => {
      const res = await fetch(path, {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || DEFAULT_TOKEN}`,
          ...(opts?.headers ?? {}),
        },
      });
      return res;
    },
    [token]
  );

  // Load data when authed or tab changes
  const loadData = useCallback(
    async (which?: Tab) => {
      setLoading(true);
      try {
        if (which === "stats" || (!which && tab === "stats")) {
          const r = await api("/api/admin/stats");
          if (r.ok) {
            const d = await r.json();
            setStats(d.stats);
          } else if (r.status === 401) {
            setAuthed(false);
            return;
          }
        }
        if (which === "reviews" || (!which && tab === "reviews")) {
          const r = await api(
            `/api/admin/reviews?page=${reviewsPage}&pageSize=${PAGE_SIZE}&q=${encodeURIComponent(reviewsQuery)}`
          );
          if (r.ok) {
            const d = await r.json();
            setReviews(d.reviews);
            setReviewsTotal(d.total ?? 0);
            setReviewsTotalPages(d.totalPages ?? 1);
          }
        }
        if (which === "messages" || (!which && tab === "messages")) {
          const r = await api(
            `/api/admin/messages?page=${messagesPage}&pageSize=${PAGE_SIZE}&q=${encodeURIComponent(messagesQuery)}`
          );
          if (r.ok) {
            const d = await r.json();
            setMessages(d.messages);
            setMessagesTotal(d.total ?? 0);
            setMessagesTotalPages(d.totalPages ?? 1);
          }
        }
        if (which === "subscribers" || (!which && tab === "subscribers")) {
          const r = await api(
            `/api/admin/subscribers?page=${subscribersPage}&pageSize=${PAGE_SIZE}&q=${encodeURIComponent(subscribersQuery)}`
          );
          if (r.ok) {
            const d = await r.json();
            setSubscribers(d.subscribers);
            setSubscribersTotal(d.total ?? 0);
            setSubscribersTotalPages(d.totalPages ?? 1);
          }
        }
        if (which === "rsvps" || (!which && tab === "rsvps")) {
          const r = await api("/api/admin/rsvps");
          if (r.ok) {
            const d = await r.json();
            setRsvps(d.rsvps);
          }
        }
        if (which === "blog" || (!which && tab === "blog")) {
          const r = await api("/api/admin/blog");
          if (r.ok) {
            const d = await r.json();
            setBlogPosts(d.posts);
          }
        }
        if (which === "comments" || (!which && tab === "comments")) {
          const r = await api("/api/admin/comments");
          if (r.ok) {
            const d = await r.json();
            setComments(d.comments);
          }
        }
        if (which === "events" || (!which && tab === "events")) {
          const r = await api("/api/admin/events");
          if (r.ok) {
            const d = await r.json();
            setAdminEvents(d.events);
          }
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    },
    [
      api,
      tab,
      reviewsPage,
      reviewsQuery,
      messagesPage,
      messagesQuery,
      subscribersPage,
      subscribersQuery,
    ]
  );

  useEffect(() => {
    if (authed) loadData("stats");
  }, [authed, loadData]);

  useEffect(() => {
    if (authed) loadData(tab);
  }, [tab, authed, loadData]);

  // Debounced search effect — reload when search query changes (after a short delay)
  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(() => {
      if (tab === "reviews" && reviewsPage !== 1) setReviewsPage(1);
      else if (tab === "reviews") loadData("reviews");
    }, 350);
    return () => clearTimeout(t);
  }, [reviewsQuery, authed, tab, reviewsPage, loadData]);

  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(() => {
      if (tab === "messages" && messagesPage !== 1) setMessagesPage(1);
      else if (tab === "messages") loadData("messages");
    }, 350);
    return () => clearTimeout(t);
  }, [messagesQuery, authed, tab, messagesPage, loadData]);

  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(() => {
      if (tab === "subscribers" && subscribersPage !== 1) setSubscribersPage(1);
      else if (tab === "subscribers") loadData("subscribers");
    }, 350);
    return () => clearTimeout(t);
  }, [subscribersQuery, authed, tab, subscribersPage, loadData]);

  // Reload when page changes
  useEffect(() => {
    if (authed && tab === "reviews") loadData("reviews");
  }, [reviewsPage, authed, tab, loadData]);

  useEffect(() => {
    if (authed && tab === "messages") loadData("messages");
  }, [messagesPage, authed, tab, loadData]);

  useEffect(() => {
    if (authed && tab === "subscribers") loadData("subscribers");
  }, [subscribersPage, authed, tab, loadData]);

  function onLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast({ title: "Enter a token", variant: "destructive" });
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    setAuthed(true);
    toast({ title: "Signed in", description: "Welcome to the admin dashboard." });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setStats(null);
  }

  async function approveReview(id: string, approved: boolean) {
    const r = await api(`/api/admin/reviews/approve?id=${id}`, {
      method: "POST",
      body: JSON.stringify({ approved }),
    });
    const d = await r.json();
    if (d.ok) {
      setReviews((prev) =>
        prev.map((rv) => (rv.id === id ? { ...rv, approved } : rv))
      );
      toast({
        title: approved ? "Review approved" : "Review unapproved",
      });
    }
  }

  async function deleteReview(id: string) {
    const r = await api(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    if (r.ok) {
      setReviews((prev) => prev.filter((rv) => rv.id !== id));
      toast({ title: "Review deleted" });
    }
  }

  async function toggleMessage(id: string, handled: boolean) {
    const r = await api(`/api/admin/messages?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ handled }),
    });
    if (r.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, handled } : m))
      );
    }
  }

  async function deleteMessage(id: string) {
    const r = await api(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    if (r.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Message deleted" });
    }
  }

  async function deleteSubscriber(id: string) {
    const r = await api(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
    if (r.ok) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Subscriber removed" });
    }
  }

  async function deleteRsvp(id: string) {
    const r = await api(`/api/admin/rsvps?id=${id}`, { method: "DELETE" });
    if (r.ok) {
      setRsvps((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "RSVP removed" });
    }
  }

  async function toggleBlogPublished(id: string, published: boolean) {
    const r = await api(`/api/admin/blog?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ published }),
    });
    if (r.ok) {
      const d = await r.json();
      setBlogPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, published, publishedAt: d.post?.publishedAt ?? p.publishedAt }
            : p
        )
      );
      toast({ title: published ? "Post published" : "Post unpublished" });
    }
  }

  async function deleteBlogPost(id: string) {
    const r = await api(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    if (r.ok) {
      setBlogPosts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Post deleted" });
    }
  }

  async function toggleCommentApproved(id: string, approved: boolean) {
    const r = await api(`/api/admin/comments/approve?id=${id}`, {
      method: "POST",
      body: JSON.stringify({ approved }),
    });
    if (r.ok) {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved } : c))
      );
      toast({ title: approved ? "Comment approved" : "Comment unapproved" });
    }
  }

  async function deleteComment(id: string) {
    const r = await api(`/api/admin/comments?id=${id}`, { method: "DELETE" });
    if (r.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Comment deleted" });
    }
  }

  async function toggleEventActive(id: string, active: boolean) {
    const r = await api(`/api/admin/events?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    });
    if (r.ok) {
      setAdminEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, active } : e))
      );
      toast({ title: active ? "Event activated" : "Event hidden" });
    }
  }

  async function toggleEventSoldOut(id: string, soldOut: boolean) {
    const r = await api(`/api/admin/events?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ soldOut }),
    });
    if (r.ok) {
      setAdminEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, soldOut } : e))
      );
    }
  }

  async function deleteAdminEvent(id: string) {
    const r = await api(`/api/admin/events?id=${id}`, { method: "DELETE" });
    if (r.ok) {
      setAdminEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Event deleted" });
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist p-4">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-violet/15 bg-white shadow-soft-lg">
          <div className="bg-violet-gradient p-6 text-center text-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="mt-3 font-display text-3xl tracking-wide">
              Admin Access
            </h1>
            <p className="font-serif text-sm text-white/80">
              Rounds of a Lifetime — internal dashboard
            </p>
          </div>
          <form onSubmit={onLogin} className="space-y-4 p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
                Access Token
              </label>
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin token"
                autoFocus
              />
              <p className="text-[11px] text-navy/50">
                Demo token: <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-violet">demo</code>
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
            >
              Sign In
            </Button>
            <a
              href="/"
              className="block text-center text-xs text-navy/50 hover:text-violet"
            >
              ← Back to site
            </a>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Star; count?: number }[] = [
    { id: "stats", label: "Overview", icon: LayoutDashboard },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      count: stats?.pendingReviews,
    },
    {
      id: "messages",
      label: "Messages",
      icon: Mail,
      count: stats?.unhandledMessages,
    },
    { id: "subscribers", label: "Subscribers", icon: Users, count: stats?.subscribers },
    { id: "rsvps", label: "RSVPs", icon: CalendarCheck, count: stats?.rsvps },
    { id: "blog", label: "Blog", icon: PenLine, count: blogPosts.filter((p) => !p.published).length },
    { id: "comments", label: "Comments", icon: MessageSquare, count: comments.filter((c) => !c.approved).length },
    { id: "events", label: "Events", icon: CalendarCheck, count: adminEvents.filter((e) => e.active).length },
  ];

  return (
    <div className="min-h-screen bg-mist">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-violet/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/10 text-violet">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg tracking-wide text-navy">
                Admin Dashboard
              </p>
              <p className="text-[11px] text-navy/50">
                Rounds of a Lifetime
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-violet/20 px-3 py-1.5 text-xs font-semibold text-violet transition-colors hover:bg-violet/5 sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Site
            </a>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-navy/70 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Tabs */}
        <nav className="mb-6 flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-violet text-white shadow-violet-glow"
                  : "bg-white text-navy/70 hover:bg-violet/5 hover:text-violet"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.count ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    tab === t.id
                      ? "bg-white/25 text-white"
                      : "bg-violet/15 text-violet"
                  )}
                >
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-navy/50">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading…
          </div>
        )}

        {/* Stats tab */}
        {!loading && tab === "stats" && stats && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                icon={Users}
                label="Newsletter Subscribers"
                value={stats.subscribers}
                tone="violet"
              />
              <StatCard
                icon={Star}
                label="Reviews Pending"
                value={stats.pendingReviews}
                tone="amber"
                sub={`${stats.approvedReviews} approved`}
              />
              <StatCard
                icon={Mail}
                label="Unhandled Messages"
                value={stats.unhandledMessages}
                tone="sky"
              />
              <StatCard
                icon={CalendarCheck}
                label="Total RSVPs"
                value={stats.rsvps}
                tone="emerald"
                sub={`${stats.totalAttendees} attendees`}
              />
              <StatCard
                icon={LayoutDashboard}
                label="Active Events"
                value={stats.events}
                tone="violet"
              />
            </div>
            <div className="rounded-3xl border border-violet/10 bg-white p-6 shadow-soft">
              <HeartbeatLine
                className="h-12 opacity-40"
                color="#5b2a86"
                width={2}
              />
              <p className="mt-2 font-serif text-sm italic text-navy/60">
                &ldquo;Every round, a verse in the poetry of a life in medicine.&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {!loading && tab === "reviews" && (
          <div className="space-y-3">
            <AdminSearchAndPagination
              query={reviewsQuery}
              onQueryChange={setReviewsQuery}
              page={reviewsPage}
              totalPages={reviewsTotalPages}
              total={reviewsTotal}
              pageSize={20}
              onPageChange={setReviewsPage}
              placeholder="Search reviews by name, role, or quote…"
            />
            {reviews.length === 0 ? (
              <EmptyState icon={Star} label={reviewsQuery ? "No reviews match your search." : "No reviews yet"} />
            ) : (
              reviews.map((rv) => (
                <div
                  key={rv.id}
                  className="rounded-2xl border border-violet/10 bg-white p-4 shadow-soft sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy">{rv.name}</span>
                        <span className="text-xs text-navy/50">{rv.role}</span>
                        <span className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={cn(
                                "h-3 w-3",
                                s <= rv.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-navy/10 text-navy/20"
                              )}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="mt-2 font-serif text-sm italic text-navy/75">
                        &ldquo;{rv.quote}&rdquo;
                      </p>
                      <p className="mt-2 text-[11px] text-navy/40">
                        {new Date(rv.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                          rv.approved
                            ? "bg-emerald-500/15 text-emerald-700"
                            : "bg-amber-500/15 text-amber-700"
                        )}
                      >
                        {rv.approved ? "Approved" : "Pending"}
                      </span>
                      <button
                        onClick={() => approveReview(rv.id, !rv.approved)}
                        className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                      >
                        <Check className="h-3 w-3" />
                        {rv.approved ? "Unapprove" : "Approve"}
                      </button>
                      <button
                        onClick={() => deleteReview(rv.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-500/5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Messages tab */}
        {!loading && tab === "messages" && (
          <div className="space-y-3">
            <AdminSearchAndPagination
              query={messagesQuery}
              onQueryChange={setMessagesQuery}
              page={messagesPage}
              totalPages={messagesTotalPages}
              total={messagesTotal}
              pageSize={20}
              onPageChange={setMessagesPage}
              placeholder="Search messages by name, email, subject, or text…"
            />
            {messages.length === 0 ? (
              <EmptyState icon={Inbox} label={messagesQuery ? "No messages match your search." : "No messages"} />
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-violet/10 bg-white p-4 shadow-soft sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-navy">{m.name}</span>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-xs text-violet hover:underline"
                        >
                          {m.email}
                        </a>
                        <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-semibold text-violet">
                          {m.subject}
                        </span>
                        {m.handled && (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            Handled
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-serif text-sm text-navy/80">
                        {m.message}
                      </p>
                      <p className="mt-2 text-[11px] text-navy/40">
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <button
                        onClick={() => toggleMessage(m.id, !m.handled)}
                        className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                      >
                        <Check className="h-3 w-3" />
                        {m.handled ? "Mark new" : "Mark handled"}
                      </button>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-500/5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Subscribers tab */}
        {!loading && tab === "subscribers" && (
          <div className="space-y-3">
            <AdminSearchAndPagination
              query={subscribersQuery}
              onQueryChange={setSubscribersQuery}
              page={subscribersPage}
              totalPages={subscribersTotalPages}
              total={subscribersTotal}
              pageSize={20}
              onPageChange={setSubscribersPage}
              placeholder="Search subscribers by email or name…"
            />
            <div className="overflow-hidden rounded-2xl border border-violet/10 bg-white shadow-soft">
              {subscribers.length === 0 ? (
                <EmptyState icon={Users} label={subscribersQuery ? "No subscribers match your search." : "No subscribers yet"} />
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-violet/10 bg-mist/50 text-xs uppercase tracking-wider text-navy/60">
                    <tr>
                      <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Status</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Joined</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-violet/5">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-mist/40">
                      <td className="px-4 py-3 font-medium text-navy">{s.email}</td>
                      <td className="px-4 py-3 text-navy/70">{s.name ?? "—"}</td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            s.active
                              ? "bg-emerald-500/15 text-emerald-700"
                              : "bg-navy/10 text-navy/50"
                          )}
                        >
                          {s.active ? "Active" : "Unsubscribed"}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-navy/50 sm:table-cell">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteSubscriber(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-500/5"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            </div>
          </div>
        )}

        {/* RSVPs tab */}
        {!loading && tab === "rsvps" && (
          <div className="overflow-hidden rounded-2xl border border-violet/10 bg-white shadow-soft">
            {rsvps.length === 0 ? (
              <EmptyState icon={CalendarCheck} label="No RSVPs yet" />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-violet/10 bg-mist/50 text-xs uppercase tracking-wider text-navy/60">
                  <tr>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Email</th>
                    <th className="px-4 py-3 text-center">Seats</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-violet/5">
                  {rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-mist/40">
                      <td className="px-4 py-3 font-mono text-xs text-violet">
                        {r.eventId}
                      </td>
                      <td className="px-4 py-3 font-medium text-navy">{r.name}</td>
                      <td className="hidden px-4 py-3 text-navy/70 sm:table-cell">
                        {r.email}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet/10 font-bold text-violet">
                          {r.count}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-navy/50 sm:table-cell">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteRsvp(r.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-500/5"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Blog tab */}
        {!loading && tab === "blog" && (
          <BlogManager
            posts={blogPosts}
            editingPost={editingPost}
            showEditor={showEditor}
            onNew={() => {
              setEditingPost(null);
              setShowEditor(true);
            }}
            onEdit={(p) => {
              setEditingPost(p);
              setShowEditor(true);
            }}
            onCloseEditor={() => setShowEditor(false)}
            onTogglePublished={toggleBlogPublished}
            onDelete={deleteBlogPost}
            api={api}
            onSaved={() => {
              setShowEditor(false);
              loadData("blog");
            }}
          />
        )}

        {/* Comments tab */}
        {!loading && tab === "comments" && (
          <div className="space-y-3">
            {comments.length === 0 ? (
              <EmptyState icon={MessageSquare} label="No comments yet" />
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-violet/10 bg-white p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-navy">{c.name}</span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            c.approved
                              ? "bg-emerald-500/15 text-emerald-700"
                              : "bg-amber-500/15 text-amber-700"
                          )}
                        >
                          {c.approved ? "Approved" : "Pending"}
                        </span>
                        <a
                          href={`/blog/${c.postSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-violet hover:underline"
                        >
                          /blog/{c.postSlug}
                        </a>
                      </div>
                      <p className="mt-2 font-serif text-sm text-navy/80">
                        {c.body}
                      </p>
                      <p className="mt-2 text-[11px] text-navy/40">
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <button
                        onClick={() => toggleCommentApproved(c.id, !c.approved)}
                        className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                      >
                        <Check className="h-3 w-3" />
                        {c.approved ? "Unapprove" : "Approve"}
                      </button>
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-500/5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Events tab */}
        {!loading && tab === "events" && (
          <EventManager
            events={adminEvents}
            editingEvent={editingEvent}
            showEditor={showEventEditor}
            onNew={() => {
              setEditingEvent(null);
              setShowEventEditor(true);
            }}
            onEdit={(e) => {
              setEditingEvent(e);
              setShowEventEditor(true);
            }}
            onCloseEditor={() => setShowEventEditor(false)}
            onToggleActive={toggleEventActive}
            onToggleSoldOut={toggleEventSoldOut}
            onDelete={deleteAdminEvent}
            api={api}
            onSaved={() => {
              setShowEventEditor(false);
              loadData("events");
            }}
          />
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  tone: "violet" | "amber" | "sky" | "emerald";
  sub?: string;
}) {
  const toneMap = {
    violet: "bg-violet/10 text-violet",
    amber: "bg-amber-500/15 text-amber-600",
    sky: "bg-sky/20 text-sky-700",
    emerald: "bg-emerald-500/15 text-emerald-600",
  };
  return (
    <div className="rounded-3xl border border-violet/10 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            toneMap[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-display text-4xl text-navy">{value}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-navy/70">{label}</p>
      {sub && <p className="text-xs text-navy/50">{sub}</p>}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  label,
}: {
  icon: typeof Star;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-violet/20 bg-white/50 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet">
        <Icon className="h-6 w-6" />
      </span>
      <p className="font-serif text-sm text-navy/60">{label}</p>
    </div>
  );
}

/* ── Blog Manager ──────────────────────────────────────────────── */
function BlogManager({
  posts,
  editingPost,
  showEditor,
  onNew,
  onEdit,
  onCloseEditor,
  onTogglePublished,
  onDelete,
  api,
  onSaved,
}: {
  posts: BlogPost[];
  editingPost: BlogPost | null;
  showEditor: boolean;
  onNew: () => void;
  onEdit: (p: BlogPost) => void;
  onCloseEditor: () => void;
  onTogglePublished: (id: string, published: boolean) => void;
  onDelete: (id: string) => void;
  api: (path: string, opts?: RequestInit) => Promise<Response>;
  onSaved: () => void;
}) {
  return (
    <div className="space-y-4">
      {!showEditor ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-navy/60">
              {posts.length} post{posts.length === 1 ? "" : "s"}
            </p>
            <Button
              onClick={onNew}
              className="bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>
          {posts.length === 0 ? (
            <EmptyState icon={PenLine} label="No blog posts yet" />
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-violet/10 bg-white p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            p.published
                              ? "bg-emerald-500/15 text-emerald-700"
                              : "bg-amber-500/15 text-amber-700"
                          )}
                        >
                          {p.published ? "Published" : "Draft"}
                        </span>
                        <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-semibold text-violet">
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="rounded-full bg-sky/20 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-semibold text-navy">{p.title}</h3>
                      <p className="mt-1 line-clamp-2 font-serif text-xs text-navy/60">
                        {p.excerpt}
                      </p>
                      <p className="mt-1 text-[11px] text-navy/40">
                        /blog/{p.slug} · {p.readMinutes} min read
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <button
                        onClick={() => onEdit(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => onTogglePublished(p.id, !p.published)}
                        className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                      >
                        {p.published ? (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" />
                            Publish
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-500/5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <BlogEditor
          post={editingPost}
          api={api}
          onClose={onCloseEditor}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

function BlogEditor({
  post,
  api,
  onClose,
  onSaved,
}: {
  post: BlogPost | null;
  api: (path: string, opts?: RequestInit) => Promise<Response>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    category: post?.category ?? "Update",
    readMinutes: post?.readMinutes ?? 3,
    published: post?.published ?? false,
    featured: post?.featured ?? false,
  });

  function set<K extends keyof typeof form>(key: K, val: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const isEdit = !!post;
      const res = await api(
        isEdit ? `/api/admin/blog?id=${post!.id}` : "/api/admin/blog",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(form),
        }
      );
      const d = await res.json();
      if (!res.ok || !d.ok) {
        toast({
          title: "Couldn't save post",
          description: d?.error ?? "Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: isEdit ? "Post updated" : "Post created" });
      onSaved();
    } catch {
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSave}
      className="overflow-hidden rounded-3xl border border-violet/10 bg-white p-5 shadow-soft sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-2xl tracking-wide text-navy">
          {post ? "Edit Post" : "New Post"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close editor"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy/50 hover:bg-mist"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
            Title *
          </label>
          <Input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Post title"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Slug
            </label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto-generated from title"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Category
            </label>
            <Input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="On Writing, Medical School, etc."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
            Excerpt *
          </label>
          <textarea
            required
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            placeholder="A short summary for cards and SEO"
            className="w-full resize-none rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
            Body * <span className="text-navy/40">(use blank lines to separate paragraphs)</span>
          </label>
          <textarea
            required
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            rows={10}
            placeholder="Write the post body…"
            className="w-full resize-y rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 font-serif text-sm leading-relaxed text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Read minutes
            </label>
            <Input
              type="number"
              min={1}
              max={60}
              value={form.readMinutes}
              onChange={(e) => set("readMinutes", Number(e.target.value))}
            />
          </div>
          <label className="flex items-end gap-2 pb-2.5">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-4 w-4 accent-violet"
            />
            <span className="text-sm font-medium text-navy/70">Published</span>
          </label>
          <label className="flex items-end gap-2 pb-2.5">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-violet"
            />
            <span className="text-sm font-medium text-navy/70">Featured</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-violet/10 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            className="text-navy/70"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ── Event Manager ─────────────────────────────────────────────── */
function EventManager({
  events,
  editingEvent,
  showEditor,
  onNew,
  onEdit,
  onCloseEditor,
  onToggleActive,
  onToggleSoldOut,
  onDelete,
  api,
  onSaved,
}: {
  events: AdminEvent[];
  editingEvent: AdminEvent | null;
  showEditor: boolean;
  onNew: () => void;
  onEdit: (e: AdminEvent) => void;
  onCloseEditor: () => void;
  onToggleActive: (id: string, active: boolean) => void;
  onToggleSoldOut: (id: string, soldOut: boolean) => void;
  onDelete: (id: string) => void;
  api: (path: string, opts?: RequestInit) => Promise<Response>;
  onSaved: () => void;
}) {
  return (
    <div className="space-y-4">
      {!showEditor ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-navy/60">
              {events.length} event{events.length === 1 ? "" : "s"}
            </p>
            <Button
              onClick={onNew}
              className="bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
            >
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </div>
          {events.length === 0 ? (
            <EmptyState icon={CalendarCheck} label="No events yet" />
          ) : (
            <div className="space-y-3">
              {events.map((e) => {
                const d = new Date(e.date);
                return (
                  <div
                    key={e.id}
                    className="rounded-2xl border border-violet/10 bg-white p-4 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              e.active
                                ? "bg-emerald-500/15 text-emerald-700"
                                : "bg-navy/10 text-navy/50"
                            )}
                          >
                            {e.active ? "Active" : "Hidden"}
                          </span>
                          <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-semibold text-violet">
                            {e.type}
                          </span>
                          {e.soldOut && (
                            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">
                              Sold Out
                            </span>
                          )}
                          {e.capacity > 0 && (
                            <span className="text-[10px] text-navy/50">
                              cap {e.capacity}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 font-semibold text-navy">{e.title}</h3>
                        <p className="mt-1 text-xs text-navy/60">
                          {d.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {e.time}
                        </p>
                        <p className="mt-0.5 text-xs text-navy/50">
                          {e.venue}, {e.city}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1.5">
                        <button
                          onClick={() => onEdit(e)}
                          className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => onToggleSoldOut(e.id, !e.soldOut)}
                          className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                        >
                          {e.soldOut ? "Mark available" : "Mark sold out"}
                        </button>
                        <button
                          onClick={() => onToggleActive(e.id, !e.active)}
                          className="inline-flex items-center gap-1 rounded-lg border border-violet/20 px-2.5 py-1 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/5"
                        >
                          {e.active ? "Hide" : "Show"}
                        </button>
                        <button
                          onClick={() => onDelete(e.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-500/5"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <EventEditor
          event={editingEvent}
          api={api}
          onClose={onCloseEditor}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

function EventEditor({
  event,
  api,
  onClose,
  onSaved,
}: {
  event: AdminEvent | null;
  api: (path: string, opts?: RequestInit) => Promise<Response>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: event?.title ?? "",
    type: event?.type ?? "Book Signing",
    date: event?.date ? new Date(event.date).toISOString().slice(0, 10) : "",
    time: event?.time ?? "7:00 PM",
    city: event?.city ?? "",
    venue: event?.venue ?? "",
    description: event?.description ?? "",
    ticketUrl: event?.ticketUrl ?? "",
    capacity: event?.capacity ?? 0,
    soldOut: event?.soldOut ?? false,
    active: event?.active ?? true,
  });

  function set<K extends keyof typeof form>(key: K, val: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const isEdit = !!event;
      const res = await api(
        isEdit ? `/api/admin/events?id=${event!.id}` : "/api/admin/events",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(form),
        }
      );
      const d = await res.json();
      if (!res.ok || !d.ok) {
        toast({
          title: "Couldn't save event",
          description: d?.error ?? "Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: isEdit ? "Event updated" : "Event created" });
      onSaved();
    } catch {
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSave}
      className="overflow-hidden rounded-3xl border border-violet/10 bg-white p-5 shadow-soft sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-2xl tracking-wide text-navy">
          {event ? "Edit Event" : "New Event"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close editor"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy/50 hover:bg-mist"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
            Title *
          </label>
          <Input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Event title"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 text-sm text-navy outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
            >
              <option>Book Signing</option>
              <option>Speaking</option>
              <option>Virtual</option>
              <option>Author Talk</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Date *
            </label>
            <Input
              type="date"
              required
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Time
            </label>
            <Input
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              placeholder="7:00 PM"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              City *
            </label>
            <Input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Atlanta, GA"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Venue *
            </label>
            <Input
              required
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="Fox Theatre"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            placeholder="A reading, Q&A, and signing…"
            className="w-full resize-none rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Ticket URL
            </label>
            <Input
              value={form.ticketUrl}
              onChange={(e) => set("ticketUrl", e.target.value)}
              placeholder="https://example.com/tickets"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
              Capacity (0 = unlimited)
            </label>
            <Input
              type="number"
              min={0}
              value={form.capacity}
              onChange={(e) => set("capacity", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.soldOut}
              onChange={(e) => set("soldOut", e.target.checked)}
              className="h-4 w-4 accent-violet"
            />
            <span className="text-sm font-medium text-navy/70">Sold out</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 accent-violet"
            />
            <span className="text-sm font-medium text-navy/70">Active (visible)</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-violet/10 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            className="text-navy/70"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : event ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </div>
    </form>
  );
}
