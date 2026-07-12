import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { addWeeks, toDateKey } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import type { ShiftData } from "./schedule-grid";

const DAY_LABELS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

export function MySchedule({ shifts, weekDays }: { shifts: ShiftData[]; weekDays: Date[] }) {
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const prevWeek = toDateKey(addWeeks(weekStart, -1));
  const nextWeek = toDateKey(addWeeks(weekStart, 1));
  const thisWeek = toDateKey(new Date());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-semibold text-white">
          {weekStart.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })} –{" "}
          {weekEnd.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/personeel?week=${prevWeek}`}
            aria-label="Vorige week"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-kitchen-gold/50 hover:text-white"
          >
            <ChevronLeft size={16} />
          </Link>
          <Link
            href={`/dashboard/personeel?week=${thisWeek}`}
            className="flex h-9 items-center rounded-full border border-white/15 px-3.5 text-xs font-medium text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
          >
            Deze week
          </Link>
          <Link
            href={`/dashboard/personeel?week=${nextWeek}`}
            aria-label="Volgende week"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-kitchen-gold/50 hover:text-white"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-7">
        {weekDays.map((day, i) => {
          const dateKey = toDateKey(day);
          const dayShifts = shifts.filter((s) => s.date === dateKey);
          const isToday = dateKey === thisWeek;
          return (
            <div
              key={i}
              className={cn(
                "rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-4 backdrop-blur-xl",
                isToday && "border-kitchen-gold/30",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{DAY_LABELS[i]}</p>
              <p className={cn("mb-3 text-sm font-medium", isToday ? "text-kitchen-gold" : "text-white/70")}>
                {day.getDate()}/{day.getMonth() + 1}
              </p>
              {dayShifts.length === 0 ? (
                <p className="text-xs text-white/30">Geen shift</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {dayShifts.map((shift) => (
                    <div key={shift.id} className="rounded-xl bg-kitchen-red/15 px-3 py-2">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-white">
                        <Clock size={12} />
                        {shift.startTime}–{shift.endTime}
                      </p>
                      <p className="mt-0.5 text-xs text-white/50">{shift.position}</p>
                      {shift.notes && <p className="mt-1 text-xs text-white/40">{shift.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
