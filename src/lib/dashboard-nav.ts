import {
  BarChart3,
  Calendar,
  CalendarClock,
  Gift,
  Grid3x3,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Settings,
  Star,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DashboardSection } from "./permissions";

export type NavItem = {
  key: DashboardSection;
  label: string;
  href: string;
  icon: LucideIcon;
};

/** Presentation config for the dashboard sidebar, in fixed display order. */
export const DASHBOARD_NAV: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "reserveringen", label: "Reserveringen", href: "/dashboard/reserveringen", icon: Calendar },
  { key: "tafels", label: "Tafels", href: "/dashboard/tafels", icon: Grid3x3 },
  { key: "menukaart", label: "Menukaart", href: "/dashboard/menukaart", icon: UtensilsCrossed },
  { key: "evenementen", label: "Evenementen", href: "/dashboard/evenementen", icon: Megaphone },
  { key: "galerij", label: "Galerij", href: "/dashboard/galerij", icon: ImageIcon },
  { key: "cadeaubonnen", label: "Cadeaubonnen", href: "/dashboard/cadeaubonnen", icon: Gift },
  { key: "openingstijden", label: "Openingstijden", href: "/dashboard/openingstijden", icon: Calendar },
  { key: "klanten", label: "Klanten", href: "/dashboard/klanten", icon: Users },
  { key: "personeel", label: "Personeel", href: "/dashboard/personeel", icon: CalendarClock },
  { key: "reviews", label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { key: "nieuws", label: "Nieuws", href: "/dashboard/nieuws", icon: Newspaper },
  { key: "statistieken", label: "Statistieken", href: "/dashboard/statistieken", icon: BarChart3 },
  { key: "instellingen", label: "Instellingen", href: "/dashboard/instellingen", icon: Settings },
];

/** Maps a pathname like "/dashboard/reserveringen/123" to its section key. */
export function sectionFromPath(pathname: string): DashboardSection | null {
  if (pathname === "/dashboard") return "dashboard";
  const match = DASHBOARD_NAV.find(
    (item) => item.key !== "dashboard" && pathname.startsWith(item.href),
  );
  return match?.key ?? null;
}
