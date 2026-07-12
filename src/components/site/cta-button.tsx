import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "gold";
  size?: "md" | "lg";
  icon?: ReactNode;
  className?: string;
};

const variantClasses: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  primary:
    "bg-kitchen-red text-white shadow-[0_8px_30px_-8px_rgba(122,13,13,0.7)] hover:bg-[#8f1010] hover:shadow-[0_10px_40px_-6px_rgba(122,13,13,0.85)]",
  outline:
    "border border-white/25 bg-white/[0.02] text-white backdrop-blur-sm hover:border-kitchen-gold/70 hover:bg-white/[0.06]",
  gold: "bg-kitchen-gold text-[#111111] shadow-[0_8px_30px_-8px_rgba(212,175,55,0.6)] hover:bg-[#e2c04e]",
};

const sizeClasses: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
}: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-wide transition-all duration-300 ease-out will-change-transform hover:-translate-y-0.5 active:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </Link>
  );
}
