import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface FallbackReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  approved: boolean;
  isFallback: boolean;
  createdAt: string;
}

const fallbackReviews: FallbackReview[] = [
  {
    id: "fb-1",
    name: "Dr. Elena Marsh",
    role: "Internal Medicine, Early Reviewer",
    rating: 5,
    quote:
      "I read it in two sittings and wept at the end. Dr. Wright writes with the steady hand of a physician and the open heart of a survivor. A memoir that will sit beside you long after the last page.",
    approved: true,
    isFallback: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "fb-2",
    name: "James Okonkwo",
    role: "Reader & Third-Year Medical Student",
    rating: 5,
    quote:
      "An unflinching, deeply human account of what it actually costs to become a doctor. Every medical student should read this before their first round.",
    approved: true,
    isFallback: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "fb-3",
    name: "Carolyn Bissett",
    role: "Book Blogger, The Reading Rounds",
    rating: 5,
    quote:
      "Wright's voice is warm, honest, and quietly brave. He makes the universal feel personal — and the deeply personal feel universal.",
    approved: true,
    isFallback: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "fb-4",
    name: "Dr. Samuel Rhee",
    role: "Pediatrics, Colleague & Reader",
    rating: 5,
    quote:
      "More than a medical memoir — it's a love letter to resilience. The heartbeat motif isn't just a design choice; it's the rhythm of the whole book.",
    approved: true,
    isFallback: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// GET /api/reviews — return approved DB reviews merged with curated fallbacks
export async function GET() {
  try {
    const dbReviews = await db.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    // DB reviews first (newest), then fallbacks to fill the section
    const merged = [
      ...dbReviews.map((r) => ({ ...r, isFallback: false, createdAt: r.createdAt.toISOString() })),
      ...fallbackReviews,
    ].slice(0, 8);
    return NextResponse.json({ ok: true, reviews: merged });
  } catch (err) {
    console.error("[reviews] list error", err);
    return NextResponse.json({ ok: true, reviews: fallbackReviews });
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/reviews — submit a reader review (pending approval)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
    const role =
      typeof body?.role === "string" && body.role.trim()
        ? body.role.trim().slice(0, 120)
        : "Reader";
    const rating =
      typeof body?.rating === "number" && body.rating >= 1 && body.rating <= 5
        ? Math.round(body.rating)
        : 5;
    const quote = typeof body?.quote === "string" ? body.quote.trim().slice(0, 1000) : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!name || !quote) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name and a review." },
        { status: 400 }
      );
    }
    if (quote.length < 15) {
      return NextResponse.json(
        { ok: false, error: "Please write at least a sentence or two (15+ characters)." },
        { status: 400 }
      );
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const record = await db.review.create({
      data: {
        name,
        role,
        rating,
        quote,
        approved: false,
        source: "website",
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Thank you for your review! It will appear here once approved by Dr. Wright's team.",
      id: record.id,
    });
  } catch (err) {
    console.error("[reviews] submit error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}
