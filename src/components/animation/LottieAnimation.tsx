"use client";

import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { assetPath } from "@/lib/assets";
import { cn } from "@/lib/utils";

export type LottieAnimationProps = {
  src: string | string[];
  className?: string;
  contentClassName?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  fit?: "contain" | "cover";
  playOnView?: boolean;
  eager?: boolean;
  pauseWhenHidden?: boolean;
  ariaLabel?: string;
  decorative?: boolean;
  replayOnHover?: boolean;
  hideWhenReducedMotion?: boolean;
  preserveSpaceWhenHidden?: boolean;
  fallbackSrc?: string;
  onComplete?: () => void;
  onDOMLoaded?: () => void;
  onDataReady?: () => void;
  onDataFailed?: (error?: unknown) => void;
  onPlayStarted?: () => void;
  onLoadStateChange?: (state: "loading" | "success" | "error") => void;
};

type LottieData = Record<string, unknown>;

const lottieDataCache = new Map<string, LottieData>();
const lottiePromiseCache = new Map<string, Promise<LottieData>>();

function loadLottie(src: string) {
  const cachedData = lottieDataCache.get(src);
  if (cachedData) return Promise.resolve(cachedData);

  const cachedPromise = lottiePromiseCache.get(src);
  if (cachedPromise) return cachedPromise;

  const promise = fetch(src)
    .then((res) => {
      if (!res.ok) throw new Error(`Unable to load Lottie: ${src}`);
      return res.json() as Promise<LottieData>;
    })
    .then((json) => {
      lottieDataCache.set(src, json);
      lottiePromiseCache.delete(src);
      return json;
    })
    .catch((error) => {
      lottiePromiseCache.delete(src);
      throw error;
    });

  lottiePromiseCache.set(src, promise);
  return promise;
}

