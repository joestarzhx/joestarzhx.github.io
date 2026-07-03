"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { getLottieItem } from "@/data/lottie";
import { profile } from "@/data/profile";

const brandIntro = getLottieItem("brand-intro")!;
const INTRO_SESSION_KEY = "haoxuan-blog-brand-intro-played";
const LEGACY_SESSION_KEY = "haoxuan-brand-intro-played";
const MAX_INTRO_DURATION = 3000;
const EXIT_DURATION = 240;

type IntroPhase = "checking" | "loading" | "playing" | "exiting" | "removed";
type CloseReason =
  | "complete"
  | "timeout"
  | "load-error"
  | "route-change"
  | "reduced-motion"
  | "already-played";

class BrandIntroBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function isHomePath(pathname: string | null) {
  return !pathname || pathname === "/";
}

export function BrandIntro() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const closedRef = useRef(false);
  const pathnameRef = useRef(pathname);

  const markPlayed = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      window.sessionStorage.setItem(LEGACY_SESSION_KEY, "true");
    } catch {
      // Storage failures must never keep the page behind the intro.
    }
  }, []);

  const removeImmediately = useCallback(() => {
    closedRef.current = true;
    setPhase("removed");
  }, []);

  const closeIntro = useCallback(
    (reason: CloseReason) => {
      if (closedRef.current) return;
      closedRef.current = true;
      markPlayed();

      if (reason === "already-played" || reason === "reduced-motion") {
        setPhase("removed");
        return;
      }

      setPhase("exiting");
    },
    [markPlayed],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isHomePath(pathname)) {
        removeImmediately();
        return;
      }

      if (reducedMotion) {
        closeIntro("reduced-motion");
        return;
      }

      try {
        const hasPlayed =
          window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1" ||
          window.sessionStorage.getItem(LEGACY_SESSION_KEY) === "true";
        if (hasPlayed) {
          closeIntro("already-played");
          return;
        }
      } catch {
        // Continue to play; unavailable storage is not a fatal condition.
      }

      setPhase((current) => (current === "checking" ? "loading" : current));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [closeIntro, pathname, reducedMotion, removeImmediately]);

  useEffect(() => {
    if (phase === "checking" || phase === "removed") return;

    const timer = window.setTimeout(() => {
      closeIntro("timeout");
    }, MAX_INTRO_DURATION);

    return () => window.clearTimeout(timer);
  }, [closeIntro, phase]);

  useEffect(() => {
    if (phase !== "exiting") return;

    const timer = window.setTimeout(() => {
      setPhase("removed");
    }, EXIT_DURATION + 100);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading" && phase !== "playing") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (pathnameRef.current !== pathname && phase !== "removed") {
      closeIntro("route-change");
    }
    pathnameRef.current = pathname;
  }, [closeIntro, pathname, phase]);

  const showOverlay = phase === "loading" || phase === "playing";

  if (phase === "checking" || phase === "removed") {
    return null;
  }

  return (
    <AnimatePresence
      initial={false}
      onExitComplete={() => {
        setPhase("removed");
      }}
    >
      {showOverlay ? (
        <motion.div
          className="fixed inset-0 z-[var(--z-intro)] grid place-items-center bg-[var(--background)]/94"
          role="status"
          aria-label="正在进入张颢轩的个人博客"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.01,
            transition: { duration: EXIT_DURATION / 1000, ease: [0.22, 1, 0.36, 1] },
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid place-items-center gap-4">
            <motion.div
              className="aspect-square w-[150px] sm:w-48"
              animate={{ opacity: phase === "playing" ? 1 : 0.96, scale: 0.985 }}
              transition={{ duration: 0.28 }}
            >
              <BrandIntroBoundary onError={() => closeIntro("load-error")}>
                <ThemedLottie
                  light={brandIntro.light}
                  dark={brandIntro.dark}
                  shared={brandIntro.shared}
                  fallbackSrc={brandIntro.fallback}
                  loop={false}
                  autoplay
                  eager
                  playOnView={false}
                  pauseWhenHidden={false}
                  className="size-full"
                  decorative
                  onDataReady={() => {
                    setPhase((current) => (current === "loading" ? "playing" : current));
                  }}
                  onDOMLoaded={() => {
                    setPhase((current) => (current === "loading" ? "playing" : current));
                  }}
                  onPlayStarted={() => {
                    setPhase((current) => (current === "loading" ? "playing" : current));
                  }}
                  onComplete={() => closeIntro("complete")}
                  onDataFailed={() => closeIntro("load-error")}
                  onLoadStateChange={(loadState) => {
                    if (loadState === "error") closeIntro("load-error");
                  }}
                />
              </BrandIntroBoundary>
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
