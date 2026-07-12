"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut } from "lucide-react";
import { ROLE_LABELS, type RoleKey } from "@/lib/permissions";

type TopbarProps = {
  name: string;
  role: RoleKey;
  pendingCount: number;
};

export function Topbar({ name, role, pendingCount }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-end gap-4 border-b border-white/[0.06] bg-[#111111]/90 px-6 backdrop-blur-xl">
      <button
        type="button"
        aria-label="Meldingen"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
      >
        <Bell size={17} />
        {pendingCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-kitchen-red px-1 text-[0.65rem] font-semibold text-white">
            {pendingCount}
          </span>
        )}
      </button>

      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-white/50">{ROLE_LABELS[role]}</p>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kitchen-red/15 font-heading text-sm font-semibold text-kitchen-gold">
        {name.charAt(0)}
      </div>

      <button
        type="button"
        aria-label="Uitloggen"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
      >
        <LogOut size={16} />
      </button>
    </header>
  );
}
