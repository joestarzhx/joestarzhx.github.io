import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { getLottieItem } from "@/data/lottie";

export function LottieDemo() {
  const labModules = getLottieItem("lab-modules")!;

  return (
    <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-5 overflow-clip rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 sm:p-5 md:grid-cols-[minmax(0,0.95fr)_minmax(280px,1.05fr)] md:items-center md:gap-8">
      <div className="relative flex min-h-[220px] min-w-0 max-w-full items-center justify-center overflow-hidden rounded-[18px] bg-[var(--surface-muted)]/30 p-5 sm:min-h-[250px] md:min-h-[320px] md:p-7 lg:min-h-[340px]">
        <div className="mx-auto aspect-square w-[min(68vw,220px)] max-w-[220px] md:w-full md:max-w-[320px]">
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
            className="h-full w-full min-w-0"
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center md:px-2">
        <div className="min-w-0 max-w-xl">
          <h3 className="text-[clamp(1.125rem,2vw,1.5rem)] font-semibold leading-tight">
            Lab Modules
          </h3>
          <p className="mt-3 text-[0.95rem] leading-[1.7] text-[var(--text-secondary)] sm:text-base">
            将 Web、Motion、AI 与 Visual 四个创作方向组织成持续连接的实验系统。
          </p>
        </div>
      </div>
    </div>
  );
}
