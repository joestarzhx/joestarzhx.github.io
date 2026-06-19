(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  let depthItems = [];
  let ticking = false;

  function createDepthStage() {
    const depth = document.createElement("div");
    depth.className = "phase2-depth";
    depth.setAttribute("aria-hidden", "true");
    const layers = [
      '<div class="phase2-depth__layer phase2-depth__layer--far" data-depth-speed="0.2"></div>',
      '<div class="phase2-depth__layer phase2-depth__layer--mid" data-depth-speed="0.42"></div>',
      '<div class="phase2-depth__layer phase2-depth__layer--near" data-depth-speed="0.68"></div>',
      '<div class="phase2-depth__layer phase2-depth__layer--mist" data-depth-speed="0.86"></div>',
    ];
    depth.innerHTML = layers.join("");
    return depth;
  }

  function enhanceHero(hero) {
    if (!hero || hero.dataset.phase2Enhanced === "true") return;
    hero.dataset.phase2Enhanced = "true";
    hero.classList.add("phase2-gif-hero");
    hero.prepend(createDepthStage());
  }

  function setupVideoDepth() {
    enhanceHero(document.querySelector(".hero#home"));
    enhanceHero(document.querySelector(".kurumi-page-hero"));
    depthItems = Array.from(document.querySelectorAll(".phase2-depth__layer")).map((element) => ({
      element,
      speed: Number(element.dataset.depthSpeed || 1),
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
      const travel = coarsePointer ? 8 : 48;
      const y = (clamped - 0.5) * travel * item.speed;
      const scale = 1;
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
