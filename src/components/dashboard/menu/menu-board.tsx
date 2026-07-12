"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItemRow, type MenuItemData } from "./menu-item-row";
import { MenuItemModal, type AllergenOption, type CategoryOption } from "./menu-item-modal";

export function MenuBoard({
  items,
  categories,
  allergens,
}: {
  items: MenuItemData[];
  categories: CategoryOption[];
  allergens: AllergenOption[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("alle");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== "alle" && item.categoryId !== activeCategory) return false;
      if (query && !item.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [items, activeCategory, query]);

  function openNew() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item: MenuItemData) {
    setEditingItem(item);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-white">Menukaart beheren</h1>
          <p className="mt-1 text-sm text-white/50">
            {items.length} {items.length === 1 ? "gerecht" : "gerechten"} op de kaart
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-kitchen-red px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(122,13,13,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#8f1010]"
        >
          <Plus size={16} />
          Nieuw gerecht
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("alle")}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeCategory === "alle"
                ? "border-transparent bg-kitchen-gold text-[#111111]"
                : "border-white/15 text-white/60 hover:border-kitchen-gold/50 hover:text-white",
            )}
          >
            Alle
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                activeCategory === cat.id
                  ? "border-transparent bg-kitchen-gold text-[#111111]"
                  : "border-white/15 text-white/60 hover:border-kitchen-gold/50 hover:text-white",
              )}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek op naam..."
            className="h-10 w-full rounded-xl border border-white/15 bg-white/[0.03] pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-kitchen-gold/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <MenuItemRow key={item.id} item={item} onEdit={() => openEdit(item)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-white/40">Geen gerechten gevonden.</p>
      )}

      <MenuItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editingItem}
        categories={categories}
        allergens={allergens}
      />
    </div>
  );
}
