import type { Metadata } from "next";
import { OnderhoudHero } from "@/components/site/onderhoud-hero";

export const metadata: Metadata = {
  title: "We zijn aan het verbouwen | The Kitchen Veendam",
  description: "The Kitchen Veendam wordt verbouwd op Prins Hendrikplein 5 in Veendam. Solliciteer nu bij ons.",
  robots: { index: false, follow: false },
};

export default function OnderhoudPage() {
  return <OnderhoudHero />;
}
