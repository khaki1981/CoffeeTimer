const display = document.getElementById("time-display");
const currentStepText = document.getElementById("current-step");
const statusText = document.getElementById("status-text");
const menuSelect = document.getElementById("timer-preset");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");
const soundSettingsButton = document.getElementById("sound-settings-button");
const soundSettings = document.getElementById("sound-settings");
const soundSettingsClose = document.getElementById("sound-settings-close");
const soundSettingsCloseBottom = document.getElementById("sound-settings-close-bottom");
const editButton = document.getElementById("edit-button");
const editor = document.getElementById("step-editor");
const menuActions = document.getElementById("menu-actions");
const menuActionsButton = document.getElementById("menu-actions-button");
const menuActionsPopover = document.getElementById("menu-actions-popover");
const deleteMenuButton = document.getElementById("delete-menu-button");
const deleteMenuHelp = document.getElementById("delete-menu-help");
const deleteMenuDialog = document.getElementById("delete-menu-dialog");
const deleteMenuDescription = document.getElementById("delete-menu-description");
const cancelDeleteMenuButton = document.getElementById("cancel-delete-menu-button");
const confirmDeleteMenuButton = document.getElementById("confirm-delete-menu-button");
const menuNameInput = document.getElementById("menu-name");
const stepList = document.getElementById("step-list");
const addStepButton = document.getElementById("add-step-button");
const saveMenuButton = document.getElementById("save-menu-button");
const editorMessage = document.getElementById("editor-message");
const saveToast = document.getElementById("save-toast");
const alertEnabledInput = document.getElementById("alert-enabled");
const alertSoundSelect = document.getElementById("alert-sound");
const alertVolumeInput = document.getElementById("alert-volume");
const alertVolumeValue = document.getElementById("alert-volume-value");
const alertToggleLabel = document.getElementById("alert-toggle-label");
const bgmEnabledInput = document.getElementById("bgm-enabled");
const bgmTrackSelect = document.getElementById("bgm-track");
const bgmVolumeInput = document.getElementById("bgm-volume");
const bgmVolumeValue = document.getElementById("bgm-volume-value");
const bgmToggleLabel = document.getElementById("bgm-toggle-label");
const bgmStatus = document.getElementById("bgm-status");

const MENUS_STORAGE_KEY = "coffee-timer-menus";
const SELECTED_MENU_STORAGE_KEY = "coffee-timer-selected-menu";
const ALERT_ENABLED_STORAGE_KEY = "coffee-timer-alert-enabled";
const ALERT_SOUND_STORAGE_KEY = "coffee-timer-alert-sound";
const ALERT_VOLUME_STORAGE_KEY = "coffee-timer-alert-volume";
const BGM_ENABLED_STORAGE_KEY = "coffee-timer-bgm-enabled";
const BGM_TRACK_STORAGE_KEY = "coffee-timer-bgm-track";
const BGM_VOLUME_STORAGE_KEY = "coffee-timer-bgm-volume";
const MAX_MINUTES = 99;
const NEW_MENU_VALUE = "new";
const ALERT_SOUND_KEYS = ["bell", "wood", "soft"];
const BGM_TRACKS = {
  none: null,
  "morning-coffee": "assets/music/morningcoffee.mp3",
  "cafe-jazz": "assets/music/cafe-jazz.mp3",
  rain: "assets/music/rain.mp3",
  lofi: "assets/music/lofi.mp3"
};
const OLD_DEFAULT_ALERT_VOLUME = 70;
const OLD_DEFAULT_BGM_VOLUME = 45;
const DEFAULT_ALERT_VOLUME = 91;
const DEFAULT_BGM_VOLUME = 59;
const DESKTOP_VOLUME_BOOST = 1.3;

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
let previousSelectedMenuIndex = null;
let currentStepIndex = 0;
let remainingSeconds = 60;
let timerId = null;
let targetTime = null;
let audioContext = null;
let alertEnabled = true;
let selectedAlertSound = "bell";
let alertVolume = DEFAULT_ALERT_VOLUME;
let bgmEnabled = false;
let selectedBgmTrack = "morning-coffee";
let bgmVolume = DEFAULT_BGM_VOLUME;
let bgmAudio = null;
let bgmSourceNode = null;
let bgmGainNode = null;
let bgmFadeLevel = 1;
let bgmFadeTimer = null;

