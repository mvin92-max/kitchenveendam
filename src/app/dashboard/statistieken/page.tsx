import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function StatistiekenPage() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Statistieken"
      description="Uitgebreide grafieken over omzet, drukte en gerechten — verder dan het dashboard-overzicht."
      planned={[
        "Omzet per periode",
        "Drukste dagen & uren",
        "Populairste gerechten",
        "Gemiddelde besteding",
      ]}
    />
  );
}
