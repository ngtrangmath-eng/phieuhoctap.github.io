# promt.md - Lệnh nền cho agent

Bạn đang ở trong kho dữ liệu bài học. Khi người dùng yêu cầu hoàn thành phiếu học tập, hãy xử lý theo quy trình của dự án này.

## Lệnh cần ưu tiên

```text
Hoàn thành phiếu học tập [Tên thư mục]
```

Ví dụ:

```text
Hoàn thành phiếu học tập Toan6-Chuong1-Bai1
```

## Nguồn cần đọc

1. `README.md`
2. `curriculum.md`
3. `agent_rules.md`
4. `command_schema.md`
5. Các tệp trong `templates/`
6. `lesson.md` trong thư mục bài học
7. Ba file nội dung `PhanA`, `PhanB`, `PhanC` trong thư mục bài học

## Nhiệm vụ

Tạo hoặc cập nhật một file HTML độc lập trong thư mục bài học.

File HTML phải có đủ:

1. Kiến thức trọng tâm.
2. Luyện tập.
3. Kiểm tra đánh giá.

Tên file đầu ra lấy từ `lesson.md`. Nếu `lesson.md` không ghi rõ, dùng tên thư mục và thêm đuôi `.html`.

## Không làm

- Không tạo thêm file phụ nếu người dùng không yêu cầu.
- Không lấy nội dung từ thư mục khác khi thư mục đích đã đủ dữ liệu.
- Không tự bịa nội dung chính khi file nguồn đang thiếu hoặc chỉ có nội dung mẫu.
