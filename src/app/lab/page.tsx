import type { Metadata } from "next";
import { LabHorizontalShowcase } from "@/components/lab/LabHorizontalShowcase";
import { LottieDemo } from "@/components/lab/LottieDemo";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { labItems } from "@/data/lab";

export const metadata: Metadata = {
  title: "实验室",
  description: "收录仍在实验中的动效、图形、动画片段与交互方案。",
};

export default function LabPage() {
  return (
    <PageContainer>
      <section className="container-shell section-space min-w-0 max-w-full">
        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] xl:items-end">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="Lab"
              title="还没有定型的东西，也值得被认真摆放。"
              text="收录仍在实验中的动效、图形、动画片段与交互方案。"
              spacing="none"
              level={1}
            />
          </div>
          <div className="grid w-full min-w-0 max-w-full grid-cols-2 gap-3 justify-self-stretch rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 text-sm text-[var(--text-body)] xl:max-w-[400px] xl:justify-self-end">
            <strong className="text-3xl text-[var(--text-primary)]">08</strong>
            <span>个实验</span>
            <span>GSAP</span>
            <span>Lottie / Manim / Live2D</span>
          </div>
        </div>
        <div className="mt-10 grid min-w-0 gap-10">
          <LottieDemo />
          <LabHorizontalShowcase items={labItems} />
        </div>
      </section>
    </PageContainer>
  );
}
