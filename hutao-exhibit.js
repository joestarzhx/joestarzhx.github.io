(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function enhanceHero() {
    const hero = document.querySelector(".hero#home");
    if (!hero || hero.dataset.hutaoExhibitEnhanced === "true") return;
    hero.dataset.hutaoExhibitEnhanced = "true";
    hero.classList.remove("phase1-ink-home");

    const fog = document.createElement("div");
    fog.className = "hutao-fog-layer";
    fog.setAttribute("aria-hidden", "true");

    const leaves = document.createElement("div");
    leaves.className = "hutao-bamboo-leaves";
    leaves.setAttribute("aria-hidden", "true");

    const copy = hero.querySelector(".hero-copy");
    hero.insertBefore(fog, copy || null);
    hero.insertBefore(leaves, copy || null);
  }

  function setupHeroParallax() {
    const hero = document.querySelector(".hero#home");
    if (!hero || reducedMotion || !finePointer) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    function render() {
      frame = 0;
      hero.style.setProperty("--hutao-bg-x", `${targetX * 10}px`);
      hero.style.setProperty("--hutao-bg-y", `${targetY * 7}px`);
      hero.style.setProperty("--hutao-fog-x", `${targetX * -18}px`);
      hero.style.setProperty("--hutao-fog-y", `${targetY * -10}px`);
    }

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - 0.5;
      targetY = (event.clientY - rect.top) / rect.height - 0.5;
      if (!frame) frame = window.requestAnimationFrame(render);
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    });
  }

  function setupCardTilt() {
    if (reducedMotion || !finePointer) return;
    const selector = [
      ".article-card",
      ".home-video-card",
      ".achievement-cards article",
      ".friend-card",
      ".portal-card",
    ].join(",");

    document.addEventListener("pointermove", (event) => {
      const card = event.target.closest(selector);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--hutao-tilt-x", `${(-y * 1.4).toFixed(2)}deg`);
      card.style.setProperty("--hutao-tilt-y", `${(x * 1.4).toFixed(2)}deg`);
    }, { passive: true });

    document.addEventListener("pointerout", (event) => {
      const card = event.target.closest(selector);
      if (!card || card.contains(event.relatedTarget)) return;
      card.style.removeProperty("--hutao-tilt-x");
      card.style.removeProperty("--hutao-tilt-y");
    });
  }

  function setupStickyHeaderState() {
    const update = () => document.body.classList.toggle("is-scrolled", window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function init() {
    enhanceHero();
    setupHeroParallax();
    setupCardTilt();
    setupStickyHeaderState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
