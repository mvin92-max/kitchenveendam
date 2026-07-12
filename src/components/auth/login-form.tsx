"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { cn } from "@/lib/utils";

const inputClass =
  "h-12 w-full rounded-xl border border-white/15 bg-white/[0.03] pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setSubmitting(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setSubmitting(false);

    if (result?.error) {
      setServerError("Onjuist e-mailadres of wachtwoord.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          E-mailadres
        </label>
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-kitchen-gold" />
          <input
            type="email"
            autoComplete="email"
            placeholder="naam@thekitchenveendam.nl"
            className={inputClass}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Wachtwoord
        </label>
        <div className="relative">
          <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-kitchen-gold" />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
        )}
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
        disabled={submitting}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-kitchen-red text-sm font-medium uppercase tracking-wide text-white shadow-[0_8px_30px_-8px_rgba(122,13,13,0.7)] transition-all duration-300",
          "hover:bg-[#8f1010] hover:shadow-[0_10px_45px_-6px_rgba(122,13,13,0.9)]",
          submitting && "pointer-events-none opacity-70",
        )}
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        {submitting ? "Bezig met inloggen..." : "Inloggen"}
      </motion.button>
    </form>
  );
}
