"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { cn } from "@/lib/utils";
import {
  adminReservationSchema,
  RESERVATION_STATUSES,
  type AdminReservationInput,
  type AdminReservationFormValues,
} from "@/lib/validation/reservation";
import { createReservationAction } from "@/app/dashboard/reserveringen/actions";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60 [color-scheme:dark]";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

const STATUS_LABELS: Record<string, string> = {
  pending: "Aanvraag",
  confirmed: "Bevestigd",
  cancelled: "Geannuleerd",
  completed: "Afgerond",
};

export type TableOption = { id: string; number: number; capacity: number; zone: string };

export function NewReservationButton({ tables }: { tables: TableOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-kitchen-red px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(122,13,13,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#8f1010]"
      >
        Nieuwe reservering
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nieuwe reservering">
        <ReservationForm tables={tables} onDone={() => setOpen(false)} />
      </Modal>
    </>
  );
}

function ReservationForm({ tables, onDone }: { tables: TableOption[]; onDone: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminReservationFormValues, unknown, AdminReservationInput>({
    resolver: zodResolver(adminReservationSchema),
    defaultValues: {
      location: "binnen",
      wheelchair: false,
      highChair: false,
      occasion: null,
      partySize: 2,
      status: "confirmed",
      tableId: "",
    },
  });

  const location = watch("location");
  const filteredTables = tables.filter((t) => t.zone === location);

  function onSubmit(data: AdminReservationInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await createReservationAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Naam</label>
          <input className={inputClass} placeholder="Voor- en achternaam" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Telefoon</label>
          <input className={inputClass} placeholder="06 12 34 56 78" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
        </div>
        <div className="col-span-2">
          <label className={labelClass}>E-mailadres</label>
          <input className={inputClass} placeholder="naam@voorbeeld.nl" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Datum</label>
          <input type="date" className={inputClass} {...register("date")} />
          {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Tijd</label>
          <input type="time" className={inputClass} {...register("time")} />
          {errors.time && <p className="mt-1 text-xs text-red-400">{errors.time.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Aantal personen</label>
          <input
            type="number"
            min={1}
            max={20}
            className={inputClass}
            {...register("partySize", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className={labelClass}>Locatie</label>
          <select className={cn(inputClass, "appearance-none")} {...register("location")}>
            <option value="binnen">Binnen</option>
            <option value="terras">Terras</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Tafel (optioneel)</label>
          <select className={cn(inputClass, "appearance-none")} {...register("tableId")}>
            <option value="">Automatisch toewijzen</option>
            {filteredTables.map((t) => (
              <option key={t.id} value={t.id}>
                Tafel {t.number} ({t.capacity}p)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={cn(inputClass, "appearance-none")} {...register("status")}>
            {RESERVATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Gelegenheid</label>
          <select
            className={cn(inputClass, "appearance-none")}
            {...register("occasion")}
            defaultValue=""
          >
            <option value="">Geen speciale gelegenheid</option>
            <option value="verjaardag">Verjaardag</option>
            <option value="zakelijk">Zakelijk diner</option>
            <option value="bbq">BBQ Arrangement</option>
          </select>
        </div>
        <div className="flex items-end gap-4 pb-1">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("highChair")} />
            Kinderstoel
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("wheelchair")} />
            Rolstoel
          </label>
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Opmerkingen</label>
          <textarea rows={2} className={cn(inputClass, "h-auto resize-none py-2.5")} {...register("notes")} />
        </div>
      </div>

      {serverError && (
        <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-kitchen-red text-sm font-medium uppercase tracking-wide text-white transition-all hover:bg-[#8f1010]",
          isPending && "pointer-events-none opacity-70",
        )}
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        Reservering opslaan
      </button>
    </form>
  );
}
