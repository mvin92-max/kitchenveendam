"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { StaggerGroup, StaggerItem } from "./motion";

const DISHES = [
  {
    name: "Steak",
    description: "Mals gegrilde rib-eye met huisgemaakte kruidenboter.",
    price: "€26,50",
    category: "diner",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80",
  },
  {
    name: "Burger",
    description: "Sappige Black Angus burger met cheddar en bacon.",
    price: "€17,95",
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
  },
  {
    name: "Spareribs",
    description: "Langzaam gegaarde ribs met onze signature BBQ-saus.",
    price: "€21,50",
    category: "bbq",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
  },
  {
    name: "Mixed Grill",
    description: "Selectie van gegrild vlees, ideaal om te delen.",
    price: "€29,95",
    category: "bbq",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80",
  },
  {
    name: "Cocktails",
    description: "Handgeshakete klassiekers met een eigen twist.",
    price: "vanaf €9,50",
    category: "cocktails",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
  },
  {
    name: "Desserts",
    description: "Zoete afsluiters, huisgemaakt en vol verwennerij.",
    price: "vanaf €7,50",
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=900&q=80",
  },
];

export function FeaturedDishes() {
  return (
    <section id="diner" className="relative bg-[#0d0d0d] py-28 lg:py-36">
      <div className="section-container flex flex-col gap-16">
        <SectionHeading
          eyebrow="Onze kaart"
          title="Uitgelichte gerechten"
          description="Een greep uit onze kaart — bereid met liefde, geserveerd met trots."
        />

        <StaggerGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((dish) => (
            <StaggerItem key={dish.name}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                  <span className="absolute right-4 top-4 rounded-full bg-kitchen-gold px-4 py-1.5 text-sm font-semibold text-[#111111] shadow-lg">
                    {dish.price}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-7">
                  <h3 className="font-heading text-2xl font-semibold text-white">
                    {dish.name}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-white/55">
                    {dish.description}
                  </p>
                  <a
                    href={`/menu#${dish.category}`}
                    className="group/link mt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-kitchen-gold"
                  >
                    Bekijk gerecht
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                    />
                  </a>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
