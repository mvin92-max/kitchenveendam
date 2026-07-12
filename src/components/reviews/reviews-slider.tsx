"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS } from "@/lib/reviews-data";
import { ReviewCard } from "./review-card";
import { cn } from "@/lib/utils";

function useItemsPerView() {
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    function update() {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return itemsPerView;
}

export function ReviewsSlider() {
  const itemsPerView = useItemsPerView();
  const pageCount = Math.max(1, Math.ceil(REVIEWS.length / itemsPerView));
  const [rawPage, setRawPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const pausedRef = useRef(false);

  // Deriving from rawPage % pageCount (rather than clamping via an effect)
  // keeps this valid even when itemsPerView/pageCount changes on resize.
  const page = ((rawPage % pageCount) + pageCount) % pageCount;

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setDirection(1);
      setRawPage((p) => p + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [pageCount]);

  const goTo = (next: number) => {
    setDirection(next > page ? 1 : -1);
    setRawPage(next);
  };

  const items = REVIEWS.slice(page * itemsPerView, page * itemsPerView + itemsPerView);

  return (
    <div
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      className="relative"
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Vorige reviews"
          onClick={() => goTo(page - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-kitchen-gold/60 hover:text-kitchen-gold"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ga naar pagina ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === page ? "w-6 bg-kitchen-gold" : "w-2 bg-white/20 hover:bg-white/40",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Volgende reviews"
          onClick={() => goTo(page + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-kitchen-gold/60 hover:text-kitchen-gold"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
