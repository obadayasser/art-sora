"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

/**
 * Shared layout primitives for the storefront.
 *
 * Every home/content section renders inside <Section> so spacing,
 * container width, and the alternating background rhythm stay
 * consistent across the whole page. Headers always go through
 * <SectionHeader> so badge/title/description typography is uniform.
 */

interface SectionProps {
  children: ReactNode;
  /** "base" = page background, "band" = alternating tinted band */
  tone?: "base" | "band";
  id?: string;
  className?: string;
}

export function Section({ children, tone = "base", id, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-14 md:py-20 ${tone === "band" ? "bg-section" : "bg-background"} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** "center" for home sections, "start" for listing pages */
  align?: "center" | "start";
}

export function SectionHeader({
  badge,
  title,
  description,
  icon: Icon,
  align = "center",
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "text-center items-center" : "text-start items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${alignment} mb-10 md:mb-14`}
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-accent-soft text-accent border border-accent-border mb-4">
        {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-ink-soft max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

interface SectionFooterLinkProps {
  href: string;
  label: string;
}

/** Uniform "view all" link rendered at the bottom of home sections. */
export function SectionFooterLink({ href, label }: SectionFooterLinkProps) {
  return (
    <div className="text-center mt-10 md:mt-14">
      <a
        href={href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-accent bg-accent-soft border border-accent-border hover:bg-accent hover:text-accent-contrast transition-colors duration-300"
      >
        {label}
      </a>
    </div>
  );
}
