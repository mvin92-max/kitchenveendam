"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { GalleryTile, type GalleryImageData } from "./gallery-tile";
import { reorderGalleryImagesAction } from "@/app/dashboard/galerij/actions";

export function GalleryCategorySection({
  label,
  images,
  onAdd,
}: {
  label: string;
  images: GalleryImageData[];
  onAdd: () => void;
}) {
  const [items, setItems] = useState(images);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Keep in sync when the server re-sends fresh props (new upload/delete).
  // Adjusting state during render (rather than in an effect) avoids an extra
  // render pass — see src/components/dashboard/tables/table-detail-modal.tsx
  // for the same pattern with more detail on why.
  if (images.map((i) => i.id).join() !== items.map((i) => i.id).join()) {
    setItems(images);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    startTransition(() => {
      void reorderGalleryImagesAction(reordered.map((i) => i.id));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-white">
          {label} <span className="text-sm font-normal text-white/40">({items.length})</span>
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
        >
          <Plus size={13} />
          Foto toevoegen
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-white/40">
          Nog geen foto&apos;s in deze categorie.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {items.map((image) => (
                <GalleryTile key={image.id} image={image} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
