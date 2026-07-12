"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";

export type ActionResult = { success: true } | { success: false; error: string };

const TABLE_STATUSES = ["vrij", "gereserveerd", "bezet", "schoonmaken", "onderhoud"] as const;

export async function updateTableStatusAction(tableId: string, status: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "tafels")) {
    return { success: false, error: "Geen toegang" };
  }
  if (!TABLE_STATUSES.includes(status as (typeof TABLE_STATUSES)[number])) {
    return { success: false, error: "Ongeldige status" };
  }

  await prisma.table.update({ where: { id: tableId }, data: { status } });
  revalidatePath("/dashboard/tafels");
  revalidatePath("/dashboard");
  return { success: true };
}
