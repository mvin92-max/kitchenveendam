import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function GeenToegangPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-kitchen-red/15 text-kitchen-gold">
        <ShieldAlert size={28} />
      </span>
      <h1 className="font-heading text-2xl font-semibold text-white">Geen toegang</h1>
      <p className="max-w-sm text-sm text-white/55">
        Je account heeft geen rechten om deze pagina te bekijken. Neem contact op met een
        beheerder als je denkt dat dit niet klopt.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-kitchen-gold/60"
      >
        Terug naar dashboard
      </Link>
    </div>
  );
}
