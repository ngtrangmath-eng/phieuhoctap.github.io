# Quy ước file nguồn

Quy ước này giúp agent nhận diện nhanh vai trò của từng file trong thư mục bài học.

## Tên file chuẩn

```text
BaiX-PhanA.md  Phần A - Kiến thức trọng tâm
BaiX-PhanB.md  Phần B - Luyện tập
BaiX-PhanC.md  Phần C - Kiểm tra đánh giá
```

Trong đó `X` là số bài.

Ví dụ:

```text
Bai1-PhanA.md
Bai1-PhanB.md
Bai1-PhanC.md
```

## Nếu tên file không chuẩn

Agent phải đọc:

1. tiêu đề cấp 1;
2. các tiêu đề cấp 2;
3. các từ khóa như “Kiến thức trọng tâm”, “Luyện tập”, “Kiểm tra đánh giá”, “Thang điểm”, “Đáp án”.

Sau đó tự gán file vào phần A, B hoặc C.

## Nội dung nên có

- Phần A: mục tiêu, ghi nhớ, ví dụ, lỗi thường gặp.
- Phần B: câu hỏi luyện tập, đáp án gợi ý, lưu ý khi học sinh sai.
- Phần C: câu hỏi kiểm tra, thang điểm, đáp án, hướng dẫn chấm.
