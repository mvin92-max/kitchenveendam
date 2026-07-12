"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { GiftCardPreview } from "./gift-card-preview";

const AMOUNTS = ["€25", "€50", "€75", "€100"];

export function GiftCardSelector() {
  const [selected, setSelected] = useState("€50");
  const [customAmount, setCustomAmount] = useState("");
  const isCustom = selected === "custom";

  const displayAmount = isCustom ? (customAmount ? `€${customAmount}` : "€ ...") : selected;

  return (
    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
      <GiftCardPreview amount={displayAmount} />

      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setSelected(amount)}
              className={cn(
                "h-14 rounded-xl border text-lg font-semibold transition-colors duration-300",
                selected === amount
                  ? "border-kitchen-gold bg-kitchen-gold text-[#111111]"
                  : "border-white/15 bg-white/[0.03] text-white hover:border-kitchen-gold/50",
              )}
            >
              {amount}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSelected("custom")}
            className={cn(
              "col-span-2 h-14 rounded-xl border text-sm font-semibold uppercase tracking-wide transition-colors duration-300 sm:col-span-1",
              isCustom
                ? "border-kitchen-gold bg-kitchen-gold text-[#111111]"
                : "border-white/15 bg-white/[0.03] text-white hover:border-kitchen-gold/50",
            )}
          >
            Vrij bedrag
          </button>
        </div>

        {isCustom && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            type="number"
            min={5}
            placeholder="Vul een bedrag in (€)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="mt-4 h-14 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 text-white placeholder:text-white/40 outline-none focus:border-kitchen-gold/60 [color-scheme:dark]"
          />
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-kitchen-red text-sm font-medium uppercase tracking-wide text-white shadow-[0_8px_30px_-8px_rgba(122,13,13,0.7)] transition-all duration-300 hover:bg-[#8f1010] hover:shadow-[0_10px_45px_-6px_rgba(122,13,13,0.9)]"
          >
            <Mail size={17} />
            Bestel digitaal
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.02] text-sm font-medium uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:border-kitchen-gold/70 hover:bg-white/[0.06]"
          >
            <Gift size={17} />
            Bestel fysieke cadeaubon
          </motion.button>
        </div>

        <p className="mt-5 text-xs text-white/40">
          Digitale cadeaubonnen ontvang je direct per e-mail. Fysieke cadeaubonnen worden
          verstuurd per post of zijn af te halen in het restaurant.
        </p>
      </div>
    </div>
  );
}
