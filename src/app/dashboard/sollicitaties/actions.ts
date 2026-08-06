"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";

export type ActionResult = { success: true } | { success: false; error: string };

async function requireSollicitatiesAccess() {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "sollicitaties")) {
    throw new Error("Geen toegang");
  }
  return session;
}

export async function markApplicationReadAction(id: string, read: boolean): Promise<ActionResult> {
  await requireSollicitatiesAccess();
  await prisma.jobApplication.update({ where: { id }, data: { read } });
  revalidatePath("/dashboard/sollicitaties");
  return { success: true };
}

export async function deleteApplicationAction(id: string): Promise<ActionResult> {
  await requireSollicitatiesAccess();
  await prisma.jobApplication.delete({ where: { id } });
  revalidatePath("/dashboard/sollicitaties");
  return { success: true };
}
