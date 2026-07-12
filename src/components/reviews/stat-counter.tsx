"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

type StatCounterProps = {
  value: string;
  suffix?: string;
  decimals?: number;
};

export function StatCounter({ value, suffix = "", decimals = 0 }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const numericValue = parseFloat(value.replace(",", "."));

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1800, bounce: 0 });

  useEffect(() => {
    if (isInView) motionValue.set(numericValue);
  }, [isInView, motionValue, numericValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (!ref.current) return;
      ref.current.textContent =
        latest.toLocaleString("nl-NL", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) + suffix;
    });
  }, [springValue, suffix, decimals]);

  return <span ref={ref}>0{suffix}</span>;
}
