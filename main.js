const display = document.getElementById("time-display");
const currentStepText = document.getElementById("current-step");
const statusText = document.getElementById("status-text");
const menuSelect = document.getElementById("timer-preset");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");
const editButton = document.getElementById("edit-button");
const editor = document.getElementById("step-editor");
const newMenuButton = document.getElementById("new-menu-button");
const menuNameInput = document.getElementById("menu-name");
const stepList = document.getElementById("step-list");
const addStepButton = document.getElementById("add-step-button");
const saveMenuButton = document.getElementById("save-menu-button");
const editorMessage = document.getElementById("editor-message");

const MENUS_STORAGE_KEY = "coffee-timer-menus";
const SELECTED_MENU_STORAGE_KEY = "coffee-timer-selected-menu";
const MAX_MINUTES = 99;

const DEFAULT_MENUS = [
  {
    name: "メニュー1",
    steps: [
      { name: "蒸らし", minutes: 1, seconds: 0 },
      { name: "2投目", minutes: 0, seconds: 30 },
      { name: "3投目", minutes: 0, seconds: 30 },
      { name: "4投目", minutes: 0, seconds: 30 }
    ]
  }
];

let menus = [];
let selectedMenuIndex = 0;
let currentStepIndex = 0;
let remainingSeconds = 60;
let timerId = null;
let targetTime = null;
let audioContext = null;

// 編集内容は「記録」を押すまで保存データと分けて管理します。
let draftMenu = null;
let editingMenuIndex = 0;

function cloneMenu(menu) {
  return {
    name: menu.name,
    steps: menu.steps.map((step) => ({ ...step }))
  };
}

function getStepName(index) {
  return index === 0 ? "蒸らし" : `${index + 1}投目`;
}

function stepToSeconds(step) {
  return step.minutes * 60 + step.seconds;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateDisplay() {
  const currentStep = menus[selectedMenuIndex].steps[currentStepIndex];
  display.textContent = formatTime(remainingSeconds);
  display.dateTime = `PT${remainingSeconds}S`;
  currentStepText.textContent = `現在：${currentStep.name}`;
}

// localStorageの値を検証し、壊れている場合はnullを返します。
function normalizeMenus(value) {
  if (!Array.isArray(value) || value.length === 0) return null;

  const names = new Set();
  const normalized = [];

  for (const menu of value) {
    const menuName = typeof menu?.name === "string" ? menu.name.trim() : "";
    if (!menuName || menuName.length > 30 || names.has(menuName) || !Array.isArray(menu.steps) || menu.steps.length === 0) {
      return null;
    }

    const steps = [];
    for (let index = 0; index < menu.steps.length; index += 1) {
      const minutes = Number(menu.steps[index]?.minutes);
      const seconds = Number(menu.steps[index]?.seconds);

      if (
        !Number.isInteger(minutes) || minutes < 0 || minutes > MAX_MINUTES ||
        !Number.isInteger(seconds) || seconds < 0 || seconds > 59 ||
        minutes * 60 + seconds === 0
      ) {
        return null;
      }

      steps.push({ name: getStepName(index), minutes, seconds });
    }

    names.add(menuName);
    normalized.push({ name: menuName, steps });
  }

  return normalized;
}

function loadMenus() {
  try {
    const saved = localStorage.getItem(MENUS_STORAGE_KEY);
    if (saved === null) return DEFAULT_MENUS.map(cloneMenu);
    return normalizeMenus(JSON.parse(saved)) ?? DEFAULT_MENUS.map(cloneMenu);
  } catch (error) {
    console.warn("メニューデータが壊れていたため、初期データを使用します。", error);
    return DEFAULT_MENUS.map(cloneMenu);
  }
}

function loadSelectedMenuIndex() {
  try {
    const index = Number(localStorage.getItem(SELECTED_MENU_STORAGE_KEY));
    return Number.isInteger(index) && index >= 0 && index < menus.length ? index : 0;
  } catch (error) {
    console.warn("選択中のメニューを読み込めませんでした。", error);
    return 0;
  }
}

function saveMenus() {
  try {
    localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(menus));
    localStorage.setItem(SELECTED_MENU_STORAGE_KEY, String(selectedMenuIndex));
  } catch (error) {
    console.warn("メニューデータを保存できませんでした。", error);
  }
}

function stopInterval() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  targetTime = null;
}

function resetToFirstStep() {
  stopInterval();
  currentStepIndex = 0;
  remainingSeconds = stepToSeconds(menus[selectedMenuIndex].steps[0]);
  statusText.textContent = "準備完了";
  updateDisplay();
}

function renderMenuSelect() {
  menuSelect.replaceChildren();
  menus.forEach((menu, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = menu.name;
    menuSelect.append(option);
  });
  menuSelect.value = String(selectedMenuIndex);
}

function createNumberInput(value, className, max) {
  const input = document.createElement("input");
  input.type = "number";
  input.className = className;
  input.min = "0";
  input.max = String(max);
  input.value = String(value);
  input.required = true;
  return input;
}

function renderDraft() {
  menuNameInput.value = draftMenu.name;
  stepList.replaceChildren();

  draftMenu.steps.forEach((step, index) => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const minuteUnit = document.createElement("span");
    const secondUnit = document.createElement("span");
    const deleteButton = document.createElement("button");

    row.className = "step-row";
    row.dataset.stepIndex = String(index);
    name.className = "step-name";
    name.textContent = getStepName(index);
    minuteUnit.className = "unit";
    minuteUnit.textContent = "分";
    secondUnit.className = "unit";
    secondUnit.textContent = "秒";

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";
    deleteButton.disabled = draftMenu.steps.length === 1;
    deleteButton.setAttribute("aria-label", `${getStepName(index)}を削除`);

    row.append(
      name,
      createNumberInput(step.minutes, "step-minutes", MAX_MINUTES),
      minuteUnit,
      createNumberInput(step.seconds, "step-seconds", 59),
      secondUnit,
      deleteButton
    );
    stepList.append(row);
  });
}

