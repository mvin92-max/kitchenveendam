"use client";

import { useState } from "react";
import { Phone, Plus, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeModal, type LinkableUser } from "./employee-modal";

export type EmployeeData = {
  id: string;
  name: string;
  position: string;
  phone: string | null;
  email: string | null;
  contractHours: number | null;
  active: boolean;
  userId: string | null;
};

export function EmployeePanel({
  employees,
  linkableUsers,
}: {
  employees: EmployeeData[];
  linkableUsers: LinkableUser[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeData | null>(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(employee: EmployeeData) {
    setEditing(employee);
    setModalOpen(true);
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-white">Personeel ({employees.length})</h2>
        <button
          type="button"
          onClick={openCreate}
          className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-xs font-medium text-white/70 transition-colors hover:border-kitchen-gold/50 hover:text-white"
        >
          <Plus size={14} />
          Medewerker
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {employees.map((e) => {
          const linkedUser = linkableUsers.find((u) => u.id === e.userId);
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => openEdit(e)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05]",
                !e.active && "opacity-40",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/60">
                  <UserRound size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{e.name}</p>
                  <p className="text-xs text-white/45">
                    {e.position}
                    {e.contractHours ? ` · ${e.contractHours}u/week` : ""}
                    {linkedUser ? " · heeft dashboard-login" : ""}
                  </p>
                </div>
              </div>
              {e.phone && (
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Phone size={11} />
                  {e.phone}
                </span>
              )}
            </button>
          );
        })}
        {employees.length === 0 && (
          <p className="px-3.5 py-6 text-center text-sm text-white/40">Nog geen medewerkers toegevoegd.</p>
        )}
      </div>

      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={editing}
        linkableUsers={linkableUsers}
      />
    </div>
  );
}
