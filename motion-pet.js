(function () {
  "use strict";

  const room = document.querySelector("#petRoom");
  if (!room) return;

  function currentScene(hour = new Date().getHours()) {
    if (hour >= 5 && hour < 8) return "dawn";
    if (hour >= 8 && hour < 17) return "day";
    if (hour >= 17 && hour < 19) return "dusk";
    return "night";
  }

  function applyScene(scene) {
    room.dataset.timeScene = scene;
    document.body.dataset.petScene = scene;
  }

  applyScene(currentScene());

  document.querySelector("#sceneToggle")?.addEventListener("click", () => {
    const order = ["dawn", "day", "dusk", "night"];
    const next = order[(order.indexOf(room.dataset.timeScene) + 1) % order.length];
    applyScene(next);
  });
}());
