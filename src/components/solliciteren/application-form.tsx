"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { OPEN_VACANCIES } from "@/lib/restaurant-info";
import {
  jobApplicationSchema,
  type JobApplicationInput,
  type JobApplicationFormValues,
} from "@/lib/validation/job-application";
import { submitJobApplication } from "@/app/solliciteren/actions";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

export function ApplicationForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobApplicationFormValues, unknown, JobApplicationInput>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: { name: "", email: "", phone: "", positions: [], message: "" },
  });

  function onSubmit(data: JobApplicationInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await submitJobApplication(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-10 text-center">
        <CheckCircle2 size={28} className="text-emerald-400" />
        <p className="font-heading text-lg font-semibold text-white">Bedankt voor je sollicitatie!</p>
        <p className="text-sm text-white/60">We nemen zo snel mogelijk contact met je op.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4 text-left">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Naam</label>
          <input className={inputClass} placeholder="Voor- en achternaam" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Telefoon (optioneel)</label>
          <input className={inputClass} placeholder="06-12345678" {...register("phone")} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>E-mail</label>
          <input className={inputClass} placeholder="naam@voorbeeld.nl" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Waar solliciteer je op?</label>
        <Controller
          control={control}
          name="positions"
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {OPEN_VACANCIES.map((role) => {
                const checked = (field.value ?? []).includes(role);
                return (
                  <label
                    key={role}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition-colors",
                      checked
                        ? "border-kitchen-gold/60 bg-kitchen-gold/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-white/[0.03]"
                      checked={checked}
                      onChange={(e) => {
                        const current: string[] = field.value ?? [];
                        field.onChange(
                          e.target.checked ? [...current, role] : current.filter((r) => r !== role),
                        );
                      }}
                    />
                    {role}
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.positions && <p className="mt-1 text-xs text-red-400">{errors.positions.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Motivatie (optioneel)</label>
        <textarea
          rows={4}
          className={cn(inputClass, "h-auto resize-none py-2.5")}
          placeholder="Vertel kort iets over jezelf en waarom je bij ons wil werken"
          {...register("message")}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
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
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        Verstuur sollicitatie
      </button>
    </form>
  );
}
