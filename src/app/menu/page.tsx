import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageBanner } from "@/components/site/page-banner";
import { FinalCta } from "@/components/site/final-cta";
import { MenuGrid, type PublicMenuItem } from "@/components/menu/menu-grid";
import type { PublicMenuCategory } from "@/components/menu/menu-filters";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Onze Menukaart | The Kitchen Veendam",
  description:
    "Geniet van verse ingrediënten, premium vlees, heerlijke cocktails en verrassende gerechten bij The Kitchen Veendam.",
};

// Menu content is managed in het dashboard (/dashboard/menukaart) and read
// live from the database here, so edits there appear on the site immediately.
export const revalidate = 0;

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    prisma.menuItem.findMany({
      include: { category: true, allergens: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
    }),
    prisma.menuCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const menuItems: PublicMenuItem[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: formatPrice(item.price, item.priceIsFrom),
    image: item.image,
    categoryKey: item.category.key,
    allergens: item.allergens.map((a) => a.name),
    spicyLevel: item.spicyLevel,
    vegetarian: item.vegetarian,
    chefsChoice: item.chefsChoice,
    soldOut: item.soldOut,
  }));

  const menuCategories: PublicMenuCategory[] = categories.map((c) => ({
    key: c.key,
    label: c.label,
    emoji: c.emoji,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#111111]">
        <PageBanner
          eyebrow="Onze kaart"
          title="Onze Menukaart"
          subtitle="Geniet van verse ingrediënten, premium vlees, heerlijke cocktails en verrassende gerechten."
          image="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=80"
          imageAlt="Tafel vol gedeelde gerechten bij The Kitchen Veendam"
        />

        <section className="py-20 lg:py-28">
          <div className="section-container">
            <MenuGrid items={menuItems} categories={menuCategories} />
          </div>
        </section>

        <FinalCta title="Klaar om te proeven? Reserveer vandaag nog jouw tafel." />
      </main>
      <Footer />
    </>
  );
}
