"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Star, Users } from "lucide-react";
import { CtaButton } from "./cta-button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#111111]"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt="Sfeervol interieur van The Kitchen Veendam met gedekte tafel en kaarslicht"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/85 to-[#111111]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/60" />
      </div>

      <div className="section-container relative z-10 grid w-full grid-cols-1 items-center gap-16 pt-24 lg:grid-cols-[1.3fr_0.7fr] lg:pt-16">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-block text-sm font-semibold uppercase tracking-[0.4em] text-kitchen-gold"
          >
            Welkom bij
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-6xl font-bold leading-[0.95] text-white sm:text-7xl lg:text-8xl"
          >
            THE KITCHEN
            <br />
            <span className="text-kitchen-red">VEENDAM</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-lg text-lg leading-relaxed text-white/70 sm:text-xl"
          >
            De plek voor familie, lunch, diner, BBQ en een gezellige borrel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <CtaButton href="/reserveren" size="lg" variant="primary">
              Reserveer direct
            </CtaButton>
            <CtaButton href="/menu" size="lg" variant="outline">
              Bekijk menukaart
            </CtaButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden justify-self-end lg:block"
        >
          <div className="w-64 rounded-2xl border border-white/10 bg-[#1D1D1D]/90 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-md">
            <div className="flex gap-1 text-kitchen-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-3 font-heading text-2xl font-semibold text-white">
              4,8 <span className="text-sm font-sans font-normal text-white/50">/ 5</span>
            </p>
            <p className="text-sm text-white/60">Google Reviews</p>
            <div className="my-4 h-px w-full bg-white/10" />
            <div className="flex items-center gap-2 text-white/80">
              <Users size={18} className="text-kitchen-gold" />
              <p className="text-sm font-medium">+12.000 tevreden gasten</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-kitchen-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
