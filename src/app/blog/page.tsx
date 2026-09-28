import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";

export const metadata: Metadata = {
  title: "Notes & Reflections — Blog · Rounds of a Lifetime",
  description:
    "Occasional writing from Robert Y. Wright, MD — on medicine, memoir, and the long art of listening.",
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss",
    },
  },
};

export default function BlogPage() {
  return <BlogIndex />;
}
