// progress.js — 表示専用の進捗レイヤー（第1段階で追加）
// main.js には一切手を入れず、#current-step / #status-text / #time-display の
// 変化を監視して、工程チップ・進捗バー・次工程表示・body状態クラスを更新します。
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

  const MENUS_STORAGE_KEY = "coffee-timer-menus"; // 読み取り専用（main.jsが保存）

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

  const stepToSeconds = (step) => Number(step.minutes) * 60 + Number(step.seconds);

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function parseDisplayTime(text) {
    const match = /^(\d+):(\d+)$/.exec(text.trim());
    return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
  }

  function currentState() {
    const s = statusText.textContent;
    if (s.startsWith("抽出中")) return "running";
    if (s.startsWith("一時停止")) return "paused";
    if (s.startsWith("できあがり")) return "done";
    return "idle";
  }

  function currentStepIndex(steps) {
    const name = stepText.textContent.replace(/^現在：/, "").trim();
    const index = steps.findIndex((step) => step.name === name);
    return index >= 0 ? index : 0;
  }

  let lastChipsSignature = "";

  function renderChips(steps, index, state) {
    const signature = `${steps.map((s) => s.name).join("|")}#${index}#${state}`;
    if (signature === lastChipsSignature) return;
    lastChipsSignature = signature;

    chipsEl.replaceChildren();
    steps.forEach((step, i) => {
      const chip = document.createElement("span");
      const done = state === "done" || i < index;
      chip.className = "progress-chip" + (done ? " done" : i === index && state !== "idle" ? " current" : i === index ? " current" : "");
      chip.textContent = step.name;
      chipsEl.append(chip);
    });

    // 現在の工程チップが見える位置までスクロール（工程が多い場合）
    const current = chipsEl.querySelector(".current");
    if (current && chipsEl.scrollWidth > chipsEl.clientWidth) {
      chipsEl.scrollLeft = Math.max(0, current.offsetLeft - 24);
    }
  }

  function render() {
    const steps = readSteps();
    const state = currentState();
    const index = currentStepIndex(steps);

    document.body.classList.toggle("is-idle", state === "idle");
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

    if (state === "idle") {
      nextEl.textContent = `全${steps.length}工程 · 合計 ${formatTime(total)}`;
    } else if (state === "done") {
      nextEl.textContent = "全工程が完了しました";
    } else if (index < steps.length - 1) {
      nextEl.textContent = `次：${steps[index + 1].name}（${formatTime(stepToSeconds(steps[index + 1]))}）`;
    } else {
      nextEl.textContent = "最後の工程です";
    }
  }

  const observerConfig = { childList: true, characterData: true, subtree: true };
  new MutationObserver(render).observe(stepText, observerConfig);
  new MutationObserver(render).observe(statusText, observerConfig);
  new MutationObserver(render).observe(timeDisplay, observerConfig);
  menuSelect.addEventListener("change", render);

  render();

  // ===== プルダウンに「新規メニューを追加」を追加（main.jsは変更しない） =====
  const NEW_MENU_VALUE = "__add_new_menu__";
  const editButton = document.getElementById("edit-button");
  const editor = document.getElementById("step-editor");
  const newMenuButton = document.getElementById("new-menu-button");
  const menuNameInput = document.getElementById("menu-name");

  if (editButton && editor && newMenuButton && menuNameInput) {
    const DRAFT_VALUE = "__drafting_new__";
    let lastValidValue = menuSelect.value;
    let isDrafting = false;

    function ensureAddOption() {
      let option = menuSelect.querySelector(`option[value="${NEW_MENU_VALUE}"]`);
      if (option) {
        if (menuSelect.lastElementChild !== option) menuSelect.append(option);
      } else {
        option = document.createElement("option");
        option.value = NEW_MENU_VALUE;
        option.textContent = "新規メニューを追加";
        menuSelect.append(option);
      }
    }

    function ensureDraftOption() {
      // ドロップダウンの一覧には出さず、閉じた状態の表示だけ空欄にするための
      // 非表示プレースホルダー。
      if (!menuSelect.querySelector(`option[value="${DRAFT_VALUE}"]`)) {
        const option = document.createElement("option");
        option.value = DRAFT_VALUE;
        option.textContent = "";
        option.hidden = true;
        menuSelect.prepend(option);
      }
    }

    new MutationObserver(ensureAddOption).observe(menuSelect, { childList: true });
    ensureAddOption();
    ensureDraftOption();

    // capture フェーズで先取りし、main.js の change リスナー（谷岡式などを
    // 再読み込みしてしまう）より先に処理して止める。
    menuSelect.addEventListener(
      "change",
      (event) => {
        if (menuSelect.value !== NEW_MENU_VALUE) {
          lastValidValue = menuSelect.value;
          isDrafting = false;
          return;
        }

        event.stopImmediatePropagation();
        event.preventDefault();
        ensureDraftOption();
        menuSelect.value = DRAFT_VALUE; // 選択欄も空欄表示にする
        isDrafting = true;

        if (editor.hidden) {
          editButton.click();
        }
        newMenuButton.click();
        // 新規メニュー名は空欄から始める（main.js側の自動採番名をクリア）
        menuNameInput.value = "";
        menuNameInput.dispatchEvent(new Event("input", { bubbles: true }));
        menuNameInput.focus();
      },
      true
    );

    // 保存せずに編集パネルを閉じた場合は、選択欄の表示を元のメニューへ戻す。
    editButton.addEventListener("click", () => {
      if (isDrafting && editor.hidden) {
        menuSelect.value = lastValidValue;
        isDrafting = false;
      }
    });

    // 保存された場合、main.js が selectedMenuIndex を更新して選択欄を
    // 描画し直すため、こちらのドラフト状態フラグだけ解除する。
    const saveMenuButton = document.getElementById("save-menu-button");
    if (saveMenuButton) {
      saveMenuButton.addEventListener("click", () => {
        isDrafting = false;
      });
    }
  }
})();
