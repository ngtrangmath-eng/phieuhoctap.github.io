# Chính sách hỗ trợ gợi ý tự động

Tệp này chỉ áp dụng nếu phiếu HTML có chức năng gợi ý hoặc nhận xét tự động.

Phiếu vẫn phải hoạt động đầy đủ khi không dùng dịch vụ AI.

## Nguyên tắc

- Không ghi sẵn API key trong mã nguồn.
- Không bắt buộc người dùng nhập API key để làm bài.
- Nếu có hỗ trợ AI, chỉ dùng để gợi ý, nhận xét hoặc chấm câu tự luận theo rubric đã có.
- Không dùng AI để thay đổi đáp án chuẩn hoặc thang điểm trong file nguồn.
- Nếu AI không khả dụng, dùng chấm và phản hồi cục bộ dựa trên đáp án nguồn.
- Khi học sinh trả lời sai, hệ thống chỉ đưa ra gợi ý mang tính định hướng, giúp học sinh nhìn lại dữ kiện, xác định bước làm phù hợp và tự điều chỉnh cách giải.
- Gợi ý phải dẫn học sinh từng bước đi đến đáp án, không nêu ngay đáp án đúng.
- Đáp án chỉ được hiển thị khi học sinh đã hết lượt gợi ý hoặc khi giáo viên cho phép trong thiết lập bài học.

## Gợi ý khi học sinh làm sai

Gợi ý nên:

- ngắn gọn, nhẹ nhàng, không chê học sinh;
- không nêu ngay đáp án đúng khi học sinh trả lời sai;
- hướng học sinh quay lại đọc kỹ đề bài, dữ kiện và yêu cầu cần tìm;
- đặt câu hỏi gợi mở để học sinh tự phát hiện sai sót;
- gợi ý từng bước tư duy, giúp học sinh tiến dần đến đáp án;
- ưu tiên nhắc lại kiến thức, công thức hoặc quy tắc liên quan thay vì cung cấp kết quả;
- chỉ hiển thị đáp án đúng khi học sinh đã hết lượt gợi ý hoặc khi giáo viên cho phép trong thiết lập bài học.

Ví dụ cách gợi ý phù hợp:

- “Em hãy đọc lại yêu cầu của đề: bài toán đang hỏi đại lượng nào?”
- “Em thử kiểm tra lại phép tính ở bước đầu tiên xem đã đúng thứ tự thực hiện phép tính chưa.”
- “Ở bài này, em cần xác định dữ kiện đã cho trước, sau đó chọn phép tính phù hợp.”
- “Em hãy nhớ lại quy tắc: khi có ngoặc, ta thực hiện phép tính trong ngoặc trước.”

Không nên gợi ý theo kiểu:

- “Đáp án đúng là...”
- “Em sai rồi, kết quả phải là...”
- “Chọn đáp án B.”

## Chấm tự luận

Khi chấm tự luận hoặc vận dụng:

- dựa trên đáp án gợi ý và thang điểm trong phần C;
- trả về điểm, nhận xét và gợi ý sửa;
- không cho điểm vượt quá thang điểm nguồn;
- nhận xét cần chỉ ra hướng điều chỉnh bài làm, không chỉ nêu đúng hoặc sai;
- nếu bài làm chưa đạt, gợi ý cần giúp học sinh biết cần sửa ở bước nào, không làm thay toàn bộ bài giải.
