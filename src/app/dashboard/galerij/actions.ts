"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import { galleryImageSchema } from "@/lib/validation/gallery";

export type ActionResult = { success: true } | { success: false; error: string };

async function requireGalleryAccess() {
  const session = await auth();
  if (!session?.user || !canAccessSection(session.user.role, "galerij")) {
    throw new Error("Geen toegang");
  }
  return session;
}

function revalidateGalleryViews() {
  revalidatePath("/dashboard/galerij");
  revalidatePath("/galerij");
}

export async function createGalleryImageAction(input: unknown): Promise<ActionResult> {
  await requireGalleryAccess();

  const parsed = galleryImageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  const maxSortOrder = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });

  await prisma.galleryImage.create({
    data: {
      url: data.url,
      alt: data.alt,
      category: data.category,
      width: data.width,
      height: data.height,
      sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
    },
  });

  revalidateGalleryViews();
  return { success: true };
}

export async function updateGalleryImageAction(id: string, input: unknown): Promise<ActionResult> {
  await requireGalleryAccess();

  const parsed = galleryImageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.galleryImage.update({
    where: { id },
    data: {
      url: data.url,
      alt: data.alt,
      category: data.category,
      width: data.width,
      height: data.height,
    },
  });

  revalidateGalleryViews();
  return { success: true };
}

export async function deleteGalleryImageAction(id: string): Promise<ActionResult> {
  await requireGalleryAccess();
  await prisma.galleryImage.delete({ where: { id } });
  revalidateGalleryViews();
  return { success: true };
}

/** Persists a new drag-and-drop order for a (typically category-filtered) subset of images. */
export async function reorderGalleryImagesAction(orderedIds: string[]): Promise<ActionResult> {
  await requireGalleryAccess();

  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.galleryImage.update({ where: { id }, data: { sortOrder: index } })),
  );

  revalidateGalleryViews();
  return { success: true };
}
