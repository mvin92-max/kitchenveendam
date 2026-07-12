"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/schedule";
import { ShiftModal, type ShiftModalContext } from "./shift-modal";
import type { EmployeeData } from "./employee-panel";

export type ShiftData = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // yyyy-mm-dd
  startTime: string;
  endTime: string;
  position: string;
  notes: string | null;
};

const DAY_LABELS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

export function ScheduleGrid({
  employees,
  shifts,
  weekDays,
}: {
  employees: EmployeeData[];
  shifts: ShiftData[];
  weekDays: Date[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftData | null>(null);
  const [newShiftContext, setNewShiftContext] = useState<ShiftModalContext | null>(null);

  const activeEmployees = employees.filter((e) => e.active);

  function openNew(employee: EmployeeData, dateKey: string) {
    setEditingShift(null);
    setNewShiftContext({ employeeId: employee.id, employeeName: employee.name, date: dateKey });
    setModalOpen(true);
  }

  function openEdit(shift: ShiftData) {
    setEditingShift(shift);
    setNewShiftContext(null);
    setModalOpen(true);
  }

  if (activeEmployees.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-10 text-center text-sm text-white/40">
        Voeg eerst medewerkers toe om een rooster te kunnen maken.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-kitchen-card/70 backdrop-blur-xl">
      <div className="grid min-w-[900px] grid-cols-[160px_repeat(7,1fr)]">
        <div className="sticky left-0 z-10 border-b border-r border-white/[0.06] bg-kitchen-card p-3 text-xs font-semibold uppercase tracking-wide text-white/40">
          Medewerker
        </div>
        {weekDays.map((day, i) => {
          const isToday = toDateKey(day) === toDateKey(new Date());
          return (
            <div
              key={i}
              className={cn(
                "border-b border-white/[0.06] p-3 text-center",
                isToday && "bg-kitchen-gold/[0.06]",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{DAY_LABELS[i]}</p>
              <p className={cn("text-sm font-medium", isToday ? "text-kitchen-gold" : "text-white/70")}>
                {day.getDate()}/{day.getMonth() + 1}
              </p>
            </div>
          );
        })}

        {activeEmployees.map((employee) => (
          <div key={employee.id} className="contents">
            <div className="sticky left-0 z-10 flex items-center border-b border-r border-white/[0.06] bg-kitchen-card p-3">
              <div>
                <p className="text-sm font-medium text-white">{employee.name}</p>
                <p className="text-xs text-white/40">{employee.position}</p>
              </div>
            </div>
            {weekDays.map((day, i) => {
              const dateKey = toDateKey(day);
              const cellShifts = shifts.filter((s) => s.employeeId === employee.id && s.date === dateKey);
              return (
                <div
                  key={i}
                  className="group relative min-h-[76px] border-b border-white/[0.04] p-1.5 last:border-r-0"
                >
                  <div className="flex flex-col gap-1">
                    {cellShifts.map((shift) => (
                      <button
                        key={shift.id}
                        type="button"
                        onClick={() => openEdit(shift)}
                        className="rounded-lg bg-kitchen-red/20 px-2 py-1 text-left text-xs text-white transition-colors hover:bg-kitchen-red/35"
                      >
                        <p className="font-medium">
                          {shift.startTime}–{shift.endTime}
                        </p>
                        <p className="text-[10px] text-white/60">{shift.position}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => openNew(employee, dateKey)}
                    aria-label="Shift toevoegen"
                    className="mt-1 flex h-6 w-full items-center justify-center rounded-lg text-white/0 transition-colors hover:bg-white/[0.06] hover:text-white/50 group-hover:text-white/25"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <ShiftModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        shift={editingShift}
        context={newShiftContext}
        employees={activeEmployees.map((e) => ({ id: e.id, name: e.name }))}
      />
    </div>
  );
}
