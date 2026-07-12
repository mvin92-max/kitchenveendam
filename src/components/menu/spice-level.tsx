import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpiceLevel({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0.5" title={`Pittigheid ${level}/3`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          size={13}
          className={cn(
            i < level ? "text-kitchen-red" : "text-white/15",
          )}
          fill={i < level ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
