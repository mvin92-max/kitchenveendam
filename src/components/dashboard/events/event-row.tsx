"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { CalendarDays, Loader2, Pencil, Ticket, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteEventAction } from "@/app/dashboard/evenementen/actions";

export type EventData = {
  id: string;
  name: string;
  description: string;
  schedule: string;
  price: string;
  image: string;
  maxGuests: number | null;
  ticketsSold: number;
};

export function EventRow({ event, onEdit }: { event: EventData; onEdit: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const soldOut = event.maxGuests != null && event.ticketsSold >= event.maxGuests;
  const fillRatio = event.maxGuests ? Math.min(1, event.ticketsSold / event.maxGuests) : null;

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(() => {
      void deleteEventAction(event.id);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card/70 backdrop-blur-xl transition-opacity",
        isPending && "opacity-50",
      )}
    >
      <div className="relative h-44 w-full shrink-0">
        {event.image ? (
          <Image src={event.image} alt={event.name} fill sizes="360px" className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-xs text-white/30">
            Geen foto
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <span className="absolute right-3 top-3 rounded-full bg-kitchen-gold px-3 py-1 text-xs font-semibold text-[#111111] shadow-lg">
          {event.price}
        </span>
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
            Uitverkocht
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-lg font-semibold text-white">{event.name}</h3>
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-kitchen-gold">
          <CalendarDays size={13} />
          {event.schedule}
        </p>
        <p className="line-clamp-2 flex-1 text-sm text-white/55">{event.description}</p>

        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <Ticket size={12} />
              {event.ticketsSold} {event.maxGuests ? `/ ${event.maxGuests}` : ""} tickets
            </span>
          </div>
          {fillRatio !== null && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn("h-full rounded-full", soldOut ? "bg-kitchen-red" : "bg-kitchen-gold")}
                style={{ width: `${fillRatio * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-end gap-1 border-t border-white/[0.06] pt-3">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Bewerken"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            aria-label="Verwijderen"
            className={cn(
              "flex h-8 items-center justify-center rounded-full px-2 text-xs font-medium transition-colors",
              confirmDelete
                ? "bg-red-500/20 text-red-300"
                : "w-8 text-white/50 hover:bg-white/[0.06] hover:text-red-400",
            )}
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : confirmDelete ? "Zeker?" : <Trash2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
