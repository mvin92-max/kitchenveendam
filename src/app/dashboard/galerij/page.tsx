import { prisma } from "@/lib/prisma";
import { GalleryBoard } from "@/components/dashboard/gallery/gallery-board";
import type { GalleryImageData } from "@/components/dashboard/gallery/gallery-tile";

export default async function GalerijBeheerPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });

  const imageData: GalleryImageData[] = images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    category: img.category,
    width: img.width,
    height: img.height,
  }));

  return <GalleryBoard images={imageData} />;
}
