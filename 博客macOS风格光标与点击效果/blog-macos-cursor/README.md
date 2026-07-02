# macOS 风格博客光标与点击效果

这套效果按照当前博客设计变量制作：

- macOS 风格黑色箭头与白色描边
- 悬停链接、按钮和交互卡片时出现克制的暗红圆环
- 点击时箭头轻微压缩，并产生 420ms 暗红脉冲
- 不使用持续粒子、大面积模糊或高开销跟随动画
- 仅在支持 hover 且使用精细指针的桌面设备启用
- 触屏设备与 `prefers-reduced-motion` 自动关闭
- 输入框和可编辑文本保留系统 I-beam 光标

## 接入

1. 将 `src/components/effects/BlogCursor.tsx` 放入项目同名目录。
2. 把 `cursor-effects.css` 追加到 `src/app/globals.css`。
3. 在 `src/app/layout.tsx` 导入：

```tsx
import { BlogCursor } from "@/components/effects/BlogCursor";
```

4. 在 `<Providers>` 内加入 `<BlogCursor />`，建议放在 `<BrandIntro />` 后、`<Header />` 前。

## 特殊组件

自动识别普通链接与按钮。特殊自定义组件可添加：

```html
data-cursor="interactive"
```

需要系统文本光标的区域可添加：

```html
data-cursor="text"
```

箭头轮廓经过重新绘制，保持 macOS 指针的熟悉比例，但不是直接复制系统资源。博客品牌色只用于悬停和点击反馈。
