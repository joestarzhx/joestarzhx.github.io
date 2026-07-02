"use client";

import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { assetPath } from "@/lib/assets";

export type LottieAnimationProps = {
  src: string | string[];
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  playOnView?: boolean;
  pauseWhenHidden?: boolean;
  ariaLabel?: string;
  decorative?: boolean;
  replayOnHover?: boolean;
  hideWhenReducedMotion?: boolean;
  fallbackSrc?: string;
  onComplete?: () => void;
  onDOMLoaded?: () => void;
  onDataReady?: () => void;
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

function StaticFallback({ className, fallbackSrc, title }: { className?: string; fallbackSrc?: string; title?: string }) {
  if (fallbackSrc) {
    return (
      <div className={className} aria-hidden="true">
        <div className="relative size-full min-h-24">
          <Image src={fallbackSrc} alt={title ?? ""} fill sizes="240px" className="object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div className={className} aria-hidden="true">
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
  loop = true,
  autoplay = true,
  speed = 1,
  playOnView = true,
  pauseWhenHidden = true,
  ariaLabel,
  decorative = true,
  replayOnHover = false,
  hideWhenReducedMotion = false,
  fallbackSrc,
  onComplete,
  onDOMLoaded,
  onDataReady,
  onLoadStateChange,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const inView = useInView(containerRef, { margin: "-80px" });
  const reducedMotion = useReducedMotion();
  const [data, setData] = useState<LottieData | null>(null);
  const [failed, setFailed] = useState(false);
  const resolvedSources = useMemo(
    () => (Array.isArray(src) ? src : [src]).filter(Boolean).map((item) => assetPath(item)),
    [src],
  );
  const resolvedFallback = useMemo(() => (fallbackSrc ? assetPath(fallbackSrc) : undefined), [fallbackSrc]);
  const shouldLoad = (!playOnView || inView) && resolvedSources.length > 0;

  useEffect(() => {
    if (!shouldLoad || reducedMotion) {
      if (!resolvedSources.length) onLoadStateChange?.("error");
      return;
    }
    let cancelled = false;
    const resetFailedTimeout = window.setTimeout(() => {
      if (!cancelled) setFailed(false);
    }, 0);
    onLoadStateChange?.("loading");

    async function loadFirstAvailable() {
      for (const candidate of resolvedSources) {
        try {
          const json = await loadLottie(candidate);
          if (!cancelled) {
            setData(json);
            onLoadStateChange?.("success");
          }
          return;
        } catch {
          // Try the next candidate.
        }
      }
      if (!cancelled) {
        setFailed(true);
        onLoadStateChange?.("error");
      }
    }

    loadFirstAvailable();

    return () => {
      cancelled = true;
      window.clearTimeout(resetFailedTimeout);
    };
  }, [onLoadStateChange, reducedMotion, resolvedSources, shouldLoad]);

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
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, [autoplay, inView, pauseWhenHidden, playOnView]);

  useEffect(() => {
    if (!lottieRef.current || reducedMotion || !playOnView) return;
    if (inView && autoplay) lottieRef.current.play();
    else lottieRef.current.pause();
  }, [autoplay, inView, playOnView, reducedMotion]);

  if (reducedMotion && hideWhenReducedMotion) {
    return <div ref={containerRef} className={className} aria-hidden="true" />;
  }

  if (reducedMotion || failed || !data) {
    return (
      <div ref={containerRef}>
        <StaticFallback className={className} fallbackSrc={resolvedFallback} title={ariaLabel} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={!decorative ? ariaLabel : undefined}
      onMouseEnter={() => {
        if (replayOnHover) lottieRef.current?.goToAndPlay(0, true);
      }}
    >
      <Lottie
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
