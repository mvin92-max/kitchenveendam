"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { cn } from "@/lib/utils";
import { EMPLOYEE_POSITIONS } from "@/lib/validation/employee";
import { shiftSchema, type ShiftInput, type ShiftFormValues } from "@/lib/validation/shift";
import { createShiftAction, deleteShiftAction, updateShiftAction } from "@/app/dashboard/personeel/actions";
import type { ShiftData } from "./schedule-grid";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

export type ShiftModalContext = {
  employeeId: string;
  employeeName: string;
  date: string; // yyyy-mm-dd
};

export function ShiftModal({
  open,
  onClose,
  shift,
  context,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  shift: ShiftData | null;
  context: ShiftModalContext | null;
  employees: { id: string; name: string }[];
}) {
  const title = shift
    ? `Shift van ${shift.employeeName} bewerken`
    : `Nieuwe shift${context ? ` — ${context.employeeName}` : ""}`;

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {open && (
        <ShiftForm
          key={shift?.id ?? (context ? `${context.employeeId}-${context.date}` : "new")}
          shift={shift}
          context={context}
          employees={employees}
          onDone={onClose}
        />
      )}
    </Modal>
  );
}

function ShiftForm({
  shift,
  context,
  employees,
  onDone,
}: {
  shift: ShiftData | null;
  context: ShiftModalContext | null;
  employees: { id: string; name: string }[];
  onDone: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShiftFormValues, unknown, ShiftInput>({
    resolver: zodResolver(shiftSchema),
    defaultValues: shift
      ? {
          employeeId: shift.employeeId,
          date: shift.date,
          startTime: shift.startTime,
          endTime: shift.endTime,
          position: shift.position as (typeof EMPLOYEE_POSITIONS)[number],
          notes: shift.notes ?? "",
        }
      : {
          employeeId: context?.employeeId ?? "",
          date: context?.date ?? "",
          startTime: "17:00",
          endTime: "23:00",
          position: EMPLOYEE_POSITIONS[0],
          notes: "",
        },
  });

  function onSubmit(data: ShiftInput) {
    setServerError(null);
    startTransition(async () => {
      const result = shift ? await updateShiftAction(shift.id, data) : await createShiftAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      onDone();
    });
  }

  function handleDelete() {
    if (!shift) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteShiftAction(shift.id);
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Medewerker</label>
        <select className={inputClass} {...register("employeeId")}>
          <option value="" disabled>
            Kies een medewerker
          </option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        {errors.employeeId && <p className="mt-1 text-xs text-red-400">{errors.employeeId.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className={labelClass}>Datum</label>
          <input type="date" className={inputClass} {...register("date")} />
          {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Van</label>
          <input type="time" className={inputClass} {...register("startTime")} />
          {errors.startTime && <p className="mt-1 text-xs text-red-400">{errors.startTime.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Tot</label>
          <input type="time" className={inputClass} {...register("endTime")} />
          {errors.endTime && <p className="mt-1 text-xs text-red-400">{errors.endTime.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Functie tijdens deze shift</label>
        <select className={inputClass} {...register("position")}>
          {EMPLOYEE_POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.position && <p className="mt-1 text-xs text-red-400">{errors.position.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Notitie (optioneel)</label>
        <textarea
          rows={2}
          className={cn(inputClass, "h-auto resize-none py-2.5")}
          placeholder="Bijv. dekt bar tijdens drukte"
          {...register("notes")}
        />
      </div>

      {serverError && (
        <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </p>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-kitchen-red text-sm font-medium uppercase tracking-wide text-white transition-all hover:bg-[#8f1010]",
            isPending && "pointer-events-none opacity-70",
          )}
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {shift ? "Wijzigingen opslaan" : "Shift toevoegen"}
        </button>
        {shift && (
          <button
            type="button"
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            disabled={isPending}
            className={cn(
              "flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors",
              confirmDelete
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-white/15 text-white/60 hover:border-red-500/40 hover:text-red-400",
            )}
          >
            <Trash2 size={15} />
            {confirmDelete ? "Zeker?" : "Verwijderen"}
          </button>
        )}
      </div>
    </form>
  );
}
