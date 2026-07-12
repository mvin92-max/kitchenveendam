"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { cn } from "@/lib/utils";
import { menuItemSchema, type MenuItemInput, type MenuItemFormValues } from "@/lib/validation/menu-item";
import { createMenuItemAction, updateMenuItemAction } from "@/app/dashboard/menukaart/actions";
import { ImageUpload } from "@/components/dashboard/shared/image-upload";
import type { MenuItemData } from "./menu-item-row";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

export type CategoryOption = { id: string; label: string; emoji: string };
export type AllergenOption = { id: string; name: string };

export function MenuItemModal({
  open,
  onClose,
  item,
  categories,
  allergens,
}: {
  open: boolean;
  onClose: () => void;
  item: MenuItemData | null;
  categories: CategoryOption[];
  allergens: AllergenOption[];
}) {
  return (
    <Modal open={open} onClose={onClose} title={item ? `${item.name} bewerken` : "Nieuw gerecht"}>
      {open && (
        <MenuItemForm
          key={item?.id ?? "new"}
          item={item}
          categories={categories}
          allergens={allergens}
          onDone={onClose}
        />
      )}
    </Modal>
  );
}

function MenuItemForm({
  item,
  categories,
  allergens,
  onDone,
}: {
  item: MenuItemData | null;
  categories: CategoryOption[];
  allergens: AllergenOption[];
  onDone: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MenuItemFormValues, unknown, MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description,
          ingredients: item.ingredients ?? "",
          price: item.price,
          priceIsFrom: item.priceIsFrom,
          image: item.image,
          categoryId: item.categoryId,
          spicyLevel: item.spicyLevel ?? 0,
          vegetarian: item.vegetarian,
          chefsChoice: item.chefsChoice,
          soldOut: item.soldOut,
          allergenIds: item.allergenIds,
        }
      : {
          name: "",
          description: "",
          ingredients: "",
          price: 0,
          priceIsFrom: false,
          image: "",
          categoryId: categories[0]?.id ?? "",
          spicyLevel: 0,
          vegetarian: false,
          chefsChoice: false,
          soldOut: false,
          allergenIds: [],
        },
  });

  function onSubmit(data: MenuItemInput) {
    setServerError(null);
    startTransition(async () => {
      const result = item
        ? await updateMenuItemAction(item.id, data)
        : await createMenuItemAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Foto</label>
        <Controller
          control={control}
          name="image"
          render={({ field }) => <ImageUpload value={field.value ?? ""} onChange={field.onChange} />}
        />
        {errors.image && <p className="mt-1 text-xs text-red-400">{errors.image.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Naam</label>
          <input className={inputClass} placeholder="Bijv. Black Angus Steak" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Beschrijving</label>
          <textarea
            rows={2}
            className={cn(inputClass, "h-auto resize-none py-2.5")}
            {...register("description")}
          />
          {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Ingrediënten (optioneel)</label>
          <input
            className={inputClass}
            placeholder="Bijv. rundvlees, kruidenboter, frites"
            {...register("ingredients")}
          />
        </div>

        <div>
          <label className={labelClass}>Categorie</label>
          <select className={cn(inputClass, "appearance-none")} {...register("categoryId")}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Prijs (€)</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              {...register("price", { valueAsNumber: true })}
            />
          </div>
          {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
        </div>

        <label className="col-span-2 flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("priceIsFrom")} />
          Prijs is een &ldquo;vanaf&rdquo;-prijs (bijv. dranken)
        </label>

        <div className="col-span-2">
          <label className={labelClass}>Pittigheid</label>
          <Controller
            control={control}
            name="spicyLevel"
            render={({ field }) => (
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => field.onChange(level)}
                    className={cn(
                      "h-10 flex-1 rounded-lg border text-sm font-medium transition-colors",
                      field.value === level
                        ? "border-kitchen-gold bg-kitchen-gold text-[#111111]"
                        : "border-white/15 text-white/60 hover:border-kitchen-gold/50",
                    )}
                  >
                    {level === 0 ? "Geen" : "🌶️".repeat(level)}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Allergenen</label>
          <Controller
            control={control}
            name="allergenIds"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => {
                  const checked = (field.value ?? []).includes(allergen.id);
                  return (
                    <button
                      key={allergen.id}
                      type="button"
                      onClick={() => {
                        const current = field.value ?? [];
                        field.onChange(
                          checked ? current.filter((id) => id !== allergen.id) : [...current, allergen.id],
                        );
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        checked
                          ? "border-kitchen-gold bg-kitchen-gold/15 text-kitchen-gold"
                          : "border-white/15 text-white/50 hover:border-white/30",
                      )}
                    >
                      {allergen.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("vegetarian")} />
          Vegetarisch
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("chefsChoice")} />
          Chef&apos;s Choice
        </label>
        <label className="col-span-2 flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("soldOut")} />
          Uitverkocht
        </label>
      </div>

      {serverError && (
        <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-kitchen-red text-sm font-medium uppercase tracking-wide text-white transition-all hover:bg-[#8f1010]",
          isPending && "pointer-events-none opacity-70",
        )}
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {item ? "Wijzigingen opslaan" : "Gerecht toevoegen"}
      </button>
    </form>
  );
}
