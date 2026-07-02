"use client";

import Image, { type ImageProps } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ImageLoader } from "@/components/loading/ImageLoader";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion";

type ImageWithLoaderProps = Omit<ImageProps, "onLoad" | "onError"> & {
  containerClassName?: string;
};

export function ImageWithLoader({
  alt,
  className,
  containerClassName,
  ...props
}: ImageWithLoaderProps) {
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "relative grid size-full place-items-center overflow-hidden bg-[var(--surface-muted)]",
          containerClassName,
        )}
        aria-hidden="true"
      >
        <Image
          src="/lottie/fallback/image-loading-static.svg"
          alt=""
          width={96}
          height={96}
          className="size-24 opacity-80"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={cn("relative size-full overflow-hidden", containerClassName)}>
      <Image
        {...props}
        alt={alt}
        className={cn(
          className,
          "transition-[opacity,filter,transform] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          loaded
            ? "scale-100 opacity-100 blur-0"
            : reducedMotion
              ? "opacity-0"
              : "scale-[1.015] opacity-0 blur-[8px]",
        )}
        onLoad={async (event) => {
          try {
            await event.currentTarget.decode();
          } catch {
            // The image is already usable when decode is unavailable or races.
          }
          setLoaded(true);
        }}
        onError={() => setFailed(true)}
      />
      <AnimatePresence>
        {!loaded ? (
          <motion.div
            className="absolute inset-0 bg-[var(--surface-muted)]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : motionTokens.duration.normal }}
          >
            <ImageLoader />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
