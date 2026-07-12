export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "eigenaar",
    name: "Mark Bruinsma",
    role: "Eigenaar",
    bio: "Runt The Kitchen Veendam met passie voor gastvrijheid en een neus voor kwaliteit.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  },
  {
    id: "chef-kok",
    name: "Daan Hoekstra",
    role: "Chef-kok",
    bio: "Meer dan 15 jaar ervaring in premium keukens, gespecialiseerd in vlees en BBQ.",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600&q=80",
  },
  {
    id: "sous-chef",
    name: "Tom Veldkamp",
    role: "Sous-chef",
    bio: "De rechterhand in de keuken, altijd op zoek naar de perfecte garing.",
    image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80",
  },
  {
    id: "gastvrouw",
    name: "Lisa de Groot",
    role: "Gastvrouw",
    bio: "Zorgt dat iedere gast zich vanaf binnenkomst meteen thuis voelt.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
  },
];
