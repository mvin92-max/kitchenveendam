import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  accent?: "red" | "gold";
};

export function StatCard({ label, value, icon: Icon, hint, accent = "gold" }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-6 backdrop-blur-xl">
      <div
        className={cn(
          "absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl",
          accent === "gold" ? "bg-kitchen-gold/10" : "bg-kitchen-red/20",
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{label}</p>
          <p className="mt-2 font-heading text-3xl font-bold text-white">{value}</p>
          {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accent === "gold" ? "bg-kitchen-gold/15 text-kitchen-gold" : "bg-kitchen-red/20 text-kitchen-red",
          )}
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}
