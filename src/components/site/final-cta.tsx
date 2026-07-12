"use client";

import Image from "next/image";
import { Reveal } from "./motion";
import { CtaButton } from "./cta-button";

type FinalCtaProps = {
  title?: string;
  image?: string;
};

export function FinalCta({
  title = "Reserveer vandaag nog jouw tafel.",
  image = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
}: FinalCtaProps) {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-[#111111] py-24">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="Sfeervolle tafel bij The Kitchen Veendam"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#111111]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]" />
      </div>

      <div className="section-container relative z-10 flex flex-col items-center gap-8 text-center">
        <Reveal>
          <h2 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-wrap items-center justify-center gap-4">
          <CtaButton href="/reserveren" size="lg" variant="primary">
            Reserveer direct
          </CtaButton>
          <CtaButton href="/menu" size="lg" variant="outline">
            Bekijk Menukaart
          </CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
