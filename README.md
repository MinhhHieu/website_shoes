# XÂY DỰNG WEBSITE BÁN GIÀY 

## Mô tả dự án
Website bán giày được xây dựng bằng NodeJs và ExpressJs cho phép người dùng xem qua các sản phẩm giày, thêm vào giỏ hàng và thực hiện đặt hàng. Còn phía người quản trị thì có thể phân quyền, quản lý sản phẩm, quản lý tài khoản người dùng, quản lý đơn hàng và danh mục sản phẩm.

## Các tính năng
- Phía người dùng: Đăng nhập, đăng ký tài khoản, xem sản phẩm, xem chi tiết sản phẩm, thêm vào giỏ hàng, thực hiện đặt hàng.
- Phía người quản trị: Đăng nhập, quản lý danh mục sản phẩm, quản lý sản phẩm, quản lý người dùng, quản lý đơn hàng, phân quyền
  
## Các công nghệ sử dụng
- NodeJs
- ExpressJs
- Template engine: Pug
- MongoDb
- Bootstrap

## Cài đặt và cách chạy dự án
Yêu cầu:
- Cài đặt NodeJs
- Cài đặt MongoDb
Cách chạy dự án:
1. Mở project với vscode
2. gõ lệnh "npm start" ở terminal để chạy project
3. Truy cập website tại địa chỉ:
 - Người dùng: http://localhost:3000/
 - Người quản trị: http://localhost:3000/admin/auth/login

## Cấu trúc thư mục
- config: kết nối với DB
- controllers: xử lý request từ người dùng
- helpers: chứa các hàm tiện ích có thể tái sử dụng
- middlewares: dùng kiểm tra xác thực người dùng
- model: định nghĩa schema dữ liệu
- node_modules: thư viện cài đặt
- public: file tĩnh(images,css,js)
- routes: định nghĩa các đường dẫn url
- validates: kiểm tra xác thực dữ liệu người dùng gửi lên
- views: chứa các giao diện
- .env: biến môi trường
- .gitignore: file bị loại trừ khi push git
- index.js: cấu hình chính của ứng dụng
  










