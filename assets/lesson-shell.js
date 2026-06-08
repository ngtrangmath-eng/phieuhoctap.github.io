(function () {
  const pages = [
    {
      id: "muc-luc",
      label: "Mục lục",
      title: "Mục lục Chương 1",
      href: "../Toan6-Chuong1-Mucluc/Toan6-Chuong1-MucLuc.html",
      trackProgress: false
    },
    {
      id: "bai-1",
      label: "Bài 1",
      title: "Tập hợp",
      href: "../Toan6-Chuong1-Bai1/Toan6-Chuong1-Bai1.html",
      trackProgress: true
    },
    {
      id: "bai-2",
      label: "Bài 2",
      title: "Cách ghi số tự nhiên",
      href: "../Toan6-Chuong1-Bai2/Toan6-Chuong1-Bai2.html",
      trackProgress: true
    },
    {
      id: "bai-3",
      label: "Bài 3",
      title: "Thứ tự trong tập hợp các số tự nhiên",
      href: "../Toan6-Chuong1-Bai3/Toan6-Chuong1-Bai3.html",
      trackProgress: true
    },
    {
      id: "bai-4",
      label: "Bài 4",
      title: "Phép cộng và phép trừ số tự nhiên",
      href: "../Toan6-Chuong1-Bai4/Toan6-Chuong1-Bai4.html",
      trackProgress: true
    },
    {
      id: "bai-5",
      label: "Bài 5",
      title: "Phép nhân và phép chia số tự nhiên",
      href: "../Toan6-Chuong1-Bai5/Toan6-Chuong1-Bai5.html",
      trackProgress: true
    },
    {
      id: "bai-6",
      label: "Bài 6",
      title: "Lũy thừa với số mũ tự nhiên",
      href: "../Toan6-Chuong1-Bai6/Toan6-Chuong1-Bai6.html",
      trackProgress: true
    },
    {
      id: "bai-7",
      label: "Bài 7",
      title: "Thứ tự thực hiện các phép tính",
      href: "../Toan6-Chuong1-Bai7/Toan6-Chuong1-Bai7.html",
      trackProgress: true
    },
    {
      id: "on-tap",
      label: "Ôn tập",
      title: "Ôn tập Chương 1",
      href: "../Toan6-Chuong1-OnTap/Toan6-Chuong1-OnTap.html",
      trackProgress: true
    }
  ];

  const legacyPrefix = "phieuhoctap.chuong1";
  const currentAccountKey = "phieuhoctap.auth.current";
  const openAuthRequestKey = "phieuhoctap.openAuth";

  function getProgressPrefix() {
    const accountKey = localStorage.getItem(currentAccountKey) || "";
    return accountKey ? `phieuhoctap.user.${accountKey}.chuong1` : legacyPrefix;
  }

  function progressKey(name) {
    return `${getProgressPrefix()}.${name}`;
  }

  function readVisited() {
    try {
      return new Set(JSON.parse(localStorage.getItem(progressKey("visited")) || "[]"));
    } catch (_error) {
      return new Set();
    }
  }

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function rememberStudyDay() {
    const key = progressKey("studyDays");
    let days = [];
    try {
      days = JSON.parse(localStorage.getItem(key) || "[]");
    } catch (_error) {
      days = [];
    }
    const day = todayKey();
    if (!days.includes(day)) {
      days.push(day);
      localStorage.setItem(key, JSON.stringify(days));
    }
  }

  function remember(page) {
    if (!page || !page.trackProgress) return;
    const visited = readVisited();
    visited.add(page.id);
    localStorage.setItem(progressKey("visited"), JSON.stringify(Array.from(visited)));
    localStorage.setItem(progressKey("lastLesson"), page.id);
    rememberStudyDay();
  }

  function createLink(text, href, className) {
    const link = document.createElement("a");
    link.className = className;
    link.href = href;
    link.textContent = text;
    return link;
  }

  function isLoggedIn() {
    return Boolean(localStorage.getItem(currentAccountKey));
  }

  function ensureLoginNotice() {
    let notice = document.querySelector(".login-required-panel");
    if (notice) return notice;

    const partC = document.getElementById("part-c");
    if (!partC || !partC.parentNode) return null;

    notice = document.createElement("section");
    notice.className = "login-required-panel";
    notice.hidden = true;

    const title = document.createElement("h2");
    title.textContent = "Cần đăng nhập để làm kiểm tra";

    const message = document.createElement("p");
    message.textContent = "Em hãy đăng nhập tài khoản học sinh trước khi vào Phần C - Kiểm tra đánh giá.";

    const loginLink = createLink("Về trang chủ đăng nhập", "../index.html", "login-required-panel__button");
    loginLink.addEventListener("click", () => {
      sessionStorage.setItem(openAuthRequestKey, "1");
    });

    notice.append(title, message, loginLink);
    partC.parentNode.insertBefore(notice, partC);
    return notice;
  }

  function showLoginNotice() {
    const notice = ensureLoginNotice();
    if (!notice) return;
    notice.hidden = false;
    notice.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function lockAssessmentUntilLogin() {
    const partC = document.getElementById("part-c");
    if (!partC || isLoggedIn()) return;

    const partCTab = document.querySelector('[data-tab="part-c"]');
    if (partCTab) {
      partCTab.classList.add("is-locked");
      partCTab.setAttribute("aria-disabled", "true");
      partCTab.title = "Em cần đăng nhập để làm kiểm tra.";
    }

    partC.classList.add("is-login-locked");
    partC.querySelectorAll("input, textarea, select, button").forEach((control) => {
      control.disabled = true;
      control.setAttribute("aria-disabled", "true");
    });

    document.addEventListener(
      "click",
      (event) => {
        const trigger = event.target.closest('[data-tab="part-c"], [data-tab-jump="part-c"]');
        if (!trigger || isLoggedIn()) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        showLoginNotice();
      },
      true
    );
  }

  function mount() {
    const currentId = document.body ? document.body.dataset.lessonId : "";
    const currentIndex = pages.findIndex((page) => page.id === currentId);
    if (currentIndex === -1 || document.querySelector(".learning-site-bar")) return;

    const current = pages[currentIndex];
    const previous = pages[currentIndex - 1];
    const next = pages[currentIndex + 1];
    remember(current);

    const bar = document.createElement("nav");
    bar.className = "learning-site-bar";
    bar.setAttribute("aria-label", "Điều hướng website học tập");

    const inner = document.createElement("div");
    inner.className = "learning-site-bar__inner";

    const brand = createLink("Phiếu học tập Toán 6", "../index.html", "learning-site-bar__brand");
    const mark = document.createElement("span");
    mark.className = "learning-site-bar__mark";
    mark.textContent = "6";
    brand.prepend(mark);

    const nav = document.createElement("div");
    nav.className = "learning-site-bar__nav";

    nav.append(createLink("Trang chủ", "../index.html", "learning-site-bar__link"));
    if (previous) nav.append(createLink("Bài trước", previous.href, "learning-site-bar__link"));

    const currentLabel = document.createElement("span");
    currentLabel.className = "learning-site-bar__current";
    currentLabel.textContent = current.label;
    nav.append(currentLabel);

    if (next) nav.append(createLink("Bài sau", next.href, "learning-site-bar__link"));

    const printButton = document.createElement("button");
    printButton.className = "learning-site-bar__button";
    printButton.type = "button";
    printButton.textContent = "In";
    printButton.addEventListener("click", () => window.print());
    nav.append(printButton);

    inner.append(brand, nav);
    bar.append(inner);
    document.body.prepend(bar);
    lockAssessmentUntilLogin();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
