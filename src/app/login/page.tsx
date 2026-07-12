import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Inloggen | The Kitchen Veendam",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-6 py-16">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-kitchen-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-kitchen-gold/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.08] bg-kitchen-card/80 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo-gold.png"
            alt="The Kitchen Veendam"
            width={1630}
            height={965}
            className="h-12 w-auto"
          />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
            Personeel
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-white">
            Inloggen op het dashboard
          </h1>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
