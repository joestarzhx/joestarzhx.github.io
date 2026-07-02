"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { PageContentLoader } from "@/components/loading/PageContentLoader";
import { motionTokens } from "@/lib/motion";

type LoadingTransitionProps = {
  loading: boolean;
  children: ReactNode;
  minHeightClassName?: string;
};

export function LoadingTransition({
  loading,
  children,
  minHeightClassName = "min-h-[240px]",
}: LoadingTransitionProps) {
  return (
    <div className={minHeightClassName}>
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease }}
          >
            <PageContentLoader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
