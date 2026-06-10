const authPanel = document.querySelector("#authPanel");
const editorPanel = document.querySelector("#editorPanel");
const loginForm = document.querySelector("#loginForm");
const articleForm = document.querySelector("#articleForm");
const logoutButton = document.querySelector("#logoutButton");
const articleList = document.querySelector("#adminArticleList");
const commentList = document.querySelector("#adminCommentList");
const messageList = document.querySelector("#adminMessageList");
const commentCount = document.querySelector("#commentCount");
const messageCount = document.querySelector("#messageCount");
const existingAttachments = document.querySelector("#existingAttachments");
const editorTitle = document.querySelector("#editorTitle");
const statusElement = document.querySelector("#adminStatus");
const markdownPreview = document.querySelector("#markdownPreview");
const videoEditorFields = document.querySelector("#videoEditorFields");
const currentVideo = document.querySelector("#currentVideo");
const contentFieldLabel = document.querySelector("#contentFieldLabel");

let articles = [];
let comments = [];
let messages = [];
let editingArticle = null;
let workFilter = "all";

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("error", isError);
}

function switchPanel(panelId) {
  document.querySelectorAll(".admin-tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === panelId);
  });
  document.querySelectorAll("[data-admin-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTarget === panelId);
  });
}

function showEditor(session) {
  const owner = articleService.isOwner(session);
  authPanel.hidden = owner;
  editorPanel.hidden = !owner;
  return owner;
}

function selectedContentType() {
  return articleForm.elements.contentType.value;
}

function updateEditorMode() {
  const type = selectedContentType();
  const isVideo = type === "video";
  videoEditorFields.hidden = !isVideo;
  contentFieldLabel.textContent = isVideo ? "视频简介（Markdown）" : "正文（Markdown）";
  articleForm.elements.content.placeholder = isVideo
    ? "介绍视频内容、录制背景或精彩看点。"
    : "# 标题\n\n支持列表、引用、链接、图片、代码块与 LaTeX 公式。";
  if (!editingArticle) editorTitle.textContent = isVideo ? "新建视频" : "新建文章";
  articleForm.querySelector(".publish-button").textContent = editingArticle
    ? "保存修改"
    : isVideo ? "发布视频" : "发布文章";
}

function resetEditor(type = "article") {
  editingArticle = null;
  articleForm.reset();
  articleForm.elements.articleId.value = "";
  articleForm.elements.contentType.value = type;
  articleForm.elements.category.value = type === "video" ? "视频" : "随笔";
  articleForm.elements.published.value = "true";
  existingAttachments.hidden = true;
  existingAttachments.replaceChildren();
  currentVideo.hidden = true;
  currentVideo.textContent = "";
  updateEditorMode();
  renderMarkdownPreview();
}

function openNewWork(type) {
  resetEditor(type);
  switchPanel("editorWorkPanel");
  articleForm.elements.title.focus();
}

function renderExistingAttachments(article) {
  existingAttachments.replaceChildren();
  const attachments = article.attachments || [];
  existingAttachments.hidden = !attachments.length;
  if (!attachments.length) return;
  const heading = document.createElement("strong");
  heading.textContent = "已上传附件（勾选后保存将删除）";
  existingAttachments.appendChild(heading);
  attachments.forEach((file, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "removeAttachment";
    checkbox.value = String(index);
    const text = document.createElement("span");
    text.textContent = file.name;
    label.append(checkbox, text);
    existingAttachments.appendChild(label);
  });
}

