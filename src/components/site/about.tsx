"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal, slideRight, slideLeft } from "./motion";

const POINTS = [
  "Gezellige sfeer voor familie en vrienden",
  "Verse, lokale ingrediënten in elk gerecht",
  "Ruime terrassen en een warm interieur",
];

export function About() {
  return (
    <section id="over-ons" className="relative bg-[#0d0d0d] py-28 lg:py-36">
      <div className="section-container grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal variants={slideRight}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
              alt="Interieur van The Kitchen Veendam"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </Reveal>

        <Reveal variants={slideLeft} className="flex flex-col items-start">
          <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
            Over ons
            <span className="h-px w-8 bg-kitchen-gold/60" />
          </span>
          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Warm welkom, van harte gegeven
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            The Kitchen Veendam is de plek voor een heerlijke lunch, diner,
            drankje of BBQ. Gezelligheid, kwaliteit en gastvrijheid staan bij
            ons altijd centraal. Of je nu langskomt voor een snelle lunch of
            een uitgebreid diner met vrienden — bij ons ben je altijd
            welkom.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-white/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kitchen-red/20 text-kitchen-gold">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-sm sm:text-base">{point}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/over-ons"
            className="group/link mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-kitchen-gold"
          >
            Lees ons verhaal
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
