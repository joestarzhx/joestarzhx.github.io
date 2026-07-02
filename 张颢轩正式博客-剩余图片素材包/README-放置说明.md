# 张颢轩正式博客：剩余图片素材包

本压缩包不包含你已经准备好的五组项目图片和个人形象照，包含以下剩余素材：

## 可直接使用

- `public/images/branding/site-og-cover.webp`
- `public/images/branding/favicon-512.png`
- `public/images/branding/apple-touch-icon.png`
- `public/images/branding/brand-mark.svg`
- `public/images/profile/profile-card-template.webp`
- `public/images/posts/` 下 5 张文章封面
- `public/images/lab/` 下 8 张实验室预览图
- `public/images/lottie-fallbacks/` 下 8 个静态 SVG 回退图

## 使用方式

将压缩包中的 `public` 文件夹合并到博客项目根目录的 `public` 文件夹。

### 个人形象照

你已经准备了个人形象照。建议另存为：

`public/images/profile/profile-avatar.webp`

建议尺寸：1200 × 1200，WebP，sRGB。

`profile-card-template.webp` 是可选模板。可以在图像软件中把个人形象照放入左侧灰色区域，也可以直接让网页使用 `profile-avatar.webp`，不必使用模板。

### 文章封面

文章封面是统一品牌风格的抽象封面，可以直接使用。以后若希望更真实，可以用对应项目截图替换，但不要更改文件名。

### 实验室预览图

实验室图片为统一视觉缩略图，可直接使用。若你已有更准确的动画截图，可以按相同文件名覆盖。

### Lottie 静态回退

用于：

- `prefers-reduced-motion`
- Lottie JSON 加载失败
- 主题文件不存在

请在 `src/data/lottie.ts` 或 Lottie 配置中把每个动画关联到对应 SVG。

## 色彩

- 雾白：`#F5F5F7`
- 墨黑：`#1D1D1F`
- 暗红：`#8F1D2C`
- 深色背景：`#0B0B0D`
