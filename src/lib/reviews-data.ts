export type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
};

export const REVIEWS: Review[] = [
  {
    id: "review-1",
    name: "Marieke de Boer",
    rating: 5,
    date: "2 weken geleden",
    text: "Heerlijk gegeten bij The Kitchen! De steak was perfect gegrild en de sfeer helemaal top. Komen zeker terug.",
  },
  {
    id: "review-2",
    name: "Johan Wiersema",
    rating: 5,
    date: "1 maand geleden",
    text: "Het BBQ arrangement is een aanrader voor iedereen. Onbeperkt lekker vlees en een super gastvrije bediening.",
  },
  {
    id: "review-3",
    name: "Sanne Mulder",
    rating: 5,
    date: "1 maand geleden",
    text: "Gezellig met de kinderen gegeten, iedereen kon zijn ding vinden op de kaart. Netjes, warm en heerlijk eten.",
  },
  {
    id: "review-4",
    name: "Ruben Postma",
    rating: 4,
    date: "2 maanden geleden",
    text: "Prima ervaring, mooie kaart en vriendelijk personeel. De cocktails waren een echte aanrader.",
  },
  {
    id: "review-5",
    name: "Femke Bakker",
    rating: 5,
    date: "2 maanden geleden",
    text: "Onze verjaardag gevierd bij The Kitchen en het was fantastisch. Aandacht voor detail en heerlijk eten.",
  },
  {
    id: "review-6",
    name: "Erik Dijkstra",
    rating: 5,
    date: "3 maanden geleden",
    text: "Beste steakhouse van de regio. De ribeye was boterzacht en de bediening zeer professioneel.",
  },
  {
    id: "review-7",
    name: "Anouk Visser",
    rating: 5,
    date: "3 maanden geleden",
    text: "Wat een prachtige avond gehad tijdens de Live Muziek Night. Geweldige sfeer en top eten.",
  },
  {
    id: "review-8",
    name: "Bas Huisman",
    rating: 4,
    date: "4 maanden geleden",
    text: "Lekkere lunch gehad met collega's. Snelle bediening en een heerlijke burger.",
  },
];

export const REVIEW_STATS = [
  { label: "Google score", value: "4,8", suffix: "" },
  { label: "Gasten", value: "12500", suffix: "+" },
  { label: "Reviews", value: "850", suffix: "+" },
  { label: "Komt terug", value: "98", suffix: "%" },
];
