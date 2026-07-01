export type ProjectCategory =
  | "Web 与 H5"
  | "比赛作品"
  | "Manim 与科普动画"
  | "Live2D 与虚拟角色"
  | "AI 影像与视觉设计";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  year: string;
  cover: string;
  featured: boolean;
  tags: string[];
  responsibilities: string[];
  background: string;
  goals: string[];
  process: string[];
  challenges: string[];
  results: string[];
  gallery: string[];
  demo?: string;
};

export type PostCategory = "项目复盘" | "视觉设计" | "物理与数学";

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: PostCategory;
  tags: string[];
  date?: string;
  cover: string;
  featured: boolean;
  headings: string[];
  body: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export type Experience = {
  time: string;
  title: string;
  place: string;
  description: string;
  points: string[];
};
