"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/dashboard/modal";
import { cn } from "@/lib/utils";
import { updateTableStatusAction } from "@/app/dashboard/tafels/actions";
import { STATUS_STYLES, type TableData } from "./table-box";
import type { ReservationChipData } from "./reservation-chip";

export function TableDetailModal({
  table,
  reservations,
  onClose,
}: {
  table: TableData | null;
  reservations: ReservationChipData[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  // The floor plan only re-fetches `table` on the next server round trip, so
  // this optimistic copy is what makes the button highlight update instantly.
  // Resetting it during render (guarded by the id/status check below) when a
  // *different* table opens is React's documented pattern for "adjusting
  // state when a prop changes" — cheaper and effect-loop-free vs a useEffect.
  const [optimisticStatus, setOptimisticStatus] = useState(table?.status);
  const [trackedTable, setTrackedTable] = useState(table);
  if (table && (trackedTable?.id !== table.id || trackedTable?.status !== table.status)) {
    setTrackedTable(table);
    setOptimisticStatus(table.status);
  }

  function setStatus(status: string) {
    if (!table) return;
    setOptimisticStatus(status);
    startTransition(() => {
      void updateTableStatusAction(table.id, status);
    });
  }

  return (
    <Modal open={!!table} onClose={onClose} title={table ? `Tafel ${table.number}` : ""}>
      {table && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6 text-sm text-white/60">
            <span>Capaciteit: {table.capacity} personen</span>
            <span className="capitalize">Zone: {table.zone}</span>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_STYLES).map(([key, style]) => (
                <button
                  key={key}
                  type="button"
                  disabled={isPending}
                  onClick={() => setStatus(key)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                    optimisticStatus === key
                      ? "border-kitchen-gold bg-kitchen-gold text-[#111111]"
                      : "border-white/15 text-white/60 hover:border-kitchen-gold/50 hover:text-white",
                  )}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
              Reserveringen vandaag
            </p>
            {reservations.length === 0 ? (
              <p className="text-sm text-white/40">Geen reserveringen voor deze tafel vandaag.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {reservations.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm"
                  >
                    <span className="font-heading font-semibold text-kitchen-gold">{r.time}</span>
                    <span className="text-white">{r.customerName}</span>
                    <span className="text-white/50">{r.partySize}p</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
