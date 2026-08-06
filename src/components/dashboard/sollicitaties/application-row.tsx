"use client";

import { useState, useTransition } from "react";
import { Loader2, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteApplicationAction, markApplicationReadAction } from "@/app/dashboard/sollicitaties/actions";

export type ApplicationData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  positions: string[];
  message: string | null;
  read: boolean;
  createdAt: string;
};

export function ApplicationRow({ application }: { application: ApplicationData }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleRead() {
    startTransition(() => {
      void markApplicationReadAction(application.id, !application.read);
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(() => {
      void deleteApplicationAction(application.id);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-kitchen-card/70 p-5 backdrop-blur-xl transition-opacity sm:flex-row sm:items-start sm:justify-between",
        isPending && "opacity-50",
        !application.read && "border-kitchen-gold/30",
      )}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-white">{application.name}</h3>
          {!application.read && (
            <span className="rounded-full bg-kitchen-gold px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#111111]">
              Nieuw
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {application.positions.map((p) => (
            <span key={p} className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs text-white/70">
              {p}
            </span>
          ))}
        </div>

        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
          <a href={`mailto:${application.email}`} className="flex items-center gap-1.5 hover:text-white">
            <Mail size={12} />
            {application.email}
          </a>
          {application.phone && (
            <a href={`tel:${application.phone}`} className="flex items-center gap-1.5 hover:text-white">
              <Phone size={12} />
              {application.phone}
            </a>
          )}
          <span>
            {new Date(application.createdAt).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {application.message && (
          <p className="mt-3 whitespace-pre-line rounded-xl bg-white/[0.03] p-3 text-sm text-white/70">
            {application.message}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={toggleRead}
          aria-label={application.read ? "Markeer als ongelezen" : "Markeer als gelezen"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          {application.read ? <Mail size={14} /> : <MailOpen size={14} />}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          onBlur={() => setConfirmDelete(false)}
          aria-label="Verwijderen"
          className={cn(
            "flex h-8 items-center justify-center rounded-full px-2 text-xs font-medium transition-colors",
            confirmDelete
              ? "bg-red-500/20 text-red-300"
              : "w-8 text-white/50 hover:bg-white/[0.06] hover:text-red-400",
          )}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : confirmDelete ? "Zeker?" : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  );
}
