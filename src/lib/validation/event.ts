import { z } from "zod";

/** Shared by the "new event" and "edit event" admin dialogs. */
export const eventSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht"),
  description: z.string().trim().min(2, "Beschrijving is verplicht"),
  schedule: z.string().trim().min(2, "Vermeld wanneer dit evenement plaatsvindt"),
  price: z.string().trim().min(1, "Prijs is verplicht"),
  image: z.string().trim().min(1, "Foto is verplicht"),
  maxGuests: z.number().int().min(0).nullable().default(null),
  ticketsSold: z.number().int().min(0).default(0),
});

export type EventInput = z.infer<typeof eventSchema>;
// See src/lib/validation/reservation.ts for why forms use the *input* type
// (pre-default) as their useForm<> generic.
export type EventFormValues = z.input<typeof eventSchema>;
