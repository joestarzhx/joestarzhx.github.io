(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isHome = Boolean(document.querySelector(".hero#home"));
  const hero = document.querySelector(".hero#home");

  if (hero) {
    hero.classList.remove("phase1-ink-home");
  }

  function mountPetals() {
    if (!isHome) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    canvas.className = "phase1-petal-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const sprite = new Image();
    sprite.src = "./assets/phase1/peach_petals_sprites.png";

    let width = 0;
    let height = 0;
    let dpr = 1;
    let petals = [];
    let rafId = 0;
    let lastTime = performance.now();
    let pointerX = 0;
    let pointerY = 0;
    let pointerInfluence = 0;

    const spriteCells = [
      { x: 246, y: 112, w: 116, h: 232 },
      { x: 345, y: 18, w: 95, h: 148 },
      { x: 658, y: 70, w: 120, h: 188 },
      { x: 842, y: 280, w: 120, h: 116 },
      { x: 486, y: 596, w: 76, h: 90 },
      { x: 647, y: 567, w: 104, h: 68 },
      { x: 731, y: 654, w: 148, h: 78 },
      { x: 365, y: 733, w: 139, h: 169 },
    ];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function petalCount() {
      if (window.innerWidth < 600) return 4;
      if (window.innerWidth < 900) return 6;
      return 8;
    }

    function createPetal(resetAbove) {
      const cell = spriteCells[Math.floor(random(0, spriteCells.length))];
      const size = random(width < 600 ? 15 : 20, width < 600 ? 28 : 42);
      return {
        cell,
        x: random(-width * 0.08, width * 1.08),
        y: resetAbove ? random(-height * 0.42, -30) : random(-20, height),
        size,
        speed: random(10, 28),
        drift: random(10, 34),
        phase: random(0, Math.PI * 2),
        rotation: random(0, Math.PI * 2),
        rotateSpeed: random(-0.55, 0.55),
        opacity: random(0.58, 0.88),
      };
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = petalCount();
      if (petals.length > targetCount) {
        petals = petals.slice(0, targetCount);
      }
      while (petals.length < targetCount) {
        petals.push(createPetal(false));
      }
    }

    function drawPetal(petal, delta) {
      petal.phase += delta * 0.0012;
      petal.y += petal.speed * delta * 0.001;
      petal.x += Math.sin(petal.phase) * petal.drift * delta * 0.001;
      petal.rotation += petal.rotateSpeed * delta * 0.001;

      if (pointerInfluence > 0.01) {
        const dx = petal.x - pointerX;
        const dy = petal.y - pointerY;
        const distance = Math.max(80, Math.hypot(dx, dy));
        const push = Math.max(0, 1 - distance / 260) * pointerInfluence;
        petal.x += (dx / distance) * push * 28;
        petal.y += (dy / distance) * push * 10;
      }

      if (petal.y > height + 70 || petal.x < -120 || petal.x > width + 120) {
        Object.assign(petal, createPetal(true));
      }

      const drawWidth = petal.size;
      const drawHeight = petal.size * (petal.cell.h / petal.cell.w);
      context.save();
      context.globalAlpha = petal.opacity;
      context.translate(petal.x, petal.y);
      context.rotate(petal.rotation);
      context.drawImage(
        sprite,
        petal.cell.x,
        petal.cell.y,
        petal.cell.w,
        petal.cell.h,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight,
      );
      context.restore();
    }

    function tick(now) {
      const delta = Math.min(40, now - lastTime);
      lastTime = now;
      pointerInfluence *= 0.92;
      context.clearRect(0, 0, width, height);

      if (sprite.complete && sprite.naturalWidth) {
        petals.forEach((petal) => drawPetal(petal, delta));
      }

      rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      if (rafId || reducedMotion) return;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(tick);
    }

    function stop() {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerInfluence = 1;
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    resize();
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      mountPetals();
    }, { once: true });
  } else {
    mountPetals();
  }
}());
