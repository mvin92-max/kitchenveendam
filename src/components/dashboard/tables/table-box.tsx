"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export type TableData = {
  id: string;
  number: number;
  capacity: number;
  zone: string;
  status: string;
  posX: number;
  posY: number;
};

export const STATUS_STYLES: Record<string, { label: string; box: string; dot: string }> = {
  vrij: { label: "Vrij", box: "border-green-500/40 bg-green-500/10", dot: "bg-green-400" },
  gereserveerd: { label: "Gereserveerd", box: "border-kitchen-gold/50 bg-kitchen-gold/10", dot: "bg-kitchen-gold" },
  bezet: { label: "Bezet", box: "border-kitchen-red/60 bg-kitchen-red/15", dot: "bg-kitchen-red" },
  schoonmaken: { label: "Schoonmaken", box: "border-blue-400/40 bg-blue-400/10", dot: "bg-blue-400" },
  onderhoud: { label: "Onderhoud", box: "border-white/15 bg-white/[0.03]", dot: "bg-white/30" },
};

export function TableBox({ table, onClick }: { table: TableData; onClick: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: table.id });
  const style = STATUS_STYLES[table.status] ?? STATUS_STYLES.vrij;

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      style={{ left: table.posX, top: table.posY }}
      className={cn(
        "absolute flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-2xl border-2 text-center transition-all",
        style.box,
        isOver && "scale-110 border-white shadow-[0_0_0_4px_rgba(212,175,55,0.3)]",
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
      <span className="font-heading text-lg font-semibold text-white">Tafel {table.number}</span>
      <span className="text-xs text-white/50">{table.capacity}p · {table.zone}</span>
    </button>
  );
}
