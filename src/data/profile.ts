import { generatedProfile } from "@/generated/profile.generated";

export const profile = {
  name: "Haoxuan Zhang",
  photo: generatedProfile.photo ?? "/images/profile/profile-card-template.webp",
  chineseName: "张颢轩",
  displayName: "Haoxuan Zhang（张颢轩）",
  role: "Developer · Designer · Visual Creator",
  summary: generatedProfile.summary ?? "我用代码、动画与视觉设计，构建有表达力的数字作品。",
  englishSummary:
    "I build expressive digital experiences through code, motion and visual design.",
  bio: generatedProfile.bio ?? "我关注前端工程、交互体验、视觉叙事和计算机图形表达。这个网站既是作品集，也是持续更新的创作档案：记录项目、文章、实验和我对技术表达的理解。",
  location: generatedProfile.location ?? "China",
  status: generatedProfile.status ?? "正在整理前端动效、AI 视觉工作流、Manim 科普动画与 Live2D 项目。",
  education: generatedProfile.education ?? "软件工程 / 数字媒体技术方向",
  current: generatedProfile.current ?? "前端开发者与视觉创作者",
  exchange: generatedProfile.exchange,
  principles: generatedProfile.principles,
  advantages: [
    "工程实现与审美判断结合",
    "能把抽象概念拆成清晰界面",
    "重视性能、可访问性和长期维护",
  ],
};
