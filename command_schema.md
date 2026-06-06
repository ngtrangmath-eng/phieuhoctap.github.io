# Quy ước câu lệnh

Tệp này giúp agent hiểu nhanh các câu lệnh tự nhiên trong dự án.

## Câu lệnh chính

```text
Hoàn thành phiếu học tập [Tên thư mục]
```

Ý nghĩa:

- `[Tên thư mục]` là thư mục bài học cần xử lý.
- Agent phải đọc nội dung trong thư mục đó.
- Agent phải tạo hoặc cập nhật phiếu học tập với đủ 3 phần A, B, C.

## Các cách nói tương đương

Những câu sau được hiểu giống lệnh chính:

```text
Tạo phiếu học tập Toan6-Chuong1-Bai1
```

```text
Hoàn thiện phiếu học tập Toan6-Chuong1-Bai1
```

```text
Làm phiếu học tập cho Toan6-Chuong1-Bai1
```

```text
Cập nhật phiếu học tập Toan6-Chuong1-Bai1
```

## Cách xác định thư mục

1. Nếu người dùng đưa tên thư mục đầy đủ, dùng đúng tên đó.
2. Nếu người dùng nói bằng mô tả tự nhiên như “toán 6 chương 1 bài 1”, tra `curriculum.md`.
3. Nếu không tìm được thư mục, hỏi lại thay vì đoán.

## Loại sản phẩm mặc định

Nếu người dùng chỉ nói “phiếu học tập”, sản phẩm mặc định là phiếu học tập tương tác gồm:

1. Phần A - Kiến thức trọng tâm.
2. Phần B - Luyện tập.
3. Phần C - Kiểm tra đánh giá.
