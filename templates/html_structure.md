# Cấu trúc HTML đầu ra

File HTML là sản phẩm cuối cùng của lệnh:

```text
Hoàn thành phiếu học tập [Tên thư mục]
```

File phải nằm trong chính thư mục bài học.

## Khung HTML

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tên bài học</title>
  <style>
    /* CSS đặt trực tiếp trong file */
  </style>
</head>
<body>
  <main id="app">
    <header id="header"></header>
    <section id="student-info"></section>
    <nav id="lesson-nav"></nav>
    <section id="part-a"></section>
    <section id="part-b"></section>
    <section id="part-c"></section>
    <section id="result"></section>
  </main>
  <script>
    /* JavaScript đặt trực tiếp trong file */
  </script>
</body>
</html>
```

## Các phần bắt buộc

### Header

Hiển thị môn học, lớp, chương, bài, tên bài và mã thư mục.

### Thông tin học sinh

Có ô nhập:

- họ tên;
- lớp;
- mã bài hoặc lần học.

### Phần A - Kiến thức trọng tâm

Chuyển nội dung lý thuyết thành các bước ngắn:

- mục tiêu;
- ghi nhớ;
- ví dụ mẫu;
- tự kiểm tra nhanh;
- lỗi thường gặp.

### Phần B - Luyện tập

Mỗi câu luyện tập nên có:

- đề bài;
- ô trả lời hoặc lựa chọn;
- nút kiểm tra;
- phản hồi đúng/sai;
- gợi ý khi làm sai;
- đáp án gợi ý nếu nguồn có sẵn.

### Phần C - Kiểm tra đánh giá

Phần kiểm tra cần có:

- thời gian làm bài nếu nguồn có ghi;
- câu trắc nghiệm;
- câu tự luận hoặc vận dụng;
- nút nộp bài;
- chấm điểm theo đáp án và thang điểm nguồn;
- nhận xét kết quả.

Nếu trình bày theo từng câu, phải có lựa chọn xem toàn bộ bài kiểm tra.

### Kết quả

Hiển thị:

- thông tin học sinh;
- điểm từng phần;
- tổng điểm;
- nhận xét;
- nút in phiếu hoặc in kết quả.

## Nguyên tắc kỹ thuật

- HTML, CSS và JavaScript nằm trong một file.
- Không phụ thuộc server riêng.
- Không hard-code thông tin riêng của học sinh.
- Không làm mất dữ liệu đã nhập khi chuyển giữa các phần.
