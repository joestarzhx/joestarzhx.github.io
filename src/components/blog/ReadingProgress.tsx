"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-0.5 bg-transparent">
      <motion.div className="h-full origin-left bg-[var(--accent)]" style={{ scaleX: scrollYProgress }} />
    </div>
  );
}
