import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { getLottieItem } from "@/data/lottie";

export function LottieDemo() {
  const labModules = getLottieItem("lab-modules")!;

  return (
    <div className="grid w-full min-w-0 max-w-full gap-5 overflow-clip rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 sm:p-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(280px,1fr)] xl:items-center">
      <div className="relative flex h-[260px] min-w-0 max-w-full items-center justify-center overflow-clip rounded-[18px] bg-[var(--surface-muted)]/30 sm:h-[340px] lg:h-[420px]">
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
          className="h-full w-full min-w-0 max-w-[560px]"
        />
      </div>
      <div className="flex min-w-0 items-center justify-between gap-4 xl:px-3">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold">Lab Modules</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            将 Web、Motion、AI 与 Visual 四个创作方向组织成持续连接的实验系统。
          </p>
        </div>
      </div>
    </div>
  );
}
