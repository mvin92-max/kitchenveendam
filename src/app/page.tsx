import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { WhyUs } from "@/components/site/why-us";
import { FeaturedDishes } from "@/components/site/featured-dishes";
import { BbqArrangement } from "@/components/site/bbq-arrangement";
import { About } from "@/components/site/about";
import { Reviews } from "@/components/site/reviews";
import { InstagramGallery } from "@/components/site/instagram-gallery";
import { FinalCta } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";

// The footer reads opening hours live from the database, so this page can't
// be statically prerendered — edits in het dashboard must appear immediately.
export const revalidate = 0;

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <WhyUs />
        <FeaturedDishes />
        <BbqArrangement />
        <About />
        <Reviews />
        <InstagramGallery />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
