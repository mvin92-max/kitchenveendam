/**
 * Shared formatting between the admin opening-hours editor and every public
 * display of the schedule (footer, reservation info panel, JSON-LD SEO
 * schema) — all read the same `OpeningHour` rows, just rendered differently.
 */

export type OpeningHourRow = {
  dayOfWeek: number; // 0 = Sunday ... 6 = Saturday, matches Prisma model
  openTime: string | null;
  closeTime: string | null;
  closed: boolean;
};

const DUTCH_DAY_LABELS = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
const SCHEMA_ORG_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Monday-first day order, since that's how the schedule reads naturally. */
const MONDAY_FIRST_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function dayLabel(dayOfWeek: number): string {
  return DUTCH_DAY_LABELS[dayOfWeek];
}

export function formatHoursRange(row: Pick<OpeningHourRow, "closed" | "openTime" | "closeTime">): string {
  if (row.closed || !row.openTime || !row.closeTime) return "Gesloten";
  return `${row.openTime} - ${row.closeTime}`;
}

export function orderRowsMondayFirst<T extends { dayOfWeek: number }>(rows: T[]): T[] {
  return MONDAY_FIRST_ORDER.map((d) => rows.find((r) => r.dayOfWeek === d)).filter((r): r is T => Boolean(r));
}

/** Builds a schema.org `openingHoursSpecification` array, grouping consecutive
 * days that share identical hours (e.g. Tuesday–Thursday) into one entry. */
export function buildOpeningHoursSpecification(rows: OpeningHourRow[]) {
  const openRows = orderRowsMondayFirst(rows).filter((r) => !r.closed && r.openTime && r.closeTime);

  const groups: { days: string[]; opens: string; closes: string }[] = [];
  for (const row of openRows) {
    const last = groups[groups.length - 1];
    if (last && last.opens === row.openTime && last.closes === row.closeTime) {
      last.days.push(SCHEMA_ORG_DAYS[row.dayOfWeek]);
    } else {
      groups.push({ days: [SCHEMA_ORG_DAYS[row.dayOfWeek]], opens: row.openTime!, closes: row.closeTime! });
    }
  }

  return groups.map((g) => ({
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: g.days.length === 1 ? g.days[0] : g.days,
    opens: g.opens,
    closes: g.closes,
  }));
}
