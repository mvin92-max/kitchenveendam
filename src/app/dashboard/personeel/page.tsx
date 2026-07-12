import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStart, getWeekDays, toDateKey } from "@/lib/schedule";
import { PersoneelBoard } from "@/components/dashboard/personeel/personeel-board";
import { MySchedule } from "@/components/dashboard/personeel/my-schedule";
import type { EmployeeData } from "@/components/dashboard/personeel/employee-panel";
import type { ShiftData } from "@/components/dashboard/personeel/schedule-grid";

export default async function PersoneelPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const weekStart = getWeekStart(params.week ? new Date(params.week) : new Date());
  const weekDays = getWeekDays(weekStart);
  const weekEnd = weekDays[6];
  const rangeEnd = new Date(weekEnd);
  rangeEnd.setDate(rangeEnd.getDate() + 1);

  const shiftRecords = await prisma.shift.findMany({
    where: { date: { gte: weekStart, lt: rangeEnd } },
    include: { employee: true },
    orderBy: { startTime: "asc" },
  });

  const shifts: ShiftData[] = shiftRecords.map((s) => ({
    id: s.id,
    employeeId: s.employeeId,
    employeeName: s.employee.name,
    date: toDateKey(s.date),
    startTime: s.startTime,
    endTime: s.endTime,
    position: s.position,
    notes: s.notes,
  }));

  const isManager = session.user.role === "OWNER" || session.user.role === "MANAGER";

  if (!isManager) {
    const myEmployee = await prisma.employee.findUnique({ where: { userId: session.user.id } });
    const myShifts = myEmployee ? shifts.filter((s) => s.employeeId === myEmployee.id) : [];

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-white">Mijn rooster</h1>
          <p className="mt-1 text-sm text-white/50">
            {myEmployee ? "Jouw ingeplande shifts deze week." : "Je bent nog niet gekoppeld aan een personeelsprofiel."}
          </p>
        </div>
        <MySchedule shifts={myShifts} weekDays={weekDays} />
      </div>
    );
  }

  const [employeeRecords, linkedUsers] = await Promise.all([
    prisma.employee.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  const employees: EmployeeData[] = employeeRecords.map((e) => ({
    id: e.id,
    name: e.name,
    position: e.position,
    phone: e.phone,
    email: e.email,
    contractHours: e.contractHours,
    active: e.active,
    userId: e.userId,
  }));

  const linkableUsers = linkedUsers.map((u) => ({ id: u.id, name: u.name, email: u.email }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-white">Personeelsplanning</h1>
        <p className="mt-1 text-sm text-white/50">Beheer medewerkers en stel het weekrooster samen.</p>
      </div>
      <PersoneelBoard employees={employees} shifts={shifts} weekDays={weekDays} linkableUsers={linkableUsers} />
    </div>
  );
}
