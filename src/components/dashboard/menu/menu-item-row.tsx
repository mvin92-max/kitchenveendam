"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Flame, Leaf, Loader2, Pencil, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import {
  deleteMenuItemAction,
  toggleChefsChoiceAction,
  toggleSoldOutAction,
} from "@/app/dashboard/menukaart/actions";

export type MenuItemData = {
  id: string;
  name: string;
  description: string;
  ingredients: string | null;
  price: number;
  priceIsFrom: boolean;
  image: string;
  categoryId: string;
  categoryLabel: string;
  spicyLevel: number | null;
  vegetarian: boolean;
  chefsChoice: boolean;
  soldOut: boolean;
  allergenIds: string[];
  allergenNames: string[];
};

export function MenuItemRow({ item, onEdit }: { item: MenuItemData; onEdit: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleSoldOut() {
    startTransition(() => {
      void toggleSoldOutAction(item.id, !item.soldOut);
    });
  }

  function toggleChefsChoice() {
    startTransition(() => {
      void toggleChefsChoiceAction(item.id, !item.chefsChoice);
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(() => {
      void deleteMenuItemAction(item.id);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card/70 backdrop-blur-xl transition-opacity",
        isPending && "opacity-50",
      )}
    >
      <div className="relative h-40 w-full shrink-0">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="320px" className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-xs text-white/30">
            Geen foto
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <span className="absolute right-3 top-3 rounded-full bg-kitchen-gold px-3 py-1 text-xs font-semibold text-[#111111] shadow-lg">
          {formatPrice(item.price, item.priceIsFrom)}
        </span>
        {item.soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
            Uitverkocht
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold text-white">{item.name}</h3>
          {item.chefsChoice && <Sparkles size={16} className="mt-1 shrink-0 text-kitchen-gold" />}
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-white/40">{item.categoryLabel}</p>
        <p className="line-clamp-2 flex-1 text-sm text-white/55">{item.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
          {item.vegetarian && (
            <span className="flex items-center gap-1 text-green-400">
              <Leaf size={12} /> Vegetarisch
            </span>
          )}
          {!!item.spicyLevel && (
            <span className="flex items-center gap-0.5 text-kitchen-red">
              {Array.from({ length: item.spicyLevel }).map((_, i) => (
                <Flame key={i} size={12} fill="currentColor" />
              ))}
            </span>
          )}
          {item.allergenNames.length > 0 && <span>Allergenen: {item.allergenNames.join(", ")}</span>}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={toggleSoldOut}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                item.soldOut
                  ? "border-red-500/40 bg-red-500/10 text-red-300"
                  : "border-white/15 text-white/50 hover:border-white/30",
              )}
            >
              Uitverkocht
            </button>
            <button
              type="button"
              onClick={toggleChefsChoice}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                item.chefsChoice
                  ? "border-kitchen-gold bg-kitchen-gold/15 text-kitchen-gold"
                  : "border-white/15 text-white/50 hover:border-white/30",
              )}
            >
              Chef&apos;s Choice
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              aria-label="Bewerken"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              onBlur={() => setConfirmDelete(false)}
              aria-label="Verwijderen"
              className={cn(
                "flex h-8 items-center justify-center rounded-full px-2 text-xs font-medium transition-colors",
                confirmDelete
                  ? "bg-red-500/20 text-red-300"
                  : "w-8 text-white/50 hover:bg-white/[0.06] hover:text-red-400",
              )}
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : confirmDelete ? "Zeker?" : <Trash2 size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
