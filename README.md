# Hộp đèn "Kiểm trước - Tin sau" – trang web giới thiệu

Trang web tĩnh (HTML, CSS, JavaScript), không cần máy chủ, không dùng thư viện ngoài, không cookie, không thu thập dữ liệu.

## Nội dung trang
- **Hai phiên bản:** Phiên bản 1 là nút công tắc (phiên bản dự thi). Phiên bản 2 là bảng điều khiển micro:bit (đang phát triển). Có bảng so sánh.
- **Hộp đèn mô phỏng:** chọn phiên bản 1 hoặc 2, thử tự do hoặc chơi với 24 thẻ tình huống.
  - Phiên bản 1: sơ đồ cây quyết định sáng theo đường đi của dòng điện.
  - Phiên bản 2: màn hình micro:bit, âm báo và khối lệnh "nếu … thì …".
- **Video:** video hướng dẫn sử dụng và video thuyết trình.
- **Hình ảnh nhóm tác giả làm sản phẩm.**
- **Bộ 40 thẻ in:** đường link Google Drive.
- **Bắt lỗi AI**, Nguyên lý (bảng 8 trường hợp), Lắp ráp phiên bản 1, Dạy học, Nhóm tác giả.

## Cập nhật video, ảnh, đường link bộ thẻ
Chỉ sửa tệp **`config.js`**. Mở bằng Notepad, dán đường link vào giữa hai dấu ngoặc kép, rồi lưu lại.

1. **`linkBoThe`:** đường link Google Drive của bản in 40 thẻ. Trên Drive, chia sẻ tệp ở chế độ "Bất kỳ ai có đường liên kết", quyền Người xem.
2. **`videoHuongDan`, `videoThuyetTrinh`:** đường link YouTube (Công khai hoặc Không công khai) hoặc đường link Google Drive của video (đã chia sẻ như trên).
3. **`hinhAnh`:** mỗi ảnh một dòng `{ src: "...", chuThich: "..." }`. Có hai cách cho `src`:
   - Chép ảnh vào thư mục `assets/anh/` rồi ghi `src: "assets/anh/01.jpg"`.
   - Dán đường link Google Drive của ảnh (đã chia sẻ).

Ô nào để trống, trang tự hiện "Đang cập nhật". Chỉ đăng ảnh và video của học sinh khi gia đình đã đồng ý.

## Đưa lên Vercel (chọn một cách)

**Cách 1: kéo thả, không cần cài gì**
1. Đăng nhập https://vercel.com.
2. Chọn **Add New… → Project**.
3. Đưa thư mục `site` lên kho GitHub rồi chọn **Import**, hoặc kéo thả thư mục `site` nếu màn hình cho phép.
4. Framework Preset chọn **Other**, không có lệnh build, Output Directory để trống, rồi bấm **Deploy**.
5. Sau mỗi lần sửa `config.js`, đưa lại thư mục `site` lên (hoặc đẩy lên GitHub) để Vercel cập nhật.

**Cách 2: dòng lệnh (máy đã có Node.js)**
```
cd site
npx vercel          # lần đầu: đăng nhập, trả lời các câu hỏi
npx vercel --prod   # đưa lên bản chính thức
```

## Xem thử trên máy
Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy:
```
cd site
python -m http.server 8000
```
rồi mở http://localhost:8000

## Sửa nội dung thẻ
Thẻ tình huống và thẻ Bắt lỗi AI nằm trong `data.js`.
