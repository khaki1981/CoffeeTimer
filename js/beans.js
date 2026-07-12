(function () {
  const beanMemoButton = document.getElementById("bean-memo-button");
  const beanMemoPanel = document.getElementById("bean-memo-panel");
  const beanForm = document.getElementById("bean-form");
  const beanFormMode = document.getElementById("bean-form-mode");
  const beanFormClear = document.getElementById("bean-form-clear");
  const beanMessage = document.getElementById("bean-message");
  const beanList = document.getElementById("bean-list");
  const roasterList = document.getElementById("roaster-list");
  const beanDetailSection = document.getElementById("bean-detail-section");
  const beanRatingEditor = document.getElementById("bean-rating-editor");
  const beanNoteSection = document.getElementById("bean-note-section");
  const ratingControls = document.getElementById("bean-rating-controls");
  const radarChart = document.getElementById("bean-radar-chart");
  const overallOutput = document.getElementById("bean-rating-overall-output");
  const flavorTags = document.getElementById("bean-flavor-tags");

  const fields = {
    id: document.getElementById("bean-id"),
    name: document.getElementById("bean-name"),
    roaster: document.getElementById("bean-roaster"),
    originRegion: document.getElementById("bean-origin-region"),
    originCountry: document.getElementById("bean-origin-country"),
    originCountryOther: document.getElementById("bean-origin-country-other"),
    process: document.getElementById("bean-process"),
    processOther: document.getElementById("bean-process-other"),
    roastLevel: document.getElementById("bean-roast-level"),
    roastLevelOther: document.getElementById("bean-roast-level-other"),
    purchaseDate: document.getElementById("bean-purchase-date"),
    openedDate: document.getElementById("bean-opened-date"),
    price: document.getElementById("bean-price"),
    weightGram: document.getElementById("bean-weight-gram"),
    flavorNotesText: document.getElementById("bean-flavor-notes"),
    memo: document.getElementById("bean-memo"),
    nextTry: document.getElementById("bean-next-try"),
    repeatRating: document.getElementById("bean-repeat-rating"),
    isFavorite: document.getElementById("bean-is-favorite")
  };

  const otherFields = {
    originCountry: document.getElementById("bean-origin-country-other-field"),
    process: document.getElementById("bean-process-other-field"),
    roastLevel: document.getElementById("bean-roast-level-other-field")
  };

  const OTHER_OPTION = "その他";
  const UNKNOWN_REGION = "不明";
  const ADD_COUNTRY_OPTION = "国を追加";
  const AFRICA_COUNTRIES = ["エチオピア", "ケニア", "ルワンダ", "ブルンジ", "タンザニア", "ウガンダ"];
  const LATIN_AMERICA_COUNTRIES = [
    "ブラジル",
    "コロンビア",
    "グアテマラ",
    "コスタリカ",
    "ホンジュラス",
    "エルサルバドル",
    "ニカラグア",
    "パナマ",
    "メキシコ",
    "ペルー",
    "ボリビア"
  ];
  const ASIA_COUNTRIES = [
    "インドネシア",
    "ベトナム",
    "インド",
    "中国",
    "東ティモール",
    "ミャンマー",
    "タイ",
    "ラオス",
    "フィリピン",
    "イエメン"
  ];
  const ALL_ORIGIN_COUNTRIES = [...new Set([
    ...AFRICA_COUNTRIES,
    ...LATIN_AMERICA_COUNTRIES,
    ...ASIA_COUNTRIES
  ])];
  const ORIGIN_COUNTRIES_BY_REGION = {
    "アフリカ": [...AFRICA_COUNTRIES, ADD_COUNTRY_OPTION],
    "中南米": [...LATIN_AMERICA_COUNTRIES, ADD_COUNTRY_OPTION],
    "アジア": [...ASIA_COUNTRIES, ADD_COUNTRY_OPTION],
    [UNKNOWN_REGION]: [...ALL_ORIGIN_COUNTRIES, ADD_COUNTRY_OPTION]
  };
  const ORIGIN_REGIONS = ["アフリカ", "中南米", "アジア", UNKNOWN_REGION];
  const PROCESS_OPTIONS = [
    "ウォッシュド",
    "ナチュラル",
    "ハニー",
    "アナエロビック",
    "ダブルアナエロビック",
    "カーボニックマセレーション",
    "ウェットハル",
    "スマトラ式",
    OTHER_OPTION
  ];
  const ROAST_LEVEL_OPTIONS = ["浅煎り", "中浅煎り", "中煎り", "中深煎り", "深煎り", OTHER_OPTION];

  const SVG_NS = "http://www.w3.org/2000/svg";
  const ratingFields = [
    { key: "acidity", label: "酸味", id: "bean-rating-acidity", chart: true },
    { key: "bitterness", label: "苦味", id: "bean-rating-bitterness", chart: true },
    { key: "sweetness", label: "甘み", id: "bean-rating-sweetness", chart: true },
    { key: "body", label: "コク", id: "bean-rating-body", chart: true },
    { key: "aroma", label: "香り", id: "bean-rating-aroma", chart: true },
    { key: "aftertaste", label: "後味", id: "bean-rating-aftertaste", chart: true },
    { key: "drinkability", label: "飲みやすさ", id: "bean-rating-drinkability", chart: true },
    { key: "overall", label: "総合評価", id: "bean-rating-overall", chart: false }
  ].map((rating) => ({
    ...rating,
    element: document.getElementById(rating.id)
  }));

  let beans = [];

  function fillSelect(select, options, placeholder) {
    select.replaceChildren();
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    select.append(placeholderOption);

    options.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }

  function createRatingOptions(select) {
    for (let value = 1; value <= 5; value += 1) {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = String(value);
      select.append(option);
    }
    select.value = "3";
  }

  function showBeanMessage(message) {
    beanMessage.textContent = message;
  }

  function updateRoasterList() {
    const roasters = [...new Set(beans
      .map((bean) => bean.roaster?.trim())
      .filter(Boolean))]
      .sort((first, second) => first.localeCompare(second, "ja"));

    roasterList.replaceChildren(...roasters.map((roaster) => {
      const option = document.createElement("option");
      option.value = roaster;
      return option;
    }));
  }

  function normalizeText(value) {
    return value.trim();
  }

  function numberOrNull(value) {
    if (value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function ratingValue(select) {
    const value = Number(select.value);
    return Number.isInteger(value) && value >= 1 && value <= 5 ? value : 3;
  }

  function setRatingValue(key, value) {
    const rating = ratingFields.find((item) => item.key === key);
    if (!rating) return;
    rating.element.value = String(ratingValue({ value }));
  }

  function updateRatingControls() {
    ratingFields.forEach((rating) => {
      ratingControls
        .querySelectorAll(`[data-rating-key="${rating.key}"] .rating-button`)
        .forEach((button) => {
          const isActive = Number(button.dataset.value) === ratingValue(rating.element);
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
    });
  }

  function renderRatingControls() {
    ratingFields.forEach((rating) => {
      const row = document.createElement("div");
      row.className = "rating-control";
      row.dataset.ratingKey = rating.key;

      const label = document.createElement("span");
      label.textContent = rating.label;

      const buttons = document.createElement("div");
      buttons.className = "rating-buttons";
      buttons.setAttribute("role", "group");
      buttons.setAttribute("aria-label", rating.label);

      for (let value = 1; value <= 5; value += 1) {
        const button = document.createElement("button");
        button.className = "rating-button";
        button.type = "button";
        button.dataset.value = String(value);
        button.textContent = String(value);
        buttons.append(button);
      }

      row.append(label, buttons);
      ratingControls.append(row);
    });
    updateRatingControls();
  }

  function parseFlavorNotes(value) {
    return value
      .split(/[,\u3001]/)
      .map((note) => note.trim())
      .filter(Boolean);
  }

  function setOtherFieldVisible(field, isVisible) {
    field.hidden = !isVisible;
  }

  function updateOriginCountryOptions(selectedCountry = "") {
    const region = fields.originRegion.value;
    const countries = ORIGIN_COUNTRIES_BY_REGION[region] ?? [];
    fillSelect(fields.originCountry, countries, region ? "国を選択" : "地域を先に選択");
    fields.originCountry.disabled = countries.length === 0;

    if (countries.includes(selectedCountry)) {
      fields.originCountry.value = selectedCountry;
    } else if (selectedCountry) {
      fields.originCountry.value = ADD_COUNTRY_OPTION;
      fields.originCountryOther.value = selectedCountry;
    }

    updateOriginOtherFields();
  }

  function updateOriginOtherFields() {
    setOtherFieldVisible(otherFields.originCountry, fields.originCountry.value === ADD_COUNTRY_OPTION);
  }

  function updateProcessOtherField() {
    setOtherFieldVisible(otherFields.process, fields.process.value === OTHER_OPTION);
  }

  function updateRoastLevelOtherField() {
    setOtherFieldVisible(otherFields.roastLevel, fields.roastLevel.value === OTHER_OPTION);
  }

  function selectOrOther(select, otherInput, value) {
    const normalizedValue = value ?? "";
    const hasOption = [...select.options].some((option) => option.value === normalizedValue);
    if (hasOption) {
      select.value = normalizedValue;
      otherInput.value = "";
    } else if (normalizedValue) {
      select.value = OTHER_OPTION;
      otherInput.value = normalizedValue;
    } else {
      select.value = "";
      otherInput.value = "";
    }
  }

  function getSelectValueWithOther(select, otherInput) {
    if (select.value !== OTHER_OPTION) return select.value;
    return normalizeText(otherInput.value) || OTHER_OPTION;
  }

  function selectRegion(value) {
    if (ORIGIN_REGIONS.includes(value)) {
      fields.originRegion.value = value;
      return;
    }
    fields.originRegion.value = value ? UNKNOWN_REGION : "";
  }

  function getCountryValue() {
    if (fields.originCountry.value !== ADD_COUNTRY_OPTION) return fields.originCountry.value;
    return normalizeText(fields.originCountryOther.value) || ADD_COUNTRY_OPTION;
  }

  function inferRegionFromCountry(country) {
    if (!country) return "";
    return ORIGIN_REGIONS.find((region) => (
      region !== UNKNOWN_REGION && ORIGIN_COUNTRIES_BY_REGION[region]?.includes(country)
    )) ?? "";
  }

  function getOriginFromForm() {
    const region = fields.originRegion.value;
    const country = getCountryValue();

    return {
      originRegion: region,
      originCountry: country,
      origin: country || region
    };
  }

  function formatDateKey(date) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  async function createBeanId() {
    const dateKey = formatDateKey(new Date());
    const dailyBeans = beans.filter((bean) => bean.id.startsWith(`bean_${dateKey}_`));
    const nextNumber = dailyBeans.reduce((max, bean) => {
      const number = Number(bean.id.split("_").at(-1));
      return Number.isInteger(number) ? Math.max(max, number) : max;
    }, 0) + 1;

    return `bean_${dateKey}_${String(nextNumber).padStart(3, "0")}`;
  }

  function buildRatingsFromForm() {
    return ratingFields.reduce((ratings, rating) => {
      ratings[rating.key] = ratingValue(rating.element);
      return ratings;
    }, {});
  }

  function getRadarPoint(centerX, centerY, radius, index, total) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  }

  function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    return element;
  }

  // 1〜5の評価値をSVGの多角形に変換して、味のバランスを小さく可視化します。
  function renderRadarChart(ratings) {
    const chartRatings = ratingFields.filter((rating) => rating.chart);
    const centerX = 90;
    const centerY = 88;
    const radius = 54;
    const labelRadius = 72;

    radarChart.replaceChildren();

    for (let level = 1; level <= 5; level += 1) {
      const points = chartRatings
        .map((_, index) => getRadarPoint(centerX, centerY, (radius * level) / 5, index, chartRatings.length))
        .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
        .join(" ");
      radarChart.append(createSvgElement("polygon", { class: "radar-grid", points }));
    }

    chartRatings.forEach((rating, index) => {
      const axisEnd = getRadarPoint(centerX, centerY, radius, index, chartRatings.length);
      radarChart.append(createSvgElement("line", {
        class: "radar-axis",
        x1: centerX,
        y1: centerY,
        x2: axisEnd.x,
        y2: axisEnd.y
      }));

      const labelPoint = getRadarPoint(centerX, centerY, labelRadius, index, chartRatings.length);
      const label = createSvgElement("text", {
        class: "radar-label",
        x: labelPoint.x,
        y: labelPoint.y
      });
      label.textContent = rating.label;
      radarChart.append(label);
    });

    const valuePoints = chartRatings
      .map((rating, index) => {
        const value = ratingValue({ value: ratings?.[rating.key] ?? 3 });
        return getRadarPoint(centerX, centerY, (radius * value) / 5, index, chartRatings.length);
      });

    radarChart.append(createSvgElement("polygon", {
      class: "radar-shape",
      points: valuePoints.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ")
    }));

    valuePoints.forEach((point) => {
      radarChart.append(createSvgElement("circle", {
        class: "radar-point",
        cx: point.x,
        cy: point.y,
        r: 2.8
      }));
    });
  }

  function renderFlavorTags(flavorNotes) {
    const notes = Array.isArray(flavorNotes) ? flavorNotes : [];
    flavorTags.replaceChildren();

    if (notes.length === 0) {
      const empty = document.createElement("span");
      empty.className = "flavor-tag empty";
      empty.textContent = "未入力";
      flavorTags.append(empty);
      return;
    }

    notes.forEach((note) => {
      const tag = document.createElement("span");
      tag.className = "flavor-tag";
      tag.textContent = note;
      flavorTags.append(tag);
    });
  }

  function updateRadarChart() {
    const ratings = buildRatingsFromForm();
    overallOutput.value = String(ratings.overall ?? 3);
    overallOutput.textContent = String(ratings.overall ?? 3);
    renderRadarChart(ratings);
    renderFlavorTags(parseFlavorNotes(fields.flavorNotesText.value));
  }

  // フォームの入力値を、docs/database-schema.md の beans 構造に変換します。
  async function buildBeanFromForm() {
    const now = new Date().toISOString();
    const editingId = fields.id.value;
    const existingBean = beans.find((bean) => bean.id === editingId);
    const origin = getOriginFromForm();

    return {
      id: editingId || await createBeanId(),
      name: normalizeText(fields.name.value),
      roaster: normalizeText(fields.roaster.value),
      originRegion: origin.originRegion,
      originCountry: origin.originCountry,
      origin: origin.origin,
      process: getSelectValueWithOther(fields.process, fields.processOther),
      roastLevel: getSelectValueWithOther(fields.roastLevel, fields.roastLevelOther),
      purchaseDate: fields.purchaseDate.value,
      openedDate: fields.openedDate.value,
      price: numberOrNull(fields.price.value),
      weightGram: numberOrNull(fields.weightGram.value),
      ratings: buildRatingsFromForm(),
      flavorNotes: parseFlavorNotes(fields.flavorNotesText.value),
      memo: normalizeText(fields.memo.value),
      nextTry: normalizeText(fields.nextTry.value),
      repeatRating: ratingValue(fields.repeatRating),
      isFavorite: fields.isFavorite.checked,
      createdAt: existingBean?.createdAt ?? now,
      updatedAt: now
    };
  }

  function resetBeanForm() {
    beanForm.reset();
    fields.id.value = "";
    beanDetailSection.open = false;
    beanRatingEditor.open = false;
    beanNoteSection.open = false;
    fields.originRegion.value = "";
    fields.originCountryOther.value = "";
    updateOriginCountryOptions();
    fields.process.value = "";
    fields.processOther.value = "";
    updateProcessOtherField();
    fields.roastLevel.value = "";
    fields.roastLevelOther.value = "";
    updateRoastLevelOtherField();
    ratingFields.forEach((rating) => {
      rating.element.value = "3";
    });
    fields.repeatRating.value = "3";
    updateRatingControls();
    updateRadarChart();
    beanFormMode.textContent = "新しい豆メモ";
    showBeanMessage("");
  }

  function fillBeanForm(bean) {
    const originCountry = bean.originCountry || bean.origin || "";
    const originRegion = bean.originRegion || inferRegionFromCountry(originCountry);

    fields.id.value = bean.id;
    fields.name.value = bean.name ?? "";
    fields.roaster.value = bean.roaster ?? "";
    selectRegion(originRegion);
    updateOriginCountryOptions(originCountry);
    updateOriginOtherFields();
    selectOrOther(fields.process, fields.processOther, bean.process);
    updateProcessOtherField();
    selectOrOther(fields.roastLevel, fields.roastLevelOther, bean.roastLevel);
    updateRoastLevelOtherField();
    fields.purchaseDate.value = bean.purchaseDate ?? "";
    fields.openedDate.value = bean.openedDate ?? "";
    fields.price.value = bean.price ?? "";
    fields.weightGram.value = bean.weightGram ?? "";
    fields.flavorNotesText.value = Array.isArray(bean.flavorNotes) ? bean.flavorNotes.join(", ") : "";
    fields.memo.value = bean.memo ?? "";
    fields.nextTry.value = bean.nextTry ?? "";
    fields.repeatRating.value = String(bean.repeatRating ?? 3);
    fields.isFavorite.checked = Boolean(bean.isFavorite);
    ratingFields.forEach((rating) => {
      rating.element.value = String(bean.ratings?.[rating.key] ?? 3);
    });
    updateRatingControls();
    updateRadarChart();
    beanFormMode.textContent = "豆メモを編集中";
    showBeanMessage("");
    fields.name.focus();
  }

  function compactTextValues(values) {
    return values
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
  }

  function flavorNotesForList(value) {
    if (Array.isArray(value)) return compactTextValues(value);
    if (typeof value === "string") return compactTextValues(value.split(/[,\u3001]/));
    return [];
  }

  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function getBeanOriginParts(bean) {
    const country = bean.originCountry || bean.origin || "";
    return compactTextValues([bean.originRegion, country]);
  }

  function createBeanCard(bean) {
    const card = document.createElement("article");
    card.className = "bean-card";

    const header = document.createElement("div");
    header.className = "bean-card-header";

    const titleGroup = document.createElement("div");
    titleGroup.className = "bean-card-title-group";

    const name = createTextElement("h4", "bean-card-name", bean.name);
    titleGroup.append(name);

    if (bean.isFavorite) {
      const favorite = createTextElement("span", "bean-favorite", "お気に入り");
      titleGroup.append(favorite);
    }

    const rating = createTextElement("div", "bean-card-rating-badge", `総合 ${bean.ratings?.overall ?? 3}`);
    header.append(titleGroup, rating);

    const main = document.createElement("div");
    main.className = "bean-card-main";

    if (bean.roaster) {
      main.append(createTextElement("p", "bean-card-roaster", bean.roaster));
    }

    const detailItems = [
      ...getBeanOriginParts(bean),
      ...compactTextValues([bean.process, bean.roastLevel])
    ];
    if (detailItems.length > 0) {
      const meta = createTextElement("p", "bean-card-meta", detailItems.join(" / "));
      main.append(meta);
    }

    const flavorNotes = flavorNotesForList(bean.flavorNotes);
    if (flavorNotes.length > 0) {
      const flavors = document.createElement("div");
      flavors.className = "bean-card-flavors";
      flavorNotes.forEach((note) => {
        flavors.append(createTextElement("span", "bean-card-flavor-tag", note));
      });
      main.append(flavors);
    }

    const actions = document.createElement("div");
    actions.className = "bean-card-actions";

    const editButton = document.createElement("button");
    editButton.className = "text-button";
    editButton.type = "button";
    editButton.textContent = "編集";
    editButton.dataset.action = "edit";
    editButton.dataset.id = bean.id;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "削除";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = bean.id;

    actions.append(editButton, deleteButton);
    card.append(header, main, actions);
    return card;
  }

  async function renderBeanList() {
    try {
      beans = await getAllBeans();
      updateRoasterList();
      beanList.replaceChildren();

      if (beans.length === 0) {
        const empty = document.createElement("article");
        empty.className = "bean-empty-card";

        const icon = createTextElement("span", "bean-empty-icon", "☕");
        icon.setAttribute("aria-hidden", "true");
        const title = createTextElement("h3", "bean-empty-title", "まだ豆メモがありません");
        const description = createTextElement("p", "bean-empty", "新規から最初の豆を登録してください。");
        const action = document.createElement("button");
        action.className = "text-button";
        action.type = "button";
        action.dataset.action = "new";
        action.textContent = "新規登録";

        empty.append(icon, title, description, action);
        beanList.append(empty);
        return;
      }

      beans.forEach((bean) => {
        beanList.append(createBeanCard(bean));
      });
    } catch (error) {
      console.warn("豆メモを読み込めませんでした。", error);
      showBeanMessage("豆メモを読み込めませんでした。");
    }
  }

  function setBeanMemoOpen(isOpen) {
    beanMemoPanel.hidden = !isOpen;
    beanMemoButton.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) renderBeanList();
  }

  async function handleBeanSubmit(event) {
    event.preventDefault();

    if (!fields.name.value.trim()) {
      showBeanMessage("豆の名前を入力してください。");
      fields.name.focus();
      return;
    }

    try {
      const bean = await buildBeanFromForm();
      const message = fields.id.value ? "豆メモを更新しました。" : "豆メモを保存しました。";
      if (fields.id.value) {
        await updateBean(bean);
      } else {
        await addBean(bean);
      }
      await renderBeanList();
      resetBeanForm();
      showBeanMessage(message);
    } catch (error) {
      console.warn("豆メモを保存できませんでした。", error);
      showBeanMessage("豆メモを保存できませんでした。");
    }
  }

  async function handleBeanListClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "new") {
      resetBeanForm();
      beanForm.scrollIntoView({ block: "start", behavior: "smooth" });
      fields.name.focus();
      return;
    }

    const bean = beans.find((item) => item.id === button.dataset.id);
    if (!bean) return;

    if (button.dataset.action === "edit") {
      fillBeanForm(bean);
      beanMemoPanel.scrollIntoView({ block: "start", behavior: "smooth" });
      return;
    }

    if (button.dataset.action === "delete" && window.confirm("この豆メモを削除しますか？")) {
      try {
        await deleteBean(bean.id);
        await renderBeanList();
        if (fields.id.value === bean.id) resetBeanForm();
        showBeanMessage("豆メモを削除しました。");
      } catch (error) {
        console.warn("豆メモを削除できませんでした。", error);
        showBeanMessage("豆メモを削除できませんでした。");
      }
    }
  }

  fillSelect(fields.originRegion, ORIGIN_REGIONS, "地域を選択");
  updateOriginCountryOptions();
  fillSelect(fields.process, PROCESS_OPTIONS, "精製方法を選択");
  fillSelect(fields.roastLevel, ROAST_LEVEL_OPTIONS, "焙煎度を選択");
  renderRatingControls();
  createRatingOptions(fields.repeatRating);
  resetBeanForm();

  beanMemoButton.addEventListener("click", () => {
    setBeanMemoOpen(beanMemoPanel.hidden);
  });
  fields.originRegion.addEventListener("change", () => {
    fields.originCountryOther.value = "";
    updateOriginCountryOptions();
  });
  fields.originCountry.addEventListener("change", updateOriginOtherFields);
  fields.process.addEventListener("change", updateProcessOtherField);
  fields.roastLevel.addEventListener("change", updateRoastLevelOtherField);
  ratingControls.addEventListener("click", (event) => {
    const button = event.target.closest(".rating-button");
    const control = event.target.closest(".rating-control");
    if (!button || !control) return;

    setRatingValue(control.dataset.ratingKey, button.dataset.value);
    updateRatingControls();
    updateRadarChart();
  });
  fields.flavorNotesText.addEventListener("input", () => {
    renderFlavorTags(parseFlavorNotes(fields.flavorNotesText.value));
  });
  beanFormClear.addEventListener("click", resetBeanForm);
  beanForm.addEventListener("submit", handleBeanSubmit);
  beanList.addEventListener("click", handleBeanListClick);

  window.renderBeanList = renderBeanList;
  window.resetBeanForm = resetBeanForm;
})();
