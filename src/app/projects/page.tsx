import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectExplorer } from "@/components/project/ProjectExplorer";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "项目",
  description: "张颢轩的网页、动画、视觉设计与数字创作项目。",
};

export default function ProjectsPage() {
  return (
    <PageContainer>
      <section className="container-shell section-space">
        <div className="mb-8 grid gap-5 lg:max-w-3xl">
          <SectionHeading
            eyebrow="Projects"
            title="作品不是截图集合，而是问题、过程和结果。"
            text="按方向筛选项目，查看每个作品背后的设计目标、实现过程和技术方案。"
            spacing="none"
          />
        </div>
        <ProjectExplorer />
      </section>
    </PageContainer>
  );
}
