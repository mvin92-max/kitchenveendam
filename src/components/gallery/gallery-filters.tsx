"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type PublicGalleryCategory = { key: string; label: string };

type GalleryFiltersProps = {
  active: string;
  onChange: (key: string) => void;
  categories: PublicGalleryCategory[];
};

export function GalleryFilters({ active, onChange, categories }: GalleryFiltersProps) {
  const options: PublicGalleryCategory[] = [{ key: "alle", label: "Alle" }, ...categories];

  return (
    <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
      {options.map((option) => {
        const isActive = active === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={cn(
              "relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-300",
              isActive
                ? "border-transparent text-[#111111]"
                : "border-white/15 text-white/70 hover:border-kitchen-gold/50 hover:text-white",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="gallery-filter-active"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-kitchen-gold"
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
