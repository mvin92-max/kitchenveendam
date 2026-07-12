"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type PublicMenuCategory = { key: string; label: string; emoji: string };

type MenuFiltersProps = {
  active: string;
  onChange: (key: string) => void;
  categories: PublicMenuCategory[];
};

export function MenuFilters({ active, onChange, categories }: MenuFiltersProps) {
  const options: PublicMenuCategory[] = [{ key: "alles", label: "Alles", emoji: "🍽️" }, ...categories];

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
                layoutId="menu-filter-active"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-kitchen-gold"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              <span aria-hidden>{option.emoji}</span>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
