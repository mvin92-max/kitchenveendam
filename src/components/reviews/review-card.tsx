import { Quote, Star } from "lucide-react";
import type { Review } from "@/lib/reviews-data";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="relative flex h-full flex-col gap-5 rounded-2xl border border-white/[0.06] bg-kitchen-card p-8 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)]">
      <Quote className="absolute right-6 top-6 text-kitchen-red/30" size={40} />
      <div className="flex gap-1 text-kitchen-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < review.rating ? "currentColor" : "none"}
            strokeWidth={i < review.rating ? 0 : 1.5}
          />
        ))}
      </div>
      <p className="text-base leading-relaxed text-white/70">&ldquo;{review.text}&rdquo;</p>
      <div className="mt-auto flex items-center gap-3 pt-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-kitchen-red/20 font-heading text-lg font-semibold text-kitchen-gold">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{review.name}</p>
          <p className="text-xs text-white/50">{review.date}</p>
        </div>
      </div>
    </div>
  );
}
