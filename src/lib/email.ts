import { Resend } from "resend";

// Sends from a dedicated subdomain (mail.thekitchenveendam.nl) verified with
// Resend, kept separate from the apex domain's real mailboxes (Microsoft
// 365) so DKIM/SPF for the two never conflict.
const FROM_ADDRESS = "The Kitchen Veendam <noreply@mail.thekitchenveendam.nl>";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<boolean> {
  const resend = getClient();
  if (!resend) {
    console.warn("RESEND_API_KEY ontbreekt — e-mail niet verzonden:", params.subject);
    return false;
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    console.error("Resend fout:", error);
    return false;
  }
  return true;
}