function beginEdit(article) {
  editingArticle = article;
  articleForm.elements.articleId.value = article.id;
  articleForm.elements.contentType.value = article.content_type || "article";
  articleForm.elements.title.value = article.title;
  articleForm.elements.slug.value = article.slug;
  articleForm.elements.excerpt.value = article.excerpt;
  articleForm.elements.content.value = article.content;
  articleForm.elements.category.value = article.category || "随笔";
  articleForm.elements.tags.value = (article.tags || []).join(", ");
  articleForm.elements.published.value = String(article.published);
  articleForm.elements.scheduledAt.value = article.scheduled_at
    ? new Date(article.scheduled_at).toISOString().slice(0, 16)
    : "";
  articleForm.elements.videoUrl.value = article.video_url || "";
  articleForm.elements.videoPoster.value = article.video_poster || "";
  currentVideo.hidden = !article.video_url;
  currentVideo.textContent = article.video_url ? `当前视频：${article.video_name || article.video_url}` : "";
  editorTitle.textContent = `编辑${articleService.contentLabel(article)}`;
  renderExistingAttachments(article);
  updateEditorMode();
  renderMarkdownPreview();
  switchPanel("editorWorkPanel");
  articleForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderArticleList() {
  articleList.replaceChildren();
  const filtered = articles.filter((article) => workFilter === "all" || (article.content_type || "article") === workFilter);
  if (!filtered.length) {
    articleList.innerHTML = '<p class="article-state">当前分类还没有作品。</p>';
  } else {
    filtered.forEach((article) => {
      const row = document.createElement("article");
      row.className = "admin-article-row";
      const copy = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = article.title;
      const meta = document.createElement("p");
      meta.textContent = `${articleService.contentLabel(article)} · ${article.published ? "已发布" : "草稿"} · ${articleService.formatDate(article.updated_at)} · ${article.view_count || 0} 次浏览`;
      copy.append(title, meta);
      const actions = document.createElement("div");
      actions.className = "admin-row-actions";
      const viewLink = document.createElement("a");
      viewLink.className = "text-button";
      viewLink.href = articleService.articleUrl(article);
      viewLink.target = "_blank";
      viewLink.rel = "noopener";
      viewLink.textContent = "查看";
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "text-button";
      editButton.textContent = "编辑";
      editButton.addEventListener("click", () => beginEdit(article));
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "text-button danger";
      deleteButton.textContent = "删除";
      deleteButton.addEventListener("click", () => removeArticle(article, deleteButton));
      actions.append(viewLink, editButton, deleteButton);
      row.append(copy, actions);
      articleList.appendChild(row);
    });
  }
  const articleWorks = articles.filter((item) => (item.content_type || "article") === "article");
  const videoWorks = articles.filter((item) => item.content_type === "video");
  document.querySelector("#articleMetric").textContent = articleWorks.length;
  document.querySelector("#videoMetric").textContent = videoWorks.length;
  document.querySelector("#viewMetric").textContent = articles.reduce((sum, item) => sum + Number(item.view_count || 0), 0);
  document.querySelector("#reactionMetric").textContent = articles.reduce((sum, item) => sum + Number(item.like_count || 0), 0);
}

async function loadAdminArticles() {
  articleList.innerHTML = '<p class="article-state">正在读取作品……</p>';
  articles = await articleService.listAllArticles();
  renderArticleList();
}

function createModerationRow(item, type) {
  const row = document.createElement("article");
  row.className = "admin-moderation-row";
  const copy = document.createElement("div");
  const meta = document.createElement("p");
  const source = type === "comment"
    ? `《${item.articles?.title || "已删除作品"}》${item.articles?.content_type === "video" ? "视频" : "文章"}`
    : "主页留言";
  meta.textContent = `${item.visitor_name} · ${source} · ${articleService.formatDate(item.created_at)}`;
  const body = document.createElement("p");
  body.className = "admin-moderation-body";
  body.textContent = item.body;
  copy.append(meta, body);
  const actions = document.createElement("div");
  actions.className = "admin-row-actions";
  if (type === "comment") {
    const approvalButton = document.createElement("button");
    approvalButton.type = "button";
    approvalButton.className = "text-button";
    approvalButton.textContent = item.approved ? "隐藏" : "通过";
    approvalButton.addEventListener("click", async () => {
      approvalButton.disabled = true;
      try {
        await articleService.updateCommentApproval(item.id, !item.approved);
        await loadModerationContent();
        setStatus(item.approved ? "评论已隐藏。" : "评论已通过。");
      } catch (error) {
        setStatus(`操作失败：${error.message}`, true);
        approvalButton.disabled = false;
      }
    });
    actions.appendChild(approvalButton);
  }
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "text-button danger";
  deleteButton.textContent = "删除";
  deleteButton.addEventListener("click", () => type === "comment" ? removeComment(item, deleteButton) : removeMessage(item, deleteButton));
  actions.appendChild(deleteButton);
  row.append(copy, actions);
  return row;
}

function renderModerationLists() {
  commentList.replaceChildren();
  messageList.replaceChildren();
  commentCount.textContent = `${comments.length} 条`;
  messageCount.textContent = `${messages.length} 条`;
  document.querySelector("#pendingMetric").textContent = comments.filter((comment) => !comment.approved).length;
  if (!comments.length) commentList.innerHTML = '<p class="article-state">暂无评论。</p>';
  else comments.forEach((comment) => commentList.appendChild(createModerationRow(comment, "comment")));
  if (!messages.length) messageList.innerHTML = '<p class="article-state">暂无留言。</p>';
  else messages.forEach((message) => messageList.appendChild(createModerationRow(message, "message")));
}

async function loadModerationContent() {
  [comments, messages] = await Promise.all([articleService.listAllComments(), articleService.listMessages(100)]);
  renderModerationLists();
}

async function removeComment(comment, button) {
  if (!window.confirm(`确定删除 ${comment.visitor_name} 的这条评论吗？`)) return;
  button.disabled = true;
  try {
    await articleService.deleteComment(comment.id);
    if (comment.attachments?.length) await articleService.removeCommentFiles(comment.attachments).catch(() => {});
    await loadModerationContent();
    setStatus("评论已删除。");
  } catch (error) {
    setStatus(`删除评论失败：${error.message}`, true);
    button.disabled = false;
  }
}

async function removeMessage(message, button) {
  if (!window.confirm(`确定删除 ${message.visitor_name} 的这条留言吗？`)) return;
  button.disabled = true;
  try {
    await articleService.deleteMessage(message.id);
    await loadModerationContent();
    setStatus("留言已删除。");
  } catch (error) {
    setStatus(`删除留言失败：${error.message}`, true);
    button.disabled = false;
  }
}

async function removeArticle(article, button) {
  if (!window.confirm(`确定删除${articleService.contentLabel(article)}《${article.title}》吗？此操作无法撤销。`)) return;
  button.disabled = true;
  try {
    const commentAttachments = comments
      .filter((comment) => comment.article_id === article.id)
      .flatMap((comment) => comment.attachments || []);
    await articleService.deleteArticle(article.id);
    if (article.attachments?.length) await articleService.removeFiles(article.attachments).catch(() => {});
    if (article.video_path) await articleService.removeVideo({ path: article.video_path }).catch(() => {});
    if (commentAttachments.length) await articleService.removeCommentFiles(commentAttachments).catch(() => {});
    if (editingArticle?.id === article.id) resetEditor();
    await Promise.all([loadAdminArticles(), loadModerationContent()]);
    setStatus("作品已删除。");
  } catch (error) {
    setStatus(`删除失败：${error.message}`, true);
    button.disabled = false;
  }
}

async function loadOwnerConsole() {
  await Promise.all([loadAdminArticles(), loadModerationContent()]);
}

function renderMarkdownPreview() {
  markdownPreview.innerHTML = window.blogMarkdown.render(articleForm.elements.content.value);
  if (!markdownPreview.textContent.trim()) {
    markdownPreview.innerHTML = '<p class="article-state">预览会随内容输入实时更新。</p>';
  } else if (typeof window.renderMathInElement === "function") {
    window.renderMathInElement(markdownPreview, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: "$", right: "$", display: false },
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
      throwOnError: false,
    });
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector("button");
  button.disabled = true;
  try {
    const form = new FormData(loginForm);
    const { session } = await articleService.signIn(form.get("email").trim(), form.get("password"));
    if (!showEditor(session)) {
      await articleService.signOut();
      throw new Error("当前账号不是站长。");
    }
    loginForm.reset();
    await loadOwnerConsole();
    setStatus("登录成功。");
  } catch (error) {
    setStatus(`登录失败：${error.message}`, true);
  } finally {
    button.disabled = false;
  }
});

articleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = articleForm.querySelector(".publish-button");
  const form = new FormData(articleForm);
  const slug = form.get("slug").trim();
  const contentType = form.get("contentType");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    setStatus("网址标识只能包含小写字母、数字和连字符。", true);
    return;
  }
  const selectedVideo = articleForm.elements.videoFile.files[0];
  if (selectedVideo && (selectedVideo.size > 50 * 1024 * 1024 || !["video/mp4", "video/webm", "video/ogg"].includes(selectedVideo.type))) {
    setStatus("视频须为 MP4、WebM 或 OGG，且不超过 50 MB。", true);
    return;
  }
  if (contentType === "video" && !selectedVideo && !form.get("videoUrl").trim() && !editingArticle?.video_url) {
    setStatus("请上传视频或填写视频直链。", true);
    return;
  }

  button.disabled = true;
  setStatus("正在保存作品……");
  let newAttachments = [];
  let uploadedVideo = null;
  try {
    const session = await articleService.getSession();
    if (!session) throw new Error("登录已过期，请重新登录。");
    const files = [...articleForm.elements.attachments.files];
    newAttachments = files.length ? await articleService.uploadFiles(files, session.user.id) : [];
    if (selectedVideo) uploadedVideo = await articleService.uploadVideo(selectedVideo, session.user.id);

    const removedIndexes = new Set(form.getAll("removeAttachment").map(Number));
    const oldAttachments = editingArticle?.attachments || [];
    const removedAttachments = oldAttachments.filter((_, index) => removedIndexes.has(index));
    const attachments = oldAttachments.filter((_, index) => !removedIndexes.has(index)).concat(newAttachments);
    const scheduledAt = form.get("scheduledAt") ? new Date(form.get("scheduledAt")).toISOString() : null;
    const directVideoUrl = form.get("videoUrl").trim();
    const values = {
      title: form.get("title").trim(),
      slug,
      excerpt: form.get("excerpt").trim(),
      content: form.get("content").trim(),
      category: form.get("category").trim() || (contentType === "video" ? "视频" : "随笔"),
      tags: form.get("tags").split(/[,，]/).map((tag) => tag.trim()).filter(Boolean),
      attachments,
      content_type: contentType,
      video_url: contentType === "video" ? (uploadedVideo?.url || directVideoUrl || editingArticle?.video_url) : null,
      video_path: contentType === "video" ? (uploadedVideo?.path || editingArticle?.video_path || null) : null,
      video_name: contentType === "video" ? (uploadedVideo?.name || editingArticle?.video_name || null) : null,
      video_poster: contentType === "video" ? (form.get("videoPoster").trim() || articleService.firstImage({ attachments })?.url || null) : null,
      published: form.get("published") === "true",
      scheduled_at: scheduledAt,
      published_at: editingArticle?.published_at || scheduledAt || new Date().toISOString(),
    };
    const wasEditing = Boolean(editingArticle);
    const oldVideoPath = editingArticle?.video_path;
    const article = wasEditing
      ? await articleService.updateArticle(editingArticle.id, values)
      : await articleService.publishArticle({ ...values, author_id: session.user.id });
    if (removedAttachments.length) await articleService.removeFiles(removedAttachments).catch(() => {});
    if (uploadedVideo && oldVideoPath && oldVideoPath !== uploadedVideo.path) {
      await articleService.removeVideo({ path: oldVideoPath }).catch(() => {});
    }
    resetEditor(contentType);
    await loadAdminArticles();
    setStatus(wasEditing ? "作品修改已保存。" : values.published ? "作品已发布。" : "草稿已保存。");
    if (values.published && (!scheduledAt || new Date(scheduledAt) <= new Date())) {
      window.location.href = articleService.articleUrl(article);
    }
  } catch (error) {
    if (newAttachments.length) await articleService.removeFiles(newAttachments).catch(() => {});
    if (uploadedVideo) await articleService.removeVideo(uploadedVideo).catch(() => {});
    setStatus(`保存失败：${error.message}`, true);
  } finally {
    button.disabled = false;
  }
});

