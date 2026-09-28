import { Navbar } from "@/components/navbar";
import { BackToTop } from "@/components/back-to-top";
import { UnsubscribeHandler } from "@/components/unsubscribe-handler";
import { Hero } from "@/components/sections/hero";
import { AboutTheBook } from "@/components/sections/about-the-book";
import { AboutTheAuthor } from "@/components/sections/about-the-author";
import { Themes } from "@/components/sections/themes";
import { Reviews } from "@/components/sections/reviews";
import { Excerpt } from "@/components/sections/excerpt";
import { Events } from "@/components/sections/events";
import { Trailer } from "@/components/sections/trailer";
import { WhereToBuy } from "@/components/sections/where-to-buy";
import { ReadingGuide } from "@/components/sections/reading-guide";
import { Faq } from "@/components/sections/faq";
import { Newsletter } from "@/components/sections/newsletter";
import { Contact } from "@/components/sections/contact";
import { Blog } from "@/components/sections/blog";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#16212c]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <UnsubscribeHandler />
      <main id="main-content" className="flex-1">
        <Hero />
        <AboutTheBook />
        <AboutTheAuthor />
        <Themes />
        <Reviews />
        <Excerpt />
        <Events />
        <Trailer />
        <WhereToBuy />
        <ReadingGuide />
        <Faq />
        <Blog />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
