// Seed source only — prisma/seed.ts reads this to populate the database.
// The live site and dashboard both read menu content from the database
// (src/app/menu/page.tsx, src/app/dashboard/menukaart), not from here.

export type MenuCategoryKey =
  | "lunch"
  | "diner"
  | "bbq"
  | "cocktails"
  | "speciaalbier"
  | "desserts"
  | "koffie"
  | "frisdrank";

export type MenuCategory = {
  key: MenuCategoryKey;
  label: string;
  emoji: string;
};

export const MENU_CATEGORIES: MenuCategory[] = [
  { key: "lunch", label: "Lunch", emoji: "🍔" },
  { key: "diner", label: "Diner", emoji: "🥩" },
  { key: "bbq", label: "BBQ", emoji: "🔥" },
  { key: "cocktails", label: "Cocktails", emoji: "🍹" },
  { key: "speciaalbier", label: "Speciaalbier", emoji: "🍺" },
  { key: "desserts", label: "Desserts", emoji: "🍰" },
  { key: "koffie", label: "Koffie", emoji: "☕" },
  { key: "frisdrank", label: "Frisdrank", emoji: "🥤" },
];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: MenuCategoryKey;
  allergens: string[];
  spicyLevel?: 0 | 1 | 2 | 3;
  vegetarian?: boolean;
  chefsChoice?: boolean;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "black-angus-steak",
    name: "Black Angus Steak",
    description:
      "Mals gegrilde Black Angus steak met kruidenboter, frites en seizoensgroenten.",
    price: "€28,50",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80",
    category: "diner",
    allergens: ["Gluten", "Melk"],
    chefsChoice: true,
  },
  {
    id: "ribeye",
    name: "Ribeye",
    description:
      "Rijk gemarmerde ribeye, botergaar gegrild en geserveerd met huisgemaakte jus.",
    price: "€31,50",
    image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=900&q=80",
    category: "diner",
    allergens: ["Melk"],
  },
  {
    id: "t-bone-steak",
    name: "T-Bone Steak",
    description:
      "Klassieke T-Bone voor de echte vleesliefhebber, inclusief huisgemaakte frites.",
    price: "€34,50",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=900&q=80",
    category: "diner",
    allergens: [],
  },
  {
    id: "carpaccio",
    name: "Carpaccio",
    description:
      "Dungesneden rundercarpaccio met Parmezaan, pijnboompitten en truffelmayonaise.",
    price: "€15,50",
    image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=900&q=80",
    category: "diner",
    allergens: ["Melk", "Ei", "Pijnboompitten"],
  },
  {
    id: "gegrilde-zalm",
    name: "Gegrilde Zalm",
    description:
      "Botergegrilde zalm met groene groenten, citrusboter en gepofte aardappel.",
    price: "€24,50",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
    category: "diner",
    allergens: ["Vis"],
    chefsChoice: true,
  },
  {
    id: "mixed-grill",
    name: "Mixed Grill",
    description:
      "Selectie van gegrild vlees rechtstreeks van de BBQ, ideaal om samen te delen.",
    price: "€29,95",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80",
    category: "bbq",
    allergens: ["Mosterd"],
    spicyLevel: 1,
    chefsChoice: true,
  },
  {
    id: "spareribs",
    name: "Spareribs",
    description:
      "Langzaam gegaarde spareribs met onze signature BBQ-saus en coleslaw.",
    price: "€22,50",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
    category: "bbq",
    allergens: ["Soja", "Sulfiet"],
    spicyLevel: 1,
  },
  {
    id: "sate",
    name: "Saté",
    description:
      "Kipsaté rechtstreeks van de grill met pindasaus, kroepoek en atjar.",
    price: "€16,50",
    image: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=900&q=80",
    category: "bbq",
    allergens: ["Pinda", "Soja", "Gluten"],
    spicyLevel: 2,
  },
  {
    id: "nacho-bbq",
    name: "Nacho BBQ",
    description:
      "Krokante nachos met pulled BBQ vlees, cheddar, jalapeño en zure room.",
    price: "€13,50",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=900&q=80",
    category: "bbq",
    allergens: ["Gluten", "Melk"],
    spicyLevel: 2,
  },
  {
    id: "the-kitchen-burger",
    name: "The Kitchen Burger",
    description:
      "Sappige Black Angus burger met cheddar, bacon en huisgemaakte burgersaus.",
    price: "€17,95",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
    category: "lunch",
    allergens: ["Gluten", "Melk", "Ei"],
  },
  {
    id: "loaded-fries",
    name: "Loaded Fries",
    description:
      "Krokante frites met cheddar, spek, bosui en truffelmayonaise.",
    price: "€9,50",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=900&q=80",
    category: "lunch",
    allergens: ["Melk", "Gluten"],
  },
  {
    id: "caesar-salad",
    name: "Caesar Salad",
    description:
      "Romige caesarsalade met krokante kip, croutons en verse Parmezaan.",
    price: "€14,50",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80",
    category: "lunch",
    allergens: ["Gluten", "Melk", "Ei", "Vis"],
  },
  {
    id: "kindermenu",
    name: "Kindermenu",
    description:
      "Pasta, snacks of een mini burger met frites, speciaal voor de kleintjes.",
    price: "€8,50",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80",
    category: "lunch",
    allergens: ["Gluten", "Melk"],
  },
  {
    id: "speciaalbier",
    name: "Speciaalbier",
    description: "Wisselend aanbod van ambachtelijke speciaalbieren van de tap.",
    price: "€5,50",
    image: "https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=900&q=80",
    category: "speciaalbier",
    allergens: ["Gluten"],
  },
  {
    id: "cocktails",
    name: "Cocktails",
    description: "Handgeshakete klassiekers en eigen creaties van onze bar.",
    price: "vanaf €10,50",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
    category: "cocktails",
    allergens: [],
  },
  {
    id: "gin-tonic",
    name: "Gin & Tonic",
    description: "Premium gin, tonic en verse botanicals naar keuze.",
    price: "€11,50",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=900&q=80",
    category: "cocktails",
    allergens: [],
  },
  {
    id: "wijn",
    name: "Wijn",
    description: "Zorgvuldig samengestelde wijnkaart in het rood, wit en rosé.",
    price: "vanaf €6,50",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80",
    category: "cocktails",
    allergens: ["Sulfiet"],
  },
  {
    id: "frisdrank",
    name: "Frisdrank",
    description: "Cola, Fanta, Sprite en meer, gekoeld geserveerd.",
    price: "€3,25",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=900&q=80",
    category: "frisdrank",
    allergens: [],
  },
  {
    id: "koffie",
    name: "Koffie",
    description: "Vers gezette koffie, cappuccino of latte macchiato.",
    price: "€3,50",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80",
    category: "koffie",
    allergens: ["Melk"],
  },
  {
    id: "cheesecake",
    name: "Cheesecake",
    description: "Romige cheesecake met een compote van bosvruchten.",
    price: "€7,95",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&q=80",
    category: "desserts",
    allergens: ["Gluten", "Melk", "Ei"],
    vegetarian: true,
  },
  {
    id: "dame-blanche",
    name: "Dame Blanche",
    description: "Vanille-ijs met warme chocoladesaus en slagroom.",
    price: "€7,50",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&q=80",
    category: "desserts",
    allergens: ["Melk", "Ei"],
    vegetarian: true,
    chefsChoice: true,
  },
  {
    id: "lava-cake",
    name: "Lava Cake",
    description: "Warme chocoladetaart met vloeibare kern en vanille-ijs.",
    price: "€8,50",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=900&q=80",
    category: "desserts",
    allergens: ["Gluten", "Melk", "Ei"],
    vegetarian: true,
  },
  {
    id: "kinderijs",
    name: "Kinderijs",
    description: "Drie bolletjes roomijs naar keuze met spikkels of saus.",
    price: "€4,50",
    image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=900&q=80",
    category: "desserts",
    allergens: ["Melk"],
    vegetarian: true,
  },
];
