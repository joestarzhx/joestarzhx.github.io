(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const veil = document.createElement("div");
  veil.className = "ink-page-transition";
  veil.setAttribute("aria-hidden", "true");
  document.body.prepend(veil);

  document.body.classList.add("page-motion-entering");
  window.setTimeout(() => {
    document.body.classList.remove("page-motion-entering");
  }, reducedMotion ? 20 : 440);

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (anchor.target || anchor.hasAttribute("download")) return;

    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;

    const sameDocument = url.pathname === location.pathname && url.search === location.search;
    if (sameDocument && url.hash) return;
    if (sameDocument) return;

    event.preventDefault();
    document.body.classList.add("page-motion-leaving");
    window.setTimeout(() => {
      location.href = url.href;
    }, reducedMotion ? 10 : 320);
  });
}());
