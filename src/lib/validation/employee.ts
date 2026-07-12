import { z } from "zod";

export const EMPLOYEE_POSITIONS = ["Bediening", "Keuken", "Bar", "Management", "Schoonmaak"] as const;

export const employeeSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht"),
  position: z.enum(EMPLOYEE_POSITIONS, { message: "Kies een functie" }),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Ongeldig e-mailadres").optional().or(z.literal("")),
  contractHours: z.number().int().min(0).max(60).nullable().default(null),
  active: z.boolean().default(true),
  userId: z.string().trim().nullable().default(null),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeFormValues = z.input<typeof employeeSchema>;
