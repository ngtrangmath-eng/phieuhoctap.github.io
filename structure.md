# Kiến trúc thư mục

Cấu trúc chính của dự án:

```text
cTrang_sangkien/
├─ README.md
├─ index.html
├─ assets/
│  ├─ site.css
│  ├─ site.js
│  ├─ lesson-shell.css
│  └─ lesson-shell.js
├─ promt.md
├─ curriculum.md
├─ agent_rules.md
├─ command_schema.md
├─ structure.md
├─ templates/
│  ├─ base_prompt.md
│  ├─ html_structure.md
│  ├─ style_guide.md
│  ├─ gemini_policy.md
│  ├─ lesson_template.md
│  └─ source_file_convention.md
├─ Toan6-Chuong1-Bai1/
│  ├─ lesson.md
│  ├─ Bai1-PhanA.md
│  ├─ Bai1-PhanB.md
│  ├─ Bai1-PhanC.md
│  └─ Toan6-Chuong1-Bai1.html
└─ Toan6-Chuong1-Bai2/
   ├─ lesson.md
   ├─ Bai2-PhanA.md
   ├─ Bai2-PhanB.md
   ├─ Bai2-PhanC.md
   └─ Toan6-Chuong1-Bai2.html
```

Các file HTML trong thư mục bài học là sản phẩm đầu ra. Nếu chưa có, agent sẽ tạo khi người dùng yêu cầu hoàn thành phiếu.

## Luồng hoạt động

```text
Câu lệnh người dùng
        ↓
Xác định thư mục bài học
        ↓
Đọc lesson.md
        ↓
Đọc PhanA, PhanB, PhanC
        ↓
Áp dụng templates
        ↓
Tạo hoặc cập nhật HTML trong thư mục bài học
```

## Vai trò các nhóm file

- `index.html`: trang chủ website học tập cho GitHub Pages.
- `assets/`: giao diện và JavaScript dùng chung cho trang chủ và thanh điều hướng bài học.
- File Markdown ở gốc dự án: hướng dẫn agent hiểu quy trình.
- `templates/`: quy tắc trình bày và cấu trúc sản phẩm.
- Thư mục bài học: chứa nội dung thật của từng phiếu.
