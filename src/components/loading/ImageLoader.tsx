"use client";

import { LottieAnimation } from "@/components/animation/LottieAnimation";
import { cn } from "@/lib/utils";

export function ImageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none grid size-full place-items-center", className)}
      aria-hidden="true"
    >
      <LottieAnimation
        src="/lottie/loading/image-loading.json"
        fallbackSrc="/lottie/fallback/image-loading-static.svg"
        className="size-[min(96px,35%)] min-h-14 min-w-14 max-h-36 max-w-36"
        decorative
      />
    </div>
  );
}
