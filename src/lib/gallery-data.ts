// GALLERY_CATEGORIES is the shared category taxonomy used everywhere
// (public site, dashboard, validation). GALLERY_IMAGES is seed data only —
// prisma/seed.ts reads it to populate the database; the live site and
// dashboard read photos from the database (src/app/galerij/page.tsx,
// src/app/dashboard/galerij), not from here.

export type GalleryCategoryKey =
  | "restaurant"
  | "lunch"
  | "diner"
  | "bbq"
  | "cocktails"
  | "desserts"
  | "evenementen";

export type GalleryCategory = {
  key: GalleryCategoryKey;
  label: string;
};

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { key: "restaurant", label: "Restaurant" },
  { key: "lunch", label: "Lunch" },
  { key: "diner", label: "Diner" },
  { key: "bbq", label: "BBQ" },
  { key: "cocktails", label: "Cocktails" },
  { key: "desserts", label: "Desserts" },
  { key: "evenementen", label: "Evenementen" },
];

export type GalleryImage = {
  id: string;
  category: GalleryCategoryKey;
  src: string;
  alt: string;
  aspect: "square" | "portrait" | "landscape";
};

export const GALLERY_IMAGES: GalleryImage[] = [
  // Restaurant
  {
    id: "restaurant-1",
    category: "restaurant",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    alt: "Interieur van The Kitchen Veendam",
    aspect: "portrait",
  },
  {
    id: "restaurant-2",
    category: "restaurant",
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    alt: "Sfeervolle eetzaal",
    aspect: "landscape",
  },
  {
    id: "restaurant-3",
    category: "restaurant",
    src: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80",
    alt: "Chef aan het werk in de keuken",
    aspect: "portrait",
  },
  {
    id: "restaurant-4",
    category: "restaurant",
    src: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&q=80",
    alt: "Gasten genieten samen van hun diner",
    aspect: "square",
  },
  // Lunch
  {
    id: "lunch-1",
    category: "lunch",
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    alt: "The Kitchen Burger",
    aspect: "square",
  },
  {
    id: "lunch-2",
    category: "lunch",
    src: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80",
    alt: "Loaded fries",
    aspect: "portrait",
  },
  {
    id: "lunch-3",
    category: "lunch",
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    alt: "Caesar salad",
    aspect: "square",
  },
  {
    id: "lunch-4",
    category: "lunch",
    src: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    alt: "Kindermenu pasta",
    aspect: "landscape",
  },
  // Diner
  {
    id: "diner-1",
    category: "diner",
    src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    alt: "Gegrilde steak",
    aspect: "landscape",
  },
  {
    id: "diner-2",
    category: "diner",
    src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
    alt: "T-Bone steak met frites",
    aspect: "portrait",
  },
  {
    id: "diner-3",
    category: "diner",
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    alt: "Gegrilde zalm",
    aspect: "portrait",
  },
  {
    id: "diner-4",
    category: "diner",
    src: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80",
    alt: "Rundercarpaccio",
    aspect: "square",
  },
  // BBQ
  {
    id: "bbq-1",
    category: "bbq",
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    alt: "BBQ mixed grill",
    aspect: "square",
  },
  {
    id: "bbq-2",
    category: "bbq",
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    alt: "Spareribs van de grill",
    aspect: "portrait",
  },
  {
    id: "bbq-3",
    category: "bbq",
    src: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=800&q=80",
    alt: "Saté op de grill",
    aspect: "portrait",
  },
  {
    id: "bbq-4",
    category: "bbq",
    src: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80",
    alt: "Nacho BBQ",
    aspect: "landscape",
  },
  // Cocktails
  {
    id: "cocktails-1",
    category: "cocktails",
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
    alt: "Signature cocktail",
    aspect: "portrait",
  },
  {
    id: "cocktails-2",
    category: "cocktails",
    src: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&q=80",
    alt: "Cocktail met bramen",
    aspect: "portrait",
  },
  {
    id: "cocktails-3",
    category: "cocktails",
    src: "https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=800&q=80",
    alt: "Speciaalbier",
    aspect: "square",
  },
  {
    id: "cocktails-4",
    category: "cocktails",
    src: "https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?w=800&q=80",
    alt: "Wijn bij zonsondergang",
    aspect: "landscape",
  },
  // Desserts
  {
    id: "desserts-1",
    category: "desserts",
    src: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    alt: "Cheesecake",
    aspect: "square",
  },
  {
    id: "desserts-2",
    category: "desserts",
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
    alt: "Dame Blanche",
    aspect: "portrait",
  },
  {
    id: "desserts-3",
    category: "desserts",
    src: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
    alt: "Lava cake",
    aspect: "landscape",
  },
  {
    id: "desserts-4",
    category: "desserts",
    src: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&q=80",
    alt: "IJscoupe",
    aspect: "square",
  },
  // Evenementen
  {
    id: "evenementen-1",
    category: "evenementen",
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    alt: "Live muziek avond",
    aspect: "portrait",
  },
  {
    id: "evenementen-2",
    category: "evenementen",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    alt: "Gedekte tafel voor evenement",
    aspect: "landscape",
  },
  {
    id: "evenementen-3",
    category: "evenementen",
    src: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80",
    alt: "Familie Zondag tafel vol gerechten",
    aspect: "square",
  },
  {
    id: "evenementen-4",
    category: "evenementen",
    src: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    alt: "Steak Friday",
    aspect: "portrait",
  },
];
