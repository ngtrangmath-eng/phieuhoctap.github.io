(function () {
  const pages = [
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
  const accountsKey = "phieuhoctap.accounts";
  const currentAccountKey = "phieuhoctap.auth.current";
  const openAuthRequestKey = "phieuhoctap.openAuth";
  const assessmentResultsKey = "tmath.assessmentResults";
  const teacherEmail = "ngtrang.math@gmail.com";
  const scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : "";
  const homeHref = getHomeHref();
  let assessmentStartedAt = null;
  let lastSavedAssessmentId = "";
  let lastAutoEmailId = "";

  function getHomeHref() {
    if (!scriptUrl) return "../index.html";
    try {
      return new URL("../index.html", scriptUrl).href;
    } catch (_error) {
      return "../index.html";
    }
  }

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

  function isLoggedIn() {
    return Boolean(localStorage.getItem(currentAccountKey));
  }

  function getCurrentAccount() {
    const accountKey = localStorage.getItem(currentAccountKey) || "";
    const accounts = readJson(accountsKey, {});
    if (!accountKey || !accounts[accountKey]) return null;
    return { ...accounts[accountKey], accountKey };
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

    const loginLink = createLink("Về trang chủ đăng nhập", homeHref, "login-required-panel__button");
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

  function markAssessmentStart() {
    if (!assessmentStartedAt) assessmentStartedAt = new Date();
  }

  function formatDateTime(date) {
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  }

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes <= 0) return `${seconds} giây`;
    return `${minutes} phút ${seconds} giây`;
  }

  function parseScore(text) {
    const match = /(\d+(?:[,.]\d+)?)\s*\/\s*10/.exec(String(text || ""));
    return match ? Number(match[1].replace(",", ".")) : null;
  }

  function getTotalScore() {
    const resultContent = document.getElementById("result-content");
    if (!resultContent) return null;

    const metrics = Array.from(resultContent.querySelectorAll(".result-metric"));
    for (const metric of metrics) {
      const label = metric.querySelector("span")?.textContent || "";
      if (label.toLowerCase().includes("tổng điểm")) {
        const score = parseScore(metric.querySelector("strong")?.textContent || "");
        if (score !== null) return score;
      }
    }
    return parseScore(resultContent.textContent);
  }

  function getRank(score) {
    if (score >= 9) return "Xuất sắc";
    if (score >= 7) return "Tốt";
    if (score >= 5) return "Đạt";
    return "Cần cố gắng";
  }

  function getFieldValue(id, fallback = "Chưa nhập") {
    const field = document.getElementById(id);
    const value = field && "value" in field ? field.value.trim() : "";
    return value || fallback;
  }

  function getAssessmentRecords() {
    return readJson(assessmentResultsKey, []);
  }

  function saveAssessmentRecord(record) {
    const records = getAssessmentRecords();
    records.push(record);
    writeJson(assessmentResultsKey, records);
    return records;
  }

  function buildAssessmentRecord(current) {
    const score = getTotalScore();
    if (score === null || Number.isNaN(score)) return null;

    const account = getCurrentAccount();
    const submittedAt = new Date();
    const startedAt = assessmentStartedAt || submittedAt;
    const studentName = getFieldValue("student-name", account?.username || "Chưa nhập");
    const className = getFieldValue("student-class", account?.className || "Chưa nhập");
    const lessonCode = getFieldValue("student-code", current.id);
    const correct = Number(score.toFixed(2));
    const wrong = Number(Math.max(0, 10 - score).toFixed(2));

    return {
      id: `${lessonCode}-${submittedAt.getTime()}`,
      username: account?.accountKey || "khach",
      student_name: studentName,
      school: account?.school || "Chưa nhập",
      class_name: className,
      email: account?.email || "Chưa nhập",
      chapter: "Chương 1",
      lesson: current.label,
      test_name: current.title,
      start_time: formatDateTime(startedAt),
      submit_time: formatDateTime(submittedAt),
      duration: formatDuration(submittedAt - startedAt),
      score: correct,
      correct_answers: correct,
      wrong_answers: wrong,
      rank: getRank(score),
      status: "Hoàn thành",
      teacher_email: teacherEmail,
      page_url: window.location.href
    };
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  }

  function recordsToCsv(records) {
    const columns = [
      ["STT", (_record, index) => index + 1],
      ["Tên đăng nhập", (record) => record.username],
      ["Họ và tên", (record) => record.student_name],
      ["Trường", (record) => record.school],
      ["Lớp", (record) => record.class_name],
      ["Email", (record) => record.email],
      ["Chương", (record) => record.chapter],
      ["Bài", (record) => record.lesson],
      ["Tên bài kiểm tra", (record) => record.test_name],
      ["Thời gian bắt đầu", (record) => record.start_time],
      ["Thời gian nộp bài", (record) => record.submit_time],
      ["Tổng thời gian làm bài", (record) => record.duration],
      ["Điểm", (record) => record.score],
      ["Số câu/ý đúng", (record) => record.correct_answers],
      ["Số câu/ý sai", (record) => record.wrong_answers],
      ["Xếp loại", (record) => record.rank],
      ["Trạng thái", (record) => record.status],
      ["Email giáo viên", (record) => record.teacher_email]
    ];
    const header = columns.map(([label]) => csvEscape(label)).join(",");
    const rows = records.map((record, index) => columns.map(([_label, getter]) => csvEscape(getter(record, index))).join(","));
    return `\uFEFF${[header, ...rows].join("\n")}`;
  }

  function downloadAssessmentCsv(records) {
    const csv = recordsToCsv(records);
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TKKetQua_Toan6_Chuong1_${date}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function buildEmailBody(record) {
    return [
      "Kính gửi cô,",
      "",
      "Hệ thống TMath gửi cô thống kê kết quả bài kiểm tra của học sinh.",
      "",
      `Họ và tên: ${record.student_name}`,
      `Tên đăng nhập: ${record.username}`,
      `Trường: ${record.school}`,
      `Lớp: ${record.class_name}`,
      `Email học sinh: ${record.email}`,
      `Bài kiểm tra: ${record.lesson} - ${record.test_name}`,
      `Thời gian bắt đầu: ${record.start_time}`,
      `Thời gian nộp bài: ${record.submit_time}`,
      `Tổng thời gian làm bài: ${record.duration}`,
      `Điểm: ${record.score}/10`,
      `Số câu/ý đúng: ${record.correct_answers}`,
      `Số câu/ý sai: ${record.wrong_answers}`,
      `Xếp loại: ${record.rank}`,
      `Trạng thái: ${record.status}`,
      "",
      "Nếu cần bảng dữ liệu, học sinh có thể bấm nút Tải file Excel trên trang kết quả rồi đính kèm vào email này.",
      "",
      "Trân trọng."
    ].join("\n");
  }

  function openTeacherEmail(record) {
    const subject = encodeURIComponent(`Thống kê kết quả bài kiểm tra Toán 6 - ${record.lesson}`);
    const body = encodeURIComponent(buildEmailBody(record));
    window.location.href = `mailto:${teacherEmail}?subject=${subject}&body=${body}`;
  }

  function getAssessmentAnswerKeySource() {
    const keys = Array.from(document.querySelectorAll("#part-c details.answer-key"));
    if (!keys.length) return null;
    return keys.find((key) => /đáp án.*hướng dẫn chấm/i.test(key.querySelector("summary")?.textContent || "")) || keys[keys.length - 1];
  }

  function renderAnswerKeyInResult() {
    const result = document.getElementById("result");
    const source = getAssessmentAnswerKeySource();
    if (!result || !source) return;

    result.querySelector(".result-answer-key")?.remove();
    const answerKey = source.cloneNode(true);
    answerKey.classList.remove("answer-key");
    answerKey.classList.add("result-answer-key");
    answerKey.open = true;
    answerKey.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));

    const summary = answerKey.querySelector("summary");
    if (summary) summary.textContent = "Đáp án và hướng dẫn chấm";

    const reportPanel = result.querySelector(".assessment-report-panel");
    if (reportPanel) {
      result.insertBefore(answerKey, reportPanel);
    } else {
      result.append(answerKey);
    }
  }

  function ensureReportPanel() {
    let panel = document.querySelector(".assessment-report-panel");
    if (panel) return panel;

    const result = document.getElementById("result");
    if (!result) return null;
    panel = document.createElement("section");
    panel.className = "assessment-report-panel";
    result.append(panel);
    return panel;
  }

  function renderReportPanel(record, records) {
    const panel = ensureReportPanel();
    if (!panel) return;

    panel.textContent = "";
    const title = document.createElement("h3");
    title.textContent = "Thống kê kết quả gửi giáo viên";

    const summary = document.createElement("p");
    summary.textContent = `Đã tự lưu kết quả ${record.score}/10 của ${record.student_name}. Hệ thống tự mở email gửi thống kê đến ${teacherEmail}; nếu email chưa mở, bấm lại nút bên dưới.`;

    const actions = document.createElement("div");
    actions.className = "assessment-report-actions";

    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.textContent = "Tải file Excel";
    downloadButton.addEventListener("click", () => downloadAssessmentCsv(records));

    const emailButton = document.createElement("button");
    emailButton.type = "button";
    emailButton.textContent = "Mở lại email gửi giáo viên";
    emailButton.addEventListener("click", () => openTeacherEmail(record));

    actions.append(downloadButton, emailButton);
    panel.append(title, summary, actions);
  }

  function handleAssessmentSubmitted(current) {
    const record = buildAssessmentRecord(current);
    if (!record) return;
    if (record.id === lastSavedAssessmentId) return;
    lastSavedAssessmentId = record.id;
    const records = saveAssessmentRecord(record);
    renderAnswerKeyInResult();
    renderReportPanel(record, records);

    if (record.id !== lastAutoEmailId) {
      lastAutoEmailId = record.id;
      window.setTimeout(() => openTeacherEmail(record), 120);
    }
  }

  function bindAssessmentReporting(current) {
    const partC = document.getElementById("part-c");
    const submitButton = document.getElementById("submit-test");
    if (!partC || !submitButton) return;

    partC.addEventListener("input", markAssessmentStart, true);
    partC.addEventListener("focusin", markAssessmentStart);
    partC.addEventListener("click", markAssessmentStart, true);

    submitButton.addEventListener(
      "click",
      () => {
        markAssessmentStart();
        window.setTimeout(() => handleAssessmentSubmitted(current), 80);
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

    const brand = createLink("TMath - Nền tảng học toán trực tuyến", homeHref, "learning-site-bar__brand");
    const mark = document.createElement("span");
    mark.className = "learning-site-bar__mark";
    mark.textContent = "T";
    brand.prepend(mark);

    const nav = document.createElement("div");
    nav.className = "learning-site-bar__nav";

    nav.append(createLink("Trang chủ", homeHref, "learning-site-bar__link"));
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
    bindAssessmentReporting(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
