# Quy trình hoàn thành phiếu học tập

Dự án này lưu nội dung bài học bằng Markdown để tạo phiếu học tập tương tác và xuất bản thành website học tập tĩnh trên GitHub Pages.

## Website học tập

Trang chủ của website là `index.html`. Trang này gom các phiếu học tập Toán 6 Chương 1 thành một bảng điều khiển học tập có tìm kiếm, lọc theo nhóm nội dung và ghi nhớ bài đã mở bằng `localStorage`.

Các file dùng chung:

```text
assets/site.css          Giao diện trang chủ
assets/site.js           Tìm kiếm, lọc bài, ghi nhớ tiến độ
assets/lesson-shell.css  Thanh điều hướng chung cho từng phiếu
assets/lesson-shell.js   Nút trang chủ, bài trước, bài sau, in phiếu
```

Các phiếu trong thư mục `Toan6-Chuong1-*` vẫn là HTML độc lập và có thể mở trực tiếp bằng trình duyệt.

Lệnh chính cần hỗ trợ:

```text
Hoàn thành phiếu học tập [Tên thư mục]
```

Ví dụ:

```text
Hoàn thành phiếu học tập Toan6-Chuong1-Bai1
```

Khi nhận lệnh này, agent phải đọc nội dung trong thư mục được nêu và hoàn thiện phiếu học tập với đủ 3 phần: kiến thức trọng tâm, luyện tập, kiểm tra đánh giá.

## Cấu trúc mỗi thư mục bài học

Mỗi thư mục bài học nên có:

```text
lesson.md        Thông tin bài học và tên file đầu ra
BaiX-PhanA.md    Phần A - Kiến thức trọng tâm
BaiX-PhanB.md    Phần B - Luyện tập
BaiX-PhanC.md    Phần C - Kiểm tra đánh giá
```

Trong đó `X` là số bài.

## Ba phần bắt buộc của phiếu

1. **Phần A - Kiến thức trọng tâm**: mục tiêu, ghi nhớ, ví dụ mẫu, lỗi thường gặp hoặc tự kiểm tra nhanh.
2. **Phần B - Luyện tập**: bài tập theo từng câu, đáp án gợi ý, phản hồi khi học sinh làm sai.
3. **Phần C - Kiểm tra đánh giá**: thông tin học sinh, câu hỏi kiểm tra, thang điểm, đáp án và hướng dẫn chấm.

## Quy trình khi nhận lệnh

1. Xác định tên thư mục sau cụm lệnh `Hoàn thành phiếu học tập`.
2. Mở đúng thư mục bài học.
3. Đọc `lesson.md` để lấy tên bài, lớp, chương, bài và file đầu ra.
4. Đọc đủ 3 file `PhanA`, `PhanB`, `PhanC`.
5. Tạo hoặc cập nhật file HTML trong chính thư mục bài học.
6. Bảo đảm HTML có đủ 3 phần của phiếu và có thể mở trực tiếp bằng trình duyệt.
7. Báo lại file đã hoàn thành và các phần còn thiếu nếu có.

## Nguyên tắc

- Ưu tiên nội dung trong thư mục bài học được chỉ định.
- Không tự thay đổi kiến thức, đáp án hoặc thang điểm khi nguồn đã ghi rõ.
- Nếu thiếu một trong 3 phần, báo rõ phần nào thiếu thay vì tự bịa nội dung chính.
- Nếu `lesson.md` không ghi tên file đầu ra, dùng mặc định `[Tên thư mục].html`.
- Không cần tệp cấu hình ngoài Markdown để hoàn thành phiếu.
