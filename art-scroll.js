(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  let brushLayer;

  function ensureBrushLayer() {
    if (brushLayer) return brushLayer;
    brushLayer = document.createElement("div");
    brushLayer.className = "art-brush-transition";
    brushLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(brushLayer);
    return brushLayer;
  }

  function playBrushSweep() {
    if (reducedMotion || coarsePointer) return;
    const layer = ensureBrushLayer();
    layer.classList.remove("is-active");
    document.body.classList.add("art-scroll-transitioning");
    window.requestAnimationFrame(() => layer.classList.add("is-active"));
    window.setTimeout(() => {
      layer.classList.remove("is-active");
      document.body.classList.remove("art-scroll-transitioning");
    }, 720);
  }

  function setupBrushLinks() {
    document.addEventListener("click", (event) => {
      const anchor = event.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (anchor.target || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      playBrushSweep();
    }, true);
  }

  function setupSectionReveal() {
    const sections = Array.from(document.querySelectorAll("main > section:not(.hero):not(.kurumi-page-hero)"));
    sections.forEach((section) => section.classList.add("art-scroll-reveal"));

    if (reducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    sections.forEach((section) => observer.observe(section));
  }

  function init() {
    setupSectionReveal();
    setupBrushLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
