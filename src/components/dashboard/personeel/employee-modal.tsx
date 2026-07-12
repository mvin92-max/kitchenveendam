"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { cn } from "@/lib/utils";
import { employeeSchema, EMPLOYEE_POSITIONS, type EmployeeInput, type EmployeeFormValues } from "@/lib/validation/employee";
import { createEmployeeAction, deleteEmployeeAction, updateEmployeeAction } from "@/app/dashboard/personeel/actions";
import type { EmployeeData } from "./employee-panel";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

export type LinkableUser = { id: string; name: string; email: string };

export function EmployeeModal({
  open,
  onClose,
  employee,
  linkableUsers,
}: {
  open: boolean;
  onClose: () => void;
  employee: EmployeeData | null;
  linkableUsers: LinkableUser[];
}) {
  return (
    <Modal open={open} onClose={onClose} title={employee ? `${employee.name} bewerken` : "Nieuwe medewerker"}>
      {open && (
        <EmployeeForm key={employee?.id ?? "new"} employee={employee} linkableUsers={linkableUsers} onDone={onClose} />
      )}
    </Modal>
  );
}

function EmployeeForm({
  employee,
  linkableUsers,
  onDone,
}: {
  employee: EmployeeData | null;
  linkableUsers: LinkableUser[];
  onDone: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeFormValues, unknown, EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? {
          name: employee.name,
          position: employee.position as (typeof EMPLOYEE_POSITIONS)[number],
          phone: employee.phone ?? "",
          email: employee.email ?? "",
          contractHours: employee.contractHours,
          active: employee.active,
          userId: employee.userId,
        }
      : {
          name: "",
          position: EMPLOYEE_POSITIONS[0],
          phone: "",
          email: "",
          contractHours: null,
          active: true,
          userId: null,
        },
  });

  function onSubmit(data: EmployeeInput) {
    setServerError(null);
    startTransition(async () => {
      const result = employee ? await updateEmployeeAction(employee.id, data) : await createEmployeeAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      onDone();
    });
  }

  function handleDelete() {
    if (!employee) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteEmployeeAction(employee.id);
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Naam</label>
          <input className={inputClass} placeholder="Voor- en achternaam" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Functie</label>
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
          <label className={labelClass}>Contracturen / week</label>
          <Controller
            control={control}
            name="contractHours"
            render={({ field }) => (
              <input
                type="number"
                min={0}
                max={60}
                placeholder="Bijv. 24"
                className={inputClass}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
              />
            )}
          />
        </div>

        <div>
          <label className={labelClass}>Telefoon</label>
          <input className={inputClass} placeholder="06-12345678" {...register("phone")} />
        </div>

        <div>
          <label className={labelClass}>E-mail</label>
          <input className={inputClass} placeholder="naam@voorbeeld.nl" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Koppel aan inlogaccount (optioneel)</label>
          <Controller
            control={control}
            name="userId"
            render={({ field }) => (
              <select
                className={inputClass}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              >
                <option value="">Geen inlogaccount</option>
                {linkableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            )}
          />
          <p className="mt-1 text-xs text-white/40">
            Alleen nodig als deze medewerker ook toegang heeft tot het dashboard — dan ziet die persoon zijn/haar
            rooster onder &ldquo;Mijn rooster&rdquo;.
          </p>
        </div>

        <label className="col-span-2 flex items-center gap-2.5 text-sm text-white/70">
          <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.03]" {...register("active")} />
          Actief in dienst
        </label>
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
          {employee ? "Wijzigingen opslaan" : "Medewerker toevoegen"}
        </button>
        {employee && (
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
