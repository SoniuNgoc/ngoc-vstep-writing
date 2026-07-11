# Hướng dẫn sửa nội dung website

## 1. Thêm hoặc sửa đề

Mở `data.js`. Mỗi bộ đề gồm thông tin chủ đề, Task 1 và Task 2. Khi chỉnh:

- Giữ nguyên dấu ngoặc, dấu phẩy và cấu trúc JavaScript.
- Mỗi câu tiếng Anh nên có bản dịch tiếng Việt tương ứng.
- Task 1 dùng `minWords: 120` và `minutes: 20`.
- Task 2 dùng `minWords: 250` và `minutes: 40`.
- Với Task 2, thêm đúng dạng luận và dấu hiệu nhận biết để web bôi đỏ.
- Với Task 1, khai báo đúng `reply` hoặc `ask` để web hiện form thư đi trả lời hoặc thư đi hỏi.

## 2. Đổi màu và font

Mở `styles.css`, tìm phần `:root`. Các biến chính:

- `--bg`: nền trang.
- `--surface`: nền thẻ và vùng viết.
- `--ink`: màu chữ chính.
- `--muted`: màu chữ phụ.
- `--primary`: màu hồng chính.

Phần `[data-theme="dark"]` là màu cho chế độ tối.

## 3. Sửa trang mở đầu

Mở `index.html` để đổi tiêu đề, mô tả, nút bắt đầu và nội dung giới thiệu.

## 4. Sửa chức năng

Mở `app.js`. Các phần quan trọng gồm:

- đồng hồ;
- lưu bản nháp;
- chuyển Task 1/Task 2;
- bộ đếm từ;
- nhận biết form;
- sửa và dịch bài;
- giao diện sáng/tối.

Trước khi sửa `app.js`, nên tải một bản ZIP dự phòng.

## 5. Kiểm tra trước khi xuất bản

- Mở trang chủ và thử cả chế độ sáng/tối.
- Mở một đề, chuyển qua lại Task 1 và Task 2.
- Gõ bài để kiểm tra bộ đếm từ và lưu nháp.
- Bấm nhận biết form ở cả hai Task.
- Nộp thử bài và xem phần sửa Anh–Việt.
- Kiểm tra trên điện thoại hoặc thu nhỏ cửa sổ trình duyệt.
