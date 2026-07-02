import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

export const metadata: Metadata = {
  title: "关于",
  description:
    "关于 Haoxuan Zhang（张颢轩）的创作方向、当前关注和联系入口。",
};

const statusCards = [
  [
    "正在进行",
    "持续完善个人博客，并整理交互式 H5、Manim 动画、AI 视觉与 Live2D 项目案例。",
  ],
  [
    "可交流方向",
    "个人网站、交互方案、网页动效、视觉叙事与科普动画。",
  ],
  [
    "创作原则",
    "少一点噪声，多一点结构；少一点炫技，多一点可用。",
  ],
];

export default function AboutPage() {
  return (
    <PageContainer>
      <section className="container-shell section-space-top">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
          <div className="contents lg:block">
            <div>
              <p className="mb-5 text-sm font-medium text-[var(--accent)]">
                About
              </p>
              <h1 className="text-[clamp(2.25rem,10vw,3.4rem)] font-semibold leading-[1.08] tracking-normal sm:text-6xl lg:text-7xl">
                我想做的，是让技术表达变得清楚、克制，但有记忆点。
              </h1>
              <p className="mt-6 max-w-[720px] text-base leading-8 text-[var(--text-body)] sm:text-lg">
                我关注前端工程、交互体验、视觉叙事和计算机图形表达。
              </p>
            </div>

            <div className="order-2 lg:hidden">
              <ProfileCard photo={profile.photo} />
            </div>

            <div className="order-3 mt-8 grid max-w-[760px] gap-6 text-base leading-[1.85] text-[var(--text-body)] sm:text-lg lg:mt-10">
              <p>
                这个网站既是作品集，也是持续更新的创作档案：记录项目、文章、实验，以及我对技术表达的理解。
              </p>
              <p>
                我喜欢把项目看成一段叙事：用户先看到什么，什么时候获得反馈，哪些信息应该安静地退后，哪些细节值得被强调。好的界面不需要一直解释自己，它应该让人自然地继续往下看。
              </p>
              <p>
                近期我关注前端动效系统、AI 视觉工作流、Manim 科普动画和 Live2D 展示。这些方向表面上分散，但核心都指向同一件事：把复杂内容变成更易理解、更有质感的数字作品。
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <ProfileCard photo={profile.photo} />
          </div>
        </div>
      </section>

      <section className="container-shell section-space-compact">
        <div className="grid gap-4 md:grid-cols-3">
          {statusCards.map(([title, text]) => (
            <div
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-5"
              key={title}
            >
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 leading-7 text-[var(--text-body)]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="container-shell section-space-bottom scroll-offset">
        <div className="rounded-[24px] border border-[var(--border)] p-6 sm:p-8">
          <h2 className="text-3xl font-semibold">合作与交流</h2>
          <p className="mt-4 max-w-2xl leading-8 text-[var(--text-body)]">
            欢迎通过这些公开主页了解我的项目与创作。
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
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
