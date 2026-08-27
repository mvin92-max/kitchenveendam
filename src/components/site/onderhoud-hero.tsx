"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Hammer, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { RESTAURANT_ADDRESS } from "@/lib/restaurant-info";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/site/social-icons";

const EASE = [0.22, 1, 0.36, 1] as const;

export function OnderhoudHero() {
  return (
    <main className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#111111] px-6 py-20 text-center">
      <div className="absolute inset-0">
        <Image
          src="/pand-gevel.jpg"
          alt="De gevel van The Kitchen Veendam"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/90 to-[#111111]/60" />
        <div className="absolute inset-0 bg-[#111111]/30" />
      </div>

      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-kitchen-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-kitchen-gold/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Logo imgClassName="h-14 w-auto" priority />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-kitchen-gold"
        >
          <Hammer size={14} />
          We zijn aan het verbouwen
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-4 font-heading text-5xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl"
        >
          Er wordt hard
          <br />
          <span className="text-kitchen-red">gebouwd</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
        >
          The Kitchen Veendam wordt volledig verbouwd tot een nieuwe culinaire hotspot. We staan te popelen om
          binnenkort onze deuren te openen.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_ADDRESS.mapsQuery)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          <MapPin size={16} className="text-kitchen-gold" />
          {RESTAURANT_ADDRESS.street}, {RESTAURANT_ADDRESS.postalCity}
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="mt-10"
        >
          <Link href="/solliciteren" className="group relative inline-flex">
            <motion.span
              className="absolute inset-0 rounded-full bg-kitchen-red/60 blur-xl"
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex h-16 items-center gap-3 rounded-full bg-kitchen-red px-10 text-base font-bold uppercase tracking-wide text-white shadow-[0_20px_60px_-15px_rgba(139,20,20,0.8)] transition-transform group-hover:scale-105 group-active:scale-100 sm:text-lg">
              <Briefcase size={20} />
              Solliciteer nu
            </span>
          </Link>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          href={`mailto:${RESTAURANT_ADDRESS.email}`}
          className="mt-6 flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <Mail size={15} className="text-kitchen-gold" />
          {RESTAURANT_ADDRESS.email}
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          className="mt-8 flex gap-3"
        >
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
        </motion.div>

        <p className="mt-14 text-xs text-white/30">© {new Date().getFullYear()} The Kitchen Veendam</p>
      </div>
    </main>
  );
}
