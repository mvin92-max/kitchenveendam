"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import { eventSchema } from "@/lib/validation/event";

export type ActionResult = { success: true } | { success: false; error: string };

async function requireEventsAccess() {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "evenementen")) {
    throw new Error("Geen toegang");
  }
  return session;
}

function revalidateEventViews() {
  revalidatePath("/dashboard/evenementen");
  revalidatePath("/evenementen");
}

export async function createEventAction(input: unknown): Promise<ActionResult> {
  await requireEventsAccess();

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      schedule: data.schedule,
      price: data.price,
      image: data.image,
      maxGuests: data.maxGuests,
      ticketsSold: data.ticketsSold,
    },
  });

  revalidateEventViews();
  return { success: true };
}

export async function updateEventAction(id: string, input: unknown): Promise<ActionResult> {
  await requireEventsAccess();

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      schedule: data.schedule,
      price: data.price,
      image: data.image,
      maxGuests: data.maxGuests,
      ticketsSold: data.ticketsSold,
    },
  });

  revalidateEventViews();
  return { success: true };
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  await requireEventsAccess();
  await prisma.event.delete({ where: { id } });
  revalidateEventViews();
  return { success: true };
}
