import type { Project, ProjectCategory } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "next-generation-letter",
    title: "下一代，来信了",
    subtitle: "以信件为叙事线索的红岩主题交互式 H5 作品",
    description:
      "以信件、档案、历史时间轴与城市空间为叙事元素，通过滚动动画和交互场景组织红岩主题内容。",
    category: "比赛作品",
    year: "2026",
    demo: "https://kurimi-hutao.github.io/next-generation-letter/",
    cover: "/images/projects/next-letter/project-next-letter-cover.webp",
    featured: true,
    tags: ["H5", "GSAP", "ScrollTrigger", "Narrative Design", "Responsive"],
    responsibilities: [
      "叙事结构设计",
      "UI 与视觉设计",
      "前端实现",
      "GSAP 动画",
      "移动端适配",
      "素材整合与性能优化",
    ],
    background:
      "作品以跨越时间的信件为主要叙事线索，通过档案影像、诗歌、城市路线和历史节点，让用户在连续滚动和互动中理解人物、时代与当下之间的联系。",
    goals: [
      "让历史内容形成连续、可感知的叙事",
      "避免页面成为单纯的史料堆叠",
      "使用动画强化信息关系而不是进行无意义装饰",
      "保证手机端也能完整体验主要内容",
    ],
    process: [
      "设计信封打开与长信展开动画",
      "制作 1949-2026 时间轴",
      "制作档案照片显影效果",
      "制作铁窗向桥索转换的视觉隐喻",
      "制作城市路线和结尾长信动画",
      "优化图片、字体和移动端布局",
    ],
    challenges: [
      "信封展开动画存在图层穿模风险",
      "大量历史图片会增加首屏加载时间",
      "手机端文字容易与背景或图片重叠",
      "滚动动画需要兼顾节奏和用户控制权",
    ],
    results: [
      "完成可在线访问的交互式 H5 作品",
      "建立完整的滚动叙事结构",
      "完成桌面端与移动端适配",
      "将档案、信件、城市与时间轴整合为统一体验",
    ],
    gallery: [
      "/images/projects/next-letter/project-next-letter-envelope.webp",
      "/images/projects/next-letter/project-next-letter-timeline.webp",
      "/images/projects/next-letter/project-next-letter-archive.webp",
      "/images/projects/next-letter/project-next-letter-mobile.webp",
      "/images/projects/next-letter/project-next-letter-ending.webp",
    ],
  },
  {
    slug: "ink-personal-blog",
    title: "古风个人博客",
    subtitle: "水墨武侠视觉与现代网页交互结合的个人博客",
    description:
      "以水墨山水、卷轴展开、雾气层次和现代响应式布局构建的个人博客，在古风视觉语言中保留清晰的信息结构与移动端可用性。",
    category: "Web 与 H5",
    year: "2026",
    demo: "https://kurimi-hutao.github.io/personal-blog/",
    cover: "/images/projects/ink-blog/project-ink-blog-cover.webp",
    featured: true,
    tags: ["Responsive", "Ink Style", "Motion", "GitHub Pages"],
    responsibilities: ["信息架构", "页面视觉设计", "前端实现", "动效设计", "移动端适配", "GitHub Pages 部署"],
    background:
      "传统个人博客通常采用通用卡片和文章列表结构，我希望尝试一种更具个人风格的表达方式，将水墨、卷轴和留白等古风视觉元素融入现代网页，同时避免视觉效果影响内容阅读。",
    goals: [
      "建立具有辨识度的个人视觉语言",
      "保持文章与项目内容清晰可读",
      "在桌面端和移动端保持一致体验",
      "控制背景、毛玻璃和动画的性能消耗",
    ],
    process: [
      "规划首页、项目、文章和角色展示结构",
      "制作水墨背景、雾气、竹叶和宣纸等视觉素材",
      "使用 CSS、Motion 和 GSAP 完成卷轴与页面转场",
      "优化移动端文字、图片和导航布局",
      "使用 GitHub Pages 完成静态部署",
    ],
    challenges: [
      "动态背景容易降低文字对比度",
      "毛玻璃会导致中文字体显得模糊",
      "移动端动画与固定元素容易产生抖动",
      "大体积素材会影响国内网络环境下的加载速度",
    ],
    results: [
      "完成可在线访问的古风个人博客",
      "建立统一的水墨视觉素材体系",
      "完成桌面端与移动端响应式适配",
      "保留接入文章和角色内容的扩展结构",
    ],
    gallery: [
      "/images/projects/ink-blog/project-ink-blog-desktop.webp",
      "/images/projects/ink-blog/project-ink-blog-mobile.webp",
      "/images/projects/ink-blog/project-ink-blog-navigation.webp",
      "/images/projects/ink-blog/project-ink-blog-detail.webp",
    ],
  },
  {
    slug: "quantum-tunneling-animation",
    title: "量子隧穿科普动画",
    subtitle: "用 Manim 与视觉动画解释微观粒子穿越势垒",
    description:
      "围绕量子隧穿的基本概念、发现历史与实际应用，使用程序化动画建立势垒、波函数和隧穿概率之间的视觉关系。",
    category: "Manim 与科普动画",
    year: "2026",
    cover: "/images/projects/quantum/project-quantum-cover.webp",
    featured: true,
    tags: ["Manim", "Physics", "Animation", "Science Communication"],
    responsibilities: ["脚本结构", "概念拆解", "动画分镜", "画面设计", "资料核验"],
    background:
      "量子隧穿很容易被误解为粒子像小球一样直接穿墙。这个动画项目希望用势垒、波函数和概率分布的关系，把抽象理论转化为更谨慎的视觉理解。",
    goals: [
      "区分经典直觉与量子描述",
      "避免用过度拟人或错误比喻解释概念",
      "让公式关系在画面中逐步出现",
      "保持科普表达的准确性和可观看性",
    ],
    process: [
      "梳理势垒、波函数和概率密度的表达顺序",
      "用 Manim 搭建坐标轴、势垒和波形变化",
      "制作穿透前后概率分布的对照画面",
      "补充扫描隧道显微镜等应用示意",
      "校对术语和画面隐喻的边界",
    ],
    challenges: [
      "波函数不能被简单画成普通水波",
      "动画要在直观和准确之间保持平衡",
      "公式过多会削弱观看节奏",
    ],
    results: [
      "形成一套可继续扩展的量子概念动画结构",
      "建立势垒和概率关系的核心视觉片段",
      "为后续科普视频脚本和讲解页面提供素材基础",
    ],
    gallery: [
      "/images/projects/quantum/project-quantum-wave.webp",
      "/images/projects/quantum/project-quantum-barrier.webp",
      "/images/projects/quantum/project-quantum-application.webp",
    ],
  },
  {
    slug: "live2d-character",
    title: "Live2D 虚拟角色",
    subtitle: "面向虚拟主播与实体桌宠的角色分层和交互设计",
    description:
      "围绕虚拟角色的面部、发型、服装、表情和身体结构进行分层设计，并为后续 Live2D 建模、表情切换与实体桌宠交互保留结构。",
    category: "Live2D 与虚拟角色",
    year: "2026",
    cover: "/images/projects/live2d/project-live2d-cover.webp",
    featured: true,
    tags: ["Live2D", "Character Design", "Interaction", "Layering"],
    responsibilities: ["角色设定", "分层设计", "表情规划", "交互状态整理"],
    background:
      "虚拟角色不仅是立绘展示，还需要兼顾后续建模、动作绑定和多场景交互。这个项目把角色设计拆成可维护的层级结构，为 Live2D 和实体桌宠方向提供基础。",
    goals: [
      "保证角色风格统一",
      "让面部、服装和发型层级适合后续建模",
      "为表情切换和交互状态留下清晰接口",
    ],
    process: [
      "确定角色气质和视觉关键词",
      "拆分头发、五官、服装和身体层级",
      "整理表情状态和动作需求",
      "根据桌宠与虚拟主播场景调整可动范围",
    ],
    challenges: [
      "视觉细节和可动层级需要互相让位",
      "表情状态要避免重复和语义不清",
      "后续建模需要更严格的命名和图层管理",
    ],
    results: [
      "完成角色主视觉和关键表情方向",
      "形成可用于 Live2D 建模的分层思路",
      "为实体桌宠交互准备状态设计基础",
    ],
    gallery: [
      "/images/projects/live2d/project-live2d-character.webp",
      "/images/projects/live2d/project-live2d-layers.webp",
      "/images/projects/live2d/project-live2d-expressions.webp",
    ],
  },
  {
    slug: "ai-visual-workflow",
    title: "AI 视觉创作工作流",
    subtitle: "角色一致性、视觉筛选与后期优化的完整创作流程",
    description:
      "围绕角色一致性、提示词约束、构图筛选、背景融合与后期优化，整理可重复使用的 AI 视觉创作流程。",
    category: "AI 影像与视觉设计",
    year: "2026",
    cover: "/images/projects/ai-visual/project-ai-visual-cover.webp",
    featured: false,
    tags: ["AI Workflow", "Visual Design", "Curation", "Post Production"],
    responsibilities: ["视觉方向", "提示词约束", "素材筛选", "后期优化", "流程整理"],
    background:
      "AI 图像生成的关键不只是输入提示词，而是持续判断哪些结果能服务角色、场景和叙事。这个项目把筛选、修正和后期步骤整理成可复用流程。",
    goals: [
      "减少随机生成带来的风格漂移",
      "建立角色和场景一致性判断标准",
      "让 AI 视觉产出能进入实际页面或视频流程",
    ],
    process: [
      "制定角色关键词和负面约束",
      "批量生成并按构图、光线和一致性筛选",
      "处理背景融合和局部修正",
      "整理适合网页展示的图片尺寸和文件结构",
    ],
    challenges: [
      "角色一致性需要多轮筛选",
      "局部细节容易出现不可用瑕疵",
      "不同用途对比例和清晰度要求不同",
    ],
    results: [
      "形成一套可复用的 AI 视觉筛选流程",
      "建立角色、背景和展示图的分类方式",
      "沉淀适合博客和作品集使用的图片素材",
    ],
    gallery: [
      "/images/projects/ai-visual/project-ai-workflow.webp",
      "/images/projects/ai-visual/project-ai-character.webp",
      "/images/projects/ai-visual/project-ai-gallery.webp",
    ],
  },
];

export const projectCategories: Array<"全部" | ProjectCategory> = [
  "全部",
  ...Array.from(new Set(projects.map((project) => project.category))),
];
