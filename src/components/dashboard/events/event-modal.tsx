"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/dashboard/modal";
import { ImageUpload } from "@/components/dashboard/shared/image-upload";
import { cn } from "@/lib/utils";
import { eventSchema, type EventInput, type EventFormValues } from "@/lib/validation/event";
import { createEventAction, updateEventAction } from "@/app/dashboard/evenementen/actions";
import type { EventData } from "./event-row";

const inputClass =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60";

export function EventModal({
  open,
  onClose,
  event,
}: {
  open: boolean;
  onClose: () => void;
  event: EventData | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title={event ? `${event.name} bewerken` : "Nieuw evenement"}>
      {open && <EventForm key={event?.id ?? "new"} event={event} onDone={onClose} />}
    </Modal>
  );
}

function EventForm({ event, onDone }: { event: EventData | null; onDone: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormValues, unknown, EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          name: event.name,
          description: event.description,
          schedule: event.schedule,
          price: event.price,
          image: event.image,
          maxGuests: event.maxGuests,
          ticketsSold: event.ticketsSold,
        }
      : {
          name: "",
          description: "",
          schedule: "",
          price: "",
          image: "",
          maxGuests: null,
          ticketsSold: 0,
        },
  });

  function onSubmit(data: EventInput) {
    setServerError(null);
    startTransition(async () => {
      const result = event ? await updateEventAction(event.id, data) : await createEventAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Foto</label>
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageUpload value={field.value ?? ""} onChange={field.onChange} folder="events" />
          )}
        />
        {errors.image && <p className="mt-1 text-xs text-red-400">{errors.image.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Naam</label>
          <input className={inputClass} placeholder="Bijv. BBQ Night" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Beschrijving</label>
          <textarea
            rows={2}
            className={cn(inputClass, "h-auto resize-none py-2.5")}
            {...register("description")}
          />
          {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Wanneer</label>
          <input
            className={inputClass}
            placeholder="Bijv. Elke laatste vrijdag van de maand"
            {...register("schedule")}
          />
          {errors.schedule && <p className="mt-1 text-xs text-red-400">{errors.schedule.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Prijs</label>
          <input className={inputClass} placeholder="Bijv. €34,50 p.p." {...register("price")} />
          {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Maximum bezoekers</label>
          <Controller
            control={control}
            name="maxGuests"
            render={({ field }) => (
              <input
                type="number"
                min={0}
                placeholder="Onbeperkt"
                className={inputClass}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
              />
            )}
          />
        </div>

        <div>
          <label className={labelClass}>Tickets verkocht</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            {...register("ticketsSold", { valueAsNumber: true })}
          />
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
        {event ? "Wijzigingen opslaan" : "Evenement toevoegen"}
      </button>
    </form>
  );
}
