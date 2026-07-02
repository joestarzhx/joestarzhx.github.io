"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  ariaLabel?: string;
} & HTMLMotionProps<"button">;

export function Button({ children, href, variant = "primary", className, ariaLabel, ...props }: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
    variant === "primary" && "bg-[var(--text-primary)] text-[var(--background)] hover:opacity-90",
    variant === "secondary" &&
      "border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]",
    variant === "ghost" && "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]",
    className,
  );

  const validHref = href && href.trim() && href.trim() !== "#" ? href.trim() : "";

  if (validHref) {
    const external = /^https?:\/\//.test(validHref);
    return (
      <motion.span
        whileHover={{ scale: 1.015, y: -1 }}
        whileTap={{ scale: 0.965, y: 0 }}
        transition={motionTokens.spring}
      >
        {external ? (
          <a className={classes} href={validHref} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
            {children}
          </a>
        ) : (
          <Link className={classes} href={validHref} aria-label={ariaLabel}>
            {children}
          </Link>
        )}
      </motion.span>
    );
  }

  if (!props.onClick && !props.type) {
    return <span className={classes}>{children}</span>;
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.965, y: 0 }}
      transition={motionTokens.spring}
      {...props}
    >
      {children}
    </motion.button>
  );
}
