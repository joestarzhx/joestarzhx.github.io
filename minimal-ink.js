(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  let ticking = false;

  function updateHeroTitleParallax() {
    ticking = false;
    if (reducedMotion || coarsePointer) return;
    const hero = document.querySelector(".hero#home");
    const copy = document.querySelector(".hero-copy");
    if (!hero || !copy) return;
    const rect = hero.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    if (rect.bottom < 0 || rect.top > viewport) return;
    const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
    const y = (progress - 0.5) * 34 * 0.8;
    copy.style.setProperty("--minimal-title-y", `${y.toFixed(2)}px`);
  }

  function requestHeroTitleParallax() {
    if (ticking || reducedMotion || coarsePointer) return;
    ticking = true;
    window.requestAnimationFrame(updateHeroTitleParallax);
  }

  function setupInkPosition() {
    const selector = ".article-card, .home-video-card, .achievement-cards article, .friend-card";
    document.addEventListener("pointermove", (event) => {
      const card = event.target.closest(selector);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--minimal-ink-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--minimal-ink-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
  }

  function init() {
    setupInkPosition();
    updateHeroTitleParallax();
    window.addEventListener("scroll", requestHeroTitleParallax, { passive: true });
    window.addEventListener("resize", requestHeroTitleParallax, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
