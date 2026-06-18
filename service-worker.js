const CACHE_NAME = "hutao-blog-v39";
const APP_SHELL = [
  "./",
  "./index.html",
  "./articles.html",
  "./article.html",
  "./videos.html",
  "./kurumi.html",
  "./pet.html",
  "./styles.css",
  "./phase1-effects.css",
  "./phase2-effects.css",
  "./pet.css",
  "./article-pages.css",
  "./script.js",
  "./phase1-effects.js",
  "./phase2-effects.js",
  "./articles.js",
  "./article-detail.js",
  "./videos.js",
  "./article-service.js",
  "./markdown.js",
  "./theme.js",
  "./kurumi.js",
  "./pet-rig.js",
  "./pet.js",
  "./assets/vendor/live2dcubismcore.min.js",
  "./assets/vendor/pixi.min.js",
  "./assets/vendor/pixi-live2d-display.min.js",
  "./assets/models/HutaoSeethrough/seethrough_output.model3.json",
  "./assets/models/HutaoSeethrough/seethrough_output.moc3",
  "./assets/models/HutaoSeethrough/seethrough_output.physics3.json",
  "./assets/models/HutaoSeethrough/seethrough_output.cdi3.json",
  "./assets/models/HutaoSeethrough/seethrough_output.motionsync3.json",
  "./assets/models/HutaoSeethrough/seethrough_output.2048/texture_00.png",
  "./assets/models/Fireman/Fireman.model3.json",
  "./assets/models/Fireman/Fireman.moc3",
  "./assets/models/Fireman/Fireman.physics3.json",
  "./assets/models/Fireman/Fireman.cdi3.json",
  "./assets/models/Fireman/Fireman.motionsync3.json",
  "./assets/models/Fireman/Fireman.2048/texture_00.png",
  "./assets/models/Zhang/Zhang.model3.json",
  "./assets/models/Zhang/Zhang.moc3",
  "./assets/models/Zhang/Zhang.physics3.json",
  "./assets/models/Zhang/Zhang.cdi3.json",
  "./assets/models/Zhang/Zhang.2048/texture_00.png",
  "./assets/icon.png",
  "./assets/hutao-entry-shanshui.png",
  "./assets/ink-hero.png",
  "./assets/ink-scroll.png",
  "./assets/phase1/scroll_paper_full.png",
  "./assets/phase1/scroll_rod_left.png",
  "./assets/phase1/scroll_rod_right.png",
  "./assets/phase1/ink_splash_mask.png",
  "./assets/phase1/peach_petals_sprites.png",
  "./assets/phase1/ink_mountain_bg.png",
  "./assets/phase1/decor_corner_peach.png",
  "./assets/phase2/jianghu-bg.mp4",
  "./assets/kurumi-portrait-red-moon.png",
  "./assets/kurumi-tiger.png",
  "./assets/kurumi-spring-smile.png",
  "./assets/kurumi-mountains.png",
  "./assets/kurumi-vertical.png",
  "./assets/hutao.png",
  "./assets/live2d/reference_sheets/character_full_reference.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(APP_SHELL.map((asset) => cache.add(asset))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html"))),
  );
});
