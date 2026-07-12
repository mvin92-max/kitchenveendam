import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageBanner } from "@/components/site/page-banner";
import { FinalCta } from "@/components/site/final-cta";
import { MasonryGallery, type PublicGalleryImage } from "@/components/gallery/masonry-gallery";
import type { PublicGalleryCategory } from "@/components/gallery/gallery-filters";
import { GALLERY_CATEGORIES } from "@/lib/gallery-data";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Galerij | The Kitchen Veendam",
  description:
    "Bekijk sfeerbeelden van restaurant, lunch, diner, BBQ, cocktails, desserts en evenementen bij The Kitchen Veendam.",
};

// Photos are managed in het dashboard (/dashboard/galerij) and read live
// from the database here, so uploads/reorders appear on the site immediately.
export const revalidate = 0;

export default async function GalerijPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });

  const publicImages: PublicGalleryImage[] = images.map((img) => ({
    id: img.id,
    category: img.category,
    src: img.url,
    alt: img.alt,
    width: img.width,
    height: img.height,
  }));

  const publicCategories: PublicGalleryCategory[] = GALLERY_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#111111]">
        <PageBanner
          eyebrow="Sfeerbeelden"
          title="Onze Galerij"
          subtitle="Een kijkje in de keuken, de kaart en de sfeer van The Kitchen Veendam."
          image="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80"
          imageAlt="Gedekte tafel bij een evenement van The Kitchen Veendam"
        />

        <section className="py-20 lg:py-28">
          <div className="section-container">
            <MasonryGallery images={publicImages} categories={publicCategories} />
          </div>
        </section>

        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
