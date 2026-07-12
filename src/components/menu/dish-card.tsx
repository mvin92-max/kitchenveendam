"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Sparkles } from "lucide-react";
import type { PublicMenuItem } from "./menu-grid";
import { SpiceLevel } from "./spice-level";

export function DishCard({ item }: { item: PublicMenuItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]"
    >
      <div className="relative h-56 w-full shrink-0 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

        {item.chefsChoice && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#111111]/80 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-kitchen-gold backdrop-blur-sm">
            <Sparkles size={12} />
            Chef&apos;s Choice
          </span>
        )}

        <span className="absolute right-4 top-4 rounded-full bg-kitchen-gold px-4 py-1.5 text-sm font-semibold text-[#111111] shadow-lg">
          {item.price}
        </span>

        {item.vegetarian && (
          <span
            title="Vegetarisch"
            className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#111111]/80 text-green-400 backdrop-blur-sm"
          >
            <Leaf size={15} />
          </span>
        )}

        {item.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
              Tijdelijk uitverkocht
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-semibold text-white">
            {item.name}
          </h3>
          {item.spicyLevel ? <SpiceLevel level={item.spicyLevel as 1 | 2 | 3} /> : null}
        </div>

        <p className="flex-1 text-sm leading-relaxed text-white/55">
          {item.description}
        </p>

        {item.allergens.length > 0 && (
          <p className="text-xs text-white/40">
            <span className="text-white/55">Allergenen: </span>
            {item.allergens.join(", ")}
          </p>
        )}
      </div>
    </motion.div>
  );
}
