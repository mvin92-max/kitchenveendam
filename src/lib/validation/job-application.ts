import { z } from "zod";
import { OPEN_VACANCIES } from "@/lib/restaurant-info";

const VACANCY_KEYS = OPEN_VACANCIES as unknown as [string, ...string[]];

export const jobApplicationSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht"),
  email: z.string().trim().email("Ongeldig e-mailadres"),
  phone: z.string().trim().optional().or(z.literal("")),
  positions: z.array(z.enum(VACANCY_KEYS)).min(1, "Kies minimaal 1 functie"),
  message: z.string().trim().max(2000, "Maximaal 2000 tekens").optional().or(z.literal("")),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type JobApplicationFormValues = z.input<typeof jobApplicationSchema>;
