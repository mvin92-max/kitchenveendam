"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function GiftCardPreview({ amount }: { amount: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: -3 }}
      whileHover={{ rotate: 0, y: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-[1.6/1] w-full max-w-md overflow-hidden rounded-2xl border border-kitchen-gold/30 bg-gradient-to-br from-[#1D1D1D] via-[#111111] to-[#2a0d0d] p-8 shadow-[0_30px_80px_-20px_rgba(212,175,55,0.25)]"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-kitchen-gold/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-kitchen-red/20 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 1px, transparent 14px)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <Image src="/logo-gold.png" alt="The Kitchen Veendam" width={200} height={118} className="h-9 w-auto" />
          <Sparkles className="text-kitchen-gold" size={22} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-kitchen-gold">
            Cadeaubon
          </p>
          <p className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
            {amount}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