// 編集内容は「記録」を押すまで保存データと分けて管理します。
let draftMenu = null;
let editingMenuIndex = 0;
let menuIndexBeforeCreate = null;
let saveToastTimer = null;

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

function normalizeVolume(value, fallback) {
  if (value === null || value === "") return fallback;
  const volume = Number(value);
  return Number.isFinite(volume) && volume >= 0 && volume <= 100
    ? Math.round(volume)
    : fallback;
}

function normalizeVolumeWithDefaultMigration(value, oldDefault, newDefault) {
  const volume = normalizeVolume(value, newDefault);
  return value !== null && volume === oldDefault ? newDefault : volume;
}

function normalizeStoredBoolean(value, fallback) {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function loadSoundSettings() {
  try {
    const savedAlertEnabled = localStorage.getItem(ALERT_ENABLED_STORAGE_KEY);
    const savedAlert = localStorage.getItem(ALERT_SOUND_STORAGE_KEY);
    const savedAlertVolume = localStorage.getItem(ALERT_VOLUME_STORAGE_KEY);
    const savedBgmEnabled = localStorage.getItem(BGM_ENABLED_STORAGE_KEY);
    const savedBgmTrack = localStorage.getItem(BGM_TRACK_STORAGE_KEY);
    const savedBgmVolume = localStorage.getItem(BGM_VOLUME_STORAGE_KEY);

    // 旧設定の「None」は、通知音OFFとして引き継ぎます。
    alertEnabled = savedAlertEnabled === null
      ? savedAlert !== "none"
      : normalizeStoredBoolean(savedAlertEnabled, true);
    selectedAlertSound = ALERT_SOUND_KEYS.includes(savedAlert) ? savedAlert : "bell";
    alertVolume = normalizeVolumeWithDefaultMigration(
      savedAlertVolume,
      OLD_DEFAULT_ALERT_VOLUME,
      DEFAULT_ALERT_VOLUME
    );
    bgmEnabled = normalizeStoredBoolean(savedBgmEnabled, false);
    selectedBgmTrack = Object.hasOwn(BGM_TRACKS, savedBgmTrack) ? savedBgmTrack : "morning-coffee";
    bgmVolume = normalizeVolumeWithDefaultMigration(
      savedBgmVolume,
      OLD_DEFAULT_BGM_VOLUME,
      DEFAULT_BGM_VOLUME
    );
  } catch (error) {
    console.warn("音設定を読み込めなかったため、初期値を使用します。", error);
    alertEnabled = true;
    selectedAlertSound = "bell";
    alertVolume = DEFAULT_ALERT_VOLUME;
    bgmEnabled = false;
    selectedBgmTrack = "morning-coffee";
    bgmVolume = DEFAULT_BGM_VOLUME;
  }
}

function saveSoundSettings() {
  try {
    localStorage.setItem(ALERT_ENABLED_STORAGE_KEY, String(alertEnabled));
    localStorage.setItem(ALERT_SOUND_STORAGE_KEY, selectedAlertSound);
    localStorage.setItem(ALERT_VOLUME_STORAGE_KEY, String(alertVolume));
    localStorage.setItem(BGM_ENABLED_STORAGE_KEY, String(bgmEnabled));
    localStorage.setItem(BGM_TRACK_STORAGE_KEY, selectedBgmTrack);
    localStorage.setItem(BGM_VOLUME_STORAGE_KEY, String(bgmVolume));
  } catch (error) {
    console.warn("音設定を保存できませんでした。", error);
  }
}

function renderSoundSettings() {
  alertEnabledInput.checked = alertEnabled;
  alertToggleLabel.textContent = alertEnabled ? "ON" : "OFF";
  alertSoundSelect.value = selectedAlertSound;
  alertVolumeInput.value = String(alertVolume);
  alertVolumeValue.value = String(alertVolume);
  bgmEnabledInput.checked = bgmEnabled;
  bgmTrackSelect.value = selectedBgmTrack;
  bgmVolumeInput.value = String(bgmVolume);
  bgmVolumeValue.value = String(bgmVolume);
  bgmToggleLabel.textContent = bgmEnabled ? "ON" : "OFF";
  updateSoundControlAvailability();
}

function updateSoundControlAvailability() {
  alertSoundSelect.disabled = !alertEnabled;
  alertVolumeInput.disabled = !alertEnabled;
  bgmTrackSelect.disabled = !bgmEnabled;
  bgmVolumeInput.disabled = !bgmEnabled;
}

function getSelectedBgmTrackLabel() {
  return bgmTrackSelect.selectedOptions[0]?.textContent ?? "BGM";
}

function setSoundSettingsOpen(isOpen) {
  soundSettings.hidden = !isOpen;
  soundSettingsButton.setAttribute("aria-expanded", String(isOpen));
  soundSettingsButton.setAttribute("aria-label", isOpen ? "音設定を閉じる" : "音設定を開く");
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
  stopBgm();
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
  const newMenuOption = document.createElement("option");
  newMenuOption.value = NEW_MENU_VALUE;
  newMenuOption.textContent = "＋ 新規メニューを追加";
  menuSelect.append(newMenuOption);
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
  menuIndexBeforeCreate = null;
  draftMenu = cloneMenu(menus[index]);
  editorMessage.textContent = "";
  renderDraft();
  updateMenuActionsAvailability();
}

function startNewMenu() {
  menuIndexBeforeCreate = selectedMenuIndex;
  editingMenuIndex = null;
  draftMenu = {
    name: "",
    steps: [{ name: "蒸らし", minutes: 0, seconds: 30 }]
  };
  editorMessage.textContent = "新しいメニューを編集中です";
  renderDraft();
  closeMenuActions();
  updateMenuActionsAvailability();
  setEditorOpen(true);
  menuNameInput.focus();
}

function setEditorOpen(isOpen) {
  if (!isOpen) closeMenuActions();
  editor.hidden = !isOpen;
  editButton.setAttribute("aria-expanded", String(isOpen));
  editButton.textContent = isOpen ? "閉じる" : "編集";
}

function updateMenuActionsAvailability() {
  const isSavedMenu = editingMenuIndex !== null;
  menuActions.hidden = !isSavedMenu;
  deleteMenuButton.disabled = menus.length <= 1;
  deleteMenuHelp.hidden = menus.length > 1;
}

function setMenuActionsOpen(isOpen) {
  menuActionsPopover.hidden = !isOpen;
  menuActionsButton.setAttribute("aria-expanded", String(isOpen));
}

function closeMenuActions() {
  setMenuActionsOpen(false);
}

function closeEditor() {
  if (editingMenuIndex === null && menuIndexBeforeCreate !== null) {
    selectedMenuIndex = menuIndexBeforeCreate;
    renderMenuSelect();
  }
  openEditorForMenu(selectedMenuIndex);
  setEditorOpen(false);
}

function showToast(message) {
  if (saveToastTimer !== null) window.clearTimeout(saveToastTimer);
  saveToast.textContent = message;
  saveToast.classList.add("is-visible");
  saveToastTimer = window.setTimeout(() => {
    saveToast.classList.remove("is-visible");
    saveToast.textContent = "";
    saveToastTimer = null;
  }, 2500);
}

function prepareAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (audioContext === null || audioContext.state === "closed") audioContext = new AudioContext();
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  } catch (error) {
    console.warn("音声を準備できませんでした。", error);
    return null;
  }
}

