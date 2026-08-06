/**
 * Central role-based access control (RBAC) definition.
 *
 * This is the single source of truth for "who can see/do what" — it is used
 * by:
 *  - `prisma/seed.ts` to seed the `Role.permissions` column
 *  - `middleware.ts` to block unauthorized routes server-side
 *  - the dashboard `Sidebar` to hide links the current user can't use
 *
 * Hiding a link in the UI is a convenience, not a security boundary — the
 * middleware check is what actually protects each `/dashboard/*` route.
 */

export const ROLE_KEYS = ["OWNER", "MANAGER", "STAFF", "KITCHEN", "GUEST"] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  OWNER: "Eigenaar",
  MANAGER: "Manager",
  STAFF: "Medewerker",
  KITCHEN: "Keuken",
  GUEST: "Gast",
};

export const DASHBOARD_SECTIONS = [
  "dashboard",
  "reserveringen",
  "tafels",
  "menukaart",
  "evenementen",
  "galerij",
  "cadeaubonnen",
  "openingstijden",
  "klanten",
  "personeel",
  "sollicitaties",
  "reviews",
  "nieuws",
  "instellingen",
  "statistieken",
] as const;
export type DashboardSection = (typeof DASHBOARD_SECTIONS)[number];

const ALL_SECTIONS: DashboardSection[] = [...DASHBOARD_SECTIONS];

/** Section access per role. Order here also drives sidebar order. */
export const ROLE_PERMISSIONS: Record<RoleKey, DashboardSection[]> = {
  OWNER: ALL_SECTIONS,
  MANAGER: ALL_SECTIONS.filter((s) => s !== "instellingen"),
  STAFF: ["dashboard", "reserveringen", "tafels", "klanten", "cadeaubonnen", "personeel"],
  KITCHEN: ["dashboard", "menukaart", "personeel"],
  // Gast has no back-office access; logging in only grants a public-site
  // account context (own reservations/gift cards), not the staff dashboard.
  GUEST: [],
};

export function canAccessSection(role: RoleKey, section: DashboardSection): boolean {
  return ROLE_PERMISSIONS[role]?.includes(section) ?? false;
}

/** First section a role lands on after login. */
export function defaultSectionFor(role: RoleKey): DashboardSection | null {
  return ROLE_PERMISSIONS[role]?.[0] ?? null;
}
