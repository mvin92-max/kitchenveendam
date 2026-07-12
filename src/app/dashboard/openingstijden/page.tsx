import { prisma } from "@/lib/prisma";
import { WeeklyHoursPanel } from "@/components/dashboard/opening-hours/weekly-hours-panel";
import { ExceptionsPanel } from "@/components/dashboard/opening-hours/exceptions-panel";
import type { ExceptionData, OpeningHourRowData } from "@/components/dashboard/opening-hours/types";
import { orderRowsMondayFirst } from "@/lib/format-hours";

export default async function OpeningstijdenPage() {
  const [hourRecords, exceptionRecords] = await Promise.all([
    prisma.openingHour.findMany(),
    prisma.openingHourException.findMany({ orderBy: { date: "asc" } }),
  ]);

  const rows: OpeningHourRowData[] = orderRowsMondayFirst(
    hourRecords.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      closed: h.closed,
    })),
  );

  const exceptions: ExceptionData[] = exceptionRecords.map((e) => ({
    id: e.id,
    date: e.date.toISOString().slice(0, 10),
    label: e.label,
    closed: e.closed,
    openTime: e.openTime,
    closeTime: e.closeTime,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-white">Openingstijden</h1>
        <p className="mt-1 text-sm text-white/50">
          Deze tijden zijn direct zichtbaar op de website (footer, reserveringspagina en zoekmachines).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyHoursPanel rows={rows} />
        <ExceptionsPanel exceptions={exceptions} />
      </div>
    </div>
  );
}
