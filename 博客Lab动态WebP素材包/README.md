# 博客 Lab 动态 WebP 素材包

把 `public/images/lab/` 中的 8 个文件复制到博客项目的同名目录并覆盖即可。

这些文件名与 `src/data/lab.ts` 完全一致：
- lab-gsap-envelope.webp
- lab-gsap-timeline.webp
- lab-ink-transition.webp
- lab-manim-quantum.webp
- lab-manim-statistics.webp
- lab-live2d-character.webp
- lab-ai-visual.webp
- lab-lottie-brand.webp

规格：480×360、4:3、18 帧、循环动态 WebP。

注意：当前 `src/app/lab/page.tsx` 对普通项目使用 `.slice(0, 4)`，所以页面只显示前 4 张普通卡片。要展示全部素材，需要移除或调整该限制。
