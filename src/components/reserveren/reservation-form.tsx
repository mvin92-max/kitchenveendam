"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accessibility,
  AlertCircle,
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  reservationSchema,
  type ReservationInput,
  type ReservationFormValues,
} from "@/lib/validation/reservation";
import { createPublicReservation } from "@/app/reserveren/actions";

const TIME_SLOTS = [
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

function getAvailability(time: string): { label: string; tone: "ruim" | "beperkt" } {
  const hour = Number(time.split(":")[0]);
  const isPeak = hour >= 18 && hour <= 20;
  return isPeak
    ? { label: "Beperkt beschikbaar", tone: "beperkt" }
    : { label: "Ruim beschikbaar", tone: "ruim" };
}

const TABLE_OPTIONS = [
  "Geen voorkeur",
  "Bij het raam",
  "Rustig hoekje",
  "Aan de bar",
  "Grote tafel / groep",
];

const OCCASION_OPTIONS: { value: "geen" | "verjaardag" | "zakelijk" | "bbq"; label: string }[] = [
  { value: "geen", label: "Geen speciale gelegenheid" },
  { value: "verjaardag", label: "Verjaardag" },
  { value: "zakelijk", label: "Zakelijk diner" },
  { value: "bbq", label: "BBQ Arrangement" },
];

const inputClass =
  "h-12 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60 [color-scheme:dark]";

const labelClass = "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60";

const todayIso = () => new Date().toISOString().slice(0, 10);

export function ReservationForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [tablePreference, setTablePreference] = useState(TABLE_OPTIONS[0]);
  const [occasionChoice, setOccasionChoice] = useState<"geen" | "verjaardag" | "zakelijk" | "bbq">(
    "geen",
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues, unknown, ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      location: "binnen",
      wheelchair: false,
      highChair: false,
      occasion: null,
      partySize: 2,
    },
  });

  const time = watch("time");
  const location = watch("location");
  const availability = useMemo(() => (time ? getAvailability(time) : null), [time]);

  async function onSubmit(data: ReservationInput) {
    setServerError(null);
    const notesWithPreference =
      tablePreference !== TABLE_OPTIONS[0]
        ? [data.notes, `Tafelvoorkeur: ${tablePreference}`].filter(Boolean).join(" — ")
        : data.notes;

    const result = await createPublicReservation({
      ...data,
      notes: notesWithPreference,
      occasion: occasionChoice === "geen" ? null : occasionChoice,
    });

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-kitchen-card px-8 py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-kitchen-red/15 text-kitchen-gold"
        >
          <CheckCircle2 size={44} strokeWidth={1.5} />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-6 font-heading text-3xl font-semibold text-white"
        >
          Bedankt voor uw reservering.
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-3 max-w-sm text-white/60"
        >
          Uw tafel is direct bevestigd. U ontvangt hiervan ook een bevestiging per e-mail.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          type="button"
          onClick={() => {
            setSuccess(false);
            reset();
          }}
          className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:border-kitchen-gold/60"
        >
          Nieuwe reservering maken
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 rounded-3xl border border-white/[0.06] bg-kitchen-card p-6 sm:p-10"
    >
      <div>
        <h3 className="mb-6 font-heading text-2xl font-semibold text-white">
          Reserveringsdetails
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              <Calendar size={14} className="text-kitchen-gold" />
              Datum
            </label>
            <input
              type="date"
              min={todayIso()}
              className={inputClass}
              {...register("date")}
            />
            {errors.date && <p className="mt-1.5 text-xs text-red-400">{errors.date.message}</p>}
          </div>

          <div>
            <label className={labelClass}>
              <Clock size={14} className="text-kitchen-gold" />
              Tijd
            </label>
            <select className={cn(inputClass, "appearance-none")} {...register("time")}>
              <option value="" disabled>
                Kies een tijd
              </option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && <p className="mt-1.5 text-xs text-red-400">{errors.time.message}</p>}
            <AnimatePresence>
              {availability && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "mt-2 flex items-center gap-1.5 text-xs",
                    availability.tone === "ruim" ? "text-green-400" : "text-kitchen-gold",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      availability.tone === "ruim" ? "bg-green-400" : "bg-kitchen-gold",
                    )}
                  />
                  {availability.label}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className={labelClass}>
              <Users size={14} className="text-kitchen-gold" />
              Aantal personen
            </label>
            <select
              className={cn(inputClass, "appearance-none")}
              {...register("partySize", { valueAsNumber: true })}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? "persoon" : "personen"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClass}>Binnen / Terras</span>
            <div className="flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] p-1.5">
              {(["binnen", "terras"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setValue("location", option)}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors",
                    location === option
                      ? "bg-kitchen-red text-white"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-6 font-heading text-2xl font-semibold text-white">
          Extra opties
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Tafelkeuze</label>
            <select
              value={tablePreference}
              onChange={(e) => setTablePreference(e.target.value)}
              className={cn(inputClass, "appearance-none")}
            >
              {TABLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Gelegenheid</label>
            <select
              value={occasionChoice}
              onChange={(e) => setOccasionChoice(e.target.value as typeof occasionChoice)}
              className={cn(inputClass, "appearance-none")}
            >
              {OCCASION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-4 text-sm text-white/80 transition-colors hover:border-kitchen-gold/40">
            <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("highChair")} />
            <Baby size={16} className="text-kitchen-gold" />
            Kinderstoel gewenst
          </label>

          <label className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-4 text-sm text-white/80 transition-colors hover:border-kitchen-gold/40">
            <input type="checkbox" className="h-4 w-4 accent-kitchen-red" {...register("wheelchair")} />
            <Accessibility size={16} className="text-kitchen-gold" />
            Rolstoeltoegankelijke plek
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-6 font-heading text-2xl font-semibold text-white">
          Contactgegevens
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              <User size={14} className="text-kitchen-gold" />
              Naam
            </label>
            <input
              type="text"
              placeholder="Voor- en achternaam"
              className={inputClass}
              {...register("name")}
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>
              <Phone size={14} className="text-kitchen-gold" />
              Telefoon
            </label>
            <input
              type="tel"
              placeholder="06 12 34 56 78"
              className={inputClass}
              {...register("phone")}
            />
            {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>
              <Mail size={14} className="text-kitchen-gold" />
              E-mailadres
            </label>
            <input
              type="email"
              placeholder="naam@voorbeeld.nl"
              className={inputClass}
              {...register("email")}
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>
              <MessageSquare size={14} className="text-kitchen-gold" />
              Opmerkingen (optioneel)
            </label>
            <textarea
              rows={4}
              placeholder="Allergieën, wensen of andere opmerkingen"
              className={cn(inputClass, "h-auto resize-none py-3")}
              {...register("notes")}
            />
          </div>
        </div>
      </div>

      {serverError && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          <AlertCircle size={15} className="shrink-0" />
          {serverError}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex h-14 items-center justify-center gap-2 rounded-full bg-kitchen-red text-base font-medium uppercase tracking-wide text-white shadow-[0_8px_30px_-8px_rgba(122,13,13,0.7)] transition-all duration-300",
          "hover:bg-[#8f1010] hover:shadow-[0_10px_45px_-6px_rgba(122,13,13,0.9)]",
          isSubmitting && "pointer-events-none opacity-70",
        )}
      >
        {isSubmitting ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
            />
            Bezig met verzenden...
          </>
        ) : (
          "Verstuur reservering"
        )}
      </motion.button>
    </form>
  );
}
