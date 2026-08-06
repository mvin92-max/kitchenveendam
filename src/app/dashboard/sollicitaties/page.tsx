import { prisma } from "@/lib/prisma";
import { ApplicationRow, type ApplicationData } from "@/components/dashboard/sollicitaties/application-row";

export default async function SollicitatiesPage() {
  const records = await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } });

  const applications: ApplicationData[] = records.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    positions: r.positions,
    message: r.message,
    read: r.read,
    createdAt: r.createdAt.toISOString(),
  }));

  const unreadCount = applications.filter((a) => !a.read).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-white">Sollicitaties</h1>
        <p className="mt-1 text-sm text-white/50">
          {applications.length} {applications.length === 1 ? "sollicitatie" : "sollicitaties"}
          {unreadCount > 0 ? ` — ${unreadCount} nieuw` : ""}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {applications.map((application) => (
          <ApplicationRow key={application.id} application={application} />
        ))}
        {applications.length === 0 && (
          <p className="rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-10 text-center text-sm text-white/40">
            Nog geen sollicitaties binnengekomen.
          </p>
        )}
      </div>
    </div>
  );
}
