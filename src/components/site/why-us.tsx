"use client";

import { motion } from "framer-motion";
import { Beef, Flame, GlassWater, Salad, Sparkles, UsersRound } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { StaggerGroup, StaggerItem, scaleIn } from "./motion";

const FEATURES = [
  {
    icon: UsersRound,
    title: "Gezinsvriendelijk",
    description: "Een warme plek waar jong en oud zich meteen thuis voelt.",
  },
  {
    icon: Beef,
    title: "Premium vlees",
    description: "Zorgvuldig geselecteerde steaks en het beste rundvlees.",
  },
  {
    icon: Flame,
    title: "BBQ specialist",
    description: "Live vuur, rook en smaak — onze BBQ is een belevenis.",
  },
  {
    icon: Salad,
    title: "Verse ingrediënten",
    description: "Dagelijks vers ingekocht, puur en vol van smaak.",
  },
  {
    icon: GlassWater,
    title: "Cocktails",
    description: "Handgemaakte cocktails en een uitgebreide drankenkaart.",
  },
  {
    icon: Sparkles,
    title: "Topservice",
    description: "Gastvrij, oplettend en met aandacht voor ieder detail.",
  },
];

export function WhyUs() {
  return (
    <section id="lunch" className="relative bg-[#111111] py-28 lg:py-36">
      <div className="section-container flex flex-col gap-16">
        <SectionHeading
          eyebrow="Onze belofte"
          title="Waarom The Kitchen"
          description="Zes redenen waarom gasten steeds weer terugkomen naar The Kitchen Veendam."
        />

        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title} variants={scaleIn}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card p-8 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:border-kitchen-gold/40"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-kitchen-red/0 blur-2xl transition-all duration-500 group-hover:bg-kitchen-red/20" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-kitchen-red/15 text-kitchen-gold transition-all duration-300 group-hover:bg-kitchen-red group-hover:text-white">
                  <feature.icon size={26} strokeWidth={1.75} />
                </div>
                <h3 className="relative mt-6 font-heading text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/55">
                  {feature.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
