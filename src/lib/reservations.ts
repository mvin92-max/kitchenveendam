import { prisma } from "@/lib/prisma";

/** How long a table is considered occupied by a single reservation. */
export const RESERVATION_DURATION_MINUTES = 120;

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Two same-length reservation windows overlap iff their starts are closer than the duration. */
function overlaps(timeA: string, timeB: string): boolean {
  return Math.abs(timeToMinutes(timeA) - timeToMinutes(timeB)) < RESERVATION_DURATION_MINUTES;
}

export async function tableHasConflict(params: {
  tableId: string;
  date: Date;
  time: string;
  excludeReservationId?: string;
}): Promise<boolean> {
  const { tableId, date, time, excludeReservationId } = params;
  const dayStart = startOfDay(date);

  const existing = await prisma.reservation.findMany({
    where: {
      tableId,
      date: dayStart,
      status: { not: "cancelled" },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
    select: { id: true, time: true },
  });

  return existing.some((r) => overlaps(r.time, time));
}

/**
 * Finds the smallest table (in the requested zone) that fits the party and
 * has no time conflict. Returns `null` if the zone is fully booked for that
 * slot — callers should surface this as "please try another time", not
 * silently switch zones (that would override the guest's explicit choice).
 */
export async function findAvailableTable(params: {
  date: Date;
  time: string;
  partySize: number;
  location: "binnen" | "terras";
}) {
  const { date, time, partySize, location } = params;
  const dayStart = startOfDay(date);

  const candidates = await prisma.table.findMany({
    where: {
      zone: location,
      capacity: { gte: partySize },
      status: { notIn: ["onderhoud"] },
    },
    orderBy: { capacity: "asc" },
  });

  for (const table of candidates) {
    const conflict = await tableHasConflict({ tableId: table.id, date: dayStart, time });
    if (!conflict) return table;
  }
  return null;
}
