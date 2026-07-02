# 张颢轩个人博客｜加载 Lottie 动画包

## 文件

- `lottie/page-content-loading.json`
  - 用于页面主要内容（不含图片）尚未准备完成时
  - 视觉：不完整墨环、轨道光点、三行内容骨架
  - 推荐显示尺寸：桌面端 160–220px，移动端 120–160px
  - 3 秒无缝循环

- `lottie/image-loading.json`
  - 用于单张图片尚未完全加载时
  - 视觉：圆角图片框、山形线稿、扫描线、加载节拍点
  - 推荐铺满图片容器或居中显示 72–140px
  - 3 秒无缝循环

- `fallback/*.svg`
  - 加载失败、关闭动画或 `prefers-reduced-motion` 时使用

- `preview.html`
  - 双动画预览页
  - 直接打开即可；Lottie 播放库通过 CDN 加载

## 推荐接入逻辑

### 页面主体

只覆盖内容区域，不覆盖导航。主体数据加载完成后，使用 180–260ms 的 opacity 过渡替换动画。

### 图片

Lottie 应放在图片容器内部，保持与最终图片相同的宽高比。图片触发 `onLoad` / `onLoadingComplete` 后淡出动画并淡入图片，避免容器高度跳变。

## lottie-react 示例

```tsx
import Lottie from "lottie-react";
import pageLoading from "@/public/lottie/page-content-loading.json";
import imageLoading from "@/public/lottie/image-loading.json";

<Lottie
  animationData={pageLoading}
  loop
  aria-hidden
  className="size-36 md:size-48"
/>
```

## 性能建议

- 相同 JSON 全局缓存，只请求一次。
- 离开视口或页面不可见时暂停。
- `prefers-reduced-motion: reduce` 时显示 SVG 静态回退。
- 动画层只使用 SVG Shape，不含字体、位图、表达式或模糊滤镜。
