import type { Metadata } from "next";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { LottieDemo } from "@/components/lab/LottieDemo";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectImage } from "@/components/project/ProjectImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLottieItem } from "@/data/lottie";
import { labItems } from "@/data/lab";

export const metadata: Metadata = {
  title: "实验室",
  description: "收录尚在实验中的动效、图形、动画片段与交互方案。",
};

export default function LabPage() {
  const labModules = getLottieItem("lab-modules")!;

  return (
    <PageContainer>
      <section className="container-shell section-space">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-end">
          <SectionHeading
            eyebrow="Lab"
            title="还没有定型的东西，也值得被认真摆放。"
            text="收录尚在实验中的动效、图形、动画片段与交互方案。"
          />
          <ThemedLottie
            light={labModules.light}
            dark={labModules.dark}
            shared={labModules.shared}
            fallbackSrc={labModules.fallback}
            loop
            speed={labModules.speed}
            className="pointer-events-none mx-auto aspect-square w-[150px] lg:ml-auto lg:w-72"
            decorative
            hideWhenReducedMotion
          />
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <LottieDemo />
          <div className="grid gap-5 sm:grid-cols-2">
            {labItems
              .filter((item) => !item.lottie)
              .slice(0, 4)
              .map((item) => (
                <article className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-4" key={item.title}>
                  <ProjectImage
                    src={item.preview}
                    alt={`${item.title} 实验预览`}
                    title={item.title}
                    sizes="(max-width: 768px) 50vw, 280px"
                    className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[var(--surface-muted)]"
                    imageClassName="object-cover"
                  />
                  <p className="mt-4 text-sm text-[var(--text-secondary)]">
                    {item.type} · {item.year}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
                </article>
              ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
