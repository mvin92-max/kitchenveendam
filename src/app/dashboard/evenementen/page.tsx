import { prisma } from "@/lib/prisma";
import { EventsBoard } from "@/components/dashboard/events/events-board";
import type { EventData } from "@/components/dashboard/events/event-row";

export default async function EvenementenBeheerPage() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "asc" } });

  const eventData: EventData[] = events.map((e) => ({
    id: e.id,
    name: e.name,
    description: e.description,
    schedule: e.schedule,
    price: e.price,
    image: e.image,
    maxGuests: e.maxGuests,
    ticketsSold: e.ticketsSold,
  }));

  return <EventsBoard events={eventData} />;
}
