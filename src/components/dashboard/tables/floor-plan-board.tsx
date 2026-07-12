"use client";

import { useMemo, useState, useTransition } from "react";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { GripVertical, Users } from "lucide-react";
import { reassignTableAction } from "@/app/dashboard/reserveringen/actions";
import { TableBox, STATUS_STYLES, type TableData } from "./table-box";
import { ReservationChip, type ReservationChipData } from "./reservation-chip";
import { TableDetailModal } from "./table-detail-modal";

export function FloorPlanBoard({
  tables,
  reservations,
}: {
  tables: TableData[];
  reservations: ReservationChipData[];
}) {
  const [activeChip, setActiveChip] = useState<ReservationChipData | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const width = useMemo(() => Math.max(...tables.map((t) => t.posX), 0) + 200, [tables]);
  const height = useMemo(() => Math.max(...tables.map((t) => t.posY), 0) + 200, [tables]);

  function handleDragStart(event: DragStartEvent) {
    const chip = reservations.find((r) => r.id === event.active.id) ?? null;
    setActiveChip(chip);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveChip(null);
    const { active, over } = event;
    if (!over) return;
    const reservationId = String(active.id);
    const tableId = String(over.id);
    setError(null);
    startTransition(async () => {
      const result = await reassignTableAction(reservationId, tableId);
      if (!result.success) setError(result.error);
    });
  }

  const tableReservations = selectedTable
    ? reservations.filter((r) => r.tableId === selectedTable.id)
    : [];

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="flex shrink-0 flex-col gap-3 lg:w-80">
          <div className="rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl">
            <h3 className="mb-1 font-heading text-lg font-semibold text-white">Reserveringen vandaag</h3>
            <p className="mb-4 text-xs text-white/45">Sleep een reservering naar een andere tafel</p>
            <div className="flex max-h-[560px] flex-col gap-2 overflow-y-auto pr-1">
              {reservations.length === 0 && (
                <p className="py-6 text-center text-sm text-white/40">Geen reserveringen vandaag.</p>
              )}
              {reservations.map((r) => (
                <ReservationChip key={r.id} r={r} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">Legenda</p>
            <div className="flex flex-col gap-2">
              {Object.entries(STATUS_STYLES).map(([key, style]) => (
                <div key={key} className="flex items-center gap-2 text-xs text-white/60">
                  <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  {style.label}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}
        </aside>

        <div className="flex-1 overflow-auto rounded-2xl border border-white/[0.06] bg-kitchen-card/40 p-4 backdrop-blur-xl">
          <div className="relative" style={{ width, height, minWidth: "100%" }}>
            {tables.map((table) => (
              <TableBox key={table.id} table={table} onClick={() => setSelectedTable(table)} />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeChip && (
          <div className="flex items-center gap-2 rounded-xl border border-kitchen-gold/60 bg-kitchen-card px-3 py-2.5 text-sm shadow-2xl">
            <GripVertical size={14} className="text-white/40" />
            <span className="w-12 font-heading font-semibold text-kitchen-gold">{activeChip.time}</span>
            <span className="text-white">{activeChip.customerName}</span>
            <span className="flex items-center gap-1 text-xs text-white/40">
              <Users size={11} /> {activeChip.partySize}p
            </span>
          </div>
        )}
      </DragOverlay>

      <TableDetailModal
        table={selectedTable}
        reservations={tableReservations}
        onClose={() => setSelectedTable(null)}
      />
    </DndContext>
  );
}
