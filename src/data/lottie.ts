export type LottieItem = {
  key: string;
  name: string;
  description: string;
  shared?: string;
  light?: string;
  dark?: string;
  fallback: string;
  loop: boolean;
  speed: number;
  placement: string;
};

export const lottieItems: LottieItem[] = [
  {
    key: "brand-intro",
    name: "Brand Intro",
    description: "首页品牌开场与个人标识。",
    light: "/lottie/light/brand-intro.json",
    dark: "/lottie/dark/brand-intro.json",
    fallback: "/images/lottie-fallbacks/brand-intro-static.svg",
    loop: false,
    speed: 1,
    placement: "首页首次进入时的品牌开场",
  },
  {
    key: "hero-orbit",
    name: "Hero Orbit",
    description: "首页 Hero 区域的低干扰循环图形。",
    light: "/lottie/light/hero-orbit.json",
    dark: "/lottie/dark/hero-orbit.json",
    fallback: "/images/lottie-fallbacks/hero-orbit-static.svg",
    loop: true,
    speed: 0.72,
    placement: "首页 Hero 人物卡片装饰",
  },
  {
    key: "projects-stack",
    name: "Projects Stack",
    description: "项目区域标题旁的轻量图形。",
    light: "/lottie/light/projects-stack.json",
    dark: "/lottie/dark/projects-stack.json",
    fallback: "/images/lottie-fallbacks/projects-stack-static.svg",
    loop: false,
    speed: 0.9,
    placement: "仅用于首页精选项目标题区域",
  },
  {
    key: "resume-timeline",
    name: "Resume Timeline",
    description: "简历首屏与时间轴的辅助图形。",
    light: "/lottie/light/resume-timeline.json",
    dark: "/lottie/dark/resume-timeline.json",
    fallback: "/images/lottie-fallbacks/resume-timeline-static.svg",
    loop: false,
    speed: 0.9,
    placement: "动画素材预览或后续时间轴实验，正式 Resume 页面暂不使用",
  },
  {
    key: "article-writing",
    name: "Article Writing",
    description: "文章区域的写作状态图形。",
    light: "/lottie/light/article-writing.json",
    dark: "/lottie/dark/article-writing.json",
    fallback: "/images/lottie-fallbacks/article-writing-static.svg",
    loop: false,
    speed: 0.9,
    placement: "仅用于 Blog 页面 Hero",
  },
  {
    key: "lab-modules",
    name: "Lab Modules",
    description: "实验室模块的低速循环图形。",
    light: "/lottie/light/lab-modules.json",
    dark: "/lottie/dark/lab-modules.json",
    fallback: "/images/lottie-fallbacks/lab-modules-static.svg",
    loop: true,
    speed: 0.6,
    placement: "仅用于 Lab 页面 LottieDemo",
  },
  {
    key: "message-success",
    name: "Message Success",
    description: "联系成功状态动画。",
    light: "/lottie/light/message-success.json",
    dark: "/lottie/dark/message-success.json",
    fallback: "/images/lottie-fallbacks/message-success-static.svg",
    loop: false,
    speed: 1,
    placement: "状态动画素材，正式功能暂未使用",
  },
  {
    key: "lost-dot-404",
    name: "Lost Dot 404",
    description: "404 页面未找到状态动画。",
    light: "/lottie/light/lost-dot-404.json",
    dark: "/lottie/dark/lost-dot-404.json",
    fallback: "/images/lottie-fallbacks/lost-dot-404-static.svg",
    loop: true,
    speed: 0.65,
    placement: "404 页面",
  },
];

export function getLottieItem(key: string) {
  return lottieItems.find((item) => item.key === key);
}