function isMobileAudioDevice() {
  const userAgent = navigator.userAgent || "";
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(userAgent)
    || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
}

function getEffectiveVolumeScale(volume) {
  const platformBoost = isMobileAudioDevice() ? 1 : DESKTOP_VOLUME_BOOST;
  return (volume / 100) * platformBoost;
}

function getDirectAudioVolume(volume, fadeLevel = 1) {
  return Math.min(1, Math.max(0, getEffectiveVolumeScale(volume) * fadeLevel));
}

function playTone({ frequency, type, volume, duration, startOffset = 0, endFrequency = null }) {
  const context = prepareAudio();
  if (!context) return;

  const startTime = context.currentTime + startOffset;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  if (endFrequency !== null) {
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);
  }
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playBellSound() {
  const volumeScale = getEffectiveVolumeScale(alertVolume);
  playTone({ frequency: 880, type: "sine", volume: 0.16 * volumeScale, duration: 0.55 });
  playTone({ frequency: 1320, type: "sine", volume: 0.08 * volumeScale, duration: 0.4, startOffset: 0.04 });
}

function playWoodSound() {
  const volumeScale = getEffectiveVolumeScale(alertVolume);
  playTone({
    frequency: 260,
    endFrequency: 110,
    type: "triangle",
    volume: 0.2 * volumeScale,
    duration: 0.16
  });
}

