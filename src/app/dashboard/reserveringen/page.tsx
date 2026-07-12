import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/reservations";
import { ReservationFilters } from "@/components/dashboard/reservations/reservation-filters";
import { ReservationRow, type ReservationRowData } from "@/components/dashboard/reservations/reservation-row";
import { NewReservationButton } from "@/components/dashboard/reservations/reservation-modal";

export default async function ReserveringenPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const dateIso = params.date || new Date().toISOString().slice(0, 10);
  const status = params.status || "";
  const q = params.q || "";

  const date = startOfDay(new Date(dateIso));

  const [reservations, tables] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        date,
        ...(status ? { status } : {}),
        ...(q ? { customer: { name: { contains: q } } } : {}),
      },
      include: { customer: true, table: true },
      orderBy: { time: "asc" },
    }),
    prisma.table.findMany({ orderBy: { number: "asc" } }),
  ]);

  const rows: ReservationRowData[] = reservations.map((r) => ({
    id: r.id,
    time: r.time,
    customerName: r.customer.name,
    customerPhone: r.customer.phone,
    partySize: r.partySize,
    tableId: r.tableId,
    tableNumber: r.table?.number ?? null,
    location: r.location,
    wheelchair: r.wheelchair,
    highChair: r.highChair,
    occasion: r.occasion,
    status: r.status,
  }));

  const tableOptions = tables.map((t) => ({ id: t.id, number: t.number, capacity: t.capacity, zone: t.zone }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-white">Reserveringen</h1>
          <p className="mt-1 text-sm text-white/50">
            {rows.length} {rows.length === 1 ? "reservering" : "reserveringen"} op{" "}
            {date.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <NewReservationButton tables={tableOptions} />
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl">
        <ReservationFilters date={dateIso} status={status} q={q} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-kitchen-card/70 backdrop-blur-xl">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/40 [&_th]:px-6 [&_th]:py-4 [&_th]:font-medium">
              <th>Tijd</th>
              <th>Klant</th>
              <th>Personen</th>
              <th>Tafel</th>
              <th>Locatie</th>
              <th>Opties</th>
              <th>Status</th>
              <th className="text-right">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <ReservationRow key={r.id} r={r} tables={tableOptions} />
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-16 text-center text-sm text-white/40">
            Geen reserveringen gevonden voor deze filters.
          </p>
        )}
      </div>
    </div>
  );
}
