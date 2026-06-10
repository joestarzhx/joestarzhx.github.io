# 虎桃不会振刀

一个水墨武侠风格的个人博客，使用原生 HTML、CSS 和 JavaScript 构建，并通过 GitHub Pages 发布。文章、视频、评论、留言、登录和附件存储由 Supabase 提供。

## 本地预览

直接打开 `index.html`，或在项目目录运行：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 配置网站数据

1. 创建一个 Supabase 项目。
2. 在 Authentication 的 Users 页面创建唯一的站长用户，关闭公开注册，并复制用户 UUID。
3. 检查 `supabase-schema.sql` 中的站长 UUID，然后在 Supabase SQL Editor 执行完整脚本。已有项目也需要重新执行，以添加作品类型、视频字段、视频存储桶、阅读与点赞、站点总访问量、评论楼层与审核字段。
4. 在 Supabase 的 Project Settings > API 中复制 Project URL 和 anon public key，填写到 `supabase-config.js`。
5. 部署后访问 `admin.html`，使用站长邮箱和密码登录，可管理文章和视频、上传不超过 50 MB 的视频、保存草稿、定时发布并管理评论。

文章正文支持 Markdown 与 KaTeX 数学公式。行内公式使用 `$E = mc^2$`，块级公式使用 `$$...$$`。

`anon key` 可以公开在前端；真正的文章管理权限由 `supabase-schema.sql` 中的 RLS 策略限制为唯一站长。评论附件仅在前端允许图片、TXT 和 PDF，单个不超过 5 MB；生产环境还应在 Supabase Storage 中配置相同的 MIME 限制。不要把 `service_role key` 写入本项目。

页边 AI 助手使用 DeepSeek 免费网页版的安全跳转方案：它会把包含当前页面上下文的问题复制到剪贴板，并打开 `chat.deepseek.com`。免费网页端没有可供静态站点直接调用的公开免密接口，因此本站不会在前端保存 DeepSeek 账号、Cookie 或 API Key。