function StaticFallback({
  className,
  contentClassName,
  fallbackSrc,
  eager,
  title,
  decorative,
}: {
  className?: string;
  contentClassName?: string;
  fallbackSrc?: string;
  eager: boolean;
  title?: string;
  decorative: boolean;
}) {
  const semanticProps = decorative
    ? { "aria-hidden": "true" as const }
    : { role: "img" as const, "aria-label": title };

  if (fallbackSrc) {
    return (
      <div className={className} {...semanticProps}>
        <div className="relative size-full min-h-24">
          <Image
            src={fallbackSrc}
            alt=""
            fill
            priority={eager}
            sizes="240px"
            className={cn("object-contain", contentClassName)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className} {...semanticProps}>
      <div className="grid size-full min-h-24 place-items-center rounded-[20px] border border-[var(--border)] bg-[var(--surface-muted)]">
        <div className="relative aspect-square w-20 rounded-full border border-[var(--border)]">
          <span className="absolute inset-5 rounded-full border border-[var(--accent)] opacity-55" />
          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
        </div>
      </div>
    </div>
  );
}

export function LottieAnimation({
  src,
  className,
  contentClassName,
  loop = true,
  autoplay = true,
  speed = 1,
  fit = "contain",
  playOnView = true,
  eager = false,
  pauseWhenHidden = true,
  ariaLabel,
  decorative = true,
  replayOnHover = false,
  hideWhenReducedMotion = false,
  preserveSpaceWhenHidden = false,
  fallbackSrc,
  onComplete,
  onDOMLoaded,
  onDataReady,
  onDataFailed,
  onPlayStarted,
  onLoadStateChange,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const playStartedRef = useRef(false);
  const inView = useInView(containerRef, { margin: "-80px" });
  const reducedMotion = useReducedMotion();
  const [data, setData] = useState<LottieData | null>(null);
  const [failed, setFailed] = useState(false);
  const resolvedSources = useMemo(
    () =>
      (Array.isArray(src) ? src : [src])
        .filter(Boolean)
        .map((item) => assetPath(item)),
    [src],
  );
  const resolvedFallback = useMemo(
    () => (fallbackSrc ? assetPath(fallbackSrc) : undefined),
    [fallbackSrc],
  );
  const shouldLoad =
    (eager || !playOnView || inView) && resolvedSources.length > 0;
  const preserveAspectRatio =
    fit === "cover" ? "xMidYMid slice" : "xMidYMid meet";

  useEffect(() => {
    playStartedRef.current = false;
    const resetTimer = window.setTimeout(() => {
      setData(null);
      setFailed(false);
    }, 0);
    return () => window.clearTimeout(resetTimer);
  }, [resolvedSources]);

  useEffect(() => {
    if (!shouldLoad || reducedMotion) {
      if (!resolvedSources.length) {
        onLoadStateChange?.("error");
        onDataFailed?.(new Error("No Lottie source provided"));
      }
      return;
    }
    let cancelled = false;
    const resetFailedTimeout = window.setTimeout(() => {
      if (!cancelled) setFailed(false);
    }, 0);
    onLoadStateChange?.("loading");

    async function loadFirstAvailable() {
      let lastError: unknown;
      for (const candidate of resolvedSources) {
        try {
          const json = await loadLottie(candidate);
          if (!cancelled) {
            setData(json);
            onLoadStateChange?.("success");
          }
          return;
        } catch (error) {
          lastError = error;
          // Try the next candidate.
        }
      }
      if (!cancelled) {
        setFailed(true);
        onLoadStateChange?.("error");
        onDataFailed?.(lastError);
      }
    }

    loadFirstAvailable();

    return () => {
      cancelled = true;
      window.clearTimeout(resetFailedTimeout);
    };
  }, [
    onDataFailed,
    onLoadStateChange,
    reducedMotion,
    resolvedSources,
    shouldLoad,
  ]);

  useEffect(() => {
    lottieRef.current?.setSpeed(speed);
  }, [data, speed]);

  useEffect(() => {
    if (!pauseWhenHidden || !lottieRef.current) return;

    const syncVisibility = () => {
      if (document.hidden) lottieRef.current?.pause();
      else if ((!playOnView || inView) && autoplay) lottieRef.current?.play();
    };

    document.addEventListener("visibilitychange", syncVisibility);
    return () =>
      document.removeEventListener("visibilitychange", syncVisibility);
  }, [autoplay, inView, pauseWhenHidden, playOnView]);

  useEffect(() => {
    if (!data || !lottieRef.current || reducedMotion) return;

    if (autoplay && (!playOnView || inView)) {
      if (!playStartedRef.current) {
        lottieRef.current.goToAndPlay(0, true);
        playStartedRef.current = true;
        onPlayStarted?.();
      } else {
        lottieRef.current.play();
      }
    } else {
      lottieRef.current.pause();
    }
  }, [autoplay, data, inView, onPlayStarted, playOnView, reducedMotion]);

  if (reducedMotion && hideWhenReducedMotion) {
    return preserveSpaceWhenHidden ? (
      <div ref={containerRef} className={className} aria-hidden="true" />
    ) : null;
  }

  if (reducedMotion || failed || !data) {
    return (
      <div ref={containerRef}>
        <StaticFallback
          className={className}
          contentClassName={contentClassName}
          fallbackSrc={resolvedFallback}
          eager={eager}
          title={ariaLabel}
          decorative={decorative}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("lottie-container min-w-0 max-w-full", className)}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={!decorative ? ariaLabel : undefined}
      onMouseEnter={() => {
        if (replayOnHover) lottieRef.current?.goToAndPlay(0, true);
      }}
    >
      <Lottie
        className={contentClassName ?? "size-full"}
        style={{ width: "100%", height: "100%" }}
        rendererSettings={{
          preserveAspectRatio,
          progressiveLoad: false,
          hideOnTransparent: true,
        }}
        lottieRef={lottieRef}
        animationData={data}
        loop={loop}
        autoplay={autoplay && (!playOnView || inView)}
        onComplete={onComplete}
        onDOMLoaded={onDOMLoaded}
        onDataReady={onDataReady}
      />
    </div>
  );
}
