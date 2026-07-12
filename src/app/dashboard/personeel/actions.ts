"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import { employeeSchema } from "@/lib/validation/employee";
import { shiftSchema } from "@/lib/validation/shift";

export type ActionResult = { success: true } | { success: false; error: string };

async function requirePersoneelAccess() {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "personeel")) {
    throw new Error("Geen toegang");
  }
  return session;
}

/** Building/editing the roster and schedule is OWNER/MANAGER only — STAFF and
 * KITCHEN only get the read-only "Mijn rooster" view (see page.tsx). */
async function requirePersoneelWrite() {
  const session = await requirePersoneelAccess();
  if (session.user.role !== "OWNER" && session.user.role !== "MANAGER") {
    throw new Error("Geen toegang");
  }
  return session;
}

function revalidatePersoneelViews() {
  revalidatePath("/dashboard/personeel");
}

export async function createEmployeeAction(input: unknown): Promise<ActionResult> {
  await requirePersoneelWrite();

  const parsed = employeeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.employee.create({
    data: {
      name: data.name,
      position: data.position,
      phone: data.phone || null,
      email: data.email || null,
      contractHours: data.contractHours,
      active: data.active,
      userId: data.userId || null,
    },
  });

  revalidatePersoneelViews();
  return { success: true };
}

export async function updateEmployeeAction(id: string, input: unknown): Promise<ActionResult> {
  await requirePersoneelWrite();

  const parsed = employeeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.employee.update({
    where: { id },
    data: {
      name: data.name,
      position: data.position,
      phone: data.phone || null,
      email: data.email || null,
      contractHours: data.contractHours,
      active: data.active,
      userId: data.userId || null,
    },
  });

  revalidatePersoneelViews();
  return { success: true };
}

export async function deleteEmployeeAction(id: string): Promise<ActionResult> {
  await requirePersoneelWrite();
  await prisma.employee.delete({ where: { id } });
  revalidatePersoneelViews();
  return { success: true };
}

export async function createShiftAction(input: unknown): Promise<ActionResult> {
  await requirePersoneelWrite();

  const parsed = shiftSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.shift.create({
    data: {
      employeeId: data.employeeId,
      // Bare "YYYY-MM-DD" parses as UTC midnight; appending a local-time
      // suffix like "T00:00:00" would shift the date in non-UTC timezones.
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      position: data.position,
      notes: data.notes || null,
    },
  });

  revalidatePersoneelViews();
  return { success: true };
}

export async function updateShiftAction(id: string, input: unknown): Promise<ActionResult> {
  await requirePersoneelWrite();

  const parsed = shiftSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.shift.update({
    where: { id },
    data: {
      employeeId: data.employeeId,
      // Bare "YYYY-MM-DD" parses as UTC midnight; appending a local-time
      // suffix like "T00:00:00" would shift the date in non-UTC timezones.
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      position: data.position,
      notes: data.notes || null,
    },
  });

  revalidatePersoneelViews();
  return { success: true };
}

export async function deleteShiftAction(id: string): Promise<ActionResult> {
  await requirePersoneelWrite();
  await prisma.shift.delete({ where: { id } });
  revalidatePersoneelViews();
  return { success: true };
}
