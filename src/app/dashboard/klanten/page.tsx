import { Users } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function KlantenBeheerPage() {
  return (
    <ComingSoon
      icon={Users}
      title="Klanten (CRM)"
      description="Bekijk klantprofielen met bezoekhistorie, voorkeuren en notities."
      planned={[
        "Naam, e-mail, telefoon",
        "Aantal bezoeken",
        "Favoriete tafel",
        "Laatste reservering",
        "Notities & VIP-status",
      ]}
    />
  );
}
