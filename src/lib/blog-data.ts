// Shared curated fallback blog posts — used by /api/blog and the server-side
// permalink page so the section is always populated even with an empty DB.

export interface FallbackPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  readMinutes: number;
  publishedAt: string;
  isFallback: boolean;
}

export const fallbackBlogPosts: FallbackPost[] = [
  {
    id: "fb-1",
    slug: "why-i-finally-wrote-it-down",
    title: "Why I Finally Wrote It Down",
    excerpt:
      "For decades I told myself the story was mine to carry. Here's what changed my mind — and why a memoir became the only honest way to close the round.",
    body: `For thirty years I carried the story the way a physician carries a pager — always on, always close, never quite silent.

I told myself it was private. I told myself no one needed to hear it. I told myself that the work — the rounds, the patients, the long nights — was testimony enough.

But stories don't keep. They ferment. They become heavier in the dark. And one evening, after a long shift, a young resident asked me a question I couldn't answer: "How did you know this was what you were supposed to do?"

I didn't know. I had never known. I had only kept going.

So I sat down, and I began to write it down — not to teach, not to inspire, but finally to listen to the boy I had been, and to let him speak.`,
    category: "On Writing",
    author: "Robert Y. Wright, MD",
    readMinutes: 4,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isFallback: true,
  },
  {
    id: "fb-2",
    slug: "the-night-i-nearly-quit",
    title: "The Night I Nearly Quit Medical School",
    excerpt:
      "The hallway fluorescent was buzzing like a heart that had lost its rhythm. I stood there a long time, holding the doorframe. Here's what happened next.",
    body: `The scores were posted like a verdict. I found my name near the bottom of the page, and for a long moment the corridor seemed to tilt.

I remember the sound of the fluorescent light above me — a thin, electrical hum, like a heart that had lost its rhythm. I stood there holding the doorframe the way you hold a hand when you're not sure you'll make it.

A part of me wanted to walk out. To go home. To let the story end there, in that quiet hallway, with the boy who had been told he'd never measure up finally proving everyone right.

But something else happened. I let go of the doorframe. And I walked on — not because I was brave, but because stopping had never been one of my options.

I didn't know it then, but that was the night I became a doctor.`,
    category: "Medical School",
    author: "Robert Y. Wright, MD",
    readMinutes: 3,
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    isFallback: true,
  },
  {
    id: "fb-3",
    slug: "what-rounds-taught-me",
    title: "What Rounds Taught Me About Listening",
    excerpt:
      "Medicine is not what you say to a patient. It's what you hear in the silence after. A reflection on four decades of listening for the story beneath the symptom.",
    body: `They teach you to take a history in medical school. They teach you the order — chief complaint, history of present illness, past medical, social, family. They teach you to write it down in the right boxes.

What they don't teach you is that the real history is rarely in the boxes.

It's in the pause before the patient answers. It's in the way they look at the door when they mention their son. It's in the sentence that begins with "I don't know if this matters, but…"—because it almost always does.

After forty years of rounds, I have come to believe that medicine is not what you say. It is what you hear in the silence after. And the best physicians I have known were not the ones with the sharpest diagnoses. They were the ones who learned, slowly, to listen for the story beneath the symptom.

That, more than anything, is what I wanted this memoir to be about.`,
    category: "On Medicine",
    author: "Robert Y. Wright, MD",
    readMinutes: 5,
    publishedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    isFallback: true,
  },
];

export const blogCategories = [
  "On Writing",
  "Medical School",
  "On Medicine",
  "Update",
];
