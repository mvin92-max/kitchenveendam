import { CalendarClock, Euro, Grid3x3, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { StatCard } from "@/components/dashboard/stat-card";
import { Panel } from "@/components/dashboard/panel";
import { TodayAgenda, type AgendaReservation } from "@/components/dashboard/today-agenda";
import { HourlyChart } from "@/components/dashboard/charts/hourly-chart";
import { WeekTrendChart } from "@/components/dashboard/charts/week-trend-chart";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getAverageSpend() {
  const setting = await prisma.setting.findUnique({ where: { key: "average_spend_per_guest" } });
  if (!setting) return 32.5;
  try {
    return JSON.parse(setting.value) as number;
  } catch {
    return 32.5;
  }
}

export default async function DashboardOverviewPage() {
  const session = await auth();
  const today = startOfDay(new Date());

  const [todayReservations, availableTables, pendingCount, averageSpend, weekReservations] =
    await Promise.all([
      prisma.reservation.findMany({
        where: { date: today },
        include: { customer: true, table: true },
        orderBy: { time: "asc" },
      }),
      prisma.table.count({ where: { status: "vrij" } }),
      prisma.reservation.count({ where: { status: "pending" } }),
      getAverageSpend(),
      prisma.reservation.findMany({
        where: {
          date: { gte: today, lt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
          status: { not: "cancelled" },
        },
        select: { date: true },
      }),
    ]);

  const activeToday = todayReservations.filter((r) => r.status !== "cancelled");
  const guestsToday = activeToday.reduce((sum, r) => sum + r.partySize, 0);
  const revenueToday = guestsToday * averageSpend;

  const hourlyMap = new Map<string, number>();
  for (const r of activeToday) {
    const hour = `${r.time.split(":")[0]}u`;
    hourlyMap.set(hour, (hourlyMap.get(hour) ?? 0) + 1);
  }
  const hourlyData = Array.from(hourlyMap.entries())
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([hour, count]) => ({ hour, count }));

  const weekMap = new Map<string, number>();
  const dayLabels = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    weekMap.set(dayLabels[d.getDay()], 0);
  }
  for (const r of weekReservations) {
    const label = dayLabels[new Date(r.date).getDay()];
    weekMap.set(label, (weekMap.get(label) ?? 0) + 1);
  }
  const weekData = Array.from(weekMap.entries()).map(([label, count]) => ({ label, count }));

  const agendaItems: AgendaReservation[] = todayReservations.map((r) => ({
    id: r.id,
    time: r.time,
    customerName: r.customer.name,
    partySize: r.partySize,
    tableNumber: r.table?.number ?? null,
    status: r.status,
  }));

  const currencyFormatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-kitchen-gold">
          Welkom terug, {session?.user.name?.split(" ")[0]}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Reserveringen vandaag"
          value={String(activeToday.length)}
          icon={CalendarClock}
        />
        <StatCard
          label="Omzet vandaag"
          value={currencyFormatter.format(revenueToday)}
          hint="Geschat op basis van gem. besteding"
          icon={Euro}
          accent="red"
        />
        <StatCard label="Aantal gasten" value={String(guestsToday)} icon={Users} />
        <StatCard label="Beschikbare tafels" value={String(availableTables)} icon={Grid3x3} />
        <StatCard
          label="Openstaande aanvragen"
          value={String(pendingCount)}
          icon={CalendarClock}
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Reserveringen per uur (vandaag)">
          {hourlyData.length > 0 ? (
            <HourlyChart data={hourlyData} />
          ) : (
            <p className="py-20 text-center text-sm text-white/40">Nog geen data voor vandaag.</p>
          )}
        </Panel>
        <Panel title="Reserveringen komende 7 dagen">
          <WeekTrendChart data={weekData} />
        </Panel>
      </div>

      <Panel title="Agenda vandaag">
        <TodayAgenda reservations={agendaItems} />
      </Panel>
    </div>
  );
}
