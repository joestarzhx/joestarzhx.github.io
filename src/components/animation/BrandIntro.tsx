"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { getLottieItem } from "@/data/lottie";
import { profile } from "@/data/profile";

const brandIntro = getLottieItem("brand-intro")!;

export function BrandIntro() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname !== "/" || reducedMotion) return;
    const played = window.sessionStorage.getItem("haoxuan-brand-intro-played");
    if (played) return;

    window.sessionStorage.setItem("haoxuan-brand-intro-played", "true");
    const showTimeout = window.setTimeout(() => setVisible(true), 0);

    const hideTimeout = window.setTimeout(() => setVisible(false), 3000);
    return () => {
      window.clearTimeout(showTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, [pathname, reducedMotion]);

  useEffect(() => {
    if (!visible || !ready) return;
    const timeout = window.setTimeout(() => setVisible(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [ready, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-[var(--background)]/88 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.32 }}
        >
          <div className="grid place-items-center gap-4">
            <ThemedLottie
              light={brandIntro.light}
              dark={brandIntro.dark}
              shared={brandIntro.shared}
              fallbackSrc={brandIntro.fallback}
              loop={false}
              autoplay={ready}
              playOnView={false}
              className="aspect-square w-44"
              decorative
              onDataReady={() => setReady(true)}
              onComplete={() => setVisible(false)}
              onLoadStateChange={(state) => {
                if (state === "error") setVisible(false);
              }}
            />
            <div className="text-center">
              <p className="text-xl font-semibold">{profile.displayName}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{profile.role}</p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
