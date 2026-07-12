"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteGalleryImageAction } from "@/app/dashboard/galerij/actions";

export type GalleryImageData = {
  id: string;
  url: string;
  alt: string;
  category: string;
  width: number;
  height: number;
};

export function GalleryTile({ image }: { image: GalleryImageData }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(() => {
      void deleteGalleryImageAction(image.id);
    });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-kitchen-card/70",
        isDragging && "z-10 opacity-50 shadow-2xl",
        isPending && "opacity-40",
      )}
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes="220px"
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Verslepen"
        className="absolute left-2 top-2 flex h-7 w-7 cursor-grab items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm transition-opacity active:cursor-grabbing group-hover:opacity-100"
      >
        <GripVertical size={14} />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        onBlur={() => setConfirmDelete(false)}
        aria-label="Verwijderen"
        className={cn(
          "absolute right-2 top-2 flex h-7 items-center justify-center rounded-full bg-black/70 px-2 text-white backdrop-blur-sm transition-opacity",
          confirmDelete ? "opacity-100" : "w-7 opacity-0 group-hover:opacity-100",
        )}
      >
        {isPending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : confirmDelete ? (
          <span className="text-[0.65rem] font-semibold uppercase">Zeker?</span>
        ) : (
          <Trash2 size={13} />
        )}
      </button>

      <p className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-[0.65rem] text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        {image.alt}
      </p>
    </div>
  );
}
