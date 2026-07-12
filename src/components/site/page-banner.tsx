"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageBannerProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
};

export function PageBanner({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  children,
}: PageBannerProps) {
  return (
    <section className="relative flex min-h-[62vh] w-full items-end overflow-hidden bg-[#111111] pt-28 pb-16 sm:min-h-[68vh]">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-[#111111]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/70 via-transparent to-[#111111]/70" />
      </div>

      <div className="section-container relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-kitchen-gold"
        >
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70"
        >
          {subtitle}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
