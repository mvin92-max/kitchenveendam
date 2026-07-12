"use client";

import { useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { value: "all", label: "Alle" },
  { value: "pending", label: "Aanvraag" },
  { value: "confirmed", label: "Bevestigd" },
  { value: "cancelled", label: "Geannuleerd" },
  { value: "completed", label: "Afgerond" },
];

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function ReservationFilters({ date, status, q }: { date: string; status: string; q: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function shiftDay(delta: number) {
    const current = new Date(date);
    current.setDate(current.getDate() + delta);
    updateParams({ date: toIso(current) });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => shiftDay(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
        >
          <ChevronLeft size={16} />
        </button>
        <input
          type="date"
          value={date}
          onChange={(e) => updateParams({ date: e.target.value })}
          className="h-10 rounded-xl border border-white/15 bg-white/[0.03] px-3 text-sm text-white outline-none focus:border-kitchen-gold/60 [color-scheme:dark]"
        />
        <button
          type="button"
          onClick={() => shiftDay(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => updateParams({ date: toIso(new Date()) })}
          className="ml-1 rounded-full border border-white/15 px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:border-kitchen-gold/50 hover:text-white"
        >
          Vandaag
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => updateParams({ status: tab.value === "all" ? "" : tab.value })}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              (status || "all") === tab.value
                ? "border-transparent bg-kitchen-gold text-[#111111]"
                : "border-white/15 text-white/60 hover:border-kitchen-gold/50 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-56">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          defaultValue={q}
          placeholder="Zoek op naam..."
          onChange={(e) => {
            const value = e.target.value;
            if (searchDebounce.current) clearTimeout(searchDebounce.current);
            searchDebounce.current = setTimeout(() => updateParams({ q: value }), 350);
          }}
          className="h-10 w-full rounded-xl border border-white/15 bg-white/[0.03] pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-kitchen-gold/60"
        />
      </div>
    </div>
  );
}
