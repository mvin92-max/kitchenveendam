"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReservationChipData = {
  id: string;
  time: string;
  customerName: string;
  partySize: number;
  tableId: string | null;
  tableNumber: number | null;
};

export function ReservationChip({ r }: { r: ReservationChipData }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: r.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
          : undefined
      }
      className={cn(
        "flex cursor-grab items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
    >
      <GripVertical size={14} className="shrink-0 text-white/25" />
      <span className="w-12 shrink-0 font-heading font-semibold text-kitchen-gold">{r.time}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-white">{r.customerName}</p>
        <p className="flex items-center gap-1 text-xs text-white/40">
          <Users size={11} /> {r.partySize}p
          {r.tableNumber && <span className="ml-1">· Tafel {r.tableNumber}</span>}
        </p>
      </div>
    </div>
  );
}
