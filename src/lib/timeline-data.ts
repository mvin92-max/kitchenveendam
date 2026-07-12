import type { LucideIcon } from "lucide-react";
import { Beef, Flame, Rocket, Trophy, UtensilsCrossed } from "lucide-react";

export type TimelineStep = {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const TIMELINE: TimelineStep[] = [
  {
    year: "2020",
    title: "Oprichting",
    description: "The Kitchen Veendam opent haar deuren met een simpele belofte: eerlijk eten, warm onthaal.",
    icon: Rocket,
  },
  {
    year: "2021",
    title: "Eerste gasten",
    description: "De allereerste gasten worden vaste bezoekers — het begin van een hechte community.",
    icon: UtensilsCrossed,
  },
  {
    year: "2022",
    title: "Uitbreiding menukaart",
    description: "Van lunch tot diner: de kaart groeit met nieuwe seizoensgerechten en signature dishes.",
    icon: Beef,
  },
  {
    year: "2023",
    title: "BBQ specialiteiten",
    description: "Een eigen BBQ-concept met live vuur maakt van The Kitchen een echte specialist.",
    icon: Flame,
  },
  {
    year: "2024",
    title: "Favoriet restaurant van Veendam",
    description: "Uitgeroepen tot favoriet van de streek, met dank aan duizenden trouwe gasten.",
    icon: Trophy,
  },
];
