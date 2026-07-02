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
    placement: "首页首次进入",
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
    placement: "首页首屏姓名侧后方",
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
    placement: "首页精选项目、Projects 页面顶部",
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
    placement: "Resume 页面首屏",
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
    placement: "首页最新文章、Blog 页面 Hero",
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
    placement: "Lab 页面首屏",
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
    placement: "Lottie 预览页",
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
    placement: "not-found.tsx",
  },
];

export function getLottieItem(key: string) {
  return lottieItems.find((item) => item.key === key);
}
