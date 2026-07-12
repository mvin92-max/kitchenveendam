"use client";

import { motion } from "framer-motion";
import { TIMELINE } from "@/lib/timeline-data";
import { SectionHeading } from "@/components/site/section-heading";

export function Timeline() {
  return (
    <section className="relative bg-[#111111] py-28 lg:py-36">
      <div className="section-container">
        <SectionHeading
          eyebrow="Ons verhaal"
          title="Van eerste steen tot favoriet van Veendam"
          description="Een tijdlijn van gezelligheid, groei en steeds beter eten."
          className="mb-20"
        />

        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-7 top-2 bottom-2 w-px bg-gradient-to-b from-kitchen-gold/60 via-white/15 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

          <ul className="flex flex-col gap-14">
            {TIMELINE.map((step, index) => {
              const Icon = step.icon;
              const alignRight = index % 2 === 1;
              return (
                <motion.li
                  key={step.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-start gap-6 sm:grid sm:grid-cols-2 sm:gap-10"
                >
                  <div className="absolute left-7 top-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-kitchen-gold/40 bg-kitchen-card text-kitchen-gold shadow-[0_0_30px_-8px_rgba(212,175,55,0.5)] sm:left-1/2">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>

                  <div
                    className={`ml-20 sm:ml-0 ${
                      alignRight
                        ? "sm:col-start-2 sm:pl-14 sm:text-left"
                        : "sm:col-start-1 sm:pr-14 sm:text-right"
                    }`}
                  >
                    <span className="font-heading text-3xl font-semibold text-kitchen-gold">
                      {step.year}
                    </span>
                    <h3 className="mt-1 font-heading text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
