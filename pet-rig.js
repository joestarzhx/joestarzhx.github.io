(() => {
  "use strict";

  const ASSET_ROOT = "./assets/live2d";
  const clamp = (value, min = -1, max = 1) => Math.min(max, Math.max(min, value));

  class HutaoRig {
    constructor(host, faceRoot, options = {}) {
      this.host = host;
      this.faceRoot = faceRoot;
      this.reducedMotion = Boolean(options.reducedMotion);
      this.motion = true;
      this.dragging = false;
      this.actionTimeline = null;
      this.idleTimeline = null;
      this.blinkTimeline = null;
      this.blinkTimer = null;
      this.expressionTimer = null;
      this.expression = "default";
    }

    static async create(host, faceRoot, options) {
      const rig = new HutaoRig(host, faceRoot, options);
      rig.init();
      return rig;
    }

    asset(path, className = "") {
      return `<img class="puppet-part ${className}" src="${ASSET_ROOT}/${path}.png" alt="" draggable="false" />`;
    }

    eye(side) {
      return `
        <span class="eye-rig eye-${side}" data-eye="${side}">
          ${this.asset(`eyes/eye_${side}_white`, "eye-white")}
          ${this.asset(`eyes/eye_${side}_iris`, "eye-iris")}
          ${this.asset(`eyes/eye_${side}_highlight`, "eye-highlight")}
          ${this.asset(`eyes/eye_${side}_lower_lash`, "eye-lower-lash")}
          ${this.asset(`eyes/eye_${side}_upper_lash`, "eye-upper-lash")}
          ${this.asset(`eyes/eye_${side}_closed`, "eye-state eye-state-closed")}
          ${this.asset(`eyes/eye_${side}_smile`, "eye-state eye-state-smile")}
          ${this.asset(`eyes/eye_${side}_surprised`, "eye-state eye-state-surprised")}
          ${this.asset(`eyes/eye_${side}_star`, "eye-state eye-state-star")}
          ${this.asset(`eyes/eye_${side}_cry`, "eye-state eye-state-cry")}
        </span>`;
    }

    init() {
      if (!this.host) return;
      this.host.innerHTML = `
        <span class="puppet" data-puppet>
          <span class="puppet-bone leg-bone leg-left" data-bone="legLeft">
            ${this.asset("body/leg_L_upper", "leg-upper-part")}
            <span class="puppet-bone lower-leg-bone" data-bone="calfLeft">
              ${this.asset("body/leg_L_lower", "leg-lower-part")}
              <span class="puppet-bone foot-bone" data-bone="footLeft">
                ${this.asset("body/foot_L", "foot-part")}
              </span>
            </span>
          </span>
          <span class="puppet-bone leg-bone leg-right" data-bone="legRight">
            ${this.asset("body/leg_R_upper", "leg-upper-part")}
            <span class="puppet-bone lower-leg-bone" data-bone="calfRight">
              ${this.asset("body/leg_R_lower", "leg-lower-part")}
              <span class="puppet-bone foot-bone" data-bone="footRight">
                ${this.asset("body/foot_R", "foot-part")}
              </span>
            </span>
          </span>

          <span class="puppet-bone arm-bone arm-left" data-bone="armLeft">
            ${this.asset("body/arm_L_upper", "arm-upper-part")}
            <span class="puppet-bone forearm-bone" data-bone="forearmLeft">
              ${this.asset("body/arm_L_lower", "arm-lower-part")}
              <span class="puppet-bone hand-bone" data-bone="handLeft">
                ${this.asset("body/hand_L", "hand-part")}
              </span>
            </span>
          </span>
          <span class="puppet-bone arm-bone arm-right" data-bone="armRight">
            ${this.asset("body/arm_R_upper", "arm-upper-part")}
            <span class="puppet-bone forearm-bone" data-bone="forearmRight">
              ${this.asset("body/arm_R_lower", "arm-lower-part")}
              <span class="puppet-bone hand-bone" data-bone="handRight">
                ${this.asset("body/hand_R", "hand-part")}
              </span>
            </span>
          </span>

          <span class="puppet-bone body-bone" data-bone="body">
            ${this.asset("body/costume_full_front", "costume-front")}
          </span>

          <span class="puppet-bone head-bone" data-bone="head">
            ${this.asset("hair/back_hair", "back-hair")}
            ${this.asset("head/left_ear", "ear ear-left")}
            ${this.asset("head/right_ear", "ear ear-right")}
            ${this.asset("head/head_base", "head-base")}
            ${this.eye("L")}
            ${this.eye("R")}
            ${this.asset("eyes/eyebrow_L_default", "eyebrow eyebrow-left")}
            ${this.asset("eyes/eyebrow_R_default", "eyebrow eyebrow-right")}
            ${this.asset("mouth/mouth_closed_lip", "mouth-part")}
            ${this.asset("hair/side_hair_L", "side-hair side-hair-left")}
            ${this.asset("hair/side_hair_R", "side-hair side-hair-right")}
            ${this.asset("hair/bang", "bang")}
            ${this.asset("hair/ahoge", "ahoge")}
            ${this.asset("hair/hat", "hat-part")}
          </span>
        </span>`;

      const find = (selector) => this.host.querySelector(selector);
      this.parts = {
        puppet: find("[data-puppet]"),
        body: find('[data-bone="body"]'),
        head: find('[data-bone="head"]'),
        hat: find(".hat-part"),
        bang: find(".bang"),
        ahoge: find(".ahoge"),
        armLeft: find('[data-bone="armLeft"]'),
        armRight: find('[data-bone="armRight"]'),
        forearmLeft: find('[data-bone="forearmLeft"]'),
        forearmRight: find('[data-bone="forearmRight"]'),
        handLeft: find('[data-bone="handLeft"]'),
        handRight: find('[data-bone="handRight"]'),
        legLeft: find('[data-bone="legLeft"]'),
        legRight: find('[data-bone="legRight"]'),
        calfLeft: find('[data-bone="calfLeft"]'),
        calfRight: find('[data-bone="calfRight"]'),
        footLeft: find('[data-bone="footLeft"]'),
        footRight: find('[data-bone="footRight"]'),
        irisLeft: find(".eye-L .eye-iris"),
        irisRight: find(".eye-R .eye-iris"),
        eyebrowLeft: find(".eyebrow-left"),
        eyebrowRight: find(".eyebrow-right"),
        mouth: find(".mouth-part"),
        eyeStates: [...this.host.querySelectorAll(".eye-state")],
      };
      this.rigRoot = this.host.closest(".pet-rig");
      this.rigRoot?.classList.add("rig-ready", "layered-rig");
      this.setExpression("default");
      this.startIdle();
      this.scheduleBlink();
    }

    setMotion(enabled) {
      this.motion = enabled;
      if (enabled) {
        this.startIdle();
        this.scheduleBlink();
      } else {
        this.stop();
      }
    }

    setDragging(dragging) {
      this.dragging = dragging;
      if (dragging) this.idleTimeline?.pause();
      else if (this.motion) this.idleTimeline?.resume();
    }

    setExpression(name = "default", duration = 0) {
      if (!this.parts) return;
      window.clearTimeout(this.expressionTimer);
      this.expression = name;
      const state = {
        sleep: "closed",
        smile: "smile",
        surprised: "surprised",
        star: "star",
        cry: "cry",
      }[name] || "";
      this.rigRoot.dataset.expression = name;
      this.rigRoot.dataset.eyeState = state || "open";
      this.parts.eyeStates.forEach((eye) => {
        eye.style.opacity = state && eye.classList.contains(`eye-state-${state}`) ? "1" : "0";
      });

      const eyebrowName = {
        happy: "smile",
        smile: "smile",
        surprised: "surprised",
        star: "star",
        cry: "cry",
        angry: "angry",
      }[name] || "default";
      this.parts.eyebrowLeft.src = `${ASSET_ROOT}/eyes/eyebrow_L_${eyebrowName}.png`;
      this.parts.eyebrowRight.src = `${ASSET_ROOT}/eyes/eyebrow_R_${eyebrowName}.png`;

      const mouthName = {
        happy: "smile",
        smile: "smile",
        surprised: "O",
        star: "smile",
        cry: "pressed",
        angry: "pressed",
        talk: "small",
        eat: "A",
        sleep: "closed",
      }[name] || "closed";
      this.parts.mouth.src = `${ASSET_ROOT}/mouth/mouth_${mouthName}_lip.png`;

      if (duration > 0) {
        this.expressionTimer = window.setTimeout(() => this.setExpression("default"), duration);
      }
    }

    trackPointer(clientX, clientY) {
      if (!this.motion || this.dragging || this.actionTimeline || !window.gsap || !this.parts) return;
      const rect = this.host.getBoundingClientRect();
      const x = clamp(((clientX - rect.left) / rect.width) * 2 - 1);
      const y = clamp(((clientY - rect.top) / rect.height) * 2 - 1);
      gsap.to([this.parts.irisLeft, this.parts.irisRight], {
        x: x * 4,
        y: y * 2.5,
        duration: 0.22,
        overwrite: "auto",
        ease: "power2.out",
      });
      gsap.to(this.parts.head, {
        x: x * 2.4,
        y: y * 1.5,
        rotation: x * 0.7,
        duration: 0.42,
        overwrite: "auto",
        ease: "power2.out",
      });
    }

    startIdle() {
      this.idleTimeline?.kill();
      if (!window.gsap || this.reducedMotion || !this.motion || this.dragging || !this.parts) return;
      const p = this.parts;
      this.idleTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { duration: 1.8, ease: "sine.inOut" },
      })
        .to(p.puppet, { y: -3 }, 0)
        .to(p.body, { scaleY: 1.006, scaleX: 0.997 }, 0)
        .to(p.head, { y: -2, rotation: 0.35 }, 0)
        .to(p.ahoge, { rotation: 3 }, 0)
        .to(p.armLeft, { rotation: -0.8 }, 0)
        .to(p.armRight, { rotation: 0.8 }, 0);
    }

    scheduleBlink() {
      window.clearTimeout(this.blinkTimer);
      if (!this.motion || this.reducedMotion) return;
      this.blinkTimer = window.setTimeout(() => {
        if (!this.actionTimeline && !this.dragging && this.expression === "default") this.blink();
        this.scheduleBlink();
      }, 2600 + Math.random() * 3000);
    }

    blink() {
      if (!window.gsap || !this.parts) return;
      const closed = this.parts.eyeStates.filter((eye) => eye.classList.contains("eye-state-closed"));
      this.blinkTimeline?.kill();
      this.blinkTimeline = gsap.timeline({
        onComplete: () => {
          this.blinkTimeline = null;
        },
      })
        .to(closed, { autoAlpha: 1, duration: 0.07, ease: "power2.in" })
        .to(closed, { autoAlpha: 0, duration: 0.11, ease: "power2.out" }, "+=0.045");
    }

    resetParts(duration = 0) {
      if (!window.gsap || !this.parts) return;
      const p = this.parts;
      gsap.to([
        p.puppet, p.body, p.head, p.hat, p.bang, p.ahoge,
        p.armLeft, p.armRight, p.forearmLeft, p.forearmRight, p.handLeft, p.handRight,
        p.legLeft, p.legRight, p.calfLeft, p.calfRight, p.footLeft, p.footRight,
      ], {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration,
        overwrite: true,
        ease: duration ? "back.out(1.35)" : "none",
      });
      if (!this.expressionTimer) this.setExpression("default");
    }

    stop() {
      window.clearTimeout(this.blinkTimer);
      window.clearTimeout(this.expressionTimer);
      this.blinkTimeline?.kill();
      this.actionTimeline?.kill();
      this.idleTimeline?.kill();
      this.blinkTimeline = null;
      this.actionTimeline = null;
      this.idleTimeline = null;
      this.resetParts(0);
      this.setExpression("default");
    }

    play(type, onComplete) {
      this.actionTimeline?.kill();
      this.idleTimeline?.pause();
      if (!window.gsap || this.reducedMotion || !this.motion || !this.parts) {
        onComplete?.();
        return null;
      }

      const p = this.parts;
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          this.actionTimeline = null;
          this.resetParts(0.24);
          this.setExpression("default");
          this.startIdle();
          onComplete?.();
        },
      });
      this.actionTimeline = timeline;

      if (type === "pet") {
        this.setExpression("happy");
        timeline
          .to(p.head, { y: 7, scaleX: 1.018, scaleY: 0.985, duration: 0.18 })
          .to(p.hat, { y: 3, rotation: -0.8, duration: 0.16 }, 0)
          .to(p.ahoge, { rotation: -8, duration: 0.18 }, 0)
          .to(p.head, { y: -2, scaleX: 0.995, scaleY: 1.008, duration: 0.24 });
      } else if (type === "feed") {
        this.setExpression("eat");
        timeline
          .to(p.head, { rotation: -2.5, y: 2, duration: 0.18 })
          .to(p.head, { rotation: 2.5, y: 0, duration: 0.18 })
          .add(() => this.setExpression("happy"), ">-0.02")
          .to(p.head, { rotation: -1.4, duration: 0.17 });
      } else if (type === "play" || type === "surprise") {
        this.setExpression(type === "surprise" ? "surprised" : "star");
        timeline
          .to(p.puppet, { y: 10, scaleX: 1.025, scaleY: 0.975, duration: 0.15, ease: "power2.in" })
          .to([p.armLeft, p.armRight], { rotation: (index) => index ? -16 : 16, duration: 0.16 }, 0)
          .to(p.puppet, { y: -42, scaleX: 0.99, scaleY: 1.016, duration: 0.28, ease: "power3.out" })
          .to([p.calfLeft, p.calfRight], { rotation: (index) => index ? -8 : 8, duration: 0.24 }, "<")
          .to(p.puppet, { y: 0, scaleX: 1.012, scaleY: 0.988, duration: 0.32, ease: "bounce.out" });
      } else if (type === "dance") {
        this.setExpression("star");
        timeline
          .to(p.body, { rotation: -4, x: -7, duration: 0.22 })
          .to(p.head, { rotation: 4, x: -3, duration: 0.22 }, 0)
          .to(p.armLeft, { rotation: 34, duration: 0.22 }, 0)
          .to(p.forearmLeft, { rotation: 24, duration: 0.22 }, 0)
          .to(p.armRight, { rotation: -10, duration: 0.22 }, 0)
          .to(p.body, { rotation: 4, x: 7, duration: 0.24 })
          .to(p.head, { rotation: -4, x: 3, duration: 0.24 }, "<")
          .to(p.armLeft, { rotation: 10, duration: 0.24 }, "<")
          .to(p.armRight, { rotation: -34, duration: 0.24 }, "<")
          .to(p.forearmRight, { rotation: -24, duration: 0.24 }, "<")
          .to(p.body, { rotation: -3, x: -5, duration: 0.21 });
      } else if (type === "sleep") {
        this.setExpression("sleep");
        timeline
          .to(p.head, { rotation: 6, y: 7, duration: 0.36, ease: "sine.inOut" })
          .to(p.body, { y: 4, scaleY: 0.992, duration: 0.42 }, 0)
          .to(p.armRight, { rotation: -7, duration: 0.36 }, 0)
          .to(p.head, { y: 10, duration: 0.7, repeat: 1, yoyo: true, ease: "sine.inOut" });
      } else if (type === "wave") {
        this.setExpression("happy");
        timeline
          .to(p.armRight, { rotation: -112, duration: 0.28, ease: "back.out(1.5)" })
          .to(p.forearmRight, { rotation: -48, duration: 0.25 }, 0.06)
          .to(p.handRight, { rotation: -18, duration: 0.13, repeat: 4, yoyo: true, ease: "sine.inOut" }, 0.28)
          .to(p.head, { rotation: -3, duration: 0.24 }, 0.1);
      } else if (type === "nod") {
        this.setExpression("happy");
        timeline
          .to(p.head, { y: 6, rotation: 0.8, duration: 0.16 })
          .to(p.head, { y: -2, rotation: -0.6, duration: 0.19 })
          .to(p.head, { y: 4, rotation: 0.5, duration: 0.16 });
      } else if (type === "talk") {
        this.setExpression("talk");
        timeline
          .to(p.head, { rotation: -1.6, duration: 0.2 })
          .add(() => this.setExpression("happy"), 0.18)
          .to(p.head, { rotation: 1.6, duration: 0.2 })
          .add(() => this.setExpression("talk"), 0.38)
          .to(p.head, { rotation: -1, duration: 0.18 })
          .add(() => this.setExpression("happy"), 0.55);
      }

      timeline.to({}, { duration: 0.16 });
      return timeline;
    }
  }

  window.HutaoRig = HutaoRig;
})();
