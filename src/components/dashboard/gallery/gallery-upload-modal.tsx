"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { ImageUpload } from "@/components/dashboard/shared/image-upload";
import { cn } from "@/lib/utils";
import { GALLERY_CATEGORIES, type GalleryCategoryKey } from "@/lib/gallery-data";
import { galleryImageSchema, type GalleryImageInput, type GalleryImageFormValues } from "@/lib/validation/gallery";
import { createGalleryImageAction } from "@/app/dashboard/galerij/actions";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

export function GalleryUploadModal({
  open,
  onClose,
  defaultCategory,
}: {
  open: boolean;
  onClose: () => void;
  defaultCategory: GalleryCategoryKey;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Foto toevoegen">
      {open && <GalleryUploadForm key={defaultCategory} defaultCategory={defaultCategory} onDone={onClose} />}
    </Modal>
  );
}

function GalleryUploadForm({
  defaultCategory,
  onDone,
}: {
  defaultCategory: GalleryCategoryKey;
  onDone: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<GalleryImageFormValues, unknown, GalleryImageInput>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      url: "",
      alt: "",
      category: defaultCategory,
      width: 1200,
      height: 900,
    },
  });

  function onSubmit(data: GalleryImageInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await createGalleryImageAction(data);
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
          name="url"
          render={({ field }) => (
            <ImageUpload
              value={field.value ?? ""}
              onChange={field.onChange}
              folder="gallery"
              onMeta={({ width, height }) => {
                setValue("width", width);
                setValue("height", height);
              }}
            />
          )}
        />
        {errors.url && <p className="mt-1 text-xs text-red-400">{errors.url.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Omschrijving (alt-tekst)</label>
        <input
          className={inputClass}
          placeholder="Bijv. Sfeervolle eetzaal bij avondlicht"
          {...register("alt")}
        />
        {errors.alt && <p className="mt-1 text-xs text-red-400">{errors.alt.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Categorie</label>
        <select className={cn(inputClass, "appearance-none")} {...register("category")}>
          {GALLERY_CATEGORIES.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
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
        Foto toevoegen
      </button>
    </form>
  );
}
