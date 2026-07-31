import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { RESTAURANT_ADDRESS } from "@/lib/restaurant-info";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/site/social-icons";

export const metadata: Metadata = {
  title: "Binnenkort meer | The Kitchen Veendam",
  robots: { index: false, follow: false },
};

export default function OnderhoudPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#111111] px-6 py-16 text-center">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-kitchen-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-kitchen-gold/10 blur-3xl" />

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <Logo imgClassName="h-14 w-auto" priority />

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
          We zijn druk bezig
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-white sm:text-4xl">
          Onze nieuwe website is bijna klaar
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          Meer informatie over The Kitchen Veendam volgt binnenkort. Voor vragen of reserveringen kun je ons
          intussen gewoon bereiken.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-white/70">
          <a href={RESTAURANT_ADDRESS.phoneHref} className="flex items-center gap-2 hover:text-white">
            <Phone size={15} className="text-kitchen-gold" />
            {RESTAURANT_ADDRESS.phone}
          </a>
          <a href={`mailto:${RESTAURANT_ADDRESS.email}`} className="flex items-center gap-2 hover:text-white">
            <Mail size={15} className="text-kitchen-gold" />
            {RESTAURANT_ADDRESS.email}
          </a>
        </div>

        <div className="mt-8 flex gap-3">
          {[
            { Icon: FacebookIcon, label: "Facebook" },
            { Icon: InstagramIcon, label: "Instagram" },
            { Icon: TikTokIcon, label: "TikTok" },
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-kitchen-gold/60 hover:text-kitchen-gold"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <p className="mt-12 text-xs text-white/30">
          © {new Date().getFullYear()} The Kitchen Veendam
        </p>
      </div>
    </main>
  );
}
