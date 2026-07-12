"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Salad, UsersRound, Gem } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { StaggerGroup, StaggerItem, scaleIn } from "@/components/site/motion";

const MISSION_ITEMS = [
  {
    icon: Salad,
    title: "Verse ingrediënten",
    description: "Dagelijks vers ingekocht bij lokale leveranciers, puur en vol van smaak.",
  },
  {
    icon: HeartHandshake,
    title: "Gastvrijheid",
    description: "Iedere gast wordt ontvangen alsof je bij ons thuiskomt.",
  },
  {
    icon: UsersRound,
    title: "Familie",
    description: "Voor jong en oud — een plek waar het hele gezin zich thuis voelt.",
  },
  {
    icon: Gem,
    title: "Kwaliteit",
    description: "Van premium vlees tot de kleinste details, wij kiezen altijd voor het beste.",
  },
];

export function MissionCards() {
  return (
    <section className="relative bg-[#0d0d0d] py-28 lg:py-36">
      <div className="section-container flex flex-col gap-16">
        <SectionHeading
          eyebrow="Onze missie"
          title="Waar wij voor staan"
          description="Vier waarden die alles bepalen wat we doen bij The Kitchen Veendam."
        />

        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MISSION_ITEMS.map((item) => (
            <StaggerItem key={item.title} variants={scaleIn}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex h-full flex-col items-center gap-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card p-8 text-center shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:border-kitchen-gold/40"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-kitchen-red/0 blur-2xl transition-all duration-500 group-hover:bg-kitchen-red/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-kitchen-red/15 text-kitchen-gold transition-all duration-300 group-hover:bg-kitchen-red group-hover:text-white">
                  <item.icon size={28} strokeWidth={1.75} />
                </div>
                <h3 className="relative font-heading text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-white/55">
                  {item.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
