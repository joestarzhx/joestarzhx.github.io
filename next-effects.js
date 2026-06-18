(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  let ticking = false;
  let progressDot;

  function createProgress() {
    if (coarsePointer) return;
    const progress = document.createElement("div");
    progress.className = "next-scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = '<span class="next-scroll-progress__dot"></span>';
    document.body.appendChild(progress);
    progressDot = progress.querySelector(".next-scroll-progress__dot");
    updateProgress();
  }

  function updateProgress() {
    ticking = false;
    if (!progressDot) return;
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.max(0, Math.min(1, window.scrollY / scrollable));
    progressDot.style.top = `${ratio * 100}%`;
  }

  function requestProgressUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }

  function scatterPetals(target) {
    if (reducedMotion || coarsePointer) return;
    const rect = target.getBoundingClientRect();
    const count = 5;
    for (let index = 0; index < count; index += 1) {
      const petal = document.createElement("i");
      petal.className = "next-hover-petal";
      petal.style.left = `${rect.left + Math.random() * rect.width}px`;
      petal.style.top = `${rect.top + Math.random() * Math.min(rect.height, 120)}px`;
      petal.style.setProperty("--petal-x", `${(Math.random() - 0.5) * 86}px`);
      petal.style.setProperty("--petal-y", `${-18 - Math.random() * 54}px`);
      document.body.appendChild(petal);
      window.setTimeout(() => petal.remove(), 820);
    }
  }

  function setupHoverPetals() {
    if (coarsePointer) return;
    const selectors = ".article-card, .home-video-card, .achievement-cards article, .friend-card, .guestbook-list article";
    document.addEventListener("pointerenter", (event) => {
      const target = event.target.closest(selectors);
      if (target) scatterPetals(target);
    }, true);
  }

  function init() {
    createProgress();
    setupHoverPetals();
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
