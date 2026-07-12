import { Gift } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function CadeaubonnenBeheerPage() {
  return (
    <ComingSoon
      icon={Gift}
      title="Cadeaubonnen"
      description="Beheer digitale cadeaubonnen, genereer QR-codes en controleer het resterende saldo."
      planned={["Digitale cadeaubonnen", "QR-code per bon", "Unieke code", "Saldo controleren"]}
    />
  );
}
