import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-kitchen-gold">
        {align === "center" && <span className="h-px w-8 bg-kitchen-gold/60" />}
        {eyebrow}
        <span className="h-px w-8 bg-kitchen-gold/60" />
      </span>
      <h2 className="font-heading text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
