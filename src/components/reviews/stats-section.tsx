"use client";

import { Star } from "lucide-react";
import { REVIEW_STATS } from "@/lib/reviews-data";
import { StaggerGroup, StaggerItem } from "@/components/site/motion";
import { StatCounter } from "./stat-counter";

export function StatsSection() {
  return (
    <section className="relative bg-[#0d0d0d] py-24 lg:py-28">
      <div className="section-container">
        <StaggerGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {REVIEW_STATS.map((stat) => {
            const isRating = stat.label === "Google score";
            return (
              <StaggerItem key={stat.label}>
                <div className="flex flex-col items-center gap-2 text-center">
                  {isRating && (
                    <div className="mb-1 flex gap-1 text-kitchen-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                  )}
                  <p className="font-heading text-4xl font-bold text-white sm:text-5xl">
                    <StatCounter value={stat.value} suffix={stat.suffix} decimals={isRating ? 1 : 0} />
                  </p>
                  <p className="text-sm uppercase tracking-wide text-white/55">{stat.label}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
