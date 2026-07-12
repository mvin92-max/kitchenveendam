"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import { menuItemSchema } from "@/lib/validation/menu-item";

export type ActionResult = { success: true } | { success: false; error: string };

async function requireMenuAccess() {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "menukaart")) {
    throw new Error("Geen toegang");
  }
  return session;
}

function revalidateMenuViews() {
  revalidatePath("/dashboard/menukaart");
  revalidatePath("/menu");
}

export async function createMenuItemAction(input: unknown): Promise<ActionResult> {
  await requireMenuAccess();

  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      ingredients: data.ingredients || null,
      price: data.price,
      priceIsFrom: data.priceIsFrom,
      image: data.image,
      categoryId: data.categoryId,
      spicyLevel: data.spicyLevel || null,
      vegetarian: data.vegetarian,
      chefsChoice: data.chefsChoice,
      soldOut: data.soldOut,
      allergens: { connect: data.allergenIds.map((id) => ({ id })) },
    },
  });

  revalidateMenuViews();
  return { success: true };
}

export async function updateMenuItemAction(id: string, input: unknown): Promise<ActionResult> {
  await requireMenuAccess();

  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.menuItem.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      ingredients: data.ingredients || null,
      price: data.price,
      priceIsFrom: data.priceIsFrom,
      image: data.image,
      categoryId: data.categoryId,
      spicyLevel: data.spicyLevel || null,
      vegetarian: data.vegetarian,
      chefsChoice: data.chefsChoice,
      soldOut: data.soldOut,
      allergens: { set: data.allergenIds.map((allergenId) => ({ id: allergenId })) },
    },
  });

  revalidateMenuViews();
  return { success: true };
}

export async function deleteMenuItemAction(id: string): Promise<ActionResult> {
  await requireMenuAccess();
  await prisma.menuItem.delete({ where: { id } });
  revalidateMenuViews();
  return { success: true };
}

export async function toggleSoldOutAction(id: string, soldOut: boolean): Promise<ActionResult> {
  await requireMenuAccess();
  await prisma.menuItem.update({ where: { id }, data: { soldOut } });
  revalidateMenuViews();
  return { success: true };
}

export async function toggleChefsChoiceAction(id: string, chefsChoice: boolean): Promise<ActionResult> {
  await requireMenuAccess();
  await prisma.menuItem.update({ where: { id }, data: { chefsChoice } });
  revalidateMenuViews();
  return { success: true };
}
