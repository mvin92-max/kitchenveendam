import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageBanner } from "@/components/site/page-banner";
import { FinalCta } from "@/components/site/final-cta";
import { Timeline } from "@/components/about/timeline";
import { MissionCards } from "@/components/about/mission-cards";
import { OpenKitchen } from "@/components/about/open-kitchen";
import { TeamGrid } from "@/components/about/team-grid";

export const metadata: Metadata = {
  title: "Over Ons | The Kitchen Veendam",
  description:
    "Ontdek het verhaal, de missie en het team achter The Kitchen Veendam — waar gastvrijheid, kwaliteit en gezelligheid samenkomen.",
  openGraph: {
    title: "Over Ons | The Kitchen Veendam",
    description:
      "Ontdek het verhaal, de missie en het team achter The Kitchen Veendam.",
    images: ["https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=80"],
  },
};

// The footer reads opening hours live from the database, so this page can't
// be statically prerendered — edits in het dashboard must appear immediately.
export const revalidate = 0;

export default function OverOnsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#111111]">
        <PageBanner
          eyebrow="Over ons"
          title="Welkom bij The Kitchen Veendam"
          subtitle="Waar gastvrijheid, kwaliteit en gezelligheid samenkomen."
          image="https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1920&q=80"
          imageAlt="Gasten genieten samen van hun diner bij The Kitchen Veendam"
        />
        <Timeline />
        <MissionCards />
        <OpenKitchen />
        <TeamGrid />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
