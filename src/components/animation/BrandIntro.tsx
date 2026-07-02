"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { getLottieItem } from "@/data/lottie";
import { profile } from "@/data/profile";

const brandIntro = getLottieItem("brand-intro")!;
const STORAGE_KEY = "haoxuan-brand-intro-played";
const LOAD_TIMEOUT_MS = 4500;
const FALLBACK_VISIBLE_MS = 1100;
const PLAY_TIMEOUT_MS = 5000;

type IntroState = "idle" | "loading" | "ready" | "playing" | "fallback" | "exiting" | "closed";

export function BrandIntro() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<IntroState>("idle");
  const loadTimerRef = useRef<number | null>(null);
  const playTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const hasMarkedPlayedRef = useRef(false);

  const clearTimer = useCallback((timerRef: MutableRefObject<number | null>) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearTimers = useCallback(() => {
    clearTimer(loadTimerRef);
    clearTimer(playTimerRef);
    clearTimer(fallbackTimerRef);
  }, [clearTimer]);

  const markPlayed = useCallback(() => {
    if (hasMarkedPlayedRef.current) return;
    window.sessionStorage.setItem(STORAGE_KEY, "true");
    hasMarkedPlayedRef.current = true;
  }, []);

  const closeIntro = useCallback(() => {
    clearTimers();
    setState("exiting");
  }, [clearTimers]);

  const showFallback = useCallback(() => {
    clearTimer(loadTimerRef);
    clearTimer(playTimerRef);
    setState("fallback");
    clearTimer(fallbackTimerRef);
    fallbackTimerRef.current = window.setTimeout(() => {
      markPlayed();
      closeIntro();
    }, reducedMotion ? 700 : FALLBACK_VISIBLE_MS);
  }, [clearTimer, closeIntro, markPlayed, reducedMotion]);

  useEffect(() => {
    if (pathname !== "/" || window.sessionStorage.getItem(STORAGE_KEY)) {
      const closeTimer = window.setTimeout(() => setState("closed"), 0);
      return () => window.clearTimeout(closeTimer);
    }

    hasMarkedPlayedRef.current = false;
    const startTimer = window.setTimeout(() => {
      setState(reducedMotion ? "fallback" : "loading");
    }, 0);

    if (reducedMotion) {
      fallbackTimerRef.current = window.setTimeout(() => {
        markPlayed();
        closeIntro();
      }, 800);
      return () => {
        window.clearTimeout(startTimer);
        clearTimers();
      };
    }

    loadTimerRef.current = window.setTimeout(showFallback, LOAD_TIMEOUT_MS);
    return () => {
      window.clearTimeout(startTimer);
      clearTimers();
    };
  }, [clearTimers, closeIntro, markPlayed, pathname, reducedMotion, showFallback]);

  useEffect(() => {
    const shouldLock = state === "loading" || state === "ready" || state === "playing" || state === "fallback";
    if (!shouldLock) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [state]);

  const visible = state !== "idle" && state !== "closed";
  const loadAnimatedLogo = state !== "fallback" && state !== "exiting" && state !== "closed";
  const showLottie = state === "ready" || state === "playing";

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[var(--z-intro)] grid place-items-center bg-[var(--background)]/94"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          onAnimationComplete={() => {
            if (state === "exiting") setState("closed");
          }}
          transition={{ duration: 0.32 }}
        >
          <div className="grid place-items-center gap-4">
            <motion.div
              className="aspect-square w-[150px] sm:w-48"
              animate={{ opacity: showLottie ? 1 : 0.96, scale: state === "fallback" ? 1 : 0.985 }}
              transition={{ duration: 0.28 }}
            >
              <ThemedLottie
                light={loadAnimatedLogo ? brandIntro.light : undefined}
                dark={loadAnimatedLogo ? brandIntro.dark : undefined}
                shared={loadAnimatedLogo ? brandIntro.shared : undefined}
                fallbackSrc={brandIntro.fallback}
                loop={false}
                autoplay
                eager
                playOnView={false}
                className="size-full"
                decorative
                onDataReady={() => {
                  clearTimer(loadTimerRef);
                  setState("ready");
                }}
                onPlayStarted={() => {
                  markPlayed();
                  setState("playing");
                  clearTimer(playTimerRef);
                  playTimerRef.current = window.setTimeout(closeIntro, PLAY_TIMEOUT_MS);
                }}
                onComplete={closeIntro}
                onLoadStateChange={(loadState) => {
                  if (loadState === "error") showFallback();
                }}
              />
            </motion.div>
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
