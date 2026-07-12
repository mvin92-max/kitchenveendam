import { prisma } from "@/lib/prisma";
import { MenuBoard } from "@/components/dashboard/menu/menu-board";
import type { MenuItemData } from "@/components/dashboard/menu/menu-item-row";

export default async function MenukaartBeheerPage() {
  const [items, categories, allergens] = await Promise.all([
    prisma.menuItem.findMany({
      include: { category: true, allergens: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
    }),
    prisma.menuCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.allergen.findMany({ orderBy: { name: "asc" } }),
  ]);

  const itemData: MenuItemData[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    ingredients: item.ingredients,
    price: item.price,
    priceIsFrom: item.priceIsFrom,
    image: item.image,
    categoryId: item.categoryId,
    categoryLabel: item.category.label,
    spicyLevel: item.spicyLevel,
    vegetarian: item.vegetarian,
    chefsChoice: item.chefsChoice,
    soldOut: item.soldOut,
    allergenIds: item.allergens.map((a) => a.id),
    allergenNames: item.allergens.map((a) => a.name),
  }));

  const categoryOptions = categories.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji }));
  const allergenOptions = allergens.map((a) => ({ id: a.id, name: a.name }));

  return <MenuBoard items={itemData} categories={categoryOptions} allergens={allergenOptions} />;
}
