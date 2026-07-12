import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./social-icons";
import { RESTAURANT_ADDRESS } from "@/lib/restaurant-info";
import { dayLabel, formatHoursRange, orderRowsMondayFirst } from "@/lib/format-hours";
import { prisma } from "@/lib/prisma";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

export async function Footer() {
  const [hourRecords, upcomingExceptions] = await Promise.all([
    prisma.openingHour.findMany(),
    prisma.openingHourException.findMany({
      where: { date: { gte: new Date(new Date().toDateString()) } },
      orderBy: { date: "asc" },
      take: 3,
    }),
  ]);
  const hours = orderRowsMondayFirst(hourRecords);

  return (
    <footer id="contact" className="relative border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="section-container grid grid-cols-1 gap-12 py-20 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo imgClassName="h-12 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            De plek voor een heerlijke lunch, diner, drankje of BBQ.
            Gezelligheid, kwaliteit en gastvrijheid staan bij ons centraal.
          </p>
          <div className="mt-6 flex gap-3">
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
        </div>

        <div>
          <h3 className="mb-6 font-heading text-lg font-semibold text-white">
            Openingstijden
          </h3>
          <ul className="flex flex-col gap-3">
            {hours.map((row) => (
              <li
                key={row.dayOfWeek}
                className="flex items-start justify-between gap-4 text-sm text-white/60"
              >
                <span className="flex items-center gap-2">
                  <Clock size={14} className="mt-0.5 shrink-0 text-kitchen-gold" />
                  {dayLabel(row.dayOfWeek)}
                </span>
                <span className="whitespace-nowrap text-white/80">{formatHoursRange(row)}</span>
              </li>
            ))}
          </ul>
          {upcomingExceptions.length > 0 && (
            <ul className="mt-4 flex flex-col gap-1.5 border-t border-white/[0.06] pt-4">
              {upcomingExceptions.map((e) => (
                <li key={e.id} className="text-xs text-kitchen-gold/80">
                  {e.date.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })} — {e.label}:{" "}
                  {e.closed ? "gesloten" : `${e.openTime} - ${e.closeTime}`}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="mb-6 font-heading text-lg font-semibold text-white">
            Contact
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-kitchen-gold" />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_ADDRESS.mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                {RESTAURANT_ADDRESS.street}
                <br />
                {RESTAURANT_ADDRESS.postalCity}
              </a>
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
        </div>

        <div>
          <h3 className="mb-6 font-heading text-lg font-semibold text-white">
            Nieuwsbrief
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-white/55">
            Blijf op de hoogte van nieuwe gerechten, arrangementen en events.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="section-container flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} The Kitchen Veendam. Alle rechten voorbehouden.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white/70">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white/70">
              Algemene voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
