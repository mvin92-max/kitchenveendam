import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageBanner } from "@/components/site/page-banner";
import { FinalCta } from "@/components/site/final-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { GiftCardSelector } from "@/components/cadeaubonnen/gift-card-selector";
import { FaqAccordion } from "@/components/cadeaubonnen/faq-accordion";

export const metadata: Metadata = {
  title: "Cadeaubonnen | The Kitchen Veendam",
  description:
    "Geef een culinaire beleving cadeau met een digitale of fysieke cadeaubon van The Kitchen Veendam.",
};

export default function CadeaubonnenPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#111111]">
        <PageBanner
          eyebrow="Cadeaubonnen"
          title="Geef een culinaire beleving cadeau"
          subtitle="Het perfecte cadeau voor iedere gelegenheid — verjaardag, jubileum of gewoon omdat het kan."
          image="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80"
          imageAlt="Sfeervol interieur van The Kitchen Veendam"
        />

        <section className="py-20 lg:py-28">
          <div className="section-container">
            <GiftCardSelector />
          </div>
        </section>

        <section className="bg-[#0d0d0d] py-20 lg:py-28">
          <div className="section-container flex flex-col gap-16">
            <SectionHeading
              eyebrow="Veelgestelde vragen"
              title="Alles wat je wilt weten"
            />
            <FaqAccordion />
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
