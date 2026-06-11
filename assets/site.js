(function () {
  const legacyPrefix = "phieuhoctap.chuong1";
  const accountsKey = "phieuhoctap.accounts";
  const currentAccountKey = "phieuhoctap.auth.current";
  const openAuthRequestKey = "phieuhoctap.openAuth";
  const cards = Array.from(document.querySelectorAll("[data-lesson-card]"));
  const searchInput = document.querySelector("[data-search]");
  const typeSelect = document.querySelector("[data-filter-type]");
  const chapterSelect = document.querySelector("[data-filter-chapter]");
  const emptyState = document.querySelector("[data-empty-state]");
  const progressText = document.querySelector("[data-progress]");
  const progressPercent = document.querySelector("[data-progress-percent]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const progressStatus = document.querySelector("[data-progress-status]");
  const progressLast = document.querySelector("[data-progress-last]");
  const progressMessage = document.querySelector("[data-progress-message]");
  const streakDays = document.querySelector("[data-streak-days]");
  const badgeLabel = document.querySelector("[data-badge-label]");
  const continueLinks = Array.from(document.querySelectorAll("[data-continue-link]"));
  const studentChip = document.querySelector(".student-chip");
  const studentName = document.querySelector("[data-student-name]");
  const authLink = document.querySelector("[data-auth-link]");
  const authNavLinks = Array.from(document.querySelectorAll("[data-auth-nav]"));
  const authNavLabels = Array.from(document.querySelectorAll("[data-auth-nav-label]"));
  const homeContent = document.querySelector("[data-home-content]");
  const authSection = document.querySelector("#dang-nhap");
  const openAuthLinks = Array.from(document.querySelectorAll("[data-open-auth]"));
  const courseSection = document.querySelector("#danh-sach-bai");
  const openCourseLinks = Array.from(document.querySelectorAll("[data-open-course]"));
  const progressSection = document.querySelector("#chuoi-hoc-tap");
  const openProgressLinks = Array.from(document.querySelectorAll("[data-open-progress]"));
  const guideSection = document.querySelector("#huong-dan");
  const openGuideLinks = Array.from(document.querySelectorAll("[data-open-guide]"));
  const showHomeLinks = Array.from(document.querySelectorAll("[data-show-home]"));
  const logoutButton = document.querySelector("[data-logout]");
  const authMessage = document.querySelector("[data-auth-message]");
  const authModeButtons = Array.from(document.querySelectorAll("[data-auth-mode]"));
  const authForms = Array.from(document.querySelectorAll("[data-auth-form]"));
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function consumeGuestLink() {
    const params = new URLSearchParams(window.location.search);
    const shouldOpenAsGuest = params.get("guest") === "1" || params.get("logout") === "1";
    if (!shouldOpenAsGuest) return false;

    localStorage.removeItem(currentAccountKey);
    sessionStorage.removeItem(openAuthRequestKey);
    params.delete("guest");
    params.delete("logout");

    const cleanSearch = params.toString();
    const cleanUrl = `${window.location.pathname}${cleanSearch ? `?${cleanSearch}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", cleanUrl);
    return true;
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeAccountKey(value) {
    return normalize(value).replace(/[^a-z0-9._-]/g, "");
  }

  function getCurrentAccountKey() {
    return localStorage.getItem(currentAccountKey) || "";
  }

  function getProgressPrefix() {
    const accountKey = getCurrentAccountKey();
    return accountKey ? `phieuhoctap.user.${accountKey}.chuong1` : legacyPrefix;
  }

  function progressKey(name) {
    return `${getProgressPrefix()}.${name}`;
  }

  function copyLegacyProgressToAccount(accountKey) {
    if (!accountKey) return;
    const targetPrefix = `phieuhoctap.user.${accountKey}.chuong1`;
    ["visited", "lastLesson", "studyDays"].forEach((name) => {
      const sourceKey = `${legacyPrefix}.${name}`;
      const targetKey = `${targetPrefix}.${name}`;
      if (localStorage.getItem(targetKey) || !localStorage.getItem(sourceKey)) return;
      localStorage.setItem(targetKey, localStorage.getItem(sourceKey));
    });
  }

  function readVisited() {
    return new Set(readJson(progressKey("visited"), []));
  }

  function writeVisited(visited) {
    writeJson(progressKey("visited"), Array.from(visited));
  }

  function readAccounts() {
    return readJson(accountsKey, {});
  }

  function writeAccounts(accounts) {
    writeJson(accountsKey, accounts);
  }

  function getCurrentAccount() {
    const key = getCurrentAccountKey();
    if (!key) return null;
    return readAccounts()[key] || null;
  }

  function setAuthMessage(message, isError) {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.classList.toggle("is-error", Boolean(isError));
  }

  function makeSalt() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function fallbackHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `fallback-${(hash >>> 0).toString(16)}`;
  }

  async function hashPassword(password, salt) {
    const source = `${salt}:${password}`;
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      const encoded = new TextEncoder().encode(source);
      const digest = await window.crypto.subtle.digest("SHA-256", encoded);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    }
    return fallbackHash(source);
  }

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDayKey(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  function calculateStreak(days) {
    const daySet = new Set(days);
    const sorted = Array.from(daySet).sort();
    if (!sorted.length) return 0;

    const today = parseDayKey(todayKey());
    const lastStudy = parseDayKey(sorted[sorted.length - 1]);
    if (!today || !lastStudy) return 0;

    const dayMs = 24 * 60 * 60 * 1000;
    const gap = Math.round((today - lastStudy) / dayMs);
    if (gap > 1) return 0;

    let count = 0;
    const cursor = new Date(lastStudy);
    while (daySet.has(todayKey(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function getBadge(percent) {
    if (percent >= 100) return "Hoàn thành";
    if (percent >= 75) return "Bền bỉ";
    if (percent >= 50) return "Nỗ lực";
    if (percent > 0) return "Khởi động";
    return "Chưa có";
  }

  function getProgressMessage(viewed, total, streak) {
    if (viewed === 0) return "Hãy mở bài học đầu tiên để bắt đầu chuỗi học tập.";
    if (viewed === total) return "Em đã mở đủ các bài trong chương. Hãy ôn tập để giữ nhịp học.";
    if (streak >= 3) return `Em đang duy trì ${streak} ngày học liên tiếp. Hãy tiếp tục giữ nhịp.`;
    return `Em đã mở ${viewed}/${total} bài. Cố gắng thêm một chút nữa để hoàn thành chương.`;
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
    const total = lessonCards.length;
    const percent = total ? Math.round((viewed.length / total) * 100) : 0;
    const streak = calculateStreak(readJson(progressKey("studyDays"), []));

    cards.forEach((card) => {
      card.classList.toggle("is-visited", visited.has(card.dataset.lessonId));
    });

    if (progressText) {
      progressText.textContent = `${viewed.length}/${total} bài đã mở`;
    }

    if (progressPercent) {
      progressPercent.textContent = `${percent}%`;
    }

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    if (progressStatus) {
      if (viewed.length === 0) {
        progressStatus.textContent = "Chưa mở bài học nào.";
      } else if (viewed.length === total) {
        progressStatus.textContent = "Đã mở đủ các bài trong chương.";
      } else {
        progressStatus.textContent = `Đang học chương 1, còn ${total - viewed.length} bài chưa mở.`;
      }
    }

    if (streakDays) {
      streakDays.textContent = `${streak} ngày`;
    }

    if (badgeLabel) {
      badgeLabel.textContent = getBadge(percent);
    }

    if (progressMessage) {
      progressMessage.textContent = getProgressMessage(viewed.length, total, streak);
    }

    const lastLessonId = localStorage.getItem(progressKey("lastLesson"));
    const lastCard = cards.find((card) => card.dataset.lessonId === lastLessonId);
    if (progressLast) {
      progressLast.textContent = lastCard ? `Bài gần nhất: ${lastCard.dataset.title || "bài học"}` : "Bài gần nhất: chưa có";
    }

    if (continueLinks.length && lastCard) {
      const link = lastCard.querySelector("a[href]");
      if (link) {
        continueLinks.forEach((continueLink) => {
          continueLink.href = link.getAttribute("href");
          continueLink.textContent = "Tiếp tục học";
        });
      }
    }
  }

  function applyUserState() {
    const account = getCurrentAccount();
    const displayName = account ? account.username : "Học sinh";
    if (studentName) {
      studentName.textContent = displayName;
      studentName.title = displayName;
    }
    if (studentChip) {
      studentChip.classList.toggle("is-logged-in", Boolean(account));
    }
    authNavLabels.forEach((label) => {
      label.textContent = account ? "Tài khoản" : "Đăng nhập";
    });
    authNavLinks.forEach((link) => {
      link.setAttribute("aria-label", account ? "Tài khoản học sinh" : "Đăng nhập");
    });
    if (authLink) {
      authLink.hidden = Boolean(account);
      authLink.textContent = "Đăng nhập";
    }
    if (logoutButton) {
      logoutButton.hidden = !account;
    }
    applyProgress();
  }

  function switchAuthMode(mode) {
    authModeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.authMode === mode);
    });
    authForms.forEach((form) => {
      form.hidden = form.dataset.authForm !== mode;
    });
    setAuthMessage("", false);
  }

  function setActiveNav(target) {
    document.querySelectorAll(".main-nav a").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.navTarget === target);
    });
  }

  function showHomeView() {
    document.body.classList.remove("is-compact-view");
    if (homeContent) homeContent.hidden = false;
    if (courseSection) courseSection.hidden = true;
    if (guideSection) guideSection.hidden = true;
    if (authSection) authSection.hidden = true;
    setActiveNav("home");
    window.requestAnimationFrame(() => {
      document.getElementById("trang-chu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function showProgressView() {
    showHomeView();
    window.requestAnimationFrame(() => {
      progressSection?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function showCourseView() {
    document.body.classList.add("is-compact-view");
    if (homeContent) homeContent.hidden = true;
    if (authSection) authSection.hidden = true;
    if (guideSection) guideSection.hidden = true;
    if (courseSection) {
      courseSection.hidden = false;
      window.requestAnimationFrame(() => {
        courseSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    setActiveNav("course");
    updateCards();
  }

  function revealAuthSection(mode) {
    document.body.classList.remove("is-compact-view");
    if (homeContent) homeContent.hidden = false;
    if (courseSection) courseSection.hidden = true;
    if (guideSection) guideSection.hidden = true;
    if (authSection) {
      authSection.hidden = false;
      window.requestAnimationFrame(() => {
        authSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    if (mode) {
      switchAuthMode(mode);
    }
    setActiveNav("auth");
  }

  function revealGuideSection() {
    if (!guideSection) return;
    document.body.classList.add("is-compact-view");
    if (homeContent) homeContent.hidden = true;
    if (courseSection) courseSection.hidden = true;
    if (authSection) authSection.hidden = true;
    guideSection.hidden = false;
    window.requestAnimationFrame(() => {
      guideSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    setActiveNav("guide");
  }

  async function handleRegister(form) {
    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const school = String(formData.get("school") || "").trim();
    const className = String(formData.get("className") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const accountKey = normalizeAccountKey(username);

    if (!username || !school || !className || !email || !password || !confirmPassword) {
      setAuthMessage("Em vui lòng nhập đầy đủ thông tin trước khi đăng kí.", true);
      return;
    }

    if (!accountKey) {
      setAuthMessage("Tên đăng nhập cần có chữ hoặc số.", true);
      return;
    }

    if (!emailPattern.test(email)) {
      setAuthMessage("Email chưa đúng định dạng. Em hãy kiểm tra lại nhé.", true);
      return;
    }

    if (password !== confirmPassword) {
      setAuthMessage("Mật khẩu xác nhận chưa trùng khớp. Em hãy nhập lại.", true);
      return;
    }

    const accounts = readAccounts();
    const emailTaken = Object.values(accounts).some((account) => normalize(account.email) === normalize(email));
    if (accounts[accountKey] || emailTaken) {
      setAuthMessage("Tên đăng nhập hoặc email đã được sử dụng.", true);
      return;
    }

    const salt = makeSalt();
    const passwordHash = await hashPassword(password, salt);
    accounts[accountKey] = {
      username,
      school,
      className,
      email,
      salt,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    writeAccounts(accounts);
    copyLegacyProgressToAccount(accountKey);
    localStorage.setItem(currentAccountKey, accountKey);
    form.reset();
    setAuthMessage("Chúc mừng em! Tài khoản đã được tạo thành công.", false);
    applyUserState();
  }

  async function handleLogin(form) {
    const formData = new FormData(form);
    const identifier = String(formData.get("identifier") || "").trim();
    const password = String(formData.get("password") || "");
    const accounts = readAccounts();
    const accountKey = normalizeAccountKey(identifier);
    const accountEntry = accounts[accountKey]
      ? [accountKey, accounts[accountKey]]
      : Object.entries(accounts).find(([_key, account]) => normalize(account.email) === normalize(identifier));

    if (!identifier || !password) {
      setAuthMessage("Em vui lòng nhập tên đăng nhập/email và mật khẩu.", true);
      return;
    }

    if (!accountEntry) {
      setAuthMessage("Tên đăng nhập hoặc mật khẩu chưa đúng. Em hãy kiểm tra lại thông tin.", true);
      return;
    }

    const [key, account] = accountEntry;
    const passwordHash = await hashPassword(password, account.salt);
    if (passwordHash !== account.passwordHash) {
      setAuthMessage("Tên đăng nhập hoặc mật khẩu chưa đúng. Em hãy kiểm tra lại thông tin.", true);
      return;
    }

    localStorage.setItem(currentAccountKey, key);
    copyLegacyProgressToAccount(key);
    form.reset();
    setAuthMessage("Đăng nhập thành công! Chào mừng em quay lại lớp học trực tuyến.", false);
    applyUserState();
  }

  cards.forEach((card) => {
    const link = card.querySelector("a[href]");
    if (!link) return;
    link.addEventListener("click", () => {
      if (card.dataset.trackProgress !== "true") return;
      const visited = readVisited();
      visited.add(card.dataset.lessonId);
      writeVisited(visited);
      localStorage.setItem(progressKey("lastLesson"), card.dataset.lessonId);
    });
  });

  authModeButtons.forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.authMode || "login"));
  });

  openAuthLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      revealAuthSection("login");
    });
  });

  openCourseLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showCourseView();
    });
  });

  openProgressLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showProgressView();
    });
  });

  openGuideLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      revealGuideSection();
    });
  });

  showHomeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showHomeView();
    });
  });

  authForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (form.dataset.authForm === "register") {
        handleRegister(form);
      } else {
        handleLogin(form);
      }
    });
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem(currentAccountKey);
      setAuthMessage("Đã đăng xuất tài khoản học sinh.", false);
      applyUserState();
    });
  }

  if (searchInput) searchInput.addEventListener("input", updateCards);
  if (typeSelect) typeSelect.addEventListener("change", updateCards);
  if (chapterSelect) chapterSelect.addEventListener("change", updateCards);

  consumeGuestLink();
  applyUserState();
  updateCards();

  if (sessionStorage.getItem(openAuthRequestKey) === "1") {
    sessionStorage.removeItem(openAuthRequestKey);
    revealAuthSection("login");
  }
})();
