# Quy tắc agent

Tệp này quy định cách xử lý lệnh hoàn thành phiếu học tập trong dự án.

## Lệnh chính

Khi người dùng nhập:

```text
Hoàn thành phiếu học tập [Tên thư mục]
```

agent hiểu rằng cần tạo hoặc cập nhật phiếu học tập HTML cho thư mục đó.

Ví dụ:

```text
Hoàn thành phiếu học tập Toan6-Chuong1-Bai1
```

## Các bước bắt buộc

1. Tìm thư mục bài học theo đúng tên người dùng đưa ra.
2. Đọc `lesson.md` trong thư mục đó.
3. Đọc đủ 3 file nội dung:
   - `PhanA`: kiến thức trọng tâm.
   - `PhanB`: luyện tập.
   - `PhanC`: kiểm tra đánh giá.
4. Nếu tên file không đúng mẫu, đọc tiêu đề và nội dung để tự nhận diện phần A, B, C.
5. Tạo hoặc cập nhật file HTML đầu ra trong chính thư mục bài học.
6. Kiểm tra lại phiếu có đủ 3 phần trước khi báo hoàn thành.

## Nhận diện tên file

Quy ước ưu tiên:

```text
BaiX-PhanA.md  Phần A - Kiến thức trọng tâm
BaiX-PhanB.md  Phần B - Luyện tập
BaiX-PhanC.md  Phần C - Kiểm tra đánh giá
```

Nếu thư mục có nhiều file Markdown, chỉ dùng các file thuộc bài học đang xử lý. Không lấy nội dung từ thư mục khác, trừ khi người dùng yêu cầu rõ.

## Sản phẩm HTML

HTML đầu ra phải:

- là một file độc lập;
- có CSS và JavaScript nhúng trực tiếp;
- có phần nhập thông tin học sinh;
- có điều hướng rõ giữa 3 phần;
- trình bày lý thuyết, luyện tập và kiểm tra theo từng bước/câu;
- có phần kết quả sau khi nộp bài;
- có nút in hoặc xuất kết quả nếu phù hợp.

## Bảo toàn nội dung chuyên môn

- Giữ đúng kiến thức, câu hỏi, đáp án và thang điểm từ các file nguồn.
- Có thể chuyển cách trình bày thành tương tác, nhưng không làm sai lệch nội dung.
- Không tự thêm kiến thức ngoài bài nếu điều đó làm thay đổi mục tiêu bài học.

## Khi thiếu dữ liệu

- Thiếu `lesson.md`: vẫn có thể tạo phiếu nếu đủ 3 file phần A, B, C; dùng tên thư mục làm mã bài.
- Thiếu một phần A, B hoặc C: báo rõ phần thiếu.
- File có nội dung mẫu như `...`: đánh dấu là nội dung chưa hoàn thiện trong báo cáo cuối.
