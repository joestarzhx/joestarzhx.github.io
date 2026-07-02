import type { Transition, Variants } from "motion/react";

export const motionTokens = {
  duration: {
    fast: 0.16,
    normal: 0.26,
    slow: 0.42,
  },
  spring: {
    type: "spring",
    stiffness: 420,
    damping: 30,
    mass: 0.75,
  } satisfies Transition,
  gentleSpring: {
    type: "spring",
    stiffness: 260,
    damping: 28,
    mass: 0.9,
  } satisfies Transition,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTokens.gentleSpring,
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const scalePress = {
  whileHover: { scale: 1.015, y: -1 },
  whileTap: { scale: 0.965, y: 0 },
  transition: motionTokens.spring,
};
