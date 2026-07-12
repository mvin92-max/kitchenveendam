import { z } from "zod";

/** Shared by the "new dish" and "edit dish" admin dialogs. */
export const menuItemSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht"),
  description: z.string().trim().min(2, "Beschrijving is verplicht"),
  ingredients: z.string().trim().optional().or(z.literal("")),
  price: z.number().min(0, "Prijs moet 0 of hoger zijn"),
  priceIsFrom: z.boolean().default(false),
  image: z.string().trim().min(1, "Foto is verplicht"),
  categoryId: z.string().min(1, "Kies een categorie"),
  spicyLevel: z.number().int().min(0).max(3).default(0),
  vegetarian: z.boolean().default(false),
  chefsChoice: z.boolean().default(false),
  soldOut: z.boolean().default(false),
  allergenIds: z.array(z.string()).default([]),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
// See src/lib/validation/reservation.ts for why forms use the *input* type
// (pre-default/pre-transform) as their useForm<> generic.
export type MenuItemFormValues = z.input<typeof menuItemSchema>;
