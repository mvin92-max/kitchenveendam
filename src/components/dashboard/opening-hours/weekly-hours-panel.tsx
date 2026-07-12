"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { dayLabel } from "@/lib/format-hours";
import {
  weeklyHoursSchema,
  type WeeklyHoursInput,
  type WeeklyHoursFormValues,
} from "@/lib/validation/opening-hour";
import { updateWeeklyHoursAction } from "@/app/dashboard/openingstijden/actions";
import type { OpeningHourRowData } from "./types";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60 disabled:opacity-30";

export function WeeklyHoursPanel({ rows }: { rows: OpeningHourRowData[] }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WeeklyHoursFormValues, unknown, WeeklyHoursInput>({
    resolver: zodResolver(weeklyHoursSchema),
    defaultValues: {
      rows: rows.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        closed: r.closed,
        openTime: r.openTime,
        closeTime: r.closeTime,
      })),
    },
  });

  function onSubmit(data: WeeklyHoursInput) {
    setServerError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateWeeklyHoursAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      setSaved(true);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl"
    >
      <h2 className="mb-4 font-heading text-lg font-semibold text-white">Wekelijkse openingstijden</h2>

      <div className="flex flex-col gap-2">
        {rows.map((row, i) => {
          const closed = watch(`rows.${i}.closed`);
          return (
            <div
              key={row.dayOfWeek}
              className="grid grid-cols-[110px_auto_1fr_1fr] items-center gap-3 rounded-xl px-1 py-1.5 sm:grid-cols-[130px_100px_1fr_1fr]"
            >
              <p className="text-sm font-medium text-white">{dayLabel(row.dayOfWeek)}</p>
              <label className="flex items-center gap-2 text-xs text-white/60">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/[0.03]"
                  {...register(`rows.${i}.closed`)}
                />
                Gesloten
              </label>
              <input type="time" className={inputClass} disabled={closed} {...register(`rows.${i}.openTime`)} />
              <input type="time" className={inputClass} disabled={closed} {...register(`rows.${i}.closeTime`)} />
              <input type="hidden" {...register(`rows.${i}.dayOfWeek`, { valueAsNumber: true })} />
            </div>
          );
        })}
      </div>

      {errors.rows && (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle size={15} className="shrink-0" />
          Controleer de ingevulde tijden — sluitingstijd moet na openingstijd liggen.
        </p>
      )}
      {serverError && (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-full bg-kitchen-red px-6 text-sm font-medium uppercase tracking-wide text-white transition-all hover:bg-[#8f1010]",
            isPending && "pointer-events-none opacity-70",
          )}
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          Wijzigingen opslaan
        </button>
        {saved && !isPending && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 size={15} />
            Opgeslagen
          </span>
        )}
      </div>
    </form>
  );
}
