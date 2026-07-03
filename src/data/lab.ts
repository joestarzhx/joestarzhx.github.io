import { generatedLabPatches } from "@/generated/lab.generated";

const baseLabItems = [
  {
    title: "信封滚动动效",
    type: "GSAP 交互动效",
    year: "2026",
    description: "围绕信封打开、长信展开和章节进入节奏整理的滚动动画片段。",
    preview: "/images/lab/lab-gsap-envelope.webp",
  },
  {
    title: "历史时间轴",
    type: "ScrollTrigger 实验",
    year: "2026",
    description: "将年份、档案和叙事节点组合为连续阅读路径的时间轴设计。",
    preview: "/images/lab/lab-gsap-timeline.webp",
  },
  {
    title: "水墨转场",
    type: "视觉转场实验",
    year: "2026",
    description: "用水墨、纸纹和轻量遮罩组织古风页面之间的过渡。",
    preview: "/images/lab/lab-ink-transition.webp",
  },
  {
    title: "量子隧穿片段",
    type: "Manim 科普动画",
    year: "2026",
    description: "用于解释势垒、波函数和穿透概率关系的程序化动画片段。",
    preview: "/images/lab/lab-manim-quantum.webp",
  },
  {
    title: "统计可视化片段",
    type: "Manim 图形实验",
    year: "2026",
    description: "将抽象数据关系转化为可讲解镜头的图形动画练习。",
    preview: "/images/lab/lab-manim-statistics.webp",
  },
  {
    title: "Live2D 角色结构",
    type: "虚拟角色实验",
    year: "2026",
    description: "整理角色分层、表情状态和后续交互方向的视觉实验。",
    preview: "/images/lab/lab-live2d-character.webp",
  },
  {
    title: "AI 视觉筛选",
    type: "AI 工作流实验",
    year: "2026",
    description: "围绕角色一致性、构图筛选和后期优化整理的视觉流程。",
    preview: "/images/lab/lab-ai-visual.webp",
  },
  {
    title: "品牌 Lottie",
    type: "Lottie 动画实验",
    year: "2026",
    description: "为个人品牌标识和页面装饰准备的轻量动画片段。",
    preview: "/images/lab/lab-lottie-brand.webp",
    lottie: "/lottie/lab-demo.json",
  },
];

export const labItems = baseLabItems.map((item) => {
  const patch = generatedLabPatches.find((candidate) => candidate.title === item.title);
  if (!patch) return item;
  return {
    ...item,
    type: patch.type ?? item.type,
    year: patch.year ?? item.year,
    description: patch.description ?? item.description,
    preview: patch.preview ?? item.preview,
    demo: patch.demo,
    github: patch.github,
    video: patch.video,
    technologies: patch.technologies,
  };
});
