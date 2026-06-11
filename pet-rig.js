(() => {
  "use strict";

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (edge0, edge1, value) => {
    const amount = clamp((value - edge0) / (edge1 - edge0));
    return amount * amount * (3 - 2 * amount);
  };

  function distanceToSegment(x, y, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    const amount = lengthSquared ? clamp(((x - x1) * dx + (y - y1) * dy) / lengthSquared) : 0;
    return Math.hypot(x - (x1 + dx * amount), y - (y1 + dy * amount));
  }

  function rotatePoint(x, y, cx, cy, angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: cx + dx * cosine - dy * sine,
      y: cy + dx * sine + dy * cosine,
    };
  }

  class HutaoRig {
    constructor(host, faceRoot, options = {}) {
      this.host = host;
      this.faceRoot = faceRoot;
      this.reducedMotion = Boolean(options.reducedMotion);
      this.motion = true;
      this.dragging = false;
      this.ready = false;
      this.mesh = null;
      this.vertexBuffer = null;
      this.baseVertices = null;
      this.actionTimeline = null;
      this.idleClock = 0;
      this.pointer = { x: 0, y: 0 };
      this.pose = {
        headX: 0,
        headY: 0,
        headRotation: 0,
        headScaleX: 1,
        headScaleY: 1,
        bodyRotation: 0,
        bodyX: 0,
        bodyY: 0,
        leftArm: 0,
        rightArm: 0,
        leftLeg: 0,
        rightLeg: 0,
        bounce: 0,
        squash: 0,
        blink: 0,
        gazeX: 0,
        gazeY: 0,
        mouth: 0,
        cheeks: 0,
      };
    }

    static async create(host, faceRoot, options) {
      const rig = new HutaoRig(host, faceRoot, options);
      await rig.init();
      return rig;
    }

    async init() {
      if (!window.PIXI || !this.host) return this;

      try {
        this.app = new PIXI.Application({
          resizeTo: this.host,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          powerPreference: "high-performance",
        });
        this.host.appendChild(this.app.view);
        const texture = await PIXI.Assets.load("./assets/hutao.png");
        this.textureWidth = texture.width;
        this.textureHeight = texture.height;
        this.mesh = new PIXI.SimplePlane(texture, 17, 25);
        this.vertexBuffer = this.mesh.geometry.getBuffer("aVertexPosition");
        this.baseVertices = new Float32Array(this.vertexBuffer.data);
        this.app.stage.addChild(this.mesh);
        this.resize();
        this.app.renderer.on("resize", () => this.resize());
        this.app.ticker.add(() => this.tick(this.app.ticker.deltaMS / 1000));
        this.host.closest(".pet-rig")?.classList.add("rig-ready");
        this.ready = true;
      } catch (error) {
        console.warn("胡桃网格骨骼初始化失败，已使用原图回退。", error);
      }
      return this;
    }

    resize() {
      if (!this.mesh || !this.app) return;
      const scale = Math.min(
        this.app.screen.width / this.textureWidth,
        this.app.screen.height / this.textureHeight,
      );
      this.mesh.scale.set(scale);
      this.mesh.x = (this.app.screen.width - this.textureWidth * scale) / 2;
      this.mesh.y = (this.app.screen.height - this.textureHeight * scale) / 2;
    }

    setMotion(enabled) {
      this.motion = enabled;
      if (!enabled) this.stop();
    }

    setDragging(dragging) {
      this.dragging = dragging;
    }

    trackPointer(clientX, clientY) {
      const rect = this.host.getBoundingClientRect();
      this.pointer.x = clamp((clientX - rect.left) / rect.width, 0, 1) * 2 - 1;
      this.pointer.y = clamp((clientY - rect.top) / rect.height, 0, 1) * 2 - 1;
    }

    resetPose() {
      Object.assign(this.pose, {
        headX: 0,
        headY: 0,
        headRotation: 0,
        headScaleX: 1,
        headScaleY: 1,
        bodyRotation: 0,
        bodyX: 0,
        bodyY: 0,
        leftArm: 0,
        rightArm: 0,
        leftLeg: 0,
        rightLeg: 0,
        bounce: 0,
        squash: 0,
        blink: 0,
        gazeX: 0,
        gazeY: 0,
        mouth: 0,
        cheeks: 0,
      });
    }

    stop() {
      this.actionTimeline?.kill();
      this.actionTimeline = null;
      if (window.gsap) gsap.killTweensOf(this.pose);
      this.resetPose();
      this.applyFace();
      this.updateMesh(0);
    }

    play(type, onComplete) {
      this.actionTimeline?.kill();
      if (!window.gsap || this.reducedMotion || !this.motion) {
        onComplete?.();
        return null;
      }

      const pose = this.pose;
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          this.actionTimeline = null;
          onComplete?.();
        },
      });
      this.actionTimeline = timeline;

      const settle = (position = ">") => timeline.to(pose, {
        headX: 0,
        headY: 0,
        headRotation: 0,
        headScaleX: 1,
        headScaleY: 1,
        bodyRotation: 0,
        bodyX: 0,
        bodyY: 0,
        leftArm: 0,
        rightArm: 0,
        leftLeg: 0,
        rightLeg: 0,
        bounce: 0,
        squash: 0,
        blink: 0,
        mouth: 0,
        cheeks: 0,
        duration: 0.32,
        ease: "back.out(1.5)",
      }, position);

      if (type === "pet") {
        timeline
          .to(pose, { blink: 1, cheeks: 1, duration: 0.1, ease: "power2.in" })
          .to(pose, { headY: 18, headScaleX: 1.025, headScaleY: 0.96, duration: 0.2 }, 0)
          .to(pose, { blink: 0, duration: 0.13 })
          .to(pose, { headY: -5, headScaleX: 0.99, headScaleY: 1.02, duration: 0.22 }, "<");
        settle();
      } else if (type === "feed") {
        timeline
          .to(pose, { headRotation: -0.045, mouth: 1, gazeX: -0.35, duration: 0.22 })
          .to(pose, { headRotation: 0.04, mouth: 0.35, gazeX: 0.3, duration: 0.2 })
          .to(pose, { headRotation: -0.025, mouth: 0.75, duration: 0.18 });
        settle();
      } else if (type === "play") {
        timeline
          .to(pose, { squash: 1, bodyY: 18, leftArm: -0.18, rightArm: 0.18, duration: 0.18, ease: "power2.in" })
          .to(pose, { bounce: -78, squash: -0.35, leftArm: 0.36, rightArm: -0.36, leftLeg: -0.12, rightLeg: 0.12, duration: 0.34, ease: "power3.out" })
          .to(pose, { bounce: 0, bodyY: 0, squash: 0.42, duration: 0.35, ease: "bounce.out" });
        settle("-=0.08");
      } else if (type === "dance") {
        timeline
          .to(pose, { bodyRotation: -0.075, bodyX: -18, leftArm: -0.35, rightArm: -0.1, leftLeg: 0.08, duration: 0.23 })
          .to(pose, { bodyRotation: 0.075, bodyX: 18, leftArm: 0.1, rightArm: 0.35, rightLeg: -0.08, duration: 0.25 })
          .to(pose, { bodyRotation: -0.065, bodyX: -15, leftArm: -0.42, rightArm: -0.08, bounce: -12, duration: 0.23 })
          .to(pose, { bodyRotation: 0.065, bodyX: 15, leftArm: 0.08, rightArm: 0.42, bounce: 0, duration: 0.23 });
        settle();
      } else if (type === "sleep") {
        timeline
          .to(pose, { headRotation: 0.075, headY: 14, bodyY: 8, blink: 1, mouth: 0.2, duration: 0.5, ease: "sine.inOut" })
          .to(pose, { headY: 18, bodyY: 11, duration: 0.7, yoyo: true, repeat: 1, ease: "sine.inOut" })
          .to(pose, { headRotation: -0.035, duration: 0.35 });
        settle();
      } else if (type === "wave") {
        timeline
          .to(pose, { rightArm: -0.78, headRotation: -0.035, mouth: 0.3, duration: 0.28 })
          .to(pose, { rightArm: -0.48, duration: 0.18, repeat: 3, yoyo: true, ease: "sine.inOut" });
        settle();
      } else if (type === "nod" || type === "talk") {
        timeline
          .to(pose, { headY: 13, headRotation: 0.015, blink: 0.75, duration: 0.2 })
          .to(pose, { headY: -5, headRotation: -0.012, blink: 0, duration: 0.22 })
          .to(pose, { headY: 9, headRotation: 0.012, duration: 0.18 });
        settle();
      } else if (type === "surprise") {
        timeline
          .to(pose, { bounce: -20, headScaleX: 1.035, headScaleY: 1.035, mouth: 1, gazeY: -0.35, cheeks: 0.7, leftArm: -0.2, rightArm: 0.2, duration: 0.22, ease: "back.out(2)" })
          .to(pose, { blink: 1, duration: 0.09 })
          .to(pose, { blink: 0, duration: 0.1 })
          .to(pose, { headRotation: -0.035, duration: 0.24 });
        settle();
      } else {
        timeline.to(pose, { headRotation: 0.035, mouth: 0.35, duration: 0.25 });
        settle();
      }
      return timeline;
    }

    tick(deltaSeconds) {
      this.idleClock += deltaSeconds;
      this.updateMesh(this.idleClock);
      this.applyFace();
    }

    updateMesh(time) {
      if (!this.vertexBuffer || !this.baseVertices) return;
      const output = this.vertexBuffer.data;
      const pose = this.pose;
      const idle = this.motion && !this.reducedMotion && !this.dragging && !this.actionTimeline;
      const breathe = idle ? Math.sin(time * 2.1) : 0;
      const sway = idle ? Math.sin(time * 0.8) : 0;
      const pointerHeadX = idle ? this.pointer.x * 8 : 0;
      const pointerHeadY = idle ? this.pointer.y * 5 : 0;
      const width = this.textureWidth;
      const height = this.textureHeight;

      for (let index = 0; index < this.baseVertices.length; index += 2) {
        const baseX = this.baseVertices[index];
        const baseY = this.baseVertices[index + 1];
        const u = baseX / width;
        const v = baseY / height;
        let x = u;
        let y = v;

        const torsoWeight = Math.exp(-(((u - 0.5) ** 2) / 0.11 + ((v - 0.69) ** 2) / 0.075));
        const torsoRotation = pose.bodyRotation + sway * 0.008;
        const torsoPoint = rotatePoint(x, y, 0.5, 0.67, torsoRotation * torsoWeight);
        x += (torsoPoint.x - x) + ((pose.bodyX / width) * torsoWeight);
        y += (torsoPoint.y - y) + (((pose.bodyY + pose.bounce) / height) * torsoWeight);

        const headWeight = 1 - smoothstep(0.48, 0.66, v);
        const headPoint = rotatePoint(x, y, 0.5, 0.55, (pose.headRotation + sway * 0.006) * headWeight);
        x += (headPoint.x - x) + (((pose.headX + pointerHeadX) / width) * headWeight);
        y += (headPoint.y - y) + (((pose.headY + pointerHeadY + pose.bounce + breathe * 2.5) / height) * headWeight);
        x = 0.5 + (x - 0.5) * (1 + (pose.headScaleX - 1) * headWeight);
        y = 0.55 + (y - 0.55) * (1 + (pose.headScaleY - 1) * headWeight);

        const leftArmWeight = Math.exp(-(distanceToSegment(u, v, 0.40, 0.62, 0.27, 0.77) ** 2) / 0.0035)
          * smoothstep(0.55, 0.66, v) * (1 - smoothstep(0.84, 0.9, v)) * (1 - smoothstep(0.48, 0.53, u));
        const leftArmPoint = rotatePoint(x, y, 0.40, 0.62, pose.leftArm * leftArmWeight);
        x += leftArmPoint.x - x;
        y += leftArmPoint.y - y;

        const rightArmWeight = Math.exp(-(distanceToSegment(u, v, 0.60, 0.62, 0.73, 0.77) ** 2) / 0.0035)
          * smoothstep(0.55, 0.66, v) * (1 - smoothstep(0.84, 0.9, v)) * smoothstep(0.47, 0.52, u);
        const rightArmPoint = rotatePoint(x, y, 0.60, 0.62, pose.rightArm * rightArmWeight);
        x += rightArmPoint.x - x;
        y += rightArmPoint.y - y;

        const leftLegWeight = Math.exp(-(((u - 0.42) ** 2) / 0.012 + ((v - 0.88) ** 2) / 0.05)) * smoothstep(0.78, 0.86, v);
        const leftLegPoint = rotatePoint(x, y, 0.43, 0.79, pose.leftLeg * leftLegWeight);
        x += leftLegPoint.x - x;
        y += leftLegPoint.y - y;

        const rightLegWeight = Math.exp(-(((u - 0.58) ** 2) / 0.012 + ((v - 0.88) ** 2) / 0.05)) * smoothstep(0.78, 0.86, v);
        const rightLegPoint = rotatePoint(x, y, 0.57, 0.79, pose.rightLeg * rightLegWeight);
        x += rightLegPoint.x - x;
        y += rightLegPoint.y - y;

        const squashWeight = smoothstep(0.5, 0.82, v);
        x = 0.5 + (x - 0.5) * (1 + pose.squash * 0.045 * squashWeight);
        y = 0.79 + (y - 0.79) * (1 - pose.squash * 0.055 * squashWeight);

        output[index] = x * width;
        output[index + 1] = y * height;
      }
      this.vertexBuffer.update();
    }

    applyFace() {
      if (!this.faceRoot) return;
      const idle = this.motion && !this.reducedMotion && !this.actionTimeline;
      const automaticBlink = idle && Math.sin(this.idleClock * 0.72) > 0.992
        ? smoothstep(0.992, 1, Math.sin(this.idleClock * 0.72))
        : 0;
      const blink = clamp(Math.max(this.pose.blink, automaticBlink));
      const gazeX = this.actionTimeline ? this.pose.gazeX : this.pointer.x * 0.55;
      const gazeY = this.actionTimeline ? this.pose.gazeY : this.pointer.y * 0.4;
      this.faceRoot.style.setProperty("--blink", blink.toFixed(3));
      this.faceRoot.style.setProperty("--blink-offset", `${(1 - blink) * -112}%`);
      this.faceRoot.style.setProperty("--gaze-x", `${gazeX * 4}px`);
      this.faceRoot.style.setProperty("--gaze-y", `${gazeY * 3}px`);
      this.faceRoot.style.setProperty("--mouth", this.pose.mouth.toFixed(3));
      this.faceRoot.style.setProperty("--mouth-height", `${0.7 + this.pose.mouth * 1.55}%`);
      this.faceRoot.style.setProperty("--mouth-alpha", (this.pose.mouth * 0.78).toFixed(3));
      this.faceRoot.style.setProperty("--mouth-y", `${this.pose.mouth * -1}px`);
      this.faceRoot.style.setProperty("--mouth-scale", (1 - this.pose.mouth * 0.08).toFixed(3));
      this.faceRoot.style.setProperty("--cheeks", this.pose.cheeks.toFixed(3));
      this.faceRoot.style.setProperty("--cheek-alpha", (this.pose.cheeks * 0.34).toFixed(3));
    }
  }

  window.HutaoRig = HutaoRig;
})();
