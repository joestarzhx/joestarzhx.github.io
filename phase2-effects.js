(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const transitionKey = "phase2WaterInkTransition";
  const videoSrc = "./assets/phase2/jianghu-bg.mp4";
  let transitionActive = false;
  let depthItems = [];
  let ticking = false;

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      /* sessionStorage may be unavailable in strict privacy contexts. */
    }
  }

  function safeSessionRemove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      /* sessionStorage may be unavailable in strict privacy contexts. */
    }
  }

  function setInkOrigin(x, y) {
    document.documentElement.style.setProperty("--phase2-ink-x", `${Math.round(x)}px`);
    document.documentElement.style.setProperty("--phase2-ink-y", `${Math.round(y)}px`);
  }

  function createInkLayer(mode) {
    const existing = document.querySelector(".phase2-water-ink");
    if (existing) existing.remove();

    const layer = document.createElement("div");
    layer.className = `phase2-water-ink ${mode}`;
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    return layer;
  }

  function playPageReveal() {
    const data = safeSessionGet(transitionKey);
    if (!data) return;
    safeSessionRemove(transitionKey);

    let point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    try {
      point = JSON.parse(data);
    } catch (error) {
      /* Fall back to center origin. */
    }

    setInkOrigin(point.x || window.innerWidth / 2, point.y || window.innerHeight / 2);
    const layer = createInkLayer("is-revealing");
    window.setTimeout(() => layer.remove(), reducedMotion ? 40 : 780);
  }

  function createRipple(x, y) {
    if (reducedMotion) return;
    const ripple = document.createElement("span");
    ripple.className = "phase2-click-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 760);
  }

  function normalizeUrl(anchor) {
    try {
      return new URL(anchor.href, window.location.href);
    } catch (error) {
      return null;
    }
  }

  function shouldTransition(anchor, url) {
    if (!anchor || !url || transitionActive) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.closest(".gallery-image-button, .lightbox-close")) return false;
    if (url.origin !== window.location.origin) return false;
    if (url.pathname.includes("admin.html")) return false;
    return true;
  }

  function transitionTo(anchor, event) {
    const url = normalizeUrl(anchor);
    if (!shouldTransition(anchor, url)) return;

    const samePage = url.pathname === window.location.pathname && url.search === window.location.search;
    const x = event.clientX || window.innerWidth / 2;
    const y = event.clientY || window.innerHeight / 2;
    const targetHash = samePage ? url.hash : "";

    if (samePage && (!targetHash || targetHash === window.location.hash)) {
      createRipple(x, y);
      return;
    }

    event.preventDefault();
    transitionActive = true;
    document.body.classList.add("phase2-transitioning");
    setInkOrigin(x, y);
    createRipple(x, y);
    const layer = createInkLayer("is-covering");
    const delay = reducedMotion ? 40 : 620;

    window.setTimeout(() => {
      if (targetHash) {
        const target = document.querySelector(decodeURIComponent(targetHash));
        if (target) {
          target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
          history.pushState(null, "", targetHash);
        }
        layer.classList.remove("is-covering");
        layer.classList.add("is-revealing");
        window.setTimeout(() => {
          layer.remove();
          transitionActive = false;
          document.body.classList.remove("phase2-transitioning");
        }, reducedMotion ? 40 : 720);
        return;
      }

      safeSessionSet(transitionKey, JSON.stringify({ x, y }));
      window.location.href = url.href;
    }, delay);
  }

  function setupTransitions() {
    document.addEventListener("click", (event) => {
      const action = event.target.closest("a, button");
      if (!action) return;

      if (action.tagName === "A") {
        transitionTo(action, event);
      } else {
        createRipple(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
      }
    });
  }

  function createVideoStage() {
    const stage = document.createElement("div");
    stage.className = "phase2-video-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = `<video src="${videoSrc}" muted loop playsinline autoplay preload="metadata"></video>`;
    return stage;
  }

  function createDepthStage() {
    const depth = document.createElement("div");
    depth.className = "phase2-depth";
    depth.setAttribute("aria-hidden", "true");
    const layers = [
      '<div class="phase2-depth__layer phase2-depth__layer--back" data-depth-speed="0.3"></div>',
      '<div class="phase2-depth__layer phase2-depth__layer--mid" data-depth-speed="0.6"></div>',
    ];
    if (window.innerWidth >= 760 && !coarsePointer) {
      layers.push('<div class="phase2-depth__layer phase2-depth__layer--front" data-depth-speed="1"></div>');
    }
    depth.innerHTML = layers.join("");
    return depth;
  }

  function enhanceHero(hero) {
    if (!hero || hero.dataset.phase2Enhanced === "true") return;
    hero.dataset.phase2Enhanced = "true";
    hero.classList.add("phase2-video-hero");
    hero.prepend(createDepthStage());
    hero.prepend(createVideoStage());
  }

  function setupVideoDepth() {
    enhanceHero(document.querySelector(".hero#home"));
    enhanceHero(document.querySelector(".kurumi-page-hero"));
    depthItems = Array.from(document.querySelectorAll(".phase2-depth__layer, .phase2-video-stage video")).map((element) => ({
      element,
      speed: Number(element.dataset.depthSpeed || (element.tagName === "VIDEO" ? 0.3 : 1)),
      host: element.closest(".hero, .kurumi-page-hero"),
    }));
    updateDepth();
  }

  function updateDepth() {
    ticking = false;
    if (reducedMotion) return;
    const viewportHeight = window.innerHeight || 1;

    depthItems.forEach((item) => {
      if (!item.host) return;
      const rect = item.host.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const travel = coarsePointer ? 22 : 58;
      const y = (clamped - 0.5) * travel * item.speed;
      const scale = item.element.tagName === "VIDEO" ? 1.04 + clamped * 0.018 : 1;
      item.element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
    });
  }

  function requestDepthUpdate() {
    if (ticking || reducedMotion) return;
    ticking = true;
    window.requestAnimationFrame(updateDepth);
  }

  function setupReveal() {
    const selectors = [
      "main > section",
      ".article-grid > *",
      ".home-video-grid > *",
      ".friend-group",
      ".achievement-cards > *",
      ".kurumi-art-card",
      ".kurumi-profile-card",
      ".page-title",
      ".article-filters",
      ".all-articles-grid",
      ".video-grid",
      ".article-detail-shell > *",
    ];

    const elements = Array.from(document.querySelectorAll(selectors.join(","))).filter((element) => {
      if (element.closest(".hero, .kurumi-page-hero")) return false;
      if (element.classList.contains("phase2-depth")) return false;
      return !element.classList.contains("phase2-reveal");
    });

    elements.forEach((element, index) => {
      element.classList.add("phase2-reveal");
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
  }

  function setupDynamicRevealForLoadedCards() {
    const containers = document.querySelectorAll("#latestArticles, #latestVideos, #articleList, #videoList, #relatedArticles, #commentList");
    if (!containers.length || reducedMotion || !("MutationObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    containers.forEach((container) => {
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches("article, a, figure, .article-card, .video-card, .comment-item")) {
              node.classList.add("phase2-reveal");
              observer.observe(node);
            }
            node.querySelectorAll?.("article, a, figure, .article-card, .video-card, .comment-item").forEach((child) => {
              child.classList.add("phase2-reveal");
              observer.observe(child);
            });
          });
        });
      });
      mutationObserver.observe(container, { childList: true, subtree: true });
    });
  }

  function init() {
    playPageReveal();
    setupTransitions();
    setupVideoDepth();
    setupReveal();
    setupDynamicRevealForLoadedCards();
    window.addEventListener("scroll", requestDepthUpdate, { passive: true });
    window.addEventListener("resize", requestDepthUpdate, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
