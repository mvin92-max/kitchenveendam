"use server";

import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validation/reservation";
import { findAvailableTable, startOfDay } from "@/lib/reservations";

export type CreateReservationResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/**
 * Public booking flow: validate → check real availability → auto-assign a
 * table → upsert the customer → save the reservation. Runs entirely
 * server-side (Server Action), so the availability check can never be
 * bypassed by tampering with the client.
 */
export async function createPublicReservation(input: unknown): Promise<CreateReservationResult> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Controleer de ingevulde gegevens.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const date = startOfDay(new Date(data.date));
  if (Number.isNaN(date.getTime())) {
    return { success: false, error: "Ongeldige datum." };
  }
  if (date.getTime() < startOfDay(new Date()).getTime()) {
    return { success: false, error: "Kies een datum in de toekomst." };
  }

  const table = await findAvailableTable({
    date,
    time: data.time,
    partySize: data.partySize,
    location: data.location,
  });

  if (!table) {
    return {
      success: false,
      error: `Helaas is er geen tafel meer beschikbaar ${
        data.location === "binnen" ? "binnen" : "op het terras"
      } om ${data.time}. Probeer een andere tijd of locatie.`,
    };
  }

  const customer = await prisma.customer.upsert({
    where: { email: data.email },
    update: { name: data.name, phone: data.phone },
    create: { name: data.name, email: data.email, phone: data.phone },
  });

  await prisma.reservation.create({
    data: {
      customerId: customer.id,
      tableId: table.id,
      date,
      time: data.time,
      partySize: data.partySize,
      location: data.location,
      wheelchair: data.wheelchair,
      highChair: data.highChair,
      occasion: data.occasion,
      notes: data.notes || null,
      // Availability was just verified above, so this can be confirmed
      // immediately — see the "Automatische bevestiging" requirement.
      // Once Resend is connected this is also where the confirmation email
      // would be sent (src/app/dashboard/instellingen for setup).
      status: "confirmed",
    },
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { visits: { increment: 1 }, lastReservationAt: new Date() },
  });

  return { success: true };
}
