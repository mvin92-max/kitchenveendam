import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageBanner } from "@/components/site/page-banner";
import { FinalCta } from "@/components/site/final-cta";
import { StaggerGroup, StaggerItem } from "@/components/site/motion";
import { EventCard, type PublicEvent } from "@/components/events/event-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Evenementen | The Kitchen Veendam",
  description:
    "Ontdek onze evenementen: BBQ Night, Live Muziek, Cocktail Night, Familie Zondag, Steak Friday en Wijnproeverij.",
};

// Events are managed in het dashboard (/dashboard/evenementen) and read live
// from the database here, so changes there appear on the site immediately.
export const revalidate = 0;

export default async function EvenementenPage() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "asc" } });

  const publicEvents: PublicEvent[] = events.map((e) => ({
    id: e.id,
    name: e.name,
    description: e.description,
    schedule: e.schedule,
    price: e.price,
    image: e.image,
    maxGuests: e.maxGuests,
    ticketsSold: e.ticketsSold,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#111111]">
        <PageBanner
          eyebrow="Evenementen"
          title="Beleef The Kitchen"
          subtitle="Van live muziek tot wijnproeverijen — bij ons is er altijd wat te vieren."
          image="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80"
          imageAlt="Live muziek avond bij The Kitchen Veendam"
        />

        <section className="py-20 lg:py-28">
          <div className="section-container">
            <StaggerGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {publicEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerGroup>

            {publicEvents.length === 0 && (
              <p className="text-center text-white/50">Binnenkort meer evenementen.</p>
            )}
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
