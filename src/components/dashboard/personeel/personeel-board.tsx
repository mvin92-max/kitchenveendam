import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, toDateKey } from "@/lib/schedule";
import { EmployeePanel, type EmployeeData } from "./employee-panel";
import { ScheduleGrid, type ShiftData } from "./schedule-grid";
import type { LinkableUser } from "./employee-modal";

export function PersoneelBoard({
  employees,
  shifts,
  weekDays,
  linkableUsers,
}: {
  employees: EmployeeData[];
  shifts: ShiftData[];
  weekDays: Date[];
  linkableUsers: LinkableUser[];
}) {
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const prevWeek = toDateKey(addWeeks(weekStart, -1));
  const nextWeek = toDateKey(addWeeks(weekStart, 1));
  const thisWeek = toDateKey(new Date());

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="lg:w-72 lg:shrink-0">
        <EmployeePanel employees={employees} linkableUsers={linkableUsers} />
      </div>

      <div className="flex flex-1 flex-col gap-4">
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

        <ScheduleGrid employees={employees} shifts={shifts} weekDays={weekDays} />
      </div>
    </div>
  );
}
