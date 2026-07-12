import type { LucideIcon } from "lucide-react";

type ComingSoonProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  planned: string[];
};

/**
 * Placeholder for sidebar sections not yet built in this phase. The route,
 * RBAC gate and sidebar entry already exist — only the feature UI/actions
 * are pending, so wiring in the real page later is a drop-in replacement of
 * this component.
 */
export function ComingSoon({ icon: Icon, title, description, planned }: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">{description}</p>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/[0.06] bg-kitchen-card/70 px-8 py-16 text-center backdrop-blur-xl">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-kitchen-gold/15 text-kitchen-gold">
          <Icon size={28} strokeWidth={1.75} />
        </span>
        <div>
          <p className="font-heading text-xl font-semibold text-white">Binnenkort beschikbaar</p>
          <p className="mt-2 max-w-md text-sm text-white/50">
            Deze sectie volgt in de volgende bouwfase. Gepland:
          </p>
        </div>
        <ul className="flex max-w-md flex-wrap justify-center gap-2">
          {planned.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
