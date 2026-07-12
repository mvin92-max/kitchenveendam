import { z } from "zod";
import { EMPLOYEE_POSITIONS } from "./employee";

export const shiftSchema = z
  .object({
    employeeId: z.string().trim().min(1, "Kies een medewerker"),
    date: z.string().trim().min(1, "Kies een datum"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Kies een starttijd"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Kies een eindtijd"),
    position: z.enum(EMPLOYEE_POSITIONS, { message: "Kies een functie" }),
    notes: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "Eindtijd moet na starttijd liggen",
    path: ["endTime"],
  });

export type ShiftInput = z.infer<typeof shiftSchema>;
export type ShiftFormValues = z.input<typeof shiftSchema>;
