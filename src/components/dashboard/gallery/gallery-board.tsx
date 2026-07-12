"use client";

import { useState } from "react";
import { GALLERY_CATEGORIES, type GalleryCategoryKey } from "@/lib/gallery-data";
import { GalleryCategorySection } from "./gallery-category-section";
import { GalleryUploadModal } from "./gallery-upload-modal";
import type { GalleryImageData } from "./gallery-tile";

export function GalleryBoard({ images }: { images: GalleryImageData[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<GalleryCategoryKey>(GALLERY_CATEGORIES[0].key);

  function openAdd(category: GalleryCategoryKey) {
    setModalCategory(category);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-white">Galerij beheren</h1>
        <p className="mt-1 text-sm text-white/50">
          {images.length} {images.length === 1 ? "foto" : "foto's"} — sleep binnen een categorie om de
          volgorde aan te passen
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {GALLERY_CATEGORIES.map((cat) => (
          <GalleryCategorySection
            key={cat.key}
            label={`${cat.label}`}
            images={images.filter((img) => img.category === cat.key)}
            onAdd={() => openAdd(cat.key)}
          />
        ))}
      </div>

      <GalleryUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCategory={modalCategory}
      />
    </div>
  );
}
