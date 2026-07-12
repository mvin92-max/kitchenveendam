"use client";

import Image from "next/image";
import { Flame } from "lucide-react";
import { Reveal, slideRight, slideLeft } from "./motion";
import { CtaButton } from "./cta-button";

export function BbqArrangement() {
  return (
    <section id="bbq" className="relative overflow-hidden bg-[#111111] py-28 lg:py-36">
      <div className="section-container grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal variants={slideRight} className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
            <Flame size={16} />
            BBQ Arrangement
          </span>
          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Live vuur, pure smaak, samen genieten
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Kies voor een van onze BBQ-arrangementen en geniet onbeperkt van
            heerlijk gegrild vlees, verse salades en huisgemaakte sauzen.
            Perfect voor een verjaardag, bedrijfsuitje of gezellig avondje met
            vrienden.
          </p>
          <div className="mt-10">
            <CtaButton href="/menu#bbq" size="lg" variant="gold">
              Bekijk BBQ arrangementen
            </CtaButton>
          </div>
        </Reveal>

        <Reveal variants={slideLeft} className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
            <Image
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80"
              alt="BBQ arrangement met gegrild vlees en groenten"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
