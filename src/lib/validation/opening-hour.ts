import { z } from "zod";

const timeField = z.string().regex(/^\d{2}:\d{2}$/, "Ongeldige tijd").nullable();

export const openingHourRowSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    closed: z.boolean().default(false),
    openTime: timeField.default(null),
    closeTime: timeField.default(null),
  })
  .refine((data) => data.closed || (data.openTime && data.closeTime && data.closeTime > data.openTime), {
    message: "Sluitingstijd moet na openingstijd liggen",
    path: ["closeTime"],
  });

export const weeklyHoursSchema = z.object({
  rows: z.array(openingHourRowSchema).length(7),
});

export type OpeningHourRowInput = z.infer<typeof openingHourRowSchema>;
export type WeeklyHoursInput = z.infer<typeof weeklyHoursSchema>;
export type WeeklyHoursFormValues = z.input<typeof weeklyHoursSchema>;
