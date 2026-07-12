"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function NewsletterForm() {
  return (
    <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        required
        placeholder="Je e-mailadres"
        className="h-11 w-full min-w-0 rounded-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-kitchen-gold/60"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        aria-label="Aanmelden"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kitchen-red text-white transition-colors hover:bg-[#8f1010]"
      >
        <Send size={16} />
      </motion.button>
    </form>
  );
}
