"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaButton } from "./cta-button";

const NAV_LINKS = [
  { label: "Menukaart", href: "/menu" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Galerij", href: "/galerij" },
  { label: "Reviews", href: "/reviews" },
  { label: "Evenementen", href: "/evenementen" },
  { label: "Cadeaubonnen", href: "/cadeaubonnen" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#111111]/85 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)] border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="section-container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-gold.png"
            alt="The Kitchen Veendam"
            width={1630}
            height={965}
            priority
            className="h-12 w-auto sm:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative whitespace-nowrap text-[0.8rem] font-medium uppercase tracking-wide text-white/80 transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-kitchen-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CtaButton href="/reserveren" size="md">
            Reserveer direct
          </CtaButton>
        </div>

        <button
          type="button"
          aria-label="Menu openen"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] bg-[#111111]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <CtaButton href="/reserveren" size="md" className="mt-3 w-full">
                Reserveer direct
              </CtaButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
