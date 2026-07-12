"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, type NavItem } from "@/lib/dashboard-nav";
import type { DashboardSection } from "@/lib/permissions";

type SidebarProps = {
  /**
   * Just the section keys the current user may see (plain strings — safe to
   * pass from a Server Component). The icon components themselves live in
   * `DASHBOARD_NAV`, imported here directly, since React components/functions
   * can't be serialized across the server→client prop boundary.
   */
  allowedKeys: DashboardSection[];
};

function NavLinks({ items, pathname, onNavigate }: { items: NavItem[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {items.map((item) => {
        const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-kitchen-red text-white"
                : "text-white/60 hover:bg-white/[0.05] hover:text-white",
            )}
          >
            <item.icon
              size={18}
              strokeWidth={1.75}
              className={cn(active ? "text-white" : "text-white/40 group-hover:text-kitchen-gold")}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ allowedKeys }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items: NavItem[] = DASHBOARD_NAV.filter((item) => allowedKeys.includes(item.key));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[0.06] bg-[#0a0a0a] lg:flex">
        <div className="flex h-20 items-center border-b border-white/[0.06] px-6">
          <Image src="/logo-gold.png" alt="The Kitchen Veendam" width={1630} height={965} className="h-9 w-auto" />
        </div>
        <NavLinks items={items} pathname={pathname} />
      </aside>

      {/* Mobile top bar trigger */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-4 lg:hidden">
        <Image src="/logo-gold.png" alt="The Kitchen Veendam" width={1630} height={965} className="h-8 w-auto" />
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
        >
          <Menu size={18} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-72 flex-col border-r border-white/[0.06] bg-[#0a0a0a]"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                <Image src="/logo-gold.png" alt="The Kitchen Veendam" width={1630} height={965} className="h-8 w-auto" />
                <button
                  type="button"
                  aria-label="Sluiten"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <NavLinks items={items} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
