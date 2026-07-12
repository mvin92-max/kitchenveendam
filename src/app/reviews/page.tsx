import type { Metadata } from "next";
import { Star } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageBanner } from "@/components/site/page-banner";
import { FinalCta } from "@/components/site/final-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { StatsSection } from "@/components/reviews/stats-section";
import { ReviewsSlider } from "@/components/reviews/reviews-slider";

export const metadata: Metadata = {
  title: "Reviews | The Kitchen Veendam",
  description:
    "Lees wat onze gasten zeggen over The Kitchen Veendam — 4,8 sterren op Google en meer dan 850 reviews.",
};

// The footer reads opening hours live from the database, so this page can't
// be statically prerendered — edits in het dashboard must appear immediately.
export const revalidate = 0;

export default function ReviewsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#111111]">
        <PageBanner
          eyebrow="Reviews"
          title="Onze gasten vertellen het verhaal."
          subtitle="Meer dan 850 gasten gingen je voor — lees hun ervaringen."
          image="https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1920&q=80"
          imageAlt="Gasten genieten samen van hun diner bij The Kitchen Veendam"
        >
          <div className="flex gap-1.5 text-kitchen-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={26} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
        </PageBanner>

        <StatsSection />

        <section className="py-20 lg:py-28">
          <div className="section-container flex flex-col gap-16">
            <SectionHeading
              eyebrow="Wat gasten zeggen"
              title="Google Reviews"
              description="Automatisch bijgewerkt — een greep uit onze meest recente reviews."
            />
            <ReviewsSlider />
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
