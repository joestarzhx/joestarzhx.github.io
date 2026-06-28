(function () {
  "use strict";

  const works = [
    {
      title: "个人博客",
      category: "H5 与网页作品",
      description: "当前这座水墨江湖博客，包含文章、视频、留言、搜索、明暗主题与后台管理。",
      tech: ["HTML", "CSS", "JavaScript", "Supabase"],
      date: "2026-06",
      demo: "./index.html",
      source: "https://github.com/Herobrine-Z/personal-blog",
      cover: "./assets/ink-hero-desktop.webp",
    },
    {
      title: "胡桃绘卷",
      category: "AI 视觉实验",
      description: "以胡桃角色资料和站内素材组织的角色绘卷、人物志与水墨画廊。",
      tech: ["HTML", "CSS", "Lightbox"],
      date: "2026-06",
      demo: "./kurumi.html",
      source: "https://github.com/Herobrine-Z/personal-blog",
      cover: "./assets/kurumi-portrait-red-moon.png",
    },
    {
      title: "Live2D 桌宠小屋",
      category: "Live2D 与桌宠",
      description: "保留本地养成状态的互动桌宠页面，支持角色切换、动作反馈和 Live2D 回退图。",
      tech: ["Live2D", "PixiJS", "JavaScript"],
      date: "2026-06",
      demo: "./pet.html",
      source: "https://github.com/Herobrine-Z/personal-blog",
      cover: "./assets/hutao-entry-shanshui.png",
    },
  ];

  const logs = [
    {
      date: "2026-06-28",
      title: "第一轮 UI 与动效整理",
      description: "统一页面转场、点击反馈和动态显现逻辑，新增作品卷宗入口。",
    },
    {
      date: "2026-06",
      title: "桌宠小屋上线",
      description: "接入 Live2D 与本地养成状态，加入基础互动动作。",
    },
    {
      date: "2026-06",
      title: "文章与视频系统接入",
      description: "通过 Supabase 管理文章、视频、评论、留言与后台内容。",
    },
  ];

  const categories = ["全部", "H5 与网页作品", "Manim 与动画", "Live2D 与桌宠", "AI 视觉实验", "比赛项目"];
  const toolbar = document.querySelector("#worksToolbar");
  const grid = document.querySelector("#worksGrid");
  const logList = document.querySelector("#worksLogList");
  let active = "全部";

  function createWorkCard(work) {
    const card = document.createElement("article");
    card.className = "work-card reveal";

    const cover = document.createElement("div");
    cover.className = "work-cover";
    if (work.cover) {
      const image = document.createElement("img");
      image.src = work.cover;
      image.alt = "";
      image.loading = "lazy";
      cover.appendChild(image);
    } else {
      const mark = document.createElement("span");
      mark.textContent = "卷";
      cover.appendChild(mark);
    }

    const copy = document.createElement("div");
    copy.className = "work-copy";
    const category = document.createElement("small");
    category.textContent = work.category;
    const title = document.createElement("h2");
    title.textContent = work.title;
    const description = document.createElement("p");
    description.textContent = work.description;
    const tech = document.createElement("div");
    tech.className = "work-tech";
    work.tech.forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      tech.appendChild(chip);
    });
    const actions = document.createElement("div");
    actions.className = "work-actions";
    if (work.demo) {
      const demo = document.createElement("a");
      demo.href = work.demo;
      demo.textContent = "在线体验";
      actions.appendChild(demo);
    }
    if (work.source) {
      const source = document.createElement("a");
      source.href = work.source;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "源码";
      actions.appendChild(source);
    }

    copy.append(category, title, description, tech, actions);
    card.append(cover, copy);
    return card;
  }

  function renderWorks() {
    const filtered = active === "全部" ? works : works.filter((work) => work.category === active);
    grid.replaceChildren();
    if (!filtered.length) {
      const state = document.createElement("p");
      state.className = "works-state";
      state.textContent = "这个分类还没有可确认的公开作品，先把卷宗留在这里，等素材齐了再补。";
      grid.appendChild(state);
      return;
    }
    filtered.forEach((work) => grid.appendChild(createWorkCard(work)));
    grid.querySelectorAll(".reveal").forEach((node) => window.MotionCore?.revealInserted(node));
  }

  function renderToolbar() {
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = category;
      button.classList.toggle("active", category === active);
      button.addEventListener("click", () => {
        active = category;
        toolbar.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
        renderWorks();
      });
      toolbar.appendChild(button);
    });
  }

  function renderLogs() {
    logs.forEach((item) => {
      const article = document.createElement("article");
      article.className = "works-log-item reveal";
      article.innerHTML = `<time datetime="${item.date}">${item.date}</time><div><h3></h3><p></p></div>`;
      article.querySelector("h3").textContent = item.title;
      article.querySelector("p").textContent = item.description;
      logList.appendChild(article);
    });
  }

  renderToolbar();
  renderWorks();
  renderLogs();
}());
