import type { Metadata } from "next";
import { Poppins, Lora, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import {
  bookJsonLd,
  websiteJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roundsofalifetime.com"),
  title: "Rounds of a Lifetime – A Memoir by Robert Y. Wright, MD",
  description:
    "A deeply personal and emotionally charged memoir by Robert Y. Wright, MD — from a challenging childhood to a life devoted to medicine. Discover the story of resilience, healing, and the call to medicine.",
  icons: {
    icon: "/images/author-logo.png",
    apple: "/images/author-logo.png",
  },
  keywords: [
    "Rounds of a Lifetime",
    "Robert Y. Wright, MD",
    "Robert Y. Wright MD",
    "medical memoir",
    "doctor memoir",
    "memoir about medicine",
    "overcoming bullying",
    "medical school journey",
    "inspirational memoir",
  ],
  authors: [{ name: "Robert Y. Wright, MD" }],
  openGraph: {
    title: "Rounds of a Lifetime – A Memoir by Robert Y. Wright, MD",
    description:
      "A deeply personal memoir from a challenging childhood to a life devoted to medicine.",
    siteName: "Rounds of a Lifetime",
    type: "book",
    images: [{ url: "/images/book-front-cover.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rounds of a Lifetime – A Memoir by Robert Y. Wright, MD",
    description:
      "A deeply personal memoir from a challenging childhood to a life devoted to medicine.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of incorrect theme — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${lora.variable} ${bebasNeue.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...bookJsonLd,
              "@context": "https://schema.org",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        {children}
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
