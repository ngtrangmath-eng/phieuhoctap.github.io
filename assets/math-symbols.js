(function () {
  const symbols = [
    "∈",
    "∉",
    "⊂",
    "⊃",
    "⊆",
    "⊇",
    "∅",
    "∪",
    "∩",
    "Ø",
    "ℕ",
    "ℤ",
    "ℚ",
    "ℝ",
    "{",
    "}",
    ";",
    "...",
    "≠",
    "≤",
    "≥",
    "×",
    "÷",
    "²",
    "³",
    "√",
    "±"
  ];

  const editableSelector = [
    "textarea[data-save]",
    "input[data-save]:not([type])",
    "input[data-save][type='text']",
    "input[data-save][type='search']",
    "input[data-save][type='email']",
    "input[data-save][type='tel']",
    "input[data-save][type='url']",
    "[contenteditable='true']"
  ].join(",");
  const defaultHelp = "Bấm vào ô cần điền rồi chọn ký hiệu để chèn.";
  let activeField = null;
  let savedSelection = null;

  function isEditableField(element) {
    if (!element || element.closest(".math-symbol-widget")) return false;
    if (!element.matches(editableSelector)) return false;
    if (element.isContentEditable) return true;
    return !element.disabled && !element.readOnly;
  }

  function saveSelection(element) {
    if (!isEditableField(element)) return;
    activeField = element;
    if (typeof element.selectionStart === "number" && typeof element.selectionEnd === "number") {
      savedSelection = {
        start: element.selectionStart,
        end: element.selectionEnd
      };
    } else {
      const selection = window.getSelection();
      if (selection && selection.rangeCount && element.contains(selection.anchorNode)) {
        savedSelection = selection.getRangeAt(0).cloneRange();
      }
    }
  }

  function dispatchFieldEvents(element) {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function insertIntoTextField(element, value) {
    const start = savedSelection && typeof savedSelection.start === "number" ? savedSelection.start : element.value.length;
    const end = savedSelection && typeof savedSelection.end === "number" ? savedSelection.end : start;
    element.focus();

    if (typeof element.setRangeText === "function") {
      element.setRangeText(value, start, end, "end");
    } else {
      element.value = `${element.value.slice(0, start)}${value}${element.value.slice(end)}`;
      const nextPosition = start + value.length;
      element.setSelectionRange(nextPosition, nextPosition);
    }

    savedSelection = {
      start: element.selectionStart,
      end: element.selectionEnd
    };
    dispatchFieldEvents(element);
  }

  function insertIntoContentEditable(element, value) {
    element.focus();
    const selection = window.getSelection();
    const range = savedSelection && typeof savedSelection.insertNode === "function"
      ? savedSelection
      : document.createRange();

    if (!savedSelection || typeof savedSelection.insertNode !== "function") {
      range.selectNodeContents(element);
      range.collapse(false);
    }

    range.deleteContents();
    const textNode = document.createTextNode(value);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    savedSelection = range.cloneRange();
    dispatchFieldEvents(element);
  }

  function insertSymbol(value, helpText) {
    if (!isEditableField(activeField)) {
      helpText.textContent = "Em hãy bấm vào ô trả lời trước, rồi chọn ký hiệu.";
      helpText.classList.add("is-warning");
      return;
    }

    helpText.textContent = defaultHelp;
    helpText.classList.remove("is-warning");

    if (activeField.isContentEditable) {
      insertIntoContentEditable(activeField, value);
    } else {
      insertIntoTextField(activeField, value);
    }
  }

  function createWidget() {
    const widget = document.createElement("div");
    widget.className = "math-symbol-widget";
    widget.innerHTML = `
      <section class="math-symbol-panel" id="math-symbol-panel" aria-label="Ký hiệu toán" hidden>
        <div class="math-symbol-header">
          <span class="math-symbol-title-icon" aria-hidden="true">∑<br />&amp;%</span>
          <h2>Ký hiệu toán</h2>
          <button class="math-symbol-close" type="button" aria-label="Đóng bảng ký hiệu">×</button>
        </div>
        <div class="math-symbol-grid" role="list"></div>
        <p class="math-symbol-help">${defaultHelp}</p>
      </section>
      <button class="math-symbol-toggle" type="button" aria-controls="math-symbol-panel" aria-expanded="false" aria-label="Mở bảng ký hiệu toán">
        <span aria-hidden="true">∑</span>
        <span aria-hidden="true">&amp;%</span>
      </button>
    `;

    const panel = widget.querySelector(".math-symbol-panel");
    const grid = widget.querySelector(".math-symbol-grid");
    const toggle = widget.querySelector(".math-symbol-toggle");
    const close = widget.querySelector(".math-symbol-close");
    const helpText = widget.querySelector(".math-symbol-help");

    symbols.forEach((symbol) => {
      const key = document.createElement("button");
      key.className = "math-symbol-key";
      key.type = "button";
      key.textContent = symbol;
      key.setAttribute("aria-label", `Chèn ký hiệu ${symbol}`);
      key.addEventListener("pointerdown", (event) => event.preventDefault());
      key.addEventListener("click", () => insertSymbol(symbol, helpText));
      grid.appendChild(key);
    });

    function setOpen(isOpen) {
      panel.hidden = !isOpen;
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        helpText.textContent = defaultHelp;
        helpText.classList.remove("is-warning");
      }
    }

    toggle.addEventListener("click", () => setOpen(panel.hidden));
    close.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    document.body.appendChild(widget);
  }

  document.addEventListener("focusin", (event) => saveSelection(event.target));
  document.addEventListener("selectionchange", () => saveSelection(document.activeElement));
  document.addEventListener("keyup", (event) => saveSelection(event.target));
  document.addEventListener("mouseup", (event) => saveSelection(event.target));
  document.addEventListener("input", (event) => saveSelection(event.target));

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
