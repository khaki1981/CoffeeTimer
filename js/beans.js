(function () {
  const beanMemoButton = document.getElementById("bean-memo-button");
  const beanMemoPanel = document.getElementById("bean-memo-panel");
  const beanForm = document.getElementById("bean-form");
  const beanFormMode = document.getElementById("bean-form-mode");
  const beanFormClear = document.getElementById("bean-form-clear");
  const beanMessage = document.getElementById("bean-message");
  const beanList = document.getElementById("bean-list");

  const fields = {
    id: document.getElementById("bean-id"),
    name: document.getElementById("bean-name"),
    roaster: document.getElementById("bean-roaster"),
    origin: document.getElementById("bean-origin"),
    process: document.getElementById("bean-process"),
    roastLevel: document.getElementById("bean-roast-level"),
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

  const ratingFields = [
    { key: "acidity", id: "bean-rating-acidity" },
    { key: "bitterness", id: "bean-rating-bitterness" },
    { key: "sweetness", id: "bean-rating-sweetness" },
    { key: "body", id: "bean-rating-body" },
    { key: "aroma", id: "bean-rating-aroma" },
    { key: "aftertaste", id: "bean-rating-aftertaste" },
    { key: "drinkability", id: "bean-rating-drinkability" },
    { key: "overall", id: "bean-rating-overall" }
  ].map((rating) => ({
    ...rating,
    element: document.getElementById(rating.id)
  }));

  let beans = [];

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

  function parseFlavorNotes(value) {
    return value
      .split(/[,\u3001]/)
      .map((note) => note.trim())
      .filter(Boolean);
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

  // フォームの入力値を、docs/database-schema.md の beans 構造に変換します。
  async function buildBeanFromForm() {
    const now = new Date().toISOString();
    const editingId = fields.id.value;
    const existingBean = beans.find((bean) => bean.id === editingId);

    return {
      id: editingId || await createBeanId(),
      name: normalizeText(fields.name.value),
      roaster: normalizeText(fields.roaster.value),
      origin: normalizeText(fields.origin.value),
      process: normalizeText(fields.process.value),
      roastLevel: normalizeText(fields.roastLevel.value),
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
    ratingFields.forEach((rating) => {
      rating.element.value = "3";
    });
    fields.repeatRating.value = "3";
    beanFormMode.textContent = "新しい豆メモ";
    showBeanMessage("");
  }

  function fillBeanForm(bean) {
    fields.id.value = bean.id;
    fields.name.value = bean.name ?? "";
    fields.roaster.value = bean.roaster ?? "";
    fields.origin.value = bean.origin ?? "";
    fields.process.value = bean.process ?? "";
    fields.roastLevel.value = bean.roastLevel ?? "";
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
    beanFormMode.textContent = "豆メモを編集中";
    showBeanMessage("");
    fields.name.focus();
  }

  function formatMeta(bean) {
    return [
      bean.roaster,
      bean.origin,
      bean.roastLevel
    ].filter(Boolean).join(" / ") || "基本情報未入力";
  }

  function createBeanCard(bean) {
    const card = document.createElement("article");
    card.className = "bean-card";

    const main = document.createElement("div");
    main.className = "bean-card-main";

    const title = document.createElement("div");
    title.className = "bean-card-title";
    const name = document.createElement("span");
    name.textContent = bean.name;
    const favorite = document.createElement("span");
    favorite.className = "bean-favorite";
    favorite.textContent = bean.isFavorite ? "★" : "☆";
    favorite.setAttribute("aria-label", bean.isFavorite ? "お気に入り" : "お気に入りではありません");
    title.append(name, favorite);

    const meta = document.createElement("div");
    meta.className = "bean-card-meta";
    meta.textContent = formatMeta(bean);

    const rating = document.createElement("div");
    rating.className = "bean-card-rating";
    rating.textContent = `総合評価 ${bean.ratings?.overall ?? 3} / 5`;

    main.append(title, meta, rating);

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
    card.append(main, actions);
    return card;
  }

  async function renderBeanList() {
    try {
      beans = await getAllBeans();
      beanList.replaceChildren();

      if (beans.length === 0) {
        const empty = document.createElement("p");
        empty.className = "bean-empty";
        empty.textContent = "保存された豆メモはまだありません。";
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

  ratingFields.forEach((rating) => createRatingOptions(rating.element));
  createRatingOptions(fields.repeatRating);
  resetBeanForm();

  beanMemoButton.addEventListener("click", () => {
    setBeanMemoOpen(beanMemoPanel.hidden);
  });
  beanFormClear.addEventListener("click", resetBeanForm);
  beanForm.addEventListener("submit", handleBeanSubmit);
  beanList.addEventListener("click", handleBeanListClick);

  window.renderBeanList = renderBeanList;
  window.resetBeanForm = resetBeanForm;
})();
