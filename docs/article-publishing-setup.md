# 免费文章发布功能部署说明

本项目已经采用最简单的免费方案：

- GitHub Pages 托管正式网站。
- GitHub Actions 自动构建并发布网站。
- Decap CMS 提供 `/admin/` 文章编辑后台。
- Cloudflare Workers 免费层提供 GitHub 登录所需的 OAuth 代理。

这个方案不需要数据库、不需要服务器，也不需要额外付费服务。管理员在网页后台发布文章后，Decap CMS 会把文章作为 Markdown 文件提交到 GitHub 仓库，GitHub Actions 随后自动重新部署网站。

## 项目中已经完成的部分

- 文章内容目录：`content/posts`
- 文章封面上传目录：`public/images/posts`
- 管理后台入口：`public/admin/index.html`
- 管理后台配置：`public/admin/config.yml`
- GitHub Pages 自动部署流程：`.github/workflows/deploy-pages.yml`
- Cloudflare OAuth Worker：`tools/decap-oauth-worker`

## 你需要完成的部分

### 1. 创建 GitHub OAuth App

打开 GitHub：

`Settings` -> `Developer settings` -> `OAuth Apps` -> `New OAuth App`

填写：

- Application name：`joestarzhx blog admin`
- Homepage URL：`https://joestarzhx.github.io`
- Authorization callback URL：先填 `https://你的-worker-域名/callback`

如果还不知道 Worker 域名，可以先临时填写一个，部署 Worker 后再回来改成真实地址。

创建后保存这两个值：

- Client ID
- Client Secret

不要把 Client Secret 提交到 GitHub。

### 2. 登录 Cloudflare Wrangler

进入 OAuth Worker 目录：

```bash
cd tools/decap-oauth-worker
npm install
npx wrangler login
```

浏览器会打开 Cloudflare 登录页面。登录后授权 Wrangler。

### 3. 写入 Worker 密钥

继续在 `tools/decap-oauth-worker` 目录执行：

```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

第一次粘贴 GitHub OAuth App 的 `Client ID`，第二次粘贴 `Client Secret`。

项目已经在 `wrangler.toml` 中限制：

- 只允许 GitHub 用户 `joestarzhx` 登录。
- 只允许正式网站 `https://joestarzhx.github.io` 调用。

### 4. 部署 OAuth Worker

```bash
npm run deploy
```

部署成功后，Cloudflare 会输出 Worker 地址，例如：

`https://joestarzhx-blog-oauth.<你的账号>.workers.dev`

然后回到 GitHub OAuth App，把 Authorization callback URL 改成：

`https://joestarzhx-blog-oauth.<你的账号>.workers.dev/callback`

### 5. 更新 Decap CMS 配置

打开：

`public/admin/config.yml`

把这一行：

```yaml
base_url: https://replace-with-your-oauth-worker.example.workers.dev
```

替换为你的 Worker 地址，例如：

```yaml
base_url: https://joestarzhx-blog-oauth.<你的账号>.workers.dev
```

注意这里不要带 `/callback`。

修改后提交并推送到 GitHub，或者直接让 Codex 帮你提交。

### 6. 确认 GitHub Pages 设置

打开仓库：

`Settings` -> `Pages`

确认 Source 选择的是：

`GitHub Actions`

### 7. 使用后台发布文章

部署完成后访问：

`https://joestarzhx.github.io/admin/`

使用 GitHub 账号 `joestarzhx` 登录。之后可以在后台新建文章、上传封面、保存草稿或发布文章。

发布后的流程是：

1. Decap CMS 提交 Markdown 和图片到 GitHub。
2. GitHub Actions 自动构建。
3. GitHub Pages 自动更新正式网站。

## 常见问题

### 后台打不开 GitHub 登录

检查 `public/admin/config.yml` 里的 `base_url` 是否已经替换为真实 Worker 地址。

### 登录后提示权限问题

确认使用的是 GitHub 用户 `joestarzhx`。当前 Worker 配置只允许这个账号登录。

### 登录成功但文章没有更新

打开 GitHub 仓库的 `Actions` 页面，查看最近一次部署是否成功。

### 上传图片后路径不对

文章封面会上传到：

`public/images/posts`

文章中引用路径应类似：

`/images/posts/example.webp`
