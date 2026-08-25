import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { RESTAURANT_ADDRESS } from "@/lib/restaurant-info";
import { dayLabel, formatHoursRange, orderRowsMondayFirst } from "@/lib/format-hours";
import { prisma } from "@/lib/prisma";

export async function InfoPanel() {
  // Falls back to an empty schedule if the database is briefly unreachable
  // rather than crashing the page — see the same pattern in
  // src/app/layout.tsx.
  const hourRecords = await prisma.openingHour.findMany().catch(() => []);
  const hours = orderRowsMondayFirst(hourRecords);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.9)]">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80"
          alt="Interieur van The Kitchen Veendam"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="rounded-3xl border border-white/[0.06] bg-kitchen-card p-7">
        <h3 className="mb-5 flex items-center gap-2 font-heading text-xl font-semibold text-white">
          <Clock size={18} className="text-kitchen-gold" />
          Openingstijden
        </h3>
        <ul className="flex flex-col gap-3">
          {hours.map((row) => (
            <li
              key={row.dayOfWeek}
              className="flex items-center justify-between gap-4 text-sm text-white/60"
            >
              <span>{dayLabel(row.dayOfWeek)}</span>
              <span className="whitespace-nowrap text-white/80">{formatHoursRange(row)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-white/[0.06] bg-kitchen-card p-7">
        <h3 className="mb-5 flex items-center gap-2 font-heading text-xl font-semibold text-white">
          <MapPin size={18} className="text-kitchen-gold" />
          Adres &amp; contact
        </h3>
        <ul className="flex flex-col gap-4 text-sm text-white/70">
          <li className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-kitchen-gold" />
            <span>
              {RESTAURANT_ADDRESS.street}
              <br />
              {RESTAURANT_ADDRESS.postalCity}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 text-kitchen-gold" />
            <a href={RESTAURANT_ADDRESS.phoneHref} className="hover:text-white">
              {RESTAURANT_ADDRESS.phone}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 text-kitchen-gold" />
            <a href={`mailto:${RESTAURANT_ADDRESS.email}`} className="hover:text-white">
              {RESTAURANT_ADDRESS.email}
            </a>
          </li>
        </ul>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <iframe
            title="Locatie The Kitchen Veendam op Google Maps"
            src={`https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT_ADDRESS.mapsQuery)}&output=embed`}
            width="100%"
            height="220"
            loading="lazy"
            className="grayscale invert-[0.92] contrast-[0.9]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