document.querySelectorAll("[data-admin-target]").forEach((button) => {
  button.addEventListener("click", () => switchPanel(button.dataset.adminTarget));
});
document.querySelectorAll("[data-new-work]").forEach((button) => {
  button.addEventListener("click", () => openNewWork(button.dataset.newWork));
});
document.querySelectorAll("[data-work-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    workFilter = button.dataset.workFilter;
    document.querySelectorAll("[data-work-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderArticleList();
  });
});
articleForm.elements.contentType.forEach((radio) => radio.addEventListener("change", updateEditorMode));
articleForm.elements.content.addEventListener("input", renderMarkdownPreview);
document.querySelector("#cancelEditButton").addEventListener("click", () => resetEditor(selectedContentType()));
logoutButton.addEventListener("click", async () => {
  await articleService.signOut();
  resetEditor();
  showEditor(null);
  setStatus("已退出登录。");
});

async function initialize() {
  if (!articleService.configured) {
    setStatus("请先在 supabase-config.js 中填写项目地址和 anon key。", true);
    loginForm.querySelector("button").disabled = true;
    return;
  }
  try {
    const session = await articleService.getSession();
    if (session && !showEditor(session)) {
      await articleService.signOut();
      setStatus("当前账号不是站长。", true);
      return;
    }
    if (session) await loadOwnerConsole();
  } catch (error) {
    setStatus(error.message, true);
  }
}

resetEditor();
initialize();
