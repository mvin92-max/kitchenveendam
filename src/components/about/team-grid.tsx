"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/lib/team-data";
import { SectionHeading } from "@/components/site/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/site/motion";

export function TeamGrid() {
  return (
    <section className="relative bg-[#0d0d0d] py-28 lg:py-36">
      <div className="section-container flex flex-col gap-16">
        <SectionHeading
          eyebrow="Ons team"
          title="De mensen achter The Kitchen"
          description="Stuk voor stuk gepassioneerd om jouw bezoek onvergetelijk te maken."
        />

        <StaggerGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_MEMBERS.map((member) => (
            <StaggerItem key={member.id}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium uppercase tracking-wide text-kitchen-gold">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
