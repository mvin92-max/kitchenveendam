import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { RESTAURANT_ADDRESS } from "@/lib/restaurant-info";
import { ApplicationForm } from "@/components/solliciteren/application-form";

export const metadata: Metadata = {
  title: "Solliciteren | The Kitchen Veendam",
  description: "The Kitchen Veendam opent in oktober 2026 en zoekt personeel. Bekijk de vacatures en solliciteer.",
};

export default function SolliciterenPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#111111] px-6 py-16">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-kitchen-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-kitchen-gold/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <Logo imgClassName="h-14 w-auto" priority />

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
          Personeel gezocht — opening oktober 2026
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-white sm:text-4xl">
          Kom werken bij The Kitchen Veendam
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          We bouwen aan een nieuw team voor onze opening. Vul het formulier in en we nemen contact met je op.
        </p>

        <div className="mt-8 w-full rounded-3xl border border-white/[0.08] bg-kitchen-card/80 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8">
          <ApplicationForm />
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-white/40">
          <MapPin size={13} className="text-kitchen-gold" />
          {RESTAURANT_ADDRESS.street}, {RESTAURANT_ADDRESS.postalCity}
        </p>

        <p className="mt-12 text-xs text-white/30">© {new Date().getFullYear()} The Kitchen Veendam</p>
      </div>
    </main>
  );
}
