"use client";

import Image from "next/image";
import { Flame, Soup, Wrench } from "lucide-react";
import { Reveal, slideRight, slideLeft } from "@/components/site/motion";

const POINTS = [
  { icon: Soup, label: "Vers koken", description: "Elk gerecht wordt à la minute bereid." },
  { icon: Flame, label: "BBQ & Grill", description: "Live vuur voor de puurste smaak." },
  { icon: Wrench, label: "Ambacht", description: "Traditionele technieken, met liefde toegepast." },
];

export function OpenKitchen() {
  return (
    <section className="relative bg-[#111111] py-28 lg:py-36">
      <div className="section-container grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal variants={slideRight}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
            <Image
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80"
              alt="Open keuken met live vuur en grill"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </Reveal>

        <Reveal variants={slideLeft}>
          <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
            Open keuken
            <span className="h-px w-8 bg-kitchen-gold/60" />
          </span>
          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Kijk mee terwijl wij koken
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Bij The Kitchen is de keuken geen gesloten deur, maar het kloppend
            hart van het restaurant. Zie hoe onze chefs vers koken op de
            plancha, boven het vuur van onze BBQ en met ambachtelijke
            technieken die al generaties meegaan.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {POINTS.map((point) => (
              <div key={point.label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kitchen-red/15 text-kitchen-gold">
                  <point.icon size={19} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-heading text-base font-semibold text-white">
                    {point.label}
                  </p>
                  <p className="text-sm text-white/55">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
