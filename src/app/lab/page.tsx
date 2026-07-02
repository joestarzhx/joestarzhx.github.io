import type { Metadata } from "next";
import { LabHorizontalShowcase } from "@/components/lab/LabHorizontalShowcase";
import { LottieDemo } from "@/components/lab/LottieDemo";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { labItems } from "@/data/lab";

export const metadata: Metadata = {
  title: "实验室",
  description: "收录尚在实验中的动效、图形、动画片段与交互方案。",
};

export default function LabPage() {
  return (
    <PageContainer>
      <section className="container-shell section-space">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <SectionHeading
            eyebrow="Lab"
            title="还没有定型的东西，也值得被认真摆放。"
            text="收录尚在实验中的动效、图形、动画片段与交互方案。"
            spacing="none"
          />
          <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 text-sm text-[var(--text-secondary)]">
            <strong className="text-3xl text-[var(--text-primary)]">08</strong>
            <span>个实验</span>
            <span>GSAP</span>
            <span>Lottie / Manim / Live2D</span>
          </div>
        </div>
        <div className="mt-12 grid gap-12">
          <LottieDemo />
          <LabHorizontalShowcase items={labItems} />
        </div>
      </section>
    </PageContainer>
  );
}
