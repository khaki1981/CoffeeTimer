(() => {
  "use strict";

  const stepText = document.getElementById("current-step");
  const statusText = document.getElementById("status-text");
  const timeDisplay = document.getElementById("time-display");
  const menuSelect = document.getElementById("timer-preset");
  const chipsEl = document.getElementById("progress-chips");
  const barEl = document.getElementById("progress-bar-fill");
  const nextEl = document.getElementById("next-step-text");

  if (!stepText || !statusText || !timeDisplay || !menuSelect || !chipsEl || !barEl || !nextEl) return;

  const MENUS_STORAGE_KEY = "coffee-timer-menus";

  function readSteps() {
    try {
      const menus = JSON.parse(localStorage.getItem(MENUS_STORAGE_KEY));
      const index = Number(menuSelect.value);
      const menu = Array.isArray(menus) ? menus[Number.isInteger(index) ? index : 0] : null;
      return menu && Array.isArray(menu.steps) ? menu.steps : [];
    } catch (error) {
      return [];
    }
  }

  function stepToSeconds(step) {
    return Number(step.minutes) * 60 + Number(step.seconds);
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function parseDisplayTime(text) {
    const match = /^(\d+):(\d+)$/.exec(text.trim());
    return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
  }

  function currentState() {
    const text = statusText.textContent.trim();
    if (text.startsWith("抽出中")) return "running";
    if (text.startsWith("一時停止")) return "paused";
    if (text.startsWith("できあがり")) return "done";
    return "idle";
  }

  function currentStepIndex(steps) {
    const name = stepText.textContent.replace(/^現在：/, "").trim();
    const index = steps.findIndex((step) => step.name === name);
    return index >= 0 ? index : 0;
  }

  function renderChips(steps, currentIndex, state) {
    chipsEl.replaceChildren();
    steps.forEach((step, index) => {
      const chip = document.createElement("span");
      const isDone = state === "done" || index < currentIndex;
      const isCurrent = index === currentIndex && state !== "done";
      chip.className = `progress-chip${isDone ? " done" : ""}${isCurrent ? " current" : ""}`;
      chip.textContent = step.name;
      chipsEl.append(chip);
    });

    const current = chipsEl.querySelector(".current");
    if (current && chipsEl.scrollWidth > chipsEl.clientWidth) {
      chipsEl.scrollLeft = Math.max(0, current.offsetLeft - 24);
    }
  }

  function render() {
    const steps = readSteps();
    const state = currentState();
    const index = currentStepIndex(steps);

    document.body.classList.toggle("is-running", state === "running");
    document.body.classList.toggle("is-paused", state === "paused");
    document.body.classList.toggle("is-done", state === "done");

    renderChips(steps, index, state);

    const total = steps.reduce((sum, step) => sum + stepToSeconds(step), 0);
    let percent = 0;
    if (total > 0) {
      if (state === "done") {
        percent = 100;
      } else {
        const upcoming = steps.slice(index + 1).reduce((sum, step) => sum + stepToSeconds(step), 0);
        const remaining = parseDisplayTime(timeDisplay.textContent) + upcoming;
        percent = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
      }
    }
    barEl.style.width = `${percent}%`;

    if (steps.length === 0) {
      nextEl.textContent = "";
    } else if (state === "idle") {
      nextEl.textContent = `全${steps.length}工程 / 合計 ${formatTime(total)}`;
    } else if (state === "done") {
      nextEl.textContent = "全工程が完了しました";
    } else if (index < steps.length - 1) {
      const nextStep = steps[index + 1];
      nextEl.textContent = `次：${nextStep.name} / ${formatTime(stepToSeconds(nextStep))}`;
    } else {
      nextEl.textContent = "最後の工程です";
    }
  }

  const observerConfig = { childList: true, characterData: true, subtree: true };
  new MutationObserver(render).observe(stepText, observerConfig);
  new MutationObserver(render).observe(statusText, observerConfig);
  new MutationObserver(render).observe(timeDisplay, observerConfig);
  menuSelect.addEventListener("change", () => window.setTimeout(render, 0));
  window.addEventListener("storage", render);

  render();
})();
