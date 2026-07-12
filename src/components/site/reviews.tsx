"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { StaggerGroup, StaggerItem } from "./motion";

const REVIEWS = [
  {
    name: "Marieke de Boer",
    role: "Google review",
    text: "Heerlijk gegeten bij The Kitchen! De steak was perfect gegrild en de sfeer helemaal top. Komen zeker terug.",
  },
  {
    name: "Johan Wiersema",
    role: "Google review",
    text: "Het BBQ arrangement is een aanrader voor iedereen. Onbeperkt lekker vlees en een super gastvrije bediening.",
  },
  {
    name: "Sanne Mulder",
    role: "Google review",
    text: "Gezellig met de kinderen gegeten, iedereen kon zijn ding vinden op de kaart. Netjes, warm en heerlijk eten.",
  },
];

export function Reviews() {
  return (
    <section className="relative bg-[#111111] py-28 lg:py-36">
      <div className="section-container flex flex-col gap-16">
        <SectionHeading
          eyebrow="Wat gasten zeggen"
          title="4,8 sterren op Google"
          description="Meer dan 12.000 tevreden gasten gingen je voor."
        />

        <StaggerGroup className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <StaggerItem key={review.name}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col gap-5 rounded-2xl border border-white/[0.06] bg-kitchen-card p-8 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)]"
              >
                <Quote className="absolute right-6 top-6 text-kitchen-red/30" size={40} />
                <div className="flex gap-1 text-kitchen-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-white/70">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3 pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-kitchen-red/20 font-heading text-lg font-semibold text-kitchen-gold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    <p className="text-xs text-white/50">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Link
          href="/reviews"
          className="group/link mx-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-kitchen-gold"
        >
          Bekijk alle reviews
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
          />
        </Link>
      </div>
    </section>
  );
}
