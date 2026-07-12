"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { GalleryFilters, type PublicGalleryCategory } from "./gallery-filters";
import { Lightbox } from "./lightbox";

export type PublicGalleryImage = {
  id: string;
  category: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function MasonryGallery({
  images,
  categories,
}: {
  images: PublicGalleryImage[];
  categories: PublicGalleryCategory[];
}) {
  const [active, setActive] = useState<string>("alle");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "alle" ? images : images.filter((img) => img.category === active)),
    [images, active],
  );

  const handleChange = (key: string) => {
    setActive(key);
    setLightboxIndex(null);
  };

  const handleNavigate = (direction: 1 | -1) => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return (current + direction + filtered.length) % filtered.length;
    });
  };

  return (
    <div>
      <GalleryFilters active={active} onChange={handleChange} categories={categories} />

      <motion.div layout className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((image, i) => (
          <motion.button
            key={image.id}
            layout
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setLightboxIndex(i)}
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
            className="group relative mb-5 block w-full overflow-hidden rounded-2xl border border-white/[0.06]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
              <Expand
                size={24}
                className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-white/50">Geen foto&apos;s gevonden in deze categorie.</p>
      )}

      <Lightbox images={filtered} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={handleNavigate} />
    </div>
  );
}
