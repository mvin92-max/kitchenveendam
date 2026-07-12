import { Star } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function ReviewsBeheerPage() {
  return (
    <ComingSoon
      icon={Star}
      title="Reviews"
      description="Modereer reviews op de website en houd Google Reviews in de gaten."
      planned={["Reviews goedkeuren/afwijzen", "Google Reviews synchroniseren"]}
    />
  );
}
