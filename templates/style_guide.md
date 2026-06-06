# Khung style và cấu trúc phiếu học tập tương tác

Tệp này dùng để hướng dẫn tạo giao diện phiếu học tập điện tử theo phong cách rõ ràng, dễ dùng cho học sinh THCS, đặc biệt là học sinh lớp 6.

---

## 1. Nguyên tắc thiết kế chung

- Giao diện sử dụng màu sáng, thân thiện, tạo cảm giác gần gũi với học sinh.
- Bố cục rộng rãi, không chen chúc, mỗi phần nội dung được tách thành khung rõ ràng.
- Font chữ dễ đọc, có thể dùng phong cách viết tay nhưng không được gây khó nhìn.
- Nút bấm đủ lớn, chữ trên nút phải nổi rõ trên nền.
- Các phần quan trọng cần được làm nổi bật bằng màu sắc, khung viền hoặc nhãn ghi chú.
- Phản hồi đúng/sai phải nhẹ nhàng, mang tính gợi mở, không chê học sinh.
- Khi học sinh làm sai, hệ thống chỉ gợi ý để học sinh đi đến đáp án, không nêu đáp án đúng ngay từ lần đầu.

---

## 2. Cấu trúc lớp giao diện bắt buộc

Source HTML nên tổ chức theo các lớp chính sau:

```text
app-shell
app-header
student-info
lesson-nav
tab-button
part-panel
question-card
feedback-box
result-card
```

Ý nghĩa từng lớp:

### `app-shell`

Khung bao toàn bộ phiếu học tập.

Nên có:

- nền dạng giấy học tập hoặc nền sáng;
- chiều rộng tối đa phù hợp màn hình máy tính;
- bo góc, đổ bóng nhẹ;
- khoảng cách trong rộng rãi.

### `app-header`

Phần tiêu đề đầu phiếu.

Nên có:

- tên phiếu học tập;
- tên bài học;
- môn học, lớp học;
- biểu tượng trang trí nhẹ nhàng.

Ví dụ:

```html
<header class="app-header">
  <h1>Phiếu học tập</h1>
  <p>Bài học: Tập hợp - Toán 6</p>
</header>
```

### `student-info`

Phần nhập thông tin học sinh.

Nên có:

- họ và tên;
- lớp;
- email hoặc mã học sinh nếu cần;
- hướng dẫn ngắn trước khi làm bài.

### `lesson-nav`

Thanh điều hướng các phần của phiếu học tập.

Nên có các nút chuyển phần như:

- Thông tin;
- Lý thuyết;
- Luyện tập;
- Kiểm tra;
- Kết quả.

### `tab-button`

Nút chuyển từng phần nội dung.

Yêu cầu:

- nút lớn, dễ bấm;
- màu sắc rõ;
- có trạng thái đang chọn;
- chữ trên nút phải tương phản tốt với nền.

### `part-panel`

Khung chứa từng phần nội dung chính.

Mỗi `part-panel` nên tương ứng với một phần:

- phần thông tin;
- phần kiến thức trọng tâm;
- phần luyện tập;
- phần kiểm tra;
- phần kết quả.

### `question-card`

Khung chứa từng câu hỏi.

Nên có:

- số thứ tự câu hỏi;
- nội dung câu hỏi;
- ô nhập hoặc đáp án lựa chọn;
- nút kiểm tra/gợi ý;
- vùng phản hồi riêng.

### `feedback-box`

Khung phản hồi cho học sinh.

Nguyên tắc:

- không dùng các câu như “Sai rồi”, “Em không hiểu bài”; 
- ưu tiên câu gợi mở;
- không nêu đáp án ngay;
- hướng học sinh kiểm tra lại dữ kiện đề bài.

Ví dụ phản hồi nên dùng:

```text
Em thử kiểm tra lại điều kiện của đề bài nhé.
Hãy xem phần tử này có xuất hiện trong tập hợp không.
Em đã đúng phần chính, chỉ cần sửa cách trình bày.
```

### `result-card`

Khung hiển thị kết quả sau khi học sinh hoàn thành.

Nên có:

- điểm số;
- số câu đúng;
- nhận xét chung;
- gợi ý ôn tập;
- nút làm lại hoặc xuất kết quả nếu cần.

---

## 3. Quy tắc phản hồi khi học sinh làm sai

Khi học sinh trả lời sai, hệ thống cần phản hồi theo hướng dẫn sau:

### Lần gợi ý đầu tiên

- Không nêu đáp án đúng.
- Nhắc học sinh đọc lại đề.
- Gợi ý học sinh xác định dữ kiện quan trọng.

Ví dụ:

```text
Em thử đọc lại yêu cầu của câu hỏi và xem đề bài đang hỏi điều gì nhé.
```

### Lần gợi ý thứ hai

- Vẫn không nêu đáp án đúng.
- Gợi ý cụ thể hơn về bước cần làm.
- Có thể nhắc lại khái niệm liên quan.

Ví dụ:

```text
Em hãy kiểm tra xem đối tượng đang xét có thỏa điều kiện của tập hợp không nhé.
```

