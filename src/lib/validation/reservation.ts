import { z } from "zod";

export const OCCASIONS = ["verjaardag", "zakelijk", "bbq"] as const;
export type Occasion = (typeof OCCASIONS)[number];

export const RESERVATION_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

/** Shared by the public booking form and the admin "new reservation" dialog. */
export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Naam is verplicht"),
  phone: z.string().trim().min(6, "Ongeldig telefoonnummer"),
  email: z.string().trim().min(1, "E-mailadres is verplicht").email("Ongeldig e-mailadres"),
  date: z.string().min(1, "Datum is verplicht"), // yyyy-mm-dd from <input type="date">
  time: z.string().regex(/^\d{2}:\d{2}$/, "Kies een tijd"),
  // Plain z.number(), not z.coerce.number(): coercion gives the schema an
  // `unknown` input type, which zodResolver can't reconcile with RHF's typed
  // form values. Inputs use `{ valueAsNumber: true }` to deliver a number.
  partySize: z.number().int().min(1, "Minimaal 1 persoon").max(20, "Bel ons voor groepen groter dan 20"),
  location: z.enum(["binnen", "terras"]),
  wheelchair: z.boolean().default(false),
  highChair: z.boolean().default(false),
  occasion: z.enum(OCCASIONS).nullable().default(null),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
// Fields with `.default()` (wheelchair, highChair, occasion) are optional in
// the *input* type and required in the *output* type. useForm() must be
// typed with the input shape (what the form actually holds pre-validation)
// for zodResolver's generics to line up — see the two form components.
export type ReservationFormValues = z.input<typeof reservationSchema>;

/** Admin form additionally lets staff set the status and pick a table directly. */
export const adminReservationSchema = reservationSchema.extend({
  status: z.enum(RESERVATION_STATUSES).default("confirmed"),
  tableId: z.string().optional().or(z.literal("")),
});

export type AdminReservationInput = z.infer<typeof adminReservationSchema>;
export type AdminReservationFormValues = z.input<typeof adminReservationSchema>;
