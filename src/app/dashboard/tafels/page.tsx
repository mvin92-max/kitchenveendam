import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/reservations";
import { FloorPlanBoard } from "@/components/dashboard/tables/floor-plan-board";

export default async function TafelsPage() {
  const today = startOfDay(new Date());

  const [tables, reservations] = await Promise.all([
    prisma.table.findMany({ orderBy: { number: "asc" } }),
    prisma.reservation.findMany({
      where: { date: today, status: { not: "cancelled" } },
      include: { customer: true, table: true },
      orderBy: { time: "asc" },
    }),
  ]);

  const tableData = tables.map((t) => ({
    id: t.id,
    number: t.number,
    capacity: t.capacity,
    zone: t.zone,
    status: t.status,
    posX: t.posX,
    posY: t.posY,
  }));

  const reservationChips = reservations.map((r) => ({
    id: r.id,
    time: r.time,
    customerName: r.customer.name,
    partySize: r.partySize,
    tableId: r.tableId,
    tableNumber: r.table?.number ?? null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-white">Tafels</h1>
        <p className="mt-1 text-sm text-white/50">
          Interactieve plattegrond — klik een tafel voor details of sleep een reservering naar een
          andere tafel.
        </p>
      </div>

      <FloorPlanBoard tables={tableData} reservations={reservationChips} />
    </div>
  );
}