### Lần gợi ý thứ ba trở đi

- Có thể hướng dẫn từng bước rõ hơn.
- Chỉ đưa đáp án nếu chính sách bài học cho phép hoặc giáo viên thiết lập cho phép.

Ví dụ:

```text
Em làm theo từng bước: xác định điều kiện, liệt kê các đối tượng thỏa điều kiện, rồi viết lại bằng kí hiệu phù hợp.
```

---

## 4. Gợi ý CSS cơ bản

```css
:root {
  --paper: #fffdf6;
  --ink: #1f2457;
  --purple: #5b35c8;
  --pink: #ef4b8b;
  --blue: #2386d8;
  --green: #2fa66a;
  --orange: #f19a24;
  --red: #d62828;
  --soft-blue: #eef7ff;
  --soft-green: #ecfff5;
  --soft-yellow: #fff8dc;
  --soft-red: #fff0f0;
  --shadow: 0 12px 24px rgba(31, 36, 87, 0.16);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #eaf2fb;
  color: var(--ink);
  font-family: "Comic Sans MS", "Segoe Print", "Marker Felt", cursive;
}

.app-shell {
  width: min(1100px, calc(100% - 22px));
  margin: 16px auto;
  padding: 24px 28px;
  border-radius: 22px;
  background: var(--paper);
  box-shadow: var(--shadow);
}

.app-header {
  text-align: center;
  margin-bottom: 18px;
}

.app-header h1 {
  margin: 0;
  color: var(--purple);
  font-size: clamp(30px, 5vw, 58px);
  text-shadow: 2px 2px 0 #eee7ff;
}

.student-info,
.part-panel,
.question-card,
.result-card {
  background: rgba(255, 255, 255, 0.86);
  border: 3px dashed #b6c3ef;
  border-radius: 18px;
  padding: 16px;
  margin: 14px 0;
}

.lesson-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 14px 0 20px;
}

.tab-button {
  border: 4px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 12px;
  min-height: 54px;
  color: #fff;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
}

.tab-button.active {
  outline: 4px dashed rgba(91, 53, 200, 0.25);
  outline-offset: 3px;
}

.feedback-box {
  display: none;
  margin-top: 10px;
  padding: 12px 14px;
  border: 3px dashed #9878d9;
  border-radius: 16px;
  background: #fbf8ff;
  color: #33206b;
  font-size: 19px;
  line-height: 1.55;
}

.feedback-box.show {
  display: block;
}

.feedback-box.correct {
  border-color: var(--green);
  background: var(--soft-green);
  color: #166339;
}

.feedback-box.hint {
  border-color: var(--orange);
  background: var(--soft-yellow);
  color: #7a4b00;
}

button {
  font-family: inherit;
}

@media print {
  .lesson-nav,
  .tab-button,
  button {
    display: none !important;
  }

  .part-panel,
  .question-card,
  .result-card {
    break-inside: avoid;
  }
}
```

---

## 5. Gợi ý cấu trúc HTML mẫu

```html
<main class="app-shell">
  <header class="app-header">
    <h1>Phiếu học tập</h1>
    <p>Bài học: ... - Toán 6</p>
  </header>

  <section class="student-info">
    <h2>Thông tin học sinh</h2>
    <input type="text" placeholder="Họ và tên">
    <input type="text" placeholder="Lớp">
  </section>

  <nav class="lesson-nav">
    <button class="tab-button active">Thông tin</button>
    <button class="tab-button">Lý thuyết</button>
    <button class="tab-button">Luyện tập</button>
    <button class="tab-button">Kết quả</button>
  </nav>

  <section class="part-panel">
    <h2>Kiến thức trọng tâm</h2>

    <article class="question-card">
      <h3>Câu 1</h3>
      <p>Nội dung câu hỏi...</p>
      <input type="text" placeholder="Nhập câu trả lời của em">
      <button>Kiểm tra</button>
      <div class="feedback-box hint">
        Em thử kiểm tra lại điều kiện của đề bài nhé.
      </div>
    </article>
  </section>

  <section class="result-card">
    <h2>Kết quả</h2>
    <p>Điểm số và nhận xét sẽ hiển thị tại đây.</p>
  </section>
</main>
```

---

## 6. Yêu cầu khi in phiếu

Khi in hoặc xuất PDF:

- Ẩn nút bấm và thành phần điều khiển.
- Hiển thị đầy đủ nội dung cần nộp.
- Tránh ngắt trang giữa một câu hỏi.
- Giữ phần kết quả nếu học sinh đã nộp bài.

---

## 7. Ghi chú dành cho AI khi tạo phiếu

Khi tạo phiếu học tập từ hướng dẫn này, AI cần:

- giữ đúng các lớp cấu trúc chính;
- không làm giao diện rối mắt;
- không dùng màu chữ quá nhạt;
- không đặt chữ trắng trên nền sáng;
- không đưa đáp án đúng ngay khi học sinh trả lời sai lần đầu;
- ưu tiên gợi ý theo từng bước để học sinh tự tìm ra đáp án.
