(() => {
  "use strict";

  const STORAGE_KEY = "hutao-house-state-v3";
  const clamp = (value) => Math.min(100, Math.max(0, value));
  const today = () => new Date().toISOString().slice(0, 10);
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  function setupEntryScene() {
    const entry = $("#petEntry");
    if (!entry) return () => {};

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bar = $("#petEntryBar");
    const number = $("#petEntryNumber");
    const status = $("#petEntryStatus");
    const skip = $("#petEntrySkip");
    const startedAt = performance.now();
    const minimumDuration = reducedMotion ? 700 : 7600;
    let assetsReady = false;
    let finished = false;
    let progress = 0;

    const leave = () => {
      if (finished) return;
      finished = true;
      bar.style.width = "100%";
      number.textContent = "100";
      status.textContent = "已到胡桃小屋";
      entry.classList.add("is-leaving");
      document.body.classList.remove("pet-entry-active");
      window.setTimeout(() => entry.remove(), 1200);
    };

    const tick = () => {
      if (finished) return;
      const elapsed = performance.now() - startedAt;
      const cinematicTarget = Math.min(99.2, 6 + (elapsed / minimumDuration) * 93.2);
      const target = assetsReady ? cinematicTarget : Math.min(90, cinematicTarget);
      progress += Math.max(0.22, (target - progress) * 0.06);
      progress = Math.min(target, progress);
      const rounded = Math.floor(progress);
      bar.style.width = `${progress}%`;
      number.textContent = String(rounded);

      if (rounded > 76) status.textContent = "木屋灯火已经可见";
      else if (rounded > 48) status.textContent = "轻舟驶入云水深处";
      else if (rounded > 20) status.textContent = "穿过远山与墨雾";

      if (assetsReady && elapsed >= minimumDuration && progress > 98.4) {
        leave();
        return;
      }
      window.requestAnimationFrame(tick);
    };

    skip.addEventListener("click", leave);
    window.setTimeout(() => {
      assetsReady = true;
    }, 12000);
    window.requestAnimationFrame(tick);
    return () => {
      assetsReady = true;
    };
  }

  const markEntryReady = setupEntryScene();

  const defaults = {
    hunger: 78,
    mood: 84,
    energy: 76,
    xp: 0,
    level: 1,
    coins: 20,
    lastGift: "",
    motion: true,
    sound: true,
    deepNight: false,
  };

  let state = loadState();
  let rig = null;
  let busy = false;
  let audioContext = null;
  let toastTimer = 0;
  let drag = null;
  let stageOffset = { x: 0, y: 0 };

  const actionData = {
    pet: { speech: ["嘿嘿，再摸一下也不是不行。", "帽子可不能揉乱啦！"], mood: 8, energy: -1, xp: 5, sound: 540 },
    feed: { speech: ["唔，这个味道不错！", "吃饱才有力气工作嘛。"], hunger: 14, mood: 3, coins: -2, xp: 6, sound: 650 },
    play: { speech: ["抓到你啦！再来一次！", "今天的胜负可还没定呢。"], mood: 7, energy: -8, hunger: -3, xp: 8, sound: 760 },
    dance: { speech: ["一二三，跟上本堂主的节拍！", "这支舞就当今日特别演出。"], mood: 12, energy: -7, xp: 9, sound: 820 },
    sleep: { speech: ["只眯一小会儿……呼……", "午后的阳光最适合打盹。"], energy: 16, hunger: -3, xp: 4, sound: 330 },
    wave: { speech: ["我一直都看见你哦！", "嗨！今天也要开心。"], mood: 4, xp: 5, sound: 710 },
  };

  function loadState() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch (_) {
      return { ...defaults };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function updateUI() {
    $("#hungerValue").textContent = Math.round(state.hunger);
    $("#moodValue").textContent = Math.round(state.mood);
    $("#energyValue").textContent = Math.round(state.energy);
    $("#hungerBar").style.width = `${state.hunger}%`;
    $("#moodBar").style.width = `${state.mood}%`;
    $("#energyBar").style.width = `${state.energy}%`;
    $("#petLevel").textContent = state.level;
    $("#petCoins").textContent = state.coins;
    $("#petXpText").textContent = `${state.xp} / 100`;
    $("#petXpBar").style.width = `${state.xp}%`;

    const gift = $("#dailyGift");
    const claimed = state.lastGift === today();
    gift.disabled = claimed;
    gift.querySelector("strong").textContent = claimed ? "今日已领取" : "领取 10 枚桃花币";
    setToggle($("#motionToggle"), state.motion, `动态：${state.motion ? "开" : "关"}`);
    setToggle($("#soundToggle"), state.sound, `音效：${state.sound ? "开" : "关"}`);
    setToggle($("#sceneToggle"), state.deepNight, `夜色：${state.deepNight ? "深" : "浅"}`);
    $("#petRoom").classList.toggle("is-deep-night", state.deepNight);
  }

  function setToggle(button, active, label) {
    button.classList.toggle("is-on", active);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = label;
  }

  function addValue(key, amount) {
    if (!amount) return;
    if (key === "coins") state.coins = Math.max(0, state.coins + amount);
    else if (key === "xp") {
      state.xp += amount;
      while (state.xp >= 100) {
        state.xp -= 100;
        state.level += 1;
        state.coins += 12;
        showToast(`亲密等级提升到 Lv.${state.level}`);
      }
    } else state[key] = clamp(state[key] + amount);
  }

  function speak(lines) {
    const line = Array.isArray(lines) ? lines[Math.floor(Math.random() * lines.length)] : lines;
    const speech = $("#petSpeech");
    speech.animate([{ opacity: 0.2, transform: "translateY(3px)" }, { opacity: 1, transform: "none" }], { duration: 260 });
    speech.textContent = line;
  }

  function showToast(message) {
    const toast = $("#petToast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function makeSparks(x, y, count = 8) {
    for (let index = 0; index < count; index += 1) {
      const spark = document.createElement("i");
      spark.className = "pet-spark";
      spark.textContent = index % 2 ? "✦" : "·";
      spark.style.left = `${x + (Math.random() - 0.5) * 42}px`;
      spark.style.top = `${y + (Math.random() - 0.5) * 28}px`;
      spark.style.setProperty("--dx", `${(Math.random() - 0.5) * 90}px`);
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 850);
    }
  }

  function playSound(frequency = 620) {
    if (!state.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.18, audioContext.currentTime + 0.11);
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.17);
    } catch (_) {
      state.sound = false;
      updateUI();
    }
  }

  function runAction(name, source) {
    if (busy || !actionData[name]) return;
    const data = actionData[name];
    if (data.coins && state.coins + data.coins < 0) {
      speak("桃花币不够啦，先领取今日小礼吧。");
      showToast("桃花币不足");
      return;
    }

    busy = true;
    $$("[data-action]").forEach((button) => { button.disabled = true; });
    speak(data.speech);
    playSound(data.sound);
    const rect = (source || $("#petCharacter")).getBoundingClientRect();
    makeSparks(rect.left + rect.width / 2, rect.top + rect.height * 0.42, name === "dance" ? 14 : 8);

    ["hunger", "mood", "energy", "xp", "coins"].forEach((key) => addValue(key, data[key]));
    saveState();
    updateUI();

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      busy = false;
      $$("[data-action]").forEach((button) => { button.disabled = false; });
    };
    setTimeout(finish, 3200);
    if (!rig?.play(name, finish)) {
      $("#petCharacter").animate(
        [{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-24px) scale(1.02)" }, { transform: "translateY(0) scale(1)" }],
        { duration: 700, easing: "ease-out" },
      ).onfinish = finish;
    }
  }

  function setClock() {
    const date = new Date();
    $("#petClock").textContent = date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    const hour = date.getHours();
    $("#petGreeting").textContent = hour < 6 ? "夜深相伴" : hour < 12 ? "早安相伴" : hour < 18 ? "午后相伴" : "晚间相伴";
    $("#petDayText").textContent = hour < 6 ? "还没睡吗？我陪你守一会儿夜" : hour < 12 ? "往生堂今日也准时开门" : hour < 18 ? "窗外阳光正好，适合偷闲" : "灯笼亮起来了，欢迎回家";
  }

  function bindDragging() {
    const character = $("#petCharacter");
    character.addEventListener("pointerdown", (event) => {
      drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, originX: stageOffset.x, originY: stageOffset.y, moved: false };
      character.setPointerCapture(event.pointerId);
    });
    character.addEventListener("pointermove", (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      drag.moved ||= Math.abs(dx) + Math.abs(dy) > 7;
      stageOffset.x = Math.max(-220, Math.min(220, drag.originX + dx));
      stageOffset.y = Math.max(-115, Math.min(110, drag.originY + dy));
      $("#petStage").style.transform = `translate3d(${stageOffset.x}px, ${stageOffset.y}px, 0)`;
    });
    character.addEventListener("pointerup", (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      if (!drag.moved) runAction("pet", character);
      drag = null;
    });
    character.addEventListener("pointercancel", () => { drag = null; });
  }

  async function initRig() {
    const status = $("#modelStatus");
    try {
      rig = await new HutaoRig($("#petRig"), {
        modelUrl: "./assets/models/Hutao/Hutao.model3.json",
      }).init();
      rig.setMotion(state.motion);
      status.classList.add("is-ready");
      status.querySelector("span").textContent = "Live2D 已连接 · 正在运行";
      speak("这次真的醒过来啦！移动光标看看？");
    } catch (error) {
      console.error("Live2D init failed:", error);
      status.classList.add("is-error");
      status.querySelector("span").textContent = "Live2D 加载失败 · 已启用备用形象";
      speak("模型暂时没有醒来，请刷新页面再试一次。");
    } finally {
      markEntryReady();
    }
  }

  function bindControls() {
    $$("[data-action]").forEach((button) => button.addEventListener("click", () => runAction(button.dataset.action, button)));
    $("#dailyGift").addEventListener("click", (event) => {
      if (state.lastGift === today()) return;
      state.lastGift = today();
      state.coins += 10;
      state.mood = clamp(state.mood + 5);
      saveState();
      updateUI();
      playSound(880);
      const rect = event.currentTarget.getBoundingClientRect();
      makeSparks(rect.left + rect.width / 2, rect.top, 14);
      speak("今日份的桃花币，收好啦！");
      showToast("获得 10 枚桃花币");
    });
    $("#motionToggle").addEventListener("click", () => {
      state.motion = !state.motion;
      rig?.setMotion(state.motion);
      saveState();
      updateUI();
      speak(state.motion ? "好啦，我继续活动活动。" : "那我先安静地待一会儿。");
    });
    $("#soundToggle").addEventListener("click", () => {
      state.sound = !state.sound;
      saveState();
      updateUI();
      if (state.sound) playSound(700);
    });
    $("#sceneToggle").addEventListener("click", () => {
      state.deepNight = !state.deepNight;
      saveState();
      updateUI();
    });
    $("#resetPosition").addEventListener("click", () => {
      stageOffset = { x: 0, y: 0 };
      $("#petStage").style.transform = "translate3d(0, 0, 0)";
      speak("又回到最舒服的位置啦。");
    });
  }

  function init() {
    updateUI();
    setClock();
    setInterval(setClock, 30000);
    bindControls();
    bindDragging();
    window.addEventListener("pointermove", (event) => {
      if (!drag) rig?.trackPointer(event.clientX, event.clientY);
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => rig?.resetGaze());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) rig?.resetGaze();
    });
    initRig();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
