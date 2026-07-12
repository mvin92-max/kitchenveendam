"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import { adminReservationSchema, type ReservationStatus } from "@/lib/validation/reservation";
import { findAvailableTable, startOfDay, tableHasConflict } from "@/lib/reservations";

export type ActionResult = { success: true } | { success: false; error: string };

async function requireReservationAccess() {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "reserveringen")) {
    throw new Error("Geen toegang");
  }
  return session;
}

function revalidateReservationViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reserveringen");
  revalidatePath("/dashboard/tafels");
}

export async function createReservationAction(input: unknown): Promise<ActionResult> {
  await requireReservationAccess();

  const parsed = adminReservationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;
  const date = startOfDay(new Date(data.date));
  if (Number.isNaN(date.getTime())) {
    return { success: false, error: "Ongeldige datum." };
  }

  let tableId = data.tableId || null;
  if (tableId) {
    const conflict = await tableHasConflict({ tableId, date, time: data.time });
    if (conflict) {
      return { success: false, error: "Deze tafel is al bezet op dit tijdstip." };
    }
  } else {
    const table = await findAvailableTable({
      date,
      time: data.time,
      partySize: data.partySize,
      location: data.location,
    });
    if (!table) {
      return { success: false, error: "Geen vrije tafel gevonden voor dit tijdstip en aantal personen." };
    }
    tableId = table.id;
  }

  const customer = await prisma.customer.upsert({
    where: { email: data.email },
    update: { name: data.name, phone: data.phone },
    create: { name: data.name, email: data.email, phone: data.phone },
  });

  await prisma.reservation.create({
    data: {
      customerId: customer.id,
      tableId,
      date,
      time: data.time,
      partySize: data.partySize,
      location: data.location,
      wheelchair: data.wheelchair,
      highChair: data.highChair,
      occasion: data.occasion,
      notes: data.notes || null,
      status: data.status,
    },
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { visits: { increment: 1 }, lastReservationAt: new Date() },
  });

  revalidateReservationViews();
  return { success: true };
}

export async function updateReservationStatusAction(
  reservationId: string,
  status: ReservationStatus,
): Promise<ActionResult> {
  await requireReservationAccess();
  await prisma.reservation.update({ where: { id: reservationId }, data: { status } });
  revalidateReservationViews();
  return { success: true };
}

/** Used by both the admin table dropdown and the Tafels drag-and-drop board. */
export async function reassignTableAction(
  reservationId: string,
  tableId: string,
): Promise<ActionResult> {
  await requireReservationAccess();

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) return { success: false, error: "Reservering niet gevonden." };

  if (reservation.tableId !== tableId) {
    const conflict = await tableHasConflict({
      tableId,
      date: reservation.date,
      time: reservation.time,
      excludeReservationId: reservationId,
    });
    if (conflict) {
      return { success: false, error: "Deze tafel is al bezet op dit tijdstip." };
    }
  }

  await prisma.reservation.update({ where: { id: reservationId }, data: { tableId } });
  revalidateReservationViews();
  return { success: true };
}

export async function cancelReservationAction(reservationId: string): Promise<ActionResult> {
  await requireReservationAccess();
  await prisma.reservation.update({ where: { id: reservationId }, data: { status: "cancelled" } });
  revalidateReservationViews();
  return { success: true };
}
