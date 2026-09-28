export const bookJsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "Rounds of a Lifetime",
  alternateName: "Rounds of a Lifetime: A Memoir",
  author: {
    "@type": "Person",
    name: "Robert Y. Wright, MD",
    jobTitle: "Physician",
    description:
      "Physician, memoirist, and speaker with over four decades in medicine.",
  },
  isbn: "978-929-167-7346",
  bookFormat: "https://schema.org/Hardcover",
  inLanguage: "en",
  genre: ["Memoir", "Biography & Autobiography", "Medical"],
  description:
    "A deeply personal and emotionally charged memoir by Robert Y. Wright, MD, offering a vivid account of his life's journey from a childhood filled with physical and emotional challenges to his transformative years in medical school and, finally, to the high-stakes world of medicine.",
  numberOfPages: 288,
  datePublished: "2025",
  publisher: {
    "@type": "Organization",
    name: "Rounds of a Lifetime Press",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
  offers: {
    "@type": "Offer",
    price: "24.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rounds of a Lifetime",
  url: "https://roundsofalifetime.com",
  description:
    "Official website for the memoir 'Rounds of a Lifetime' by Robert Y. Wright, MD.",
  inLanguage: "en",
  potentialAction: {
    "@type": "ReadAction",
    target: "https://roundsofalifetime.com/#excerpt",
  },
};

export const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://roundsofalifetime.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Rounds of a Lifetime (Memoir)",
      item: "https://roundsofalifetime.com/#about-the-book",
    },
  ],
};
