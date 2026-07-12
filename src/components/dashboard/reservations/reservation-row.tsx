"use client";

import { useTransition } from "react";
import { Accessibility, Baby, Cake, Briefcase, Flame, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  cancelReservationAction,
  reassignTableAction,
  updateReservationStatusAction,
} from "@/app/dashboard/reserveringen/actions";
import type { ReservationStatus } from "@/lib/validation/reservation";
import type { TableOption } from "./reservation-modal";

export type ReservationRowData = {
  id: string;
  time: string;
  customerName: string;
  customerPhone: string | null;
  partySize: number;
  tableId: string | null;
  tableNumber: number | null;
  location: string;
  wheelchair: boolean;
  highChair: boolean;
  occasion: string | null;
  status: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Aanvraag",
  confirmed: "Bevestigd",
  cancelled: "Geannuleerd",
  completed: "Afgerond",
};

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-kitchen-gold/15 text-kitchen-gold",
  confirmed: "bg-green-500/15 text-green-400",
  cancelled: "bg-white/10 text-white/40",
  completed: "bg-white/10 text-white/50",
};

const OCCASION_ICON: Record<string, typeof Cake> = {
  verjaardag: Cake,
  zakelijk: Briefcase,
  bbq: Flame,
};

export function ReservationRow({ r, tables }: { r: ReservationRowData; tables: TableOption[] }) {
  const [isPending, startTransition] = useTransition();
  const OccasionIcon = r.occasion ? OCCASION_ICON[r.occasion] : null;
  const zoneTables = tables.filter((t) => t.zone === r.location);

  function setStatus(status: string) {
    startTransition(() => {
      void updateReservationStatusAction(r.id, status as ReservationStatus);
    });
  }

  function setTable(tableId: string) {
    if (!tableId) return;
    startTransition(() => {
      void reassignTableAction(r.id, tableId);
    });
  }

  return (
    <tr className={cn("border-b border-white/[0.06] transition-opacity", isPending && "opacity-50")}>
      <td className="px-6 py-3.5 font-heading text-base font-semibold text-kitchen-gold">{r.time}</td>
      <td className="px-6 py-3.5">
        <p className="text-sm font-medium text-white">{r.customerName}</p>
        <p className="text-xs text-white/40">{r.customerPhone}</p>
      </td>
      <td className="px-6 py-3.5 text-sm text-white/70">{r.partySize}p</td>
      <td className="px-6 py-3.5">
        <select
          value={r.tableId ?? ""}
          onChange={(e) => setTable(e.target.value)}
          disabled={isPending}
          className="h-9 rounded-lg border border-white/15 bg-white/[0.03] px-2 text-xs text-white outline-none focus:border-kitchen-gold/60"
        >
          {!r.tableId && <option value="">Geen tafel</option>}
          {zoneTables.map((t) => (
            <option key={t.id} value={t.id}>
              Tafel {t.number}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-3.5 text-sm capitalize text-white/60">{r.location}</td>
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-1.5 text-white/50">
          {r.wheelchair && (
            <span title="Rolstoel">
              <Accessibility size={14} />
            </span>
          )}
          {r.highChair && (
            <span title="Kinderstoel">
              <Baby size={14} />
            </span>
          )}
          {OccasionIcon && (
            <span title={r.occasion ?? undefined}>
              <OccasionIcon size={14} className="text-kitchen-gold" />
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-3.5">
        <select
          value={r.status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isPending}
          className={cn(
            "h-8 rounded-full border-0 px-3 text-xs font-medium outline-none",
            STATUS_CLASS[r.status] ?? "bg-white/10 text-white/50",
          )}
        >
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value} className="bg-[#1D1D1D] text-white">
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-3.5 text-right">
        {r.status !== "cancelled" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                void cancelReservationAction(r.id);
              })
            }
            className="text-xs font-medium text-white/40 transition-colors hover:text-red-400"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : "Annuleren"}
          </button>
        )}
      </td>
    </tr>
  );
}
