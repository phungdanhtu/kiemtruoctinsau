/*
  CẤU HÌNH NỘI DUNG CẬP NHẬT – thầy chỉ cần sửa tệp này, không cần sửa tệp khác.
  Để trống ("") thì trang tự hiện ô "Đang cập nhật".

  1) Đường link Google Drive của bản in 40 thẻ:
     Tải tệp PDF lên Google Drive → chuột phải → Chia sẻ → "Bất kỳ ai có đường liên kết" (Người xem)
     → Sao chép đường liên kết → dán vào linkBoThe.

  2) Video: dán đường link YouTube (để chế độ Công khai hoặc Không công khai)
     hoặc đường link Google Drive của video (đã chia sẻ "Bất kỳ ai có đường liên kết").

  3) Hình ảnh tác giả làm sản phẩm: mỗi ảnh một dòng { src: "...", chuThich: "..." }.
     src có thể là:
       - tệp ảnh chép vào thư mục assets/anh/ của trang, ví dụ "assets/anh/01.jpg"
       - hoặc đường link Google Drive của ảnh (đã chia sẻ "Bất kỳ ai có đường liên kết").
     Chỉ đăng ảnh khi gia đình hai bạn đã đồng ý.
*/
window.CAU_HINH = {
  linkBoThe: "https://drive.google.com/file/d/1PCXliVlEgkIn0v1vaWce7WwQHl6JBtbT/view",

  videoHuongDan: "",
  videoThuyetTrinh: "",

  hinhAnh: [
    { src: "assets/anh/01.jpg", chuThich: "Cùng đọc thẻ tình huống, tìm ba dấu hiệu nghi ngờ" },
    { src: "assets/anh/02.jpg", chuThich: "Nối thử mạch trên bàn theo sơ đồ" },
    { src: "assets/anh/03.jpg", chuThich: "Thử đủ 8 cách gạt công tắc, so với bảng" },
    { src: "assets/anh/04.jpg", chuThich: "Gắn công tắc, nút KIỂM và đèn lên mặt hộp" },
    { src: "assets/anh/05.jpg", chuThich: "Trang trí hộp, dán nhãn CÓ / KHÔNG" },
    { src: "assets/anh/06.jpg", chuThich: "Hướng dẫn bạn bè và người thân cùng chơi" }
  ]
};
