"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MenuFilters, type PublicMenuCategory } from "./menu-filters";
import { DishCard } from "./dish-card";

export type PublicMenuItem = {
  id: string;
  name: string;
  description: string;
  price: string; // pre-formatted for display, e.g. "€28,50" or "vanaf €9,50"
  image: string;
  categoryKey: string;
  allergens: string[];
  spicyLevel?: number | null;
  vegetarian?: boolean;
  chefsChoice?: boolean;
  soldOut?: boolean;
};

export function MenuGrid({
  items,
  categories,
}: {
  items: PublicMenuItem[];
  categories: PublicMenuCategory[];
}) {
  const [active, setActive] = useState<string>("alles");

  useEffect(() => {
    // Reads the URL fragment set by nav links (e.g. /menu#bbq) to preselect a
    // category. Fragments never reach the server, so this can only run
    // client-side after mount — the initial render always matches SSR's
    // default ("alles") and is corrected here in one pass.
    const hash = window.location.hash.replace("#", "");
    if (!hash || !categories.some((c) => c.key === hash)) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a client-only source (URL fragment), not derivable during render/SSR
    setActive(hash);
    document.getElementById("menukaart")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [categories]);

  const handleChange = (key: string) => {
    setActive(key);
    const url = key === "alles" ? window.location.pathname : `#${key}`;
    window.history.replaceState(null, "", url);
  };

  const filtered = active === "alles" ? items : items.filter((item) => item.categoryKey === active);

  return (
    <div id="menukaart" className="scroll-mt-24">
      <MenuFilters active={active} onChange={handleChange} categories={categories} />

      <motion.div layout className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-white/50">
          Geen gerechten gevonden in deze categorie.
        </p>
      )}
    </div>
  );
}
