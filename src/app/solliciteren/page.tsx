import type { Metadata } from "next";
import { Mail, MapPin, ChefHat } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { RESTAURANT_ADDRESS, OPEN_VACANCIES } from "@/lib/restaurant-info";

export const metadata: Metadata = {
  title: "Solliciteren | The Kitchen Veendam",
  description: "The Kitchen Veendam opent in oktober 2026 en zoekt personeel. Bekijk de vacatures en solliciteer.",
};

export default function SolliciterenPage() {
  const mailtoHref = `mailto:${RESTAURANT_ADDRESS.email}?subject=${encodeURIComponent("Sollicitatie The Kitchen Veendam")}`;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#111111] px-6 py-16 text-center">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-kitchen-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-kitchen-gold/10 blur-3xl" />

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <Logo imgClassName="h-14 w-auto" priority />

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
          Personeel gezocht — opening oktober 2026
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-white sm:text-4xl">
          Kom werken bij The Kitchen Veendam
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          We bouwen aan een nieuw team voor onze opening. Op zoek naar de volgende functies:
        </p>

        <ul className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          {OPEN_VACANCIES.map((role) => (
            <li
              key={role}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80"
            >
              <ChefHat size={15} className="shrink-0 text-kitchen-gold" />
              {role}
            </li>
          ))}
        </ul>

        <a
          href={mailtoHref}
          className="mt-8 flex h-12 items-center gap-2 rounded-full bg-kitchen-red px-7 text-sm font-medium uppercase tracking-wide text-white transition-all hover:bg-[#8f1010]"
        >
          <Mail size={16} />
          Solliciteer via e-mail
        </a>

        <p className="mt-4 flex items-center gap-2 text-xs text-white/40">
          <MapPin size={13} className="text-kitchen-gold" />
          {RESTAURANT_ADDRESS.street}, {RESTAURANT_ADDRESS.postalCity}
        </p>

        <p className="mt-12 text-xs text-white/30">© {new Date().getFullYear()} The Kitchen Veendam</p>
      </div>
    </main>
  );
}
