// Seed source only — prisma/seed.ts reads this to populate the database.
// The live site and dashboard both read events from the database
// (src/app/evenementen/page.tsx, src/app/dashboard/evenementen), not here.

export type EventItem = {
  id: string;
  name: string;
  date: string;
  description: string;
  price: string;
  image: string;
};

export const EVENTS: EventItem[] = [
  {
    id: "bbq-night",
    name: "BBQ Night",
    date: "Elke laatste vrijdag van de maand",
    description: "Onbeperkt genieten van gegrild vlees, live vuur en een gezellige buitensfeer.",
    price: "€34,50 p.p.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80",
  },
  {
    id: "live-muziek",
    name: "Live Muziek",
    date: "Elke tweede zaterdag van de maand",
    description: "Live optredens van lokale artiesten terwijl je geniet van diner en drankjes.",
    price: "Gratis entree",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=80",
  },
  {
    id: "cocktail-night",
    name: "Cocktail Night",
    date: "Elke donderdag",
    description: "Signature cocktails met korting en live shaken door onze bartenders.",
    price: "Cocktails vanaf €7,50",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
  },
  {
    id: "familie-zondag",
    name: "Familie Zondag",
    date: "Elke zondag",
    description: "Een gezellige familiemiddag met een speciaal kindermenu en activiteiten.",
    price: "Kinderen eten gratis*",
    image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=900&q=80",
  },
  {
    id: "steak-friday",
    name: "Steak Friday",
    date: "Elke vrijdag",
    description: "Onze premium steaks met korting, geserveerd zoals het hoort.",
    price: "-15% op alle steaks",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80",
  },
  {
    id: "wijnproeverij",
    name: "Wijnproeverij",
    date: "Elke eerste woensdag van de maand",
    description: "Proef een zorgvuldig samengestelde selectie wijnen onder begeleiding van onze sommelier.",
    price: "€29,50 p.p.",
    image: "https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?w=900&q=80",
  },
];
