import { Armchair, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type AgendaReservation = {
  id: string;
  time: string;
  customerName: string;
  partySize: number;
  tableNumber: number | null;
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

export function TodayAgenda({ reservations }: { reservations: AgendaReservation[] }) {
  if (reservations.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-white/40">
        Nog geen reserveringen voor vandaag.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-white/[0.06]">
      {reservations.map((r) => (
        <li key={r.id} className="flex items-center gap-4 py-3.5">
          <span className="w-14 shrink-0 font-heading text-base font-semibold text-kitchen-gold">
            {r.time}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{r.customerName}</p>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-white/45">
              <span className="flex items-center gap-1">
                <Users size={12} /> {r.partySize}
              </span>
              {r.tableNumber && (
                <span className="flex items-center gap-1">
                  <Armchair size={12} /> Tafel {r.tableNumber}
                </span>
              )}
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
              STATUS_CLASS[r.status] ?? "bg-white/10 text-white/50",
            )}
          >
            {STATUS_LABEL[r.status] ?? r.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
