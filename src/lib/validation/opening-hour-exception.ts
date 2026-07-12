import { z } from "zod";

export const openingHourExceptionSchema = z
  .object({
    date: z.string().trim().min(1, "Kies een datum"),
    label: z.string().trim().min(2, "Naam is verplicht (bijv. Eerste Kerstdag)"),
    closed: z.boolean().default(true),
    openTime: z.string().regex(/^\d{2}:\d{2}$/, "Ongeldige tijd").nullable().default(null),
    closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Ongeldige tijd").nullable().default(null),
  })
  .refine((data) => data.closed || (data.openTime && data.closeTime && data.closeTime > data.openTime), {
    message: "Sluitingstijd moet na openingstijd liggen",
    path: ["closeTime"],
  });

export type OpeningHourExceptionInput = z.infer<typeof openingHourExceptionSchema>;
export type OpeningHourExceptionFormValues = z.input<typeof openingHourExceptionSchema>;
