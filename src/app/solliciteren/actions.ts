"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { VACANCY_EMAIL } from "@/lib/restaurant-info";
import { jobApplicationSchema } from "@/lib/validation/job-application";

export type SubmitApplicationResult = { success: true } | { success: false; error: string };

/**
 * Public vacancy form: always saved to the database first (so nothing is
 * lost even if the notification email bounces or lands in spam), then
 * emailed to the vacancy inbox. Runs entirely server-side.
 */
export async function submitJobApplication(input: unknown): Promise<SubmitApplicationResult> {
  const parsed = jobApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Controleer de ingevulde gegevens." };
  }
  const data = parsed.data;

  await prisma.jobApplication.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      positions: data.positions,
      message: data.message || null,
    },
  });

  await sendEmail({
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

  return { success: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
