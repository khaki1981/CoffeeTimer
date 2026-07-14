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
const quickWaterGuideToggle = document.getElementById("quick-water-guide-toggle");
const quickWaterGuideDetails = document.getElementById("quick-water-guide-details");
const quickWaterServingsSelect = document.getElementById("quick-water-servings");
const quickWaterCoffee = document.getElementById("quick-water-coffee");
const quickWaterTotal = document.getElementById("quick-water-total");
const quickWaterDetailsButton = document.getElementById("quick-water-details-button");
const quickWaterDetails = document.getElementById("quick-water-details");
const quickWaterBeansInput = document.getElementById("quick-water-beans-per-serving");
const quickWaterWaterInput = document.getElementById("quick-water-water-per-serving");
const quickWaterMessage = document.getElementById("quick-water-message");
const quickWaterCreateMenuButton = document.getElementById("quick-water-create-menu");
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
const waterGuideEditor = document.getElementById("water-guide-editor");
const pourModeEditor = document.getElementById("pour-mode-editor");
const waterGuideFields = document.getElementById("water-guide-fields");
const waterGuideSummary = document.getElementById("water-guide-summary");
const waterGuideMessage = document.getElementById("water-guide-message");
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
const QUICK_WATER_GUIDE_STORAGE_KEY = "coffee-timer-quick-water-guide";
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
const AVAILABLE_BGM_TRACK_KEYS = ["none", "morning-coffee"];
const BGM_DEBUG_EVENTS = [
  "play",
  "playing",
  "pause",
  "ended",
  "waiting",
  "stalled",
  "abort",
  "error",
  "loadedmetadata",
  "canplay"
];
const OLD_DEFAULT_ALERT_VOLUME = 70;
const OLD_DEFAULT_BGM_VOLUME = 45;
const DEFAULT_ALERT_VOLUME = 91;
const DEFAULT_BGM_VOLUME = 59;
const DESKTOP_VOLUME_BOOST = 1.3;
const WATER_GUIDE_MODES = ["none", "servings", "ratio", "direct"];
const WATER_DISPLAY_MODES = ["both", "cumulative", "hidden"];
const POUR_MODES = ["percentage", "grams", "none"];
const DEFAULT_WATER_GUIDE = {
  mode: "none",
  servings: 1,
  beansPerServingGrams: 12,
  waterPerServingGrams: 200,
  coffeeGrams: 12,
  totalWaterGrams: 200,
  brewRatio: 16.7,
  displayMode: "both",
  pourMode: "none"
};
const DEFAULT_QUICK_WATER_GUIDE = {
  servings: 1,
  beansPerServingGrams: 12,
  waterPerServingGrams: 200
};