function playSoftSound() {
  playTone({ frequency: 520, type: "sine", volume: 0.09 * getEffectiveVolumeScale(alertVolume), duration: 0.3 });
}

function playAlertSound() {
  if (!alertEnabled || alertVolume === 0) return;

  try {
    if (selectedAlertSound === "bell") playBellSound();
    if (selectedAlertSound === "wood") playWoodSound();
    if (selectedAlertSound === "soft") playSoftSound();
  } catch (error) {
    console.warn("通知音を再生できませんでした。", error);
  }
}

function clearBgmFade() {
  if (bgmFadeTimer !== null) {
    window.clearInterval(bgmFadeTimer);
    bgmFadeTimer = null;
  }
  bgmFadeLevel = 1;
}

function disconnectBgmAudioGraph() {
  if (bgmSourceNode !== null) {
    bgmSourceNode.disconnect();
  }
  if (bgmGainNode !== null) {
    bgmGainNode.disconnect();
  }
  bgmSourceNode = null;
  bgmGainNode = null;
}

function connectBgmAudioGraph(audio) {
  if (bgmSourceNode !== null && bgmGainNode !== null) return true;

  const context = prepareAudio();
  if (!context || typeof context.createMediaElementSource !== "function") return false;

  try {
    bgmSourceNode = context.createMediaElementSource(audio);
    bgmGainNode = context.createGain();
    bgmSourceNode.connect(bgmGainNode);
    bgmGainNode.connect(context.destination);
    return true;
  } catch (error) {
    console.warn("BGM縺ｮ髻ｳ驥上ヮ繝ｼ繝峨ｒ菴懈・縺ｧ縺阪∪縺帙ｓ縺ｧ縺励◆縲・", error);
    disconnectBgmAudioGraph();
    return false;
  }
}

function updateBgmOutputVolume() {
  if (bgmAudio === null) return;

  const volume = Math.max(0, getEffectiveVolumeScale(bgmVolume) * bgmFadeLevel);
  if (bgmGainNode !== null && audioContext !== null && audioContext.state !== "closed") {
    bgmAudio.volume = 1;
    bgmGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    return;
  }

  bgmAudio.volume = Math.min(1, volume);
}

function loadBgmTrack(trackKey) {
  clearBgmFade();
  disconnectBgmAudioGraph();
  if (bgmAudio !== null) {
    bgmAudio.pause();
    bgmAudio.removeAttribute("src");
    bgmAudio.load();
  }
  bgmAudio = null;
  bgmStatus.textContent = "";

  const filePath = BGM_TRACKS[trackKey];
  if (!filePath) return null;

  const audio = new Audio();
  audio.loop = true;
  audio.preload = "none";
  audio.volume = getDirectAudioVolume(bgmVolume);
  audio.src = filePath;
  audio.addEventListener("error", () => {
    if (bgmAudio === audio) {
      bgmStatus.textContent = "BGMファイルが見つかりません";
    }
  });
  bgmAudio = audio;
  return bgmAudio;
}

