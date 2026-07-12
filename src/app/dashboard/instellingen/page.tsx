import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function InstellingenPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Instellingen"
      description="Restaurantgegevens, gebruikersbeheer en koppelingen met externe diensten."
      planned={[
        "Restaurantgegevens",
        "Gebruikers & rollen",
        "Stripe koppelen",
        "Resend koppelen",
        "Cloudinary koppelen",
        "Google Maps koppelen",
      ]}
    />
  );
}
