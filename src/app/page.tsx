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
