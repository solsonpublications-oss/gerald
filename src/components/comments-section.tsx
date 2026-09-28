"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  User,
  Reply,
  CornerDownRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeartbeatLine } from "@/components/heartbeat-line";
import { CommentReactions } from "@/components/comment-reactions";

interface Comment {
  id: string;
  postSlug: string;
  name: string;
  body: string;
  approved: boolean;
  createdAt: string;
  parentCommentId: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const avatarTones = [
  "bg-violet/15 text-violet",
  "bg-sky/25 text-sky-700",
  "bg-emerald-500/15 text-emerald-600",
  "bg-amber-500/15 text-amber-600",
];

export function CommentsSection({ postSlug }: { postSlug: string }) {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/blog/comments?postSlug=${encodeURIComponent(postSlug)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.ok && Array.isArray(d.comments)) {
          setComments(d.comments);
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [postSlug]);

  // top-level comments + replies grouped by parent
  const topLevel = comments.filter((c) => !c.parentCommentId);
  const repliesOf = (parentId: string) =>
    comments.filter((c) => c.parentCommentId === parentId);

  async function submitComment(parentId: string | null, nameVal: string, bodyVal: string) {
    const res = await fetch("/api/blog/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug, name: nameVal, body: bodyVal, parentCommentId: parentId }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      toast({
        title: "Couldn't post comment",
        description: data?.error ?? "Please try again shortly.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting || done) return;
    setSubmitting(true);
    try {
      const ok = await submitComment(null, name, body);
      if (ok) {
        setDone(true);
        toast({ title: "Comment submitted!", description: "Your comment will appear once approved." });
        setName("");
        setBody("");
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t border-violet/10 pt-8">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
          <MessageSquare className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl tracking-wide text-navy dark:text-white">
            Join the Conversation
          </h2>
          <p className="text-xs text-navy/60 dark:text-white/60">
            {loading
              ? "Loading comments…"
              : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <HeartbeatLine
        className="mt-4 h-5 w-32 opacity-50"
        color="#5b2a86"
        width={1.5}
      />

      {/* Comments list (threaded) */}
      {loading ? (
        <div className="mt-6 flex items-center gap-2 py-6 text-navy/50 dark:text-white/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : topLevel.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-violet/20 bg-mist/40 p-6 text-center">
          <p className="font-serif text-sm italic text-navy/60 dark:text-white/60">
            No comments yet. Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {topLevel.map((c, i) => {
            const tone = avatarTones[i % avatarTones.length];
            const replies = repliesOf(c.id);
            return (
              <div key={c.id}>
                <CommentCard comment={c} tone={tone} />
                {/* Reply button */}
                <div className="ml-13 mt-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setReplyingTo(replyingTo === c.id ? null : c.id)
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
                  >
                    <Reply className="h-3 w-3" />
                    Reply
                  </button>
                </div>
                {/* Inline reply form */}
                {replyingTo === c.id && (
                  <ReplyForm
                    onCancel={() => setReplyingTo(null)}
                    onSubmit={async (nameVal, bodyVal) => {
                      const ok = await submitComment(c.id, nameVal, bodyVal);
                      if (ok) {
                        toast({
                          title: "Reply submitted!",
                          description: "Your reply will appear once approved.",
                        });
                        setReplyingTo(null);
                      }
                      return ok;
                    }}
                  />
                )}
                {/* Replies */}
                {replies.length > 0 && (
                  <div className="ml-6 mt-3 space-y-3 border-l-2 border-violet/10 pl-4">
                    {replies.map((r, ri) => {
                      const rTone = avatarTones[(i + ri + 1) % avatarTones.length];
                      return (
                        <div key={r.id} className="relative">
                          <CornerDownRight className="absolute -left-7 top-3 h-3.5 w-3.5 text-violet/30" />
                          <CommentCard comment={r} tone={rTone} small />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Comment form */}
      <div className="mt-8 rounded-2xl border border-violet/10 bg-mist/40 p-5 dark:bg-white/5">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="font-display text-xl tracking-wide text-navy dark:text-white">
              Thank you!
            </p>
            <p className="font-serif text-sm text-navy/60 dark:text-white/60">
              Your comment will appear once approved.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="text-xs font-semibold uppercase tracking-wider text-violet underline-offset-4 hover:underline"
            >
              Write another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <p className="font-display text-lg tracking-wide text-navy dark:text-white">
              Leave a comment
            </p>
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
                Your Comment *
              </label>
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Share your thoughts on this post…"
                className="w-full resize-none rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20 dark:bg-[#1e2a38] dark:text-white dark:placeholder:text-white/40"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-violet text-white shadow-violet-glow hover:bg-violet-dark"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {submitting ? "Sending…" : "Post Comment"}
            </Button>
            <p className="text-xs text-navy/50 dark:text-white/50">
              Comments are moderated and appear once approved.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function CommentCard({
  comment,
  tone,
  small = false,
}: {
  comment: Comment;
  tone: string;
  small?: boolean;
}) {
  return (
    <div
      className={`flex gap-3 rounded-2xl border border-violet/10 bg-white p-4 shadow-soft dark:bg-[#1e2a38] ${
        small ? "py-3" : ""
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm ${tone} ${
          small ? "h-8 w-8 text-xs" : ""
        }`}
      >
        {initials(comment.name) || "R"}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-navy dark:text-white">
            {comment.name}
          </span>
          <span className="text-[11px] text-navy/40 dark:text-white/40">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1.5 font-serif text-[15px] leading-relaxed text-navy/80 dark:text-white/80">
          {comment.body}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <CommentReactions commentId={comment.id} />
        </div>
      </div>
    </div>
  );
}

function ReplyForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (name: string, body: string) => Promise<boolean>;
}) {
  const [rName, setRName] = useState("");
  const [rBody, setRBody] = useState("");
  const [sending, setSending] = useState(false);

  async function handle(e: FormEvent) {
    e.preventDefault();
    if (sending || !rName || !rBody) return;
    setSending(true);
    const ok = await onSubmit(rName, rBody);
    setSending(false);
    if (ok) {
      setRName("");
      setRBody("");
    }
  }

  return (
    <form
      onSubmit={handle}
      className="mt-2 rounded-xl border border-violet/15 bg-white p-3 dark:bg-[#1e2a38]"
    >
      <div className="flex gap-2">
        <Input
          required
          value={rName}
          onChange={(e) => setRName(e.target.value)}
          placeholder="Your name"
          className="flex-1"
        />
      </div>
      <textarea
        required
        value={rBody}
        onChange={(e) => setRBody(e.target.value)}
        rows={2}
        placeholder="Your reply…"
        className="mt-2 w-full resize-none rounded-xl border border-violet/20 bg-white px-3.5 py-2.5 text-sm text-navy outline-none placeholder:text-navy/40 focus:border-violet focus:ring-2 focus:ring-violet/20 dark:bg-[#16212c] dark:text-white"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-navy/60 hover:text-violet"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-violet px-3 py-1.5 text-xs font-semibold text-white shadow-violet-glow hover:bg-violet-dark disabled:opacity-60"
        >
          {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          {sending ? "Sending…" : "Reply"}
        </button>
      </div>
    </form>
  );
}
