import { z } from "zod";
import { GALLERY_CATEGORIES } from "@/lib/gallery-data";

const CATEGORY_KEYS = GALLERY_CATEGORIES.map((c) => c.key) as [string, ...string[]];

export const galleryImageSchema = z.object({
  url: z.string().trim().min(1, "Foto is verplicht"),
  alt: z.string().trim().min(2, "Omschrijving is verplicht (voor toegankelijkheid & SEO)"),
  category: z.enum(CATEGORY_KEYS, { message: "Kies een categorie" }),
  width: z.number().int().min(1).default(1200),
  height: z.number().int().min(1).default(900),
});

export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
export type GalleryImageFormValues = z.input<typeof galleryImageSchema>;
