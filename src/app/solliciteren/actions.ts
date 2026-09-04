"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { VACANCY_EMAIL } from "@/lib/restaurant-info";
import { jobApplicationSchema } from "@/lib/validation/job-application";

export type SubmitApplicationResult = { success: true } | { success: false; error: string };

/**
 * Public vacancy form: saved to the database AND emailed to the vacancy
 * inbox, independently of each other, so a hiccup in one (e.g. the database
 * being briefly unreachable) doesn't lose an application that the other
 * channel still captured. Only reports failure to the applicant if both did.
 */
export async function submitJobApplication(input: unknown): Promise<SubmitApplicationResult> {
  const parsed = jobApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  const savedToDb = await prisma.jobApplication
    .create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        positions: data.positions,
        message: data.message || null,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.error("Kon sollicitatie niet opslaan in database:", err);
      return false;
    });

  const emailSent = await sendEmail({
    to: VACANCY_EMAIL,
    subject: `Nieuwe sollicitatie: ${data.name}`,
    html: `
      <h2>Nieuwe sollicitatie via de website</h2>
      <p><strong>Naam:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefoon:</strong> ${escapeHtml(data.phone || "-")}</p>
      <p><strong>Functie(s):</strong> ${data.positions.map(escapeHtml).join(", ")}</p>
      <p><strong>Motivatie:</strong></p>
      <p>${escapeHtml(data.message || "-").replace(/\n/g, "<br />")}</p>
    `,
  });

  if (!savedToDb && !emailSent) {
    return { success: false, error: "Versturen is niet gelukt. Probeer het later opnieuw of mail ons rechtstreeks." };
  }

  return { success: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
