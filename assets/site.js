(function () {
  const storageKey = "phieuhoctap.chuong1.visited";
  const lastKey = "phieuhoctap.chuong1.lastLesson";
  const cards = Array.from(document.querySelectorAll("[data-lesson-card]"));
  const searchInput = document.querySelector("[data-search]");
  const typeSelect = document.querySelector("[data-filter-type]");
  const chapterSelect = document.querySelector("[data-filter-chapter]");
  const emptyState = document.querySelector("[data-empty-state]");
  const progressText = document.querySelector("[data-progress]");
  const continueLink = document.querySelector("[data-continue-link]");

  function readVisited() {
    try {
      return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    } catch (_error) {
      return new Set();
    }
  }

  function writeVisited(visited) {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(visited)));
  }

  function normalize(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function updateCards() {
    const query = normalize(searchInput ? searchInput.value.trim() : "");
    const type = typeSelect ? typeSelect.value : "all";
    const chapter = chapterSelect ? chapterSelect.value : "all";
    let shown = 0;

    cards.forEach((card) => {
      const title = normalize(card.dataset.title || "");
      const keywords = normalize(card.dataset.keywords || "");
      const cardType = card.dataset.type || "lesson";
      const cardChapter = card.dataset.chapter || "chapter-1";
      const matchesQuery = !query || title.includes(query) || keywords.includes(query);
      const matchesType = type === "all" || type === cardType;
      const matchesChapter = chapter === "all" || chapter === cardChapter;
      const visible = matchesQuery && matchesType && matchesChapter;

      card.classList.toggle("is-hidden", !visible);
      if (visible) shown += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle("is-visible", shown === 0);
    }
  }

  function applyProgress() {
    const visited = readVisited();
    const lessonCards = cards.filter((card) => card.dataset.trackProgress === "true");
    const viewed = lessonCards.filter((card) => visited.has(card.dataset.lessonId));

    cards.forEach((card) => {
      card.classList.toggle("is-visited", visited.has(card.dataset.lessonId));
    });

    if (progressText) {
      progressText.textContent = `${viewed.length}/${lessonCards.length} bài đã mở`;
    }

    const lastLessonId = localStorage.getItem(lastKey);
    const lastCard = cards.find((card) => card.dataset.lessonId === lastLessonId);
    if (continueLink && lastCard) {
      const link = lastCard.querySelector("a[href]");
      if (link) {
        continueLink.href = link.getAttribute("href");
        continueLink.textContent = "Tiếp tục học";
      }
    }
  }

  cards.forEach((card) => {
    const link = card.querySelector("a[href]");
    if (!link) return;
    link.addEventListener("click", () => {
      if (card.dataset.trackProgress !== "true") return;
      const visited = readVisited();
      visited.add(card.dataset.lessonId);
      writeVisited(visited);
      localStorage.setItem(lastKey, card.dataset.lessonId);
    });
  });

  if (searchInput) searchInput.addEventListener("input", updateCards);
  if (typeSelect) typeSelect.addEventListener("change", updateCards);
  if (chapterSelect) chapterSelect.addEventListener("change", updateCards);

  applyProgress();
  updateCards();
})();