const DEFAULT_MENUS = [
  {
    name: "メニュー1",
    waterGuide: { ...DEFAULT_WATER_GUIDE },
    steps: [
      { name: "蒸らし", minutes: 1, seconds: 0, pourPercent: null, pourGrams: null },
      { name: "2投目", minutes: 0, seconds: 30, pourPercent: null, pourGrams: null },
      { name: "3投目", minutes: 0, seconds: 30, pourPercent: null, pourGrams: null },
      { name: "4投目", minutes: 0, seconds: 30, pourPercent: null, pourGrams: null }
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
let quickWaterGuide = { ...DEFAULT_QUICK_WATER_GUIDE };
let bgmAudio = null;
let bgmSourceNode = null;
let bgmGainNode = null;
let bgmFadeLevel = 1;
let bgmFadeTimer = null;
let bgmPlayToken = 0;
let bgmDesiredPlaying = false;

// 編集内容は「記録」を押すまで保存データと分けて管理します。
let draftMenu = null;
let editingMenuIndex = 0;
let menuIndexBeforeCreate = null;
let saveToastTimer = null;

function normalizePositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function normalizeMinimumNumber(value, fallback, minimum) {
  const number = Number(value);
  return Number.isFinite(number) && number >= minimum ? number : fallback;
}

function normalizePourGrams(value) {
  if (value === undefined || value === null || value === "") return null;

  const grams = Number(value);
  return Number.isFinite(grams) && grams >= 0 ? grams : null;
}

function normalizePourPercent(value) {
  if (value === undefined || value === null || value === "") return null;

  const percent = Number(value);
  return Number.isFinite(percent) && percent >= 0 && percent <= 100 ? percent : null;
}

function normalizeWaterGuide(waterGuide) {
  const source = waterGuide && typeof waterGuide === "object" ? waterGuide : {};
  const mode = WATER_GUIDE_MODES.includes(source.mode) ? source.mode : DEFAULT_WATER_GUIDE.mode;
  const displayMode = WATER_DISPLAY_MODES.includes(source.displayMode)
    ? source.displayMode
    : DEFAULT_WATER_GUIDE.displayMode;
  const pourMode = POUR_MODES.includes(source.pourMode)
    ? source.pourMode
    : mode === "none"
      ? "none"
      : "grams";

  return {
    mode,
    servings: normalizeMinimumNumber(source.servings, DEFAULT_WATER_GUIDE.servings, 1),
    beansPerServingGrams: normalizePositiveNumber(
      source.beansPerServingGrams,
      DEFAULT_WATER_GUIDE.beansPerServingGrams
    ),
    waterPerServingGrams: normalizePositiveNumber(
      source.waterPerServingGrams,
      DEFAULT_WATER_GUIDE.waterPerServingGrams
    ),
    coffeeGrams: normalizePositiveNumber(source.coffeeGrams, DEFAULT_WATER_GUIDE.coffeeGrams),
    totalWaterGrams: normalizePositiveNumber(source.totalWaterGrams, DEFAULT_WATER_GUIDE.totalWaterGrams),
    brewRatio: normalizePositiveNumber(source.brewRatio, DEFAULT_WATER_GUIDE.brewRatio),
    displayMode,
    pourMode
  };
}

function normalizeQuickWaterGuide(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    servings: Math.min(10, Math.max(1, Math.round(normalizeMinimumNumber(
      source.servings,
      DEFAULT_QUICK_WATER_GUIDE.servings,
      1
    )))),
    beansPerServingGrams: normalizePositiveNumber(
      source.beansPerServingGrams,
      DEFAULT_QUICK_WATER_GUIDE.beansPerServingGrams
    ),
    waterPerServingGrams: normalizePositiveNumber(
      source.waterPerServingGrams,
      DEFAULT_QUICK_WATER_GUIDE.waterPerServingGrams
    )
  };
}

function calculateQuickWaterGuide(guide) {
  const normalized = normalizeQuickWaterGuide(guide);
  const coffeeGrams = Math.round(normalized.servings * normalized.beansPerServingGrams);
  const totalWaterGrams = Math.round(normalized.servings * normalized.waterPerServingGrams);
  const brewRatio = Math.round((normalized.waterPerServingGrams / normalized.beansPerServingGrams) * 10) / 10;
  return {
    ...normalized,
    coffeeGrams,
    totalWaterGrams,
    brewRatio
  };
}

function createWaterGuideFromQuickGuide(guide) {
  const calculated = calculateQuickWaterGuide(guide);
  return normalizeWaterGuide({
    mode: "servings",
    servings: calculated.servings,
    beansPerServingGrams: calculated.beansPerServingGrams,
    waterPerServingGrams: calculated.waterPerServingGrams,
    coffeeGrams: calculated.coffeeGrams,
    totalWaterGrams: calculated.totalWaterGrams,
    brewRatio: calculated.brewRatio,
    displayMode: DEFAULT_WATER_GUIDE.displayMode,
    pourMode: "percentage"
  });
}

function cloneMenu(menu) {
  return {
    name: menu.name,
    waterGuide: normalizeWaterGuide(menu.waterGuide),
    steps: menu.steps.map((step) => ({
      name: step.name,
      minutes: step.minutes,
      seconds: step.seconds,
      pourPercent: normalizePourPercent(step.pourPercent),
      pourGrams: normalizePourGrams(step.pourGrams)
    }))
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

      steps.push({
        name: getStepName(index),
        minutes,
        seconds,
        pourPercent: normalizePourPercent(menu.steps[index]?.pourPercent),
        pourGrams: normalizePourGrams(menu.steps[index]?.pourGrams)
      });
    }

    names.add(menuName);
    normalized.push({
      name: menuName,
      waterGuide: normalizeWaterGuide(menu.waterGuide),
      steps
    });
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

function loadQuickWaterGuide() {
  try {
    const saved = localStorage.getItem(QUICK_WATER_GUIDE_STORAGE_KEY);
    return normalizeQuickWaterGuide(saved === null ? null : JSON.parse(saved));
  } catch (error) {
    console.warn("かんたん湯量ガイド設定を読み込めませんでした。", error);
    return { ...DEFAULT_QUICK_WATER_GUIDE };
  }
}

function saveQuickWaterGuide() {
  try {
    localStorage.setItem(QUICK_WATER_GUIDE_STORAGE_KEY, JSON.stringify(quickWaterGuide));
  } catch (error) {
    console.warn("かんたん湯量ガイド設定を保存できませんでした。", error);
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

function isAvailableBgmTrack(trackKey) {
  return AVAILABLE_BGM_TRACK_KEYS.includes(trackKey);
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
    selectedBgmTrack = isAvailableBgmTrack(savedBgmTrack) ? savedBgmTrack : "morning-coffee";
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

function setupQuickWaterGuideOptions() {
  if (!quickWaterServingsSelect) return;
  quickWaterServingsSelect.replaceChildren();
  for (let servings = 1; servings <= 10; servings += 1) {
    const option = document.createElement("option");
    option.value = String(servings);
    option.textContent = `${servings}人分`;
    quickWaterServingsSelect.append(option);
  }
}

function readQuickWaterGuideInputs() {
  const servings = Number(quickWaterServingsSelect?.value);
  const beansPerServingGrams = Number(quickWaterBeansInput?.value);
  const waterPerServingGrams = Number(quickWaterWaterInput?.value);
  const isValid = (
    Number.isFinite(servings) &&
    servings >= 1 &&
    servings <= 10 &&
    Number.isFinite(beansPerServingGrams) &&
    beansPerServingGrams > 0 &&
    Number.isFinite(waterPerServingGrams) &&
    waterPerServingGrams > 0
  );

  return {
    isValid,
    guide: {
      servings,
      beansPerServingGrams,
      waterPerServingGrams
    }
  };
}

function renderQuickWaterGuide(syncInputs = true) {
  if (!quickWaterServingsSelect || !quickWaterCoffee || !quickWaterTotal) return;

  const source = syncInputs ? { isValid: true, guide: quickWaterGuide } : readQuickWaterGuideInputs();

  if (!source.isValid) {
    quickWaterCoffee.textContent = "-";
    quickWaterTotal.textContent = "-";
    if (quickWaterMessage) quickWaterMessage.textContent = "1人分の豆量と湯量は0より大きい数値で入力してください。";
    return;
  }

  quickWaterGuide = normalizeQuickWaterGuide(source.guide);
  const calculated = calculateQuickWaterGuide(quickWaterGuide);

  if (syncInputs) {
    quickWaterServingsSelect.value = String(calculated.servings);
    if (quickWaterBeansInput) quickWaterBeansInput.value = String(calculated.beansPerServingGrams);
    if (quickWaterWaterInput) quickWaterWaterInput.value = String(calculated.waterPerServingGrams);
  }

  quickWaterCoffee.textContent = `${formatWaterNumber(calculated.coffeeGrams)}g`;
  quickWaterTotal.textContent = `${formatWaterNumber(calculated.totalWaterGrams)}g`;
  if (quickWaterMessage) quickWaterMessage.textContent = "";
}

function setQuickWaterGuideDetailsOpen(isOpen) {
  if (!quickWaterGuideDetails || !quickWaterGuideToggle) return;
  quickWaterGuideDetails.hidden = !isOpen;
  quickWaterGuideToggle.setAttribute("aria-expanded", String(isOpen));
  quickWaterGuideToggle.setAttribute(
    "aria-label",
    isOpen ? "かんたん湯量ガイドの詳細を閉じる" : "かんたん湯量ガイドの詳細を開く"
  );
  quickWaterGuideToggle.classList.toggle("is-open", isOpen);
  if (!isOpen) setQuickWaterDetailsOpen(false);
}

function setQuickWaterDetailsOpen(isOpen) {
  if (!quickWaterDetails || !quickWaterDetailsButton) return;
  quickWaterDetails.hidden = !isOpen;
  quickWaterDetailsButton.setAttribute("aria-expanded", String(isOpen));
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

function formatWaterNumber(value, digits = 0) {
  if (!Number.isFinite(value)) return "-";
  return digits > 0 ? value.toFixed(digits) : String(Math.round(value));
}

function formatPercentNumber(value) {
  if (!Number.isFinite(value)) return "-";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function setWaterGuideValue(key, value) {
  draftMenu.waterGuide = normalizeWaterGuide({
    ...draftMenu.waterGuide,
    [key]: value
  });
}

function updateWaterGuideCalculatedValues() {
  const guide = normalizeWaterGuide(draftMenu.waterGuide);
  if (guide.mode === "servings") {
    guide.coffeeGrams = Math.round(guide.servings * guide.beansPerServingGrams);
    guide.totalWaterGrams = Math.round(guide.servings * guide.waterPerServingGrams);
  } else if (guide.mode === "ratio") {
    guide.totalWaterGrams = Math.round(guide.coffeeGrams * guide.brewRatio);
  } else if (guide.mode === "direct") {
    guide.brewRatio = Math.round((guide.totalWaterGrams / guide.coffeeGrams) * 10) / 10;
  }
  draftMenu.waterGuide = guide;
  return guide;
}

function getStepPourTotal() {
  if (draftMenu.waterGuide.pourMode === "percentage") {
    const calculated = calculateStepPourGrams(draftMenu.steps, draftMenu.waterGuide.totalWaterGrams);
    return calculated.totalGrams;
  }
  return draftMenu.steps.reduce((sum, step) => sum + (normalizePourGrams(step.pourGrams) ?? 0), 0);
}

function getStepPourTotalUntil(index) {
  if (draftMenu.waterGuide.pourMode === "percentage") {
    const calculated = calculateStepPourGrams(draftMenu.steps, draftMenu.waterGuide.totalWaterGrams);
    return calculated.items[index]?.cumulativeGrams ?? 0;
  }
  return draftMenu.steps
    .slice(0, index + 1)
    .reduce((sum, step) => sum + (normalizePourGrams(step.pourGrams) ?? 0), 0);
}

function calculateStepPourGrams(steps, totalWaterGrams) {
  const totalWater = normalizePourGrams(totalWaterGrams) ?? 0;
  const percents = steps.map((step) => normalizePourPercent(step.pourPercent));
  const percentTotal = percents.reduce((sum, percent) => sum + (percent ?? 0), 0);
  const isComplete = Math.abs(percentTotal - 100) < 0.001;
  const lastValidIndex = percents.reduce((lastIndex, percent, index) => (
    percent === null ? lastIndex : index
  ), -1);
  let runningTotal = 0;

  const items = percents.map((percent, index) => {
    let grams = percent === null ? null : Math.round(totalWater * percent / 100);
    if (isComplete && index === lastValidIndex) {
      grams = Math.max(0, totalWater - runningTotal);
    }
    if (grams !== null) runningTotal += grams;
    return {
      pourGrams: grams,
      cumulativeGrams: runningTotal
    };
  });

  return {
    items,
    percentTotal,
    totalGrams: runningTotal
  };
}

function getWaterModeLabel(mode) {
  if (mode === "servings") return "人数から";
  if (mode === "ratio") return "比率から";
  if (mode === "direct") return "豆量と湯量";
  return "使わない";
}

function getWaterGuideSummary(guide) {
  if (guide.mode === "servings") {
    return `${formatWaterNumber(guide.servings)}人分 / 豆${formatWaterNumber(guide.coffeeGrams)}g / 湯${formatWaterNumber(guide.totalWaterGrams)}g`;
  }
  if (guide.mode === "ratio") {
    return `豆${formatWaterNumber(guide.coffeeGrams)}g / 1:${formatWaterNumber(guide.brewRatio, 1)} / 湯${formatWaterNumber(guide.totalWaterGrams)}g`;
  }
  if (guide.mode === "direct") {
    return `豆${formatWaterNumber(guide.coffeeGrams)}g / 湯${formatWaterNumber(guide.totalWaterGrams)}g / 1:${formatWaterNumber(guide.brewRatio, 1)}`;
  }
  return "使わない";
}

function createWaterNumberField({ key, label, value, unit, min = "0.1", step = "1", readonly = false }) {
  const field = document.createElement("label");
  field.className = readonly ? "water-field is-readonly" : "water-field";

  const text = document.createElement("span");
  text.textContent = label;

  const control = document.createElement("span");
  control.className = "water-input-shell";

  const input = document.createElement("input");
  input.type = "number";
  input.min = min;
  input.step = step;
  input.inputMode = "decimal";
  input.value = value === null || value === undefined ? "" : String(value);
  input.dataset.waterKey = key;
  input.readOnly = readonly;
  if (readonly) input.tabIndex = -1;

  const unitText = document.createElement("span");
  unitText.className = "water-unit";
  unitText.textContent = unit;

  control.append(input, unitText);
  field.append(text, control);
  return field;
}

function renderPourModeEditor(guide) {
  if (!pourModeEditor) return;
  pourModeEditor.replaceChildren();

  if (guide.mode === "none") {
    pourModeEditor.hidden = true;
    return;
  }

  pourModeEditor.hidden = false;

  const title = document.createElement("p");
  title.className = "pour-mode-title";
  title.textContent = "各工程の注ぐ量";

  const group = document.createElement("div");
  group.className = "pour-mode-options";
  group.role = "radiogroup";
  group.setAttribute("aria-label", "各工程の注ぐ量");

  [
    ["percentage", "割合で自動計算", "総湯量に追従"],
    ["grams", "グラムを直接入力", "工程ごとに固定"],
    ["none", "設定しない", "時間だけ設定"]
  ].forEach(([value, label, description]) => {
    const card = document.createElement("label");
    const input = document.createElement("input");
    const text = document.createElement("span");
    const small = document.createElement("small");

    card.className = "water-mode-card pour-mode-card";
    input.type = "radio";
    input.name = "water-pour-mode";
    input.value = value;
    input.checked = guide.pourMode === value;
    card.classList.toggle("is-selected", input.checked);
    text.textContent = label;
    small.textContent = description;
    card.append(input, text, small);
    group.append(card);
  });

  pourModeEditor.append(title, group);
}

function renderWaterGuideEditor() {
  if (!waterGuideEditor || !waterGuideFields || !waterGuideSummary || !waterGuideMessage) return;

  const guide = updateWaterGuideCalculatedValues();
  waterGuideSummary.textContent = getWaterGuideSummary(guide);
  renderPourModeEditor(guide);
  waterGuideEditor.querySelectorAll('input[name="water-guide-mode"]').forEach((input) => {
    input.checked = input.value === guide.mode;
    input.closest(".water-mode-card")?.classList.toggle("is-selected", input.checked);
  });

  waterGuideFields.replaceChildren();
  waterGuideMessage.textContent = "";
  waterGuideMessage.classList.remove("is-warning", "is-ok");

  if (guide.mode === "none") {
    const note = document.createElement("p");
    note.className = "water-guide-note";
    note.textContent = "湯量ガイドを使わず、従来どおり時間だけを設定します。";
    waterGuideFields.append(note);
    return;
  }

  if (guide.mode === "servings") {
    waterGuideFields.append(
      createWaterNumberField({ key: "servings", label: "人数", value: guide.servings, unit: "人", min: "1" }),
      createWaterNumberField({ key: "beansPerServingGrams", label: "1人分の豆量", value: guide.beansPerServingGrams, unit: "g" }),
      createWaterNumberField({ key: "waterPerServingGrams", label: "1人分の湯量", value: guide.waterPerServingGrams, unit: "g" }),
      createWaterNumberField({ key: "coffeeGrams", label: "合計豆量", value: guide.coffeeGrams, unit: "g", readonly: true }),
      createWaterNumberField({ key: "totalWaterGrams", label: "総湯量", value: guide.totalWaterGrams, unit: "g", readonly: true })
    );
  }

  if (guide.mode === "ratio") {
    waterGuideFields.append(
      createWaterNumberField({ key: "coffeeGrams", label: "豆量", value: guide.coffeeGrams, unit: "g" }),
      createWaterNumberField({ key: "brewRatio", label: "抽出比率 1:", value: guide.brewRatio, unit: "", step: "0.1" }),
      createWaterNumberField({ key: "totalWaterGrams", label: "総湯量", value: guide.totalWaterGrams, unit: "g", readonly: true })
    );
  }

  if (guide.mode === "direct") {
    waterGuideFields.append(
      createWaterNumberField({ key: "coffeeGrams", label: "豆量", value: guide.coffeeGrams, unit: "g" }),
      createWaterNumberField({ key: "totalWaterGrams", label: "総湯量", value: guide.totalWaterGrams, unit: "g" }),
      createWaterNumberField({ key: "brewRatio", label: "参考比率 1:", value: guide.brewRatio, unit: "", step: "0.1", readonly: true })
    );
  }
}

function renderPourSummary() {
  if (!waterGuideMessage) return;
  waterGuideMessage.replaceChildren();
  waterGuideMessage.classList.remove("is-warning", "is-ok");

  if (draftMenu.waterGuide.mode === "none" || draftMenu.waterGuide.pourMode === "none") {
    waterGuideMessage.hidden = true;
    return;
  }

  waterGuideMessage.hidden = false;

  if (draftMenu.waterGuide.pourMode === "percentage") {
    const calculated = calculateStepPourGrams(draftMenu.steps, draftMenu.waterGuide.totalWaterGrams);
    const totalWater = draftMenu.waterGuide.totalWaterGrams;
    const percentDiff = 100 - calculated.percentTotal;
    const gramDiff = totalWater - calculated.totalGrams;
    const isComplete = Math.abs(percentDiff) < 0.001;
    const summary = document.createElement("p");
    const totals = document.createElement("p");
    const actions = document.createElement("div");

    waterGuideMessage.classList.toggle("is-ok", isComplete);
    waterGuideMessage.classList.toggle("is-warning", !isComplete);
    summary.textContent = isComplete
      ? `配分合計 ${formatPercentNumber(calculated.percentTotal)}%`
      : percentDiff > 0
        ? `配分合計 ${formatPercentNumber(calculated.percentTotal)}%（あと${formatPercentNumber(percentDiff)}%必要です）`
        : `配分合計 ${formatPercentNumber(calculated.percentTotal)}%（${formatPercentNumber(Math.abs(percentDiff))}%多く設定されています）`;
    totals.textContent = isComplete
      ? `工程合計 ${formatWaterNumber(calculated.totalGrams)}g / 総湯量 ${formatWaterNumber(totalWater)}g`
      : gramDiff > 0
        ? `工程合計 ${formatWaterNumber(calculated.totalGrams)}g / 総湯量 ${formatWaterNumber(totalWater)}g（あと${formatWaterNumber(gramDiff)}gです）`
        : `工程合計 ${formatWaterNumber(calculated.totalGrams)}g / 総湯量 ${formatWaterNumber(totalWater)}g（${formatWaterNumber(Math.abs(gramDiff))}g多いです）`;

    actions.className = "pour-summary-actions";
    const evenButton = document.createElement("button");
    evenButton.type = "button";
    evenButton.className = "secondary-action-button";
    evenButton.dataset.pourAction = "distribute-evenly";
    evenButton.textContent = "均等に分ける";
    actions.append(evenButton);

    if (!isComplete) {
      const adjustButton = document.createElement("button");
      adjustButton.type = "button";
      adjustButton.className = "secondary-action-button";
      adjustButton.dataset.pourAction = "adjust-last";
      adjustButton.textContent = "最後の工程を調整";
      actions.append(adjustButton);
    }

    waterGuideMessage.append(summary, totals, actions);
    return;
  }

  if (!waterGuideMessage || draftMenu.waterGuide.mode === "none") {
    if (waterGuideMessage) {
      waterGuideMessage.textContent = "";
      waterGuideMessage.classList.remove("is-warning", "is-ok");
    }
    return;
  }

  const totalPour = getStepPourTotal();
  const totalWater = draftMenu.waterGuide.totalWaterGrams;
  const diff = totalWater - totalPour;
  waterGuideMessage.classList.toggle("is-warning", diff !== 0);
  waterGuideMessage.classList.toggle("is-ok", diff === 0);
  waterGuideMessage.textContent = diff === 0
    ? `工程合計 ${formatWaterNumber(totalPour)}g / 総湯量 ${formatWaterNumber(totalWater)}g`
    : `工程合計 ${formatWaterNumber(totalPour)}g / 総湯量 ${formatWaterNumber(totalWater)}g（差 ${formatWaterNumber(Math.abs(diff))}g）`;
}

function updateWaterCalculatedField(key, value) {
  const input = waterGuideFields?.querySelector(`[data-water-key="${key}"][readonly]`);
  if (input) input.value = value === null || value === undefined ? "" : String(value);
}

function updateWaterGuideOutput() {
  const guide = updateWaterGuideCalculatedValues();
  if (waterGuideSummary) waterGuideSummary.textContent = getWaterGuideSummary(guide);
  updateWaterCalculatedField("coffeeGrams", guide.coffeeGrams);
  updateWaterCalculatedField("totalWaterGrams", guide.totalWaterGrams);
  updateWaterCalculatedField("brewRatio", guide.brewRatio);
  updateStepWaterDisplays();
}

function updateStepWaterDisplays() {
  const calculated = calculateStepPourGrams(draftMenu.steps, draftMenu.waterGuide.totalWaterGrams);
  stepList.querySelectorAll(".step-row").forEach((row) => {
    const index = Number(row.dataset.stepIndex);
    const cumulative = row.querySelector(".step-cumulative");
    const calculatedPour = row.querySelector(".step-calculated-pour");
    if (draftMenu.waterGuide.pourMode === "percentage") {
      const item = calculated.items[index];
      if (calculatedPour) {
        calculatedPour.textContent = item?.pourGrams === null
          ? "注ぐ量 未設定"
          : `注ぐ量 ${formatWaterNumber(item?.pourGrams ?? 0)}g`;
      }
      if (cumulative) cumulative.textContent = `累計 ${formatWaterNumber(item?.cumulativeGrams ?? 0)}g`;
      return;
    }
    if (!cumulative) return;
    const pourValue = normalizePourGrams(draftMenu.steps[index]?.pourGrams);
    cumulative.textContent = pourValue === null
      ? "累計 未設定"
      : `累計 ${formatWaterNumber(getStepPourTotalUntil(index))}g`;
  });
  renderPourSummary();
}

function convertStepValuesForPourMode(nextMode) {
  const currentMode = draftMenu.waterGuide.pourMode;
  const totalWater = normalizePourGrams(draftMenu.waterGuide.totalWaterGrams);

  if (nextMode === "percentage" && currentMode !== "percentage") {
    draftMenu.steps = draftMenu.steps.map((step) => {
      const grams = normalizePourGrams(step.pourGrams);
      const existingPercent = normalizePourPercent(step.pourPercent);
      return {
        ...step,
        pourPercent: totalWater && grams !== null
          ? Math.round((grams / totalWater * 100) * 10) / 10
          : existingPercent ?? 0
      };
    });
  }

  if (nextMode === "grams" && currentMode === "percentage") {
    const calculated = calculateStepPourGrams(draftMenu.steps, draftMenu.waterGuide.totalWaterGrams);
    draftMenu.steps = draftMenu.steps.map((step, index) => ({
      ...step,
      pourGrams: calculated.items[index]?.pourGrams ?? normalizePourGrams(step.pourGrams)
    }));
  }

  draftMenu.waterGuide = normalizeWaterGuide({
    ...draftMenu.waterGuide,
    pourMode: nextMode
  });
}

function adjustLastStepPercent() {
  if (draftMenu.steps.length === 0) return false;
  const lastIndex = draftMenu.steps.length - 1;
  const previousTotal = draftMenu.steps
    .slice(0, lastIndex)
    .reduce((sum, step) => sum + (normalizePourPercent(step.pourPercent) ?? 0), 0);
  const nextPercent = Math.round((100 - previousTotal) * 10) / 10;
  if (nextPercent < 0 || nextPercent > 100) return false;
  draftMenu.steps[lastIndex].pourPercent = nextPercent;
  return true;
}

function distributePercentsEvenly() {
  if (draftMenu.steps.length === 0) return;
  const base = Math.floor((100 / draftMenu.steps.length) * 10) / 10;
  let assigned = 0;
  draftMenu.steps = draftMenu.steps.map((step, index) => {
    const isLast = index === draftMenu.steps.length - 1;
    const pourPercent = isLast ? Math.round((100 - assigned) * 10) / 10 : base;
    assigned += pourPercent;
    return { ...step, pourPercent };
  });
}

function renderDraft() {
  menuNameInput.value = draftMenu.name;
  renderWaterGuideEditor();
  stepList.replaceChildren();

  draftMenu.steps.forEach((step, index) => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const timeGroup = document.createElement("div");
    const minuteUnit = document.createElement("span");
    const secondUnit = document.createElement("span");
    const deleteButton = document.createElement("button");
    const pourMode = draftMenu.waterGuide.mode === "none" ? "none" : draftMenu.waterGuide.pourMode;
    const showWaterFields = pourMode !== "none";
    const calculated = pourMode === "percentage"
      ? calculateStepPourGrams(draftMenu.steps, draftMenu.waterGuide.totalWaterGrams)
      : null;

    row.className = "step-row";
    row.dataset.stepIndex = String(index);
    row.classList.toggle("has-water", showWaterFields);
    name.className = "step-name";
    name.textContent = getStepName(index);
    timeGroup.className = "step-time-fields";
    minuteUnit.className = "unit";
    minuteUnit.textContent = "分";
    secondUnit.className = "unit";
    secondUnit.textContent = "秒";

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";
    deleteButton.disabled = draftMenu.steps.length === 1;
    deleteButton.setAttribute("aria-label", `${getStepName(index)}を削除`);

    timeGroup.append(
      createNumberInput(step.minutes, "step-minutes", MAX_MINUTES),
      minuteUnit,
      createNumberInput(step.seconds, "step-seconds", 59),
      secondUnit
    );

    row.append(name, timeGroup);

    if (pourMode === "grams") {
      const pourField = document.createElement("label");
      const pourLabel = document.createElement("span");
      const pourInput = document.createElement("input");
      const pourUnit = document.createElement("span");
      const cumulative = document.createElement("span");
      const pourValue = normalizePourGrams(step.pourGrams);

      pourField.className = "step-pour-field";
      pourLabel.textContent = "注ぐ量";
      pourInput.type = "number";
      pourInput.className = "step-pour-grams";
      pourInput.min = "0";
      pourInput.step = "1";
      pourInput.inputMode = "decimal";
      pourInput.value = pourValue === null ? "" : String(pourValue);
      pourUnit.className = "unit";
      pourUnit.textContent = "g";
      cumulative.className = "step-cumulative";
      cumulative.textContent = pourValue === null
        ? "累計 未設定"
        : `累計 ${formatWaterNumber(getStepPourTotalUntil(index))}g`;

      pourField.append(pourLabel, pourInput, pourUnit);
      row.append(pourField, cumulative);
    }

    if (pourMode === "percentage") {
      const percentField = document.createElement("label");
      const percentLabel = document.createElement("span");
      const percentInput = document.createElement("input");
      const percentUnit = document.createElement("span");
      const calculatedPour = document.createElement("span");
      const cumulative = document.createElement("span");
      const percentValue = normalizePourPercent(step.pourPercent);
      const calculatedItem = calculated.items[index];

      percentField.className = "step-pour-field step-percent-field";
      percentLabel.textContent = "配分";
      percentInput.type = "number";
      percentInput.className = "step-pour-percent";
      percentInput.min = "0";
      percentInput.max = "100";
      percentInput.step = "0.1";
      percentInput.inputMode = "decimal";
      percentInput.value = percentValue === null ? "" : String(percentValue);
      percentInput.setAttribute("aria-label", `${getStepName(index)}の配分割合`);
      percentUnit.className = "unit";
      percentUnit.textContent = "%";
      calculatedPour.className = "step-auto-field step-calculated-pour";
      calculatedPour.setAttribute("aria-label", `${getStepName(index)}の自動計算された注ぐ量`);
      calculatedPour.textContent = calculatedItem?.pourGrams === null
        ? "注ぐ量 未設定"
        : `注ぐ量 ${formatWaterNumber(calculatedItem?.pourGrams ?? 0)}g`;
      cumulative.className = "step-cumulative";
      cumulative.textContent = `累計 ${formatWaterNumber(calculatedItem?.cumulativeGrams ?? 0)}g`;

      percentField.append(percentLabel, percentInput, percentUnit);
      row.append(percentField, calculatedPour, cumulative);
    }

    row.append(deleteButton);
    stepList.append(row);
  });

  renderPourSummary();
}
function openEditorForMenu(index) {
  editingMenuIndex = index;
  menuIndexBeforeCreate = null;
  draftMenu = cloneMenu(menus[index]);
  editorMessage.textContent = "";
  renderDraft();
  updateMenuActionsAvailability();
}

function startNewMenu(initialWaterGuide = null) {
  menuIndexBeforeCreate = selectedMenuIndex;
  editingMenuIndex = null;
  const waterGuide = normalizeWaterGuide(initialWaterGuide ?? DEFAULT_WATER_GUIDE);
  draftMenu = {
    name: "",
    waterGuide,
    steps: [{
      name: "蒸らし",
      minutes: 0,
      seconds: 30,
      pourPercent: waterGuide.pourMode === "percentage" ? 100 : null,
      pourGrams: null
    }]
  };
  draftMenu = normalizeMenus([{ ...draftMenu, name: "draft" }])[0];
  draftMenu.name = "";
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
      audioContext.resume().catch((error) => {
        console.warn("AudioContext resume failed", error);
      });
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

async function resumeAudioContextForBgm(context) {
  if (!context || context.state !== "suspended" || typeof context.resume !== "function") return;

  try {
    await context.resume();
  } catch (error) {
    console.warn("BGM AudioContext resume failed", error);
  }
}

function registerBgmAudioDebugEvents(audio) {
  BGM_DEBUG_EVENTS.forEach((eventName) => {
    audio.addEventListener(eventName, () => {
      console.log("BGM audio event", eventName, {
        readyState: audio.readyState,
        networkState: audio.networkState,
        currentTime: audio.currentTime,
        duration: audio.duration,
        paused: audio.paused,
        loop: audio.loop
      });
    });
  });
}

function logBgmPlayRejected(error, audio) {
  console.error(
    "BGM play rejected",
    error.name,
    error.message,
    {
      readyState: audio.readyState,
      networkState: audio.networkState,
      currentTime: audio.currentTime,
      duration: audio.duration,
      audioContextState: audioContext?.state
    }
  );
}

function getBgmPlayErrorMessage(error) {
  if (error.name === "NotAllowedError") return "BGM playback was blocked";
  if (error.name === "AbortError") return "";
  if (error.name === "NotSupportedError") return "BGM file is not supported";
  return "BGM playback failed";
}

function loadBgmTrack(trackKey) {
  console.log("BGM load", trackKey);
  bgmDesiredPlaying = false;
  bgmPlayToken += 1;
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
  registerBgmAudioDebugEvents(audio);
  audio.addEventListener("error", () => {
    if (bgmAudio === audio) {
      bgmStatus.textContent = "BGM file was not found";
    }
  });
  bgmAudio = audio;
  return bgmAudio;
}

async function playBgm() {
  if (!bgmEnabled || selectedBgmTrack === "none") {
    bgmDesiredPlaying = false;
    bgmPlayToken += 1;
    return;
  }

  console.log("BGM play requested");
  clearBgmFade();
  const audio = bgmAudio ?? loadBgmTrack(selectedBgmTrack);
  if (!audio) return;

  bgmDesiredPlaying = true;
  const playToken = bgmPlayToken + 1;
  bgmPlayToken = playToken;
  audio.loop = true;

  const graphContext = connectBgmAudioGraph(audio) ? audioContext : prepareAudio();
  await resumeAudioContextForBgm(graphContext);
  if (bgmPlayToken !== playToken || !bgmDesiredPlaying || bgmAudio !== audio) return;

  updateBgmOutputVolume();
  try {
    await audio.play();
    console.log("BGM play resolved");
    if (bgmPlayToken === playToken && bgmDesiredPlaying && bgmAudio === audio) {
      bgmStatus.textContent = `${getSelectedBgmTrackLabel()} 蜀咲函荳ｭ`;
    }
  } catch (error) {
    logBgmPlayRejected(error, audio);
    if (bgmPlayToken === playToken && bgmAudio === audio) {
      const message = getBgmPlayErrorMessage(error);
      if (message) bgmStatus.textContent = message;
    }
  }
}

function pauseBgm() {
  bgmDesiredPlaying = false;
  bgmPlayToken += 1;
  clearBgmFade();
  if (bgmAudio !== null) {
    bgmAudio.pause();
    console.log("BGM paused", bgmAudio.currentTime);
  }
  bgmStatus.textContent = "";
}

function stopBgm() {
  bgmDesiredPlaying = false;
  bgmPlayToken += 1;
  clearBgmFade();
  if (bgmAudio === null) {
    bgmStatus.textContent = "";
    return;
  }
  bgmAudio.pause();
  try {
    bgmAudio.currentTime = 0;
  } catch (error) {
    console.warn("BGM currentTime reset failed", error);
  }
  bgmAudio.loop = true;
  updateBgmOutputVolume();
  console.log("BGM stopped", {
    paused: bgmAudio.paused,
    currentTime: bgmAudio.currentTime,
    loop: bgmAudio.loop
  });
  bgmStatus.textContent = "";
}

function fadeOutBgm() {
  bgmDesiredPlaying = false;
  bgmPlayToken += 1;
  clearBgmFade();
  if (bgmAudio === null || bgmAudio.paused) {
    stopBgm();
    return;
  }

  const audio = bgmAudio;
  audio.loop = false;
  console.log("BGM fade started", audio.currentTime, audio.duration);
  const steps = 15;
  let currentStep = 0;
  bgmFadeTimer = window.setInterval(() => {
    if (bgmAudio !== audio) {
      clearBgmFade();
      return;
    }
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
  selectedBgmTrack = isAvailableBgmTrack(bgmTrackSelect.value)
    ? bgmTrackSelect.value
    : "morning-coffee";
  bgmTrackSelect.value = selectedBgmTrack;
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

quickWaterServingsSelect?.addEventListener("change", () => {
  const { isValid, guide } = readQuickWaterGuideInputs();
  if (!isValid) {
    renderQuickWaterGuide(false);
    return;
  }
  quickWaterGuide = normalizeQuickWaterGuide(guide);
  saveQuickWaterGuide();
  renderQuickWaterGuide(false);
});

quickWaterBeansInput?.addEventListener("input", () => {
  const { isValid, guide } = readQuickWaterGuideInputs();
  if (!isValid) {
    renderQuickWaterGuide(false);
    return;
  }
  quickWaterGuide = normalizeQuickWaterGuide(guide);
  saveQuickWaterGuide();
  renderQuickWaterGuide(false);
});

quickWaterWaterInput?.addEventListener("input", () => {
  const { isValid, guide } = readQuickWaterGuideInputs();
  if (!isValid) {
    renderQuickWaterGuide(false);
    return;
  }
  quickWaterGuide = normalizeQuickWaterGuide(guide);
  saveQuickWaterGuide();
  renderQuickWaterGuide(false);
});

quickWaterDetailsButton?.addEventListener("click", () => {
  setQuickWaterDetailsOpen(quickWaterDetails?.hidden ?? true);
});

quickWaterGuideToggle?.addEventListener("click", () => {
  setQuickWaterGuideDetailsOpen(quickWaterGuideDetails?.hidden ?? true);
});

quickWaterCreateMenuButton?.addEventListener("click", () => {
  const { isValid, guide } = readQuickWaterGuideInputs();
  if (!isValid) {
    renderQuickWaterGuide(false);
    return;
  }
  quickWaterGuide = normalizeQuickWaterGuide(guide);
  saveQuickWaterGuide();
  renderQuickWaterGuide(false);
  startNewMenu(createWaterGuideFromQuickGuide(quickWaterGuide));
});

waterGuideEditor?.addEventListener("change", (event) => {
  const input = event.target.closest('input[name="water-guide-mode"]');
  if (!input || !WATER_GUIDE_MODES.includes(input.value)) return;
  draftMenu.waterGuide = normalizeWaterGuide({
    ...draftMenu.waterGuide,
    mode: input.value,
    pourMode: input.value === "none" ? "none" : draftMenu.waterGuide.pourMode
  });
  editorMessage.textContent = "";
  renderDraft();
});

pourModeEditor?.addEventListener("change", (event) => {
  const input = event.target.closest('input[name="water-pour-mode"]');
  if (!input || !POUR_MODES.includes(input.value)) return;
  convertStepValuesForPourMode(input.value);
  editorMessage.textContent = "";
  renderDraft();
});

waterGuideFields?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-water-key]");
  if (!input || input.readOnly) return;
  setWaterGuideValue(input.dataset.waterKey, input.value);
  editorMessage.textContent = "";
  updateWaterGuideOutput();
});

stepList.addEventListener("input", (event) => {
  const input = event.target.closest("input");
  const row = event.target.closest(".step-row");
  if (!input || !row) return;
  const step = draftMenu.steps[Number(row.dataset.stepIndex)];
  if (input.classList.contains("step-minutes")) step.minutes = Number(input.value);
  if (input.classList.contains("step-seconds")) step.seconds = Number(input.value);
  if (input.classList.contains("step-pour-grams")) {
    step.pourGrams = normalizePourGrams(input.value);
    updateStepWaterDisplays();
  }
  if (input.classList.contains("step-pour-percent")) {
    step.pourPercent = normalizePourPercent(input.value);
    updateStepWaterDisplays();
  }
  editorMessage.textContent = "";
});

waterGuideMessage?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pour-action]");
  if (!button) return;
  if (button.dataset.pourAction === "distribute-evenly") {
    distributePercentsEvenly();
    editorMessage.textContent = "";
    renderDraft();
    return;
  }
  if (button.dataset.pourAction === "adjust-last") {
    if (adjustLastStepPercent()) {
      editorMessage.textContent = "";
      renderDraft();
    } else {
      editorMessage.textContent = "最後の工程だけでは調整できません";
    }
  }
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
  const pourMode = draftMenu.waterGuide.mode === "none" ? "none" : draftMenu.waterGuide.pourMode;
  draftMenu.steps.push({
    name: getStepName(draftMenu.steps.length),
    minutes: 0,
    seconds: 30,
    pourPercent: pourMode === "percentage" ? 0 : null,
    pourGrams: null
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
quickWaterGuide = loadQuickWaterGuide();
loadSoundSettings();
renderMenuSelect();
setupQuickWaterGuideOptions();
renderQuickWaterGuide();
setQuickWaterGuideDetailsOpen(false);
setQuickWaterDetailsOpen(false);
renderSoundSettings();
setSoundSettingsOpen(false);
resetToFirstStep();
openEditorForMenu(selectedMenuIndex);
saveMenus();
