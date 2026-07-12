"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, Ticket } from "lucide-react";
import { CtaButton } from "@/components/site/cta-button";

export type PublicEvent = {
  id: string;
  name: string;
  description: string;
  schedule: string;
  price: string;
  image: string;
  maxGuests: number | null;
  ticketsSold: number;
};

export function EventCard({ event }: { event: PublicEvent }) {
  const soldOut = event.maxGuests != null && event.ticketsSold >= event.maxGuests;
  const spotsLeft = event.maxGuests != null ? Math.max(0, event.maxGuests - event.ticketsSold) : null;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]"
    >
      <div className="relative h-64 w-full shrink-0 overflow-hidden">
        <Image
          src={event.image}
          alt={event.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <span className="absolute right-4 top-4 rounded-full bg-kitchen-gold px-4 py-1.5 text-sm font-semibold text-[#111111] shadow-lg">
          {event.price}
        </span>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
              Uitverkocht
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-7">
        <h3 className="font-heading text-2xl font-semibold text-white">{event.name}</h3>
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-kitchen-gold">
          <CalendarDays size={13} />
          {event.schedule}
        </p>
        <p className="flex-1 text-sm leading-relaxed text-white/55">{event.description}</p>

        {spotsLeft !== null && !soldOut && spotsLeft <= 10 && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-kitchen-gold">
            <Ticket size={13} />
            Nog {spotsLeft} {spotsLeft === 1 ? "plek" : "plekken"} beschikbaar
          </p>
        )}

        <CtaButton
          href={soldOut ? "#" : "/reserveren"}
          size="md"
          variant="outline"
          className={soldOut ? "mt-2 w-full pointer-events-none opacity-50" : "mt-2 w-full"}
        >
          {soldOut ? "Uitverkocht" : "Reserveer"}
        </CtaButton>
      </div>
    </motion.div>
  );
}
