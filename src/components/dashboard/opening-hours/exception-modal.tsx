"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { cn } from "@/lib/utils";
import {
  openingHourExceptionSchema,
  type OpeningHourExceptionInput,
  type OpeningHourExceptionFormValues,
} from "@/lib/validation/opening-hour-exception";
import {
  createExceptionAction,
  deleteExceptionAction,
  updateExceptionAction,
} from "@/app/dashboard/openingstijden/actions";
import type { ExceptionData } from "./types";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60 disabled:opacity-30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

export function ExceptionModal({
  open,
  onClose,
  exception,
}: {
  open: boolean;
  onClose: () => void;
  exception: ExceptionData | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title={exception ? "Uitzondering bewerken" : "Nieuwe uitzondering"}>
      {open && <ExceptionForm key={exception?.id ?? "new"} exception={exception} onDone={onClose} />}
    </Modal>
  );
}

function ExceptionForm({ exception, onDone }: { exception: ExceptionData | null; onDone: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OpeningHourExceptionFormValues, unknown, OpeningHourExceptionInput>({
    resolver: zodResolver(openingHourExceptionSchema),
    defaultValues: exception
      ? {
          date: exception.date,
          label: exception.label,
          closed: exception.closed,
          openTime: exception.openTime,
          closeTime: exception.closeTime,
        }
      : {
          date: "",
          label: "",
          closed: true,
          openTime: null,
          closeTime: null,
        },
  });

  const closed = watch("closed");

  function onSubmit(data: OpeningHourExceptionInput) {
    setServerError(null);
    startTransition(async () => {
      const result = exception
        ? await updateExceptionAction(exception.id, data)
        : await createExceptionAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      onDone();
    });
  }

  function handleDelete() {
    if (!exception) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteExceptionAction(exception.id);
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Naam</label>
          <input className={inputClass} placeholder="Bijv. Eerste Kerstdag" {...register("label")} />
          {errors.label && <p className="mt-1 text-xs text-red-400">{errors.label.message}</p>}
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Datum</label>
          <input type="date" className={inputClass} {...register("date")} />
          {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
        </div>

        <label className="col-span-2 flex items-center gap-2.5 text-sm text-white/70">
          <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.03]" {...register("closed")} />
          Gesloten deze dag
        </label>

        <div>
          <label className={labelClass}>Van</label>
          <input type="time" className={inputClass} disabled={closed} {...register("openTime")} />
        </div>
        <div>
          <label className={labelClass}>Tot</label>
          <input type="time" className={inputClass} disabled={closed} {...register("closeTime")} />
          {errors.closeTime && <p className="mt-1 text-xs text-red-400">{errors.closeTime.message}</p>}
        </div>
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
          {exception ? "Wijzigingen opslaan" : "Uitzondering toevoegen"}
        </button>
        {exception && (
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
