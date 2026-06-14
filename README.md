# Hệ Thống Bán Sự Kiện Trực Tuyến

### Demo dự án
**Video demo:** [Link Google Drive](https://drive.google.com/file/d/1GhnnHk3JeayL5fMuO46veThPqQTOk-Tz/view?usp=drive_link)

### Công nghệ sử dụng

| Thành phần | Công nghệ / Thư viện sử dụng |
| :--- | :--- |
| Mobile App (Client) | React Native, Expo, React Native Paper, React Navigation |
| Web Dashboard | ReactJS, Ant Design |
| Backend API | Spring Boot (Java) |
| Database | MySQL |
| Tích hợp bên thứ 3 | VNPAY Sandbox|


### Các tính năng chính

### 1. Ứng dụng Mobile 
*   **Giao diện trực quan:** Tối ưu hóa giao diện mượt mà trên nền tảng di động.
*   **Khám phá sự kiện:** Tìm kiếm, lọc các sự kiện.
*   **Thương mại điện tử:** Hỗ trợ đặt mua vé sự kiện và các sản phẩm/đồ lưu niệm đi kèm một cách nhanh chóng.
*   **Tính năng Cộng đồng:** Không gian cho người dùng tạo bài viết chia sẻ và thảo luận công khai.
*   **Đánh giá & Phản hồi:** Cho phép người tham gia đánh giá và nhận xét về chất lượng sự kiện sau khi kết thúc.
*   **Thanh toán điện tử:** Tích hợp cổng thanh toán **VNPAY**.
*   **Vé điện tử QR Code:** Tự động sinh mã QR độc duy cho từng vé sau khi thanh toán thành công.
*   **Quét mã tại sự kiện:** Tích hợp camera điện thoại để quét mã QR và kiểm tra trạng thái vé (Check-in) trực tiếp tại địa điểm tổ chức, giảm thiểu gian lận vé.

### 2. Hệ Thống Web
*   **Giao diện quản trị:** Xây dựng bằng **ReactJS & Ant Design** chuyên nghiệp, trực quan.
*   **Quy trình kiểm duyệt:** Hỗ trợ đăng ký hồ sơ doanh nghiệp của BTC và phê duyệt từ phía Admin.
*   **Chiến dịch Marketing:** Cho phép BTC tự tạo, quản lý và áp dụng các mã giảm giá cho sự kiện.
*   **Báo cáo & Thống kê:** Theo dõi số lượng vé bán ra, quản lý doanh thu theo thời gian thực.

###  3. Kiến Trúc Backend & Database
*   **RESTful API:** Hệ thống API chuẩn hóa xây dựng trên nền tảng **Spring Boot**, đảm bảo tính bảo mật và phân quyền rõ ràng giữa 3 vai trò (User, BTC, Admin).
*   **Tối ưu dữ liệu:** Cấu trúc cơ sở dữ liệu **MySQL** được thiết kế tối ưu, xử lý tốt các truy vấn phức tạp nhằm bảo đảm tính toàn vẹn dữ liệu.
