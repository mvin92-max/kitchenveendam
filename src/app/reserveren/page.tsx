import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageBanner } from "@/components/site/page-banner";
import { ReservationForm } from "@/components/reserveren/reservation-form";
import { InfoPanel } from "@/components/reserveren/info-panel";

export const metadata: Metadata = {
  title: "Reserveer jouw tafel | The Kitchen Veendam",
  description:
    "Reserveer eenvoudig online een tafel bij The Kitchen Veendam voor lunch, diner of BBQ.",
};

// InfoPanel + the footer both read opening hours live from the database, so
// this page can't be statically prerendered — dashboard edits must appear immediately.
export const revalidate = 0;

export default function ReserverenPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#111111]">
        <PageBanner
          eyebrow="Online reserveren"
          title="Reserveer jouw tafel"
          subtitle="Boek in een paar klikken je plek bij The Kitchen Veendam — voor een lunch, diner, BBQ of speciale gelegenheid."
          image="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80"
          imageAlt="Sfeervol interieur van The Kitchen Veendam"
        />

        <section className="py-20 lg:py-28">
          <div className="section-container grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
            <ReservationForm />
            <InfoPanel />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
