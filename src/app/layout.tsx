import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { RESTAURANT_ADDRESS } from "@/lib/restaurant-info";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://www.thekitchenveendam.nl";
const SITE_NAME = "The Kitchen Veendam";
const SITE_DESCRIPTION =
  "The Kitchen Veendam — de plek voor familie, lunch, diner, BBQ en een gezellige borrel. Reserveer direct je tafel.";
const OG_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Restaurant & BBQ`,
    template: `%s`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Restaurant & BBQ`,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Restaurant & BBQ`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/#restaurant`,
  name: SITE_NAME,
  url: SITE_URL,
  image: OG_IMAGE,
  telephone: RESTAURANT_ADDRESS.phone.replace(/\s|-/g, ""),
  email: RESTAURANT_ADDRESS.email,
  priceRange: "€€",
  servesCuisine: ["Grill", "BBQ", "Steakhouse", "Nederlands"],
  acceptsReservations: true,
  menu: `${SITE_URL}/menu`,
  address: {
    "@type": "PostalAddress",
    streetAddress: RESTAURANT_ADDRESS.street,
    postalCode: RESTAURANT_ADDRESS.postalCity.split(" ").slice(0, 2).join(" "),
    addressLocality: "Veendam",
    addressCountry: "NL",
  },
  openingHoursSpecification: [
    // Maandag gesloten — bewust weggelaten (afwezigheid van een dag betekent gesloten)
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
      opens: "11:00",
      closes: "22:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "11:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "11:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "22:00" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
