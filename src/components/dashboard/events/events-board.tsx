"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EventRow, type EventData } from "./event-row";
import { EventModal } from "./event-modal";

export function EventsBoard({ events }: { events: EventData[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  function openNew() {
    setEditingEvent(null);
    setModalOpen(true);
  }

  function openEdit(event: EventData) {
    setEditingEvent(event);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-white">Evenementen beheren</h1>
          <p className="mt-1 text-sm text-white/50">
            {events.length} {events.length === 1 ? "evenement" : "evenementen"} gepland
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-kitchen-red px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(122,13,13,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#8f1010]"
        >
          <Plus size={16} />
          Nieuw evenement
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventRow key={event.id} event={event} onEdit={() => openEdit(event)} />
        ))}
      </div>

      {events.length === 0 && (
        <p className="py-16 text-center text-sm text-white/40">Nog geen evenementen gepland.</p>
      )}

      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} event={editingEvent} />
    </div>
  );
}
