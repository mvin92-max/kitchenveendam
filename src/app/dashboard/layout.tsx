import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Belt-and-braces: middleware already redirects unauthenticated requests,
  // this covers any server-rendered edge case (e.g. stale/expired token).
  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const allowedKeys = DASHBOARD_NAV.filter((item) => canAccessSection(role, item.key)).map(
    (item) => item.key,
  );
  const pendingCount = await prisma.reservation.count({ where: { status: "pending" } });

  return (
    <div className="min-h-screen bg-[#111111]">
      <Sidebar allowedKeys={allowedKeys} />
      <div className="pt-16 lg:pl-64 lg:pt-0">
        <Topbar name={session.user.name} role={role} pendingCount={pendingCount} />
        <main className="flex flex-1 flex-col p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
