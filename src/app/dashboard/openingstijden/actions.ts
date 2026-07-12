"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import { weeklyHoursSchema } from "@/lib/validation/opening-hour";
import { openingHourExceptionSchema } from "@/lib/validation/opening-hour-exception";

export type ActionResult = { success: true } | { success: false; error: string };

async function requireOpeningHoursAccess() {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "openingstijden")) {
    throw new Error("Geen toegang");
  }
  return session;
}

function revalidateOpeningHourViews() {
  revalidatePath("/dashboard/openingstijden");
  revalidatePath("/");
  revalidatePath("/reserveren");
}

export async function updateWeeklyHoursAction(input: unknown): Promise<ActionResult> {
  await requireOpeningHoursAccess();

  const parsed = weeklyHoursSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde tijden." };
  }

  await prisma.$transaction(
    parsed.data.rows.map((row) =>
      prisma.openingHour.upsert({
        where: { dayOfWeek: row.dayOfWeek },
        update: { closed: row.closed, openTime: row.closed ? null : row.openTime, closeTime: row.closed ? null : row.closeTime },
        create: {
          dayOfWeek: row.dayOfWeek,
          closed: row.closed,
          openTime: row.closed ? null : row.openTime,
          closeTime: row.closed ? null : row.closeTime,
        },
      }),
    ),
  );

  revalidateOpeningHourViews();
  return { success: true };
}

export async function createExceptionAction(input: unknown): Promise<ActionResult> {
  await requireOpeningHoursAccess();

  const parsed = openingHourExceptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.openingHourException.create({
    data: {
      // Bare "YYYY-MM-DD" parses as UTC midnight; appending a local-time
      // suffix like "T00:00:00" would shift the date in non-UTC timezones.
      date: new Date(data.date),
      label: data.label,
      closed: data.closed,
      openTime: data.closed ? null : data.openTime,
      closeTime: data.closed ? null : data.closeTime,
    },
  });

  revalidateOpeningHourViews();
  return { success: true };
}

export async function updateExceptionAction(id: string, input: unknown): Promise<ActionResult> {
  await requireOpeningHoursAccess();

  const parsed = openingHourExceptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.openingHourException.update({
    where: { id },
    data: {
      // Bare "YYYY-MM-DD" parses as UTC midnight; appending a local-time
      // suffix like "T00:00:00" would shift the date in non-UTC timezones.
      date: new Date(data.date),
      label: data.label,
      closed: data.closed,
      openTime: data.closed ? null : data.openTime,
      closeTime: data.closed ? null : data.closeTime,
    },
  });

  revalidateOpeningHourViews();
  return { success: true };
}

export async function deleteExceptionAction(id: string): Promise<ActionResult> {
  await requireOpeningHoursAccess();
  await prisma.openingHourException.delete({ where: { id } });
  revalidateOpeningHourViews();
  return { success: true };
}
