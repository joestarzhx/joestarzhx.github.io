"use client";

import { LottieAnimation } from "@/components/animation/LottieAnimation";
import { cn } from "@/lib/utils";

type PageContentLoaderProps = {
  className?: string;
  label?: string;
  showLabel?: boolean;
};

export function PageContentLoader({
  className,
  label = "正在准备内容",
  showLabel = true,
}: PageContentLoaderProps) {
  return (
    <div
      className={cn(
        "grid min-h-[240px] place-items-center px-6 py-12 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <LottieAnimation
          src="/lottie/loading/page-content-loading.json"
          fallbackSrc="/lottie/fallback/page-content-loading-static.svg"
          className="size-24 sm:size-28"
          decorative
        />
        {showLabel ? (
          <p className="text-[13px] leading-6 text-[var(--text-secondary)] sm:text-sm">
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
}
