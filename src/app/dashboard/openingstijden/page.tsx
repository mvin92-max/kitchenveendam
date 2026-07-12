import { Clock } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function OpeningstijdenBeheerPage() {
  return (
    <ComingSoon
      icon={Clock}
      title="Openingstijden"
      description="Beheer de reguliere openingstijden en uitzonderingen zoals feestdagen."
      planned={["Openingstijden per dag", "Feestdagen & uitzonderingen", "Direct zichtbaar op de website"]}
    />
  );
}
