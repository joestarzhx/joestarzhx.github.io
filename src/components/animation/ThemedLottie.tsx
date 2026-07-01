"use client";

import { LottieAnimation, type LottieAnimationProps } from "@/components/animation/LottieAnimation";
import { useTheme } from "@/components/providers";

type ThemedLottieProps = Omit<LottieAnimationProps, "src"> & {
  light: string;
  dark: string;
  shared?: string;
};

export function ThemedLottie({ light, dark, shared, ...props }: ThemedLottieProps) {
  const { resolvedTheme } = useTheme();
  const preferred = resolvedTheme === "dark" ? dark : light;
  const sources = [preferred, shared].filter((item): item is string => Boolean(item));

  return <LottieAnimation key={sources.join("|")} src={sources} {...props} />;
}