function playBgm() {
  if (!bgmEnabled || selectedBgmTrack === "none") return;
  clearBgmFade();
  const audio = bgmAudio ?? loadBgmTrack(selectedBgmTrack);
  if (!audio) return;

  connectBgmAudioGraph(audio);
  updateBgmOutputVolume();
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        if (bgmAudio === audio) bgmStatus.textContent = `${getSelectedBgmTrackLabel()} 再生中`;
      })
      .catch(() => {
        if (bgmAudio === audio) bgmStatus.textContent = "BGMファイルが見つかりません";
      });
  }
}

function pauseBgm() {
  clearBgmFade();
  if (bgmAudio !== null) bgmAudio.pause();
  bgmStatus.textContent = "";
}

function stopBgm() {
  clearBgmFade();
  if (bgmAudio === null) {
    bgmStatus.textContent = "";
    return;
  }
  bgmAudio.pause();
  if (bgmAudio.readyState > 0) bgmAudio.currentTime = 0;
  updateBgmOutputVolume();
  bgmStatus.textContent = "";
}

function fadeOutBgm() {
  clearBgmFade();
  if (bgmAudio === null || bgmAudio.paused) {
    stopBgm();
    return;
  }

  const audio = bgmAudio;
  const steps = 15;
  let currentStep = 0;
  bgmFadeTimer = window.setInterval(() => {
    currentStep += 1;
    bgmFadeLevel = Math.max(0, 1 - currentStep / steps);
    updateBgmOutputVolume();
    if (currentStep >= steps) {
      clearBgmFade();
      if (bgmAudio === audio) stopBgm();
    }
  }, 100);
}

function finishCurrentStep() {
  playAlertSound();
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
  fadeOutBgm();
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
  playBgm();
}

function pauseTimer() {
  if (timerId === null) return;
  remainingSeconds = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
  stopInterval();
  pauseBgm();
  updateDisplay();
  statusText.textContent = "一時停止";
}

menuSelect.addEventListener("change", () => {
  if (menuSelect.value === NEW_MENU_VALUE) {
    startNewMenu();
    return;
  }
  previousSelectedMenuIndex = selectedMenuIndex;
  selectedMenuIndex = Number(menuSelect.value);
  resetToFirstStep();
  openEditorForMenu(selectedMenuIndex);
  saveMenus();
});

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetToFirstStep);

soundSettingsButton.addEventListener("click", () => {
  setSoundSettingsOpen(soundSettings.hidden);
});

soundSettingsClose.addEventListener("click", () => setSoundSettingsOpen(false));
soundSettingsCloseBottom.addEventListener("click", () => setSoundSettingsOpen(false));

alertEnabledInput.addEventListener("change", () => {
  alertEnabled = alertEnabledInput.checked;
  alertToggleLabel.textContent = alertEnabled ? "ON" : "OFF";
  updateSoundControlAvailability();
  saveSoundSettings();
});

alertSoundSelect.addEventListener("change", () => {
  selectedAlertSound = ALERT_SOUND_KEYS.includes(alertSoundSelect.value)
    ? alertSoundSelect.value
    : "bell";
  saveSoundSettings();
});

function handleAlertVolumeChange() {
  alertVolume = normalizeVolume(alertVolumeInput.value, DEFAULT_ALERT_VOLUME);
  alertVolumeValue.value = String(alertVolume);
  saveSoundSettings();
}

alertVolumeInput.addEventListener("input", handleAlertVolumeChange);
alertVolumeInput.addEventListener("change", handleAlertVolumeChange);

bgmEnabledInput.addEventListener("change", () => {
  bgmEnabled = bgmEnabledInput.checked;
  bgmToggleLabel.textContent = bgmEnabled ? "ON" : "OFF";
  bgmStatus.textContent = "";
  updateSoundControlAvailability();
  saveSoundSettings();
  if (bgmEnabled && timerId !== null) {
    playBgm();
  } else if (!bgmEnabled) {
    stopBgm();
  }
});

