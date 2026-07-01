# Haoxuan Zhang（张颢轩）Blog & Portfolio

一个基于 Next.js App Router 的个人博客与数字作品集，展示前端开发、交互动效、视觉设计、Manim 科普动画、AI 视觉创作与 Live2D 项目。

## 本地运行

```bash
npm install
npm run dev
```

默认地址：

```text
http://localhost:3000
```

发布前检查：

```bash
npm run lint
npm run build
```

## 页面

- `/` 首页
- `/projects` 项目列表与分类筛选
- `/projects/[slug]` 项目详情
- `/blog` 文章列表、分类、标签与搜索
- `/blog/[slug]` 文章详情、阅读进度和目录
- `/resume` 在线简历
- `/lab` 实验室
- `/about` 关于与联系入口
- `/lottie-preview` Lottie 动画预览
- `/robots.txt`、`/sitemap.xml` SEO 文件

## 内容位置

- 个人信息：`src/data/profile.ts`
- 社交链接：`src/data/socials.ts`
- 项目数据：`src/data/projects.ts`
- 文章数据：`src/data/posts.ts`
- 简历经历：`src/data/experience.ts`
- 技能与能力：`src/data/skills.ts`
- 实验室内容：`src/data/lab.ts`

## 资源位置

- 项目、文章和实验室图片：`public/images/`
- Lottie 文件：`public/lottie/`
- Manifest：`public/manifest.json`

## 部署

项目使用 `output: "export"` 生成静态站点。当前 GitHub Pages 配置从仓库根目录发布，因此每次发布前需要运行 `npm run build`，并将 `out/` 中的新静态文件同步到仓库根目录后提交。
