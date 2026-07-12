"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./social-icons";
import { OPENING_HOURS, RESTAURANT_ADDRESS } from "@/lib/restaurant-info";
import { Logo } from "./logo";

export function Footer() {
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
            {OPENING_HOURS.map((row) => (
              <li
                key={row.day}
                className="flex items-start justify-between gap-4 text-sm text-white/60"
              >
                <span className="flex items-center gap-2">
                  <Clock size={14} className="mt-0.5 shrink-0 text-kitchen-gold" />
                  {row.day}
                </span>
                <span className="whitespace-nowrap text-white/80">{row.time}</span>
              </li>
            ))}
          </ul>
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
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Je e-mailadres"
              className="h-11 w-full min-w-0 rounded-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              aria-label="Aanmelden"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kitchen-red text-white transition-colors hover:bg-[#8f1010]"
            >
              <Send size={16} />
            </motion.button>
          </form>
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
