"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./motion";
import { InstagramIcon } from "./social-icons";

const GALLERY = [
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=80",
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
];

export function InstagramGallery() {
  return (
    <section id="galerij" className="relative bg-[#0d0d0d] py-28 lg:py-36">
      <div className="section-container mb-14 flex flex-col items-center gap-4 text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
            <span className="h-px w-8 bg-kitchen-gold/60" />
            @thekitchenveendam
            <span className="h-px w-8 bg-kitchen-gold/60" />
          </span>
          <h2 className="font-heading text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            Volg ons op Instagram
          </h2>
          <Link
            href="/galerij"
            className="group/link mt-1 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-kitchen-gold"
          >
            Bekijk volledige galerij
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
            />
          </Link>
        </Reveal>
      </div>

      <Reveal>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 sm:px-8 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GALLERY.map((src, i) => (
            <a
              key={src}
              href="#"
              className="group relative aspect-square w-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-64"
            >
              <Image
                src={src}
                alt={`The Kitchen Veendam Instagram foto ${i + 1}`}
                fill
                sizes="256px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                <InstagramIcon className="h-7 w-7 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
