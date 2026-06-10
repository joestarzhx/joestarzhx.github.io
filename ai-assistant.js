(function () {
  const deepSeekUrl = "https://chat.deepseek.com/";
  const root = document.createElement("aside");
  root.className = "ai-assistant";
  root.innerHTML = `
    <button class="ai-assistant-toggle" type="button" aria-expanded="false" aria-controls="aiAssistantPanel">
      <span aria-hidden="true">AI</span><span class="sr-only">打开 AI 小助手</span>
    </button>
    <section class="ai-assistant-panel" id="aiAssistantPanel" hidden>
      <header>
        <div><small>DeepSeek Web</small><strong>页边小助手</strong></div>
        <button type="button" data-ai-close aria-label="关闭">×</button>
      </header>
      <div class="ai-assistant-messages" aria-live="polite">
        <p class="ai-message assistant">我可以整理当前页面的问题，并带你前往 DeepSeek 免费网页版继续对话。</p>
      </div>
      <form>
        <label class="sr-only" for="aiAssistantInput">输入问题</label>
        <textarea id="aiAssistantInput" rows="3" maxlength="1200" placeholder="例如：总结这篇作品，或帮我写一条评论……" required></textarea>
        <button class="ink-button" type="submit">交给 DeepSeek</button>
      </form>
      <p class="ai-assistant-note">为保护账号安全，问题会复制到剪贴板，再打开 DeepSeek 官网。</p>
    </section>`;
  document.body.appendChild(root);

  const toggle = root.querySelector(".ai-assistant-toggle");
  const panel = root.querySelector(".ai-assistant-panel");
  const form = root.querySelector("form");
  const input = root.querySelector("textarea");
  const messages = root.querySelector(".ai-assistant-messages");

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    root.classList.toggle("open", open);
    if (open) input.focus();
  }

  function pageContext() {
    const heading = document.querySelector("main h1, main h2")?.textContent?.trim() || document.title;
    const description = document.querySelector('meta[name="description"]')?.content || "";
    return `我正在浏览“${heading}”（${location.href}）。${description ? `页面简介：${description}` : ""}`;
  }

  async function copyAndOpen(prompt) {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = prompt;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    const message = document.createElement("p");
    message.className = "ai-message assistant";
    message.textContent = "问题已复制。DeepSeek 打开后直接粘贴发送即可。";
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    window.open(deepSeekUrl, "_blank", "noopener,noreferrer");
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  root.querySelector("[data-ai-close]").addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    const userMessage = document.createElement("p");
    userMessage.className = "ai-message user";
    userMessage.textContent = question;
    messages.appendChild(userMessage);
    input.value = "";
    await copyAndOpen(`${pageContext()}\n\n我的问题：${question}`);
  });
})();