function openEditorForMenu(index) {
  editingMenuIndex = index;
  draftMenu = cloneMenu(menus[index]);
  editorMessage.textContent = "";
  renderDraft();
}

function prepareAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (audioContext === null || audioContext.state === "closed") audioContext = new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  } catch (error) {
    console.warn("音声を準備できませんでした。", error);
    return null;
  }
}

function playBuzzer() {
  try {
    const context = prepareAudio();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = 760;
    gain.gain.setValueAtTime(0.14, context.currentTime);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch (error) {
    console.warn("ブザー音を再生できませんでした。", error);
  }
}

function finishCurrentStep() {
  playBuzzer();
  const steps = menus[selectedMenuIndex].steps;

  if (currentStepIndex < steps.length - 1) {
    currentStepIndex += 1;
    remainingSeconds = stepToSeconds(steps[currentStepIndex]);
    targetTime = Date.now() + remainingSeconds * 1000;
    statusText.textContent = "抽出中…";
    updateDisplay();
    return;
  }

  stopInterval();
  remainingSeconds = 0;
  updateDisplay();
  statusText.textContent = "できあがり ☕";
}

// 終了予定時刻から残り時間を算出し、タイマーのずれを抑えます。
function tick() {
  remainingSeconds = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
  updateDisplay();
  if (remainingSeconds === 0) finishCurrentStep();
}

function startTimer() {
  if (timerId !== null) return;
  prepareAudio();

  // 全工程終了後の再生は、最初の工程から再開します。
  if (remainingSeconds === 0 && currentStepIndex === menus[selectedMenuIndex].steps.length - 1) {
    resetToFirstStep();
  }

  targetTime = Date.now() + remainingSeconds * 1000;
  statusText.textContent = "抽出中…";
  timerId = window.setInterval(tick, 250);
}

function pauseTimer() {
  if (timerId === null) return;
  remainingSeconds = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
  stopInterval();
  updateDisplay();
  statusText.textContent = "一時停止";
}

menuSelect.addEventListener("change", () => {
  selectedMenuIndex = Number(menuSelect.value);
  resetToFirstStep();
  openEditorForMenu(selectedMenuIndex);
  saveMenus();
});

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetToFirstStep);

editButton.addEventListener("click", () => {
  const willOpen = editor.hidden;
  editor.hidden = !willOpen;
  editButton.setAttribute("aria-expanded", String(willOpen));
  editButton.textContent = willOpen ? "閉じる" : "編集";
  if (willOpen) openEditorForMenu(selectedMenuIndex);
});

newMenuButton.addEventListener("click", () => {
  editingMenuIndex = null;
  draftMenu = {
    name: `メニュー${menus.length + 1}`,
    steps: [{ name: "蒸らし", minutes: 0, seconds: 30 }]
  };
  editorMessage.textContent = "新しいメニューを編集中です";
  renderDraft();
  menuNameInput.focus();
  menuNameInput.select();
});

menuNameInput.addEventListener("input", () => {
  draftMenu.name = menuNameInput.value;
  editorMessage.textContent = "";
});

stepList.addEventListener("input", (event) => {
  const input = event.target.closest("input");
  const row = event.target.closest(".step-row");
  if (!input || !row) return;
  const step = draftMenu.steps[Number(row.dataset.stepIndex)];
  if (input.classList.contains("step-minutes")) step.minutes = Number(input.value);
  if (input.classList.contains("step-seconds")) step.seconds = Number(input.value);
  editorMessage.textContent = "";
});

stepList.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-button");
  const row = event.target.closest(".step-row");
  if (!button || !row || draftMenu.steps.length === 1) return;
  draftMenu.steps.splice(Number(row.dataset.stepIndex), 1);
  draftMenu.steps.forEach((step, index) => {
    step.name = getStepName(index);
  });
  renderDraft();
});

addStepButton.addEventListener("click", () => {
  draftMenu.steps.push({
    name: getStepName(draftMenu.steps.length),
    minutes: 0,
    seconds: 30
  });
  renderDraft();
});

saveMenuButton.addEventListener("click", () => {
  const normalized = normalizeMenus([{ ...draftMenu, name: menuNameInput.value.trim() }]);
  if (!normalized) {
    editorMessage.textContent = "メニュー名と各工程の時間を確認してください";
    return;
  }

  const savedMenu = normalized[0];
  const duplicateIndex = menus.findIndex(
    (menu, index) => menu.name === savedMenu.name && index !== editingMenuIndex
  );
  if (duplicateIndex !== -1) {
    editorMessage.textContent = "同じ名前のメニューがすでにあります";
    return;
  }

  if (editingMenuIndex === null) {
    menus.push(savedMenu);
    selectedMenuIndex = menus.length - 1;
  } else {
    menus[editingMenuIndex] = savedMenu;
    selectedMenuIndex = editingMenuIndex;
  }

  renderMenuSelect();
  resetToFirstStep();
  saveMenus();
  openEditorForMenu(selectedMenuIndex);
  editorMessage.textContent = "記録しました";
});

menus = loadMenus();
selectedMenuIndex = loadSelectedMenuIndex();
renderMenuSelect();
resetToFirstStep();
openEditorForMenu(selectedMenuIndex);
saveMenus();
