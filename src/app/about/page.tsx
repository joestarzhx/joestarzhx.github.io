import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 Haoxuan Zhang（张颢轩）的创作方向、当前关注和联系入口。",
};

export default function AboutPage() {
  return (
    <PageContainer>
      <section className="container-shell section-space">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_260px] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-medium text-[var(--accent)]">
              About
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              我想做的，是让技术表达变得清楚、克制，但有记忆点。
            </h1>
            <div className="mt-10 grid max-w-[760px] gap-6 text-[17px] leading-[1.85] text-[var(--text-secondary)] sm:text-lg">
              <p>{profile.bio}</p>
              <p>
                我喜欢把项目看成一段叙事：用户先看到什么，什么时候获得反馈，哪些信息应该安静地退后，哪些细节值得被强调。好的界面不需要一直解释自己，它应该让人自然地继续往下看。
              </p>
              <p>
                近期我关注前端动效系统、AI 视觉工作流、Manim 科普动画和 Live2D
                角色展示。这些方向表面上很分散，但核心都指向同一件事：把复杂内容变成更易理解、更有质感的数字作品。
              </p>
            </div>
          </div>
          <ProfileCard photo={profile.photo} />
        </div>
      </section>

      <section className="container-shell section-space pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["正在进行", "整理个人项目、文章系统与实验室作品片段。"],
            ["可交流方向", "个人网站、交互方案、动效落地、视觉叙事。"],
            ["创作原则", "少一点噪声，多一点结构；少一点炫技，多一点可用。"],
          ].map(([title, text]) => (
            <div
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-6"
              key={title}
            >
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-4 leading-7 text-[var(--text-secondary)]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="container-shell section-space pt-0">
        <div className="rounded-[28px] border border-[var(--border)] p-8">
          <h2 className="text-3xl font-semibold">合作与交流</h2>
          <p className="mt-4 max-w-2xl leading-8 text-[var(--text-secondary)]">
            欢迎通过 GitHub、Bilibili 或抖音了解我的项目与创作。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map((social) => (
              <Button
                href={social.href}
                variant="secondary"
                key={social.label}
                ariaLabel={social.ariaLabel}
              >
                <social.icon size={16} />
                {social.label}
              </Button>
            ))}
            <Button href="/resume">
              简历入口 <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
