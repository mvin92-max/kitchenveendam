"use client";

import { useState } from "react";
import { CalendarOff, Plus } from "lucide-react";
import { ExceptionModal } from "./exception-modal";
import type { ExceptionData } from "./types";

export function ExceptionsPanel({ exceptions }: { exceptions: ExceptionData[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExceptionData | null>(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(exception: ExceptionData) {
    setEditing(exception);
    setModalOpen(true);
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-white">Feestdagen &amp; uitzonderingen</h2>
          <p className="mt-0.5 text-xs text-white/45">Afwijkende of gesloten dagen, los van het reguliere rooster.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-xs font-medium text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
        >
          <Plus size={14} />
          Uitzondering
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {exceptions.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => openEdit(e)}
            className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/60">
                <CalendarOff size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-white">{e.label}</p>
                <p className="text-xs text-white/45">
                  {new Date(`${e.date}T00:00:00`).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <span className="text-xs text-white/50">
              {e.closed ? "Gesloten" : `${e.openTime} - ${e.closeTime}`}
            </span>
          </button>
        ))}
        {exceptions.length === 0 && (
          <p className="px-3.5 py-6 text-center text-sm text-white/40">Nog geen uitzonderingen toegevoegd.</p>
        )}
      </div>

      <ExceptionModal open={modalOpen} onClose={() => setModalOpen(false)} exception={editing} />
    </div>
  );
}
