# Bật sửa bài AI chi tiết trên Netlify

Bản này dùng **Netlify AI Gateway** trong `netlify/functions/review.mjs`.

## Các file mới hoặc đã thay đổi

- `package.json`
- `netlify/functions/review.mjs`
- `app.js`
- `styles.css`
- `service-worker.js`

## Cập nhật repository GitHub

1. Giải nén gói ZIP.
2. Mở repository đang nối với website Netlify.
3. Thay toàn bộ các file trong repository bằng nội dung của thư mục này, hoặc chỉ thay 5 file nêu trên và thêm `package.json`.
4. Commit thay đổi.
5. Chờ Netlify triển khai xong với trạng thái **Published**.

## Điều kiện để AI Gateway chạy

- Tài khoản Netlify dùng gói **credit-based** (Free, Personal hoặc Pro mới).
- AI features không bị tắt trong Team settings.
- Tài khoản còn credits.
- Dự án đã có ít nhất một production deploy.

Không cần dán API key vào mã nguồn. Netlify tự cung cấp khóa và địa chỉ gateway cho Function.

## Kiểm tra

1. Mở website bằng cửa sổ ẩn danh hoặc nhấn `Ctrl + F5`.
2. Viết ít nhất 20 từ rồi nộp bài.
3. Ban đầu web hiện kiểm tra nhanh.
4. Sau vài giây, dòng trạng thái phải đổi thành **“Bài được AI sửa chi tiết, giải thích Anh – Việt”**.
5. Nếu AI chưa chạy, website sẽ hiện nguyên nhân ngay dưới tiêu đề kết quả thay vì im lặng như bản cũ.

## Theo dõi lỗi Function

Netlify → Project → Logs/Functions → chọn function `review`.
