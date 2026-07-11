# Đưa website VSTEP Writing lên mạng và sửa trực tiếp

## Cách nên dùng: GitHub + Netlify

Cách này phù hợp nhất nếu bạn muốn sửa web nhiều lần. Bạn chỉnh file ngay trên GitHub, bấm **Commit changes**, và Netlify sẽ tự cập nhật website.

### Bước 1 — Tạo kho mã trên GitHub

1. Đăng nhập GitHub và tạo một repository mới, ví dụ: `ngoc-vstep-writing`.
2. Chọn repository công khai hoặc riêng tư tùy nhu cầu.
3. Tải toàn bộ **các file nằm bên trong thư mục `vstep-writing-web`** lên repository.
4. Bảo đảm `index.html` nằm ở thư mục gốc của repository, không bị lồng thêm một lớp thư mục.

### Bước 2 — Kết nối repository với Netlify

1. Đăng nhập Netlify.
2. Chọn tạo dự án mới từ Git repository.
3. Chọn GitHub và repository vừa tạo.
4. Website này không cần lệnh build:
   - Build command: để trống.
   - Publish directory: `.`
   - Functions directory đã được cấu hình trong `netlify.toml`.
5. Bấm Deploy.

Sau khi triển khai xong, Netlify cấp một địa chỉ dạng `ten-ngau-nhien.netlify.app`. Bạn có thể đổi tên site trong phần cấu hình tên miền của Netlify.

## Cách sửa web sau khi đã online

Trên GitHub, mở file cần sửa, bấm biểu tượng bút chì, chỉnh nội dung rồi bấm **Commit changes**. Netlify sẽ tự triển khai phiên bản mới.

- `data.js`: chủ đề, đề bài, bản dịch, bài mẫu và nội dung học.
- `styles.css`: màu sắc, font, kích thước, bố cục.
- `index.html`: trang mở đầu và khung giao diện.
- `app.js`: đồng hồ, chuyển Task, đếm từ, chấm/sửa bài, nhận biết form.
- `manifest.json`: tên ứng dụng và màu giao diện khi cài lên thiết bị.
- `netlify/functions/`: chức năng dịch và chấm AI trên máy chủ.

## Cách nhanh hơn nhưng sửa kém tiện: Netlify Drop

Giải nén gói, rồi kéo cả thư mục `vstep-writing-web` vào vùng Netlify Drop. Website sẽ online ngay, nhưng mỗi lần sửa bạn phải tải lại thư mục lên.

## Cấu hình chấm AI nâng cao — không bắt buộc

Website vẫn có bộ kiểm tra cơ bản khi chưa cấu hình AI. Nếu dùng API riêng, vào phần biến môi trường của Netlify và thêm:

- `AI_API_URL`
- `AI_API_KEY`
- `AI_MODEL`

Không viết khóa API trực tiếp vào `app.js`, `data.js`, GitHub hoặc bất kỳ file công khai nào.

## Lỗi thường gặp

- Trang trắng hoặc thiếu giao diện: kiểm tra `index.html`, `app.js`, `styles.css`, `data.js` có nằm cùng cấp hay không.
- Sửa GitHub nhưng web chưa đổi: chờ Netlify deploy xong rồi tải lại bằng `Ctrl + F5`.
- Trình duyệt vẫn giữ bản cũ: đóng tab, mở lại hoặc xóa dữ liệu website/service worker.
- Dịch/chấm AI không hoạt động: kiểm tra Netlify Functions và biến môi trường. Bộ sửa cơ bản vẫn dùng được.
