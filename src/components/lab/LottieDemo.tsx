import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { getLottieItem } from "@/data/lottie";

export function LottieDemo() {
  const labModules = getLottieItem("lab-modules")!;

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 sm:p-5">
      <div className="relative flex h-[300px] items-center justify-center rounded-[18px] bg-[var(--surface-muted)]/30 sm:h-[380px] lg:h-[500px] xl:h-[540px]">
        <ThemedLottie
          light={labModules.light}
          dark={labModules.dark}
          shared={labModules.shared}
          fallbackSrc={labModules.fallback}
          loop
          speed={labModules.speed}
          fit="contain"
          ariaLabel="实验室模块动画"
          decorative={false}
          replayOnHover
          className="h-full w-full max-w-[560px]"
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Lab Modules</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            低速循环，进入视口播放，离开视口暂停，桌面端悬停可重播。
          </p>
        </div>
      </div>
    </div>
  );
}
