import { Newspaper } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function NieuwsBeheerPage() {
  return (
    <ComingSoon
      icon={Newspaper}
      title="Nieuws"
      description="Plaats nieuwsberichten en verstuur nieuwsbrieven naar aangemelde abonnees."
      planned={["Nieuwsbericht plaatsen", "Nieuwsbrief versturen (Resend)"]}
    />
  );
}
