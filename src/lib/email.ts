import { Resend } from "resend";

// No custom domain is verified with Resend yet (avoids touching the DNS that
// already runs this domain's real mailboxes), so this sends from Resend's
// own shared domain rather than an @thekitchenveendam.nl address. Swap
// EMAIL_FROM once a sending domain is verified in the Resend dashboard.
const FROM_ADDRESS = "The Kitchen Veendam <onboarding@resend.dev>";

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