function handleBgmVolumeChange() {
  bgmVolume = normalizeVolume(bgmVolumeInput.value, DEFAULT_BGM_VOLUME);
  bgmVolumeValue.value = String(bgmVolume);
  updateBgmOutputVolume();
  saveSoundSettings();
}

bgmVolumeInput.addEventListener("input", handleBgmVolumeChange);
bgmVolumeInput.addEventListener("change", handleBgmVolumeChange);

bgmTrackSelect.addEventListener("change", () => {
  selectedBgmTrack = Object.hasOwn(BGM_TRACKS, bgmTrackSelect.value)
    ? bgmTrackSelect.value
    : "morning-coffee";
  loadBgmTrack(selectedBgmTrack);
  saveSoundSettings();
  if (bgmEnabled && timerId !== null) playBgm();
});

editButton.addEventListener("click", () => {
  const willOpen = editor.hidden;
  if (willOpen) {
    openEditorForMenu(selectedMenuIndex);
    setEditorOpen(true);
  } else {
    closeEditor();
  }
});

menuActionsButton.addEventListener("click", () => {
  const willOpen = menuActionsPopover.hidden;
  setMenuActionsOpen(willOpen);
  if (willOpen && !deleteMenuButton.disabled) deleteMenuButton.focus();
});

document.addEventListener("click", (event) => {
  if (!menuActions.contains(event.target)) closeMenuActions();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!deleteMenuDialog.hidden) {
    closeDeleteDialog();
  } else if (!menuActionsPopover.hidden) {
    closeMenuActions();
    menuActionsButton.focus();
  }
});

deleteMenuButton.addEventListener("click", () => {
  if (editingMenuIndex === null || menus.length <= 1 || !menus[editingMenuIndex]) return;
  deleteMenuDescription.textContent = `「${menus[editingMenuIndex].name}」を削除します。この操作は元に戻せません。`;
  closeMenuActions();
  deleteMenuDialog.hidden = false;
  cancelDeleteMenuButton.focus();
});

function closeDeleteDialog(restoreFocus = true) {
  deleteMenuDialog.hidden = true;
  if (restoreFocus && !menuActions.hidden) menuActionsButton.focus();
}

cancelDeleteMenuButton.addEventListener("click", () => closeDeleteDialog());

deleteMenuDialog.addEventListener("click", (event) => {
  if (event.target === deleteMenuDialog) closeDeleteDialog();
});

deleteMenuDialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const firstButton = cancelDeleteMenuButton;
  const lastButton = confirmDeleteMenuButton;
  if (event.shiftKey && document.activeElement === firstButton) {
    event.preventDefault();
    lastButton.focus();
  } else if (!event.shiftKey && document.activeElement === lastButton) {
    event.preventDefault();
    firstButton.focus();
  }
});

confirmDeleteMenuButton.addEventListener("click", () => {
  const deleteIndex = editingMenuIndex;
  if (deleteIndex === null || menus.length <= 1 || !menus[deleteIndex]) return;

  menus.splice(deleteIndex, 1);
  if (
    previousSelectedMenuIndex !== null &&
    previousSelectedMenuIndex !== deleteIndex &&
    previousSelectedMenuIndex >= 0 &&
    previousSelectedMenuIndex <= menus.length
  ) {
    selectedMenuIndex = previousSelectedMenuIndex > deleteIndex
      ? previousSelectedMenuIndex - 1
      : previousSelectedMenuIndex;
  } else {
    selectedMenuIndex = 0;
  }
  previousSelectedMenuIndex = null;
  closeDeleteDialog(false);
  renderMenuSelect();
  resetToFirstStep();
  saveMenus();
  openEditorForMenu(selectedMenuIndex);
  setEditorOpen(false);
  showToast("メニューを削除しました");
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
  setEditorOpen(false);
  showToast("メニューを保存しました");
});

menus = loadMenus();
selectedMenuIndex = loadSelectedMenuIndex();
loadSoundSettings();
renderMenuSelect();
renderSoundSettings();
setSoundSettingsOpen(false);
resetToFirstStep();
openEditorForMenu(selectedMenuIndex);
saveMenus();
