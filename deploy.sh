
#!/bin/bash

# Script tự động triển khai ứng dụng Next.js với PM2 trên Ubuntu 24.04
#
# HƯỚNG DẪN SỬ DỤNG:
# 1. Sao chép tệp này vào thư mục gốc của dự án trên máy chủ của bạn.
# 2. Cấp quyền thực thi cho tệp: chmod +x deploy.sh
# 3. Chạy tập lệnh: ./deploy.sh

# --- Biến Cấu Hình ---
# Thay đổi các giá trị này nếu cần để phù hợp với môi trường của bạn
APP_NAME="python-vietnam-app" # Tên ứng dụng sẽ hiển thị trong PM2
PORT=3006                     # Cổng mà ứng dụng Next.js sẽ chạy

# Dừng script ngay lập tức nếu có lỗi
set -e

echo "Bắt đầu quá trình triển khai cho ứng dụng: $APP_NAME"

# --- KIỂM TRA CÁC CÔNG CỤ CẦN THIẾT ---

# 1. Kiểm tra Node.js và npm
if ! command -v node &> /dev/null
then
    echo "Node.js chưa được cài đặt. Vui lòng cài đặt Node.js (khuyến nghị phiên bản LTS) và npm."
    exit 1
fi

# 2. Kiểm tra PM2
if ! command -v pm2 &> /dev/null
then
    echo "PM2 chưa được cài đặt. Đang tiến hành cài đặt PM2 trên toàn cục..."
    npm install -g pm2
fi

echo "✓ Các công cụ cần thiết đã sẵn sàng."

# --- CÁC BƯỚC TRIỂN KHAI ---

# 1. Cài đặt/cập nhật các gói phụ thuộc của dự án
echo "▶️ Đang cài đặt các gói phụ thuộc từ package.json..."
npm install

# 2. Xây dựng (build) ứng dụng Next.js cho môi trường production
echo "▶️ Đang xây dựng ứng dụng Next.js..."
npm run build

# 3. Quản lý ứng dụng với PM2
echo "▶️ Đang quản lý ứng dụng với PM2..."

# Kiểm tra xem ứng dụng đã chạy trong PM2 chưa
if pm2 list | grep -q "$APP_NAME"; then
    echo "Ứng dụng '$APP_NAME' đã tồn tại. Đang tiến hành khởi động lại..."
    # Khởi động lại ứng dụng với các thay đổi mới
    pm2 restart "$APP_NAME" --update-env
else
    echo "Ứng dụng '$APP_NAME' chưa tồn tại. Đang tiến hành khởi động lần đầu..."
    # Khởi động ứng dụng lần đầu với PM2
    # Cờ --name: đặt tên cho tiến trình
    # Cờ -p: chỉ định cổng
    pm2 start npm --name "$APP_NAME" -- start -- -p "$PORT"
fi

# Cấu hình PM2 tự khởi động cùng hệ thống (nếu chưa có)
# Lệnh này sẽ tạo ra một hướng dẫn, bạn cần sao chép và chạy lệnh đó một lần
if ! pm2 startup | grep -q "command is already configured"; then
    echo "Để PM2 tự động khởi động lại sau khi reboot, vui lòng chạy lệnh sau:"
    pm2 startup
fi

# Lưu lại danh sách tiến trình hiện tại của PM2
pm2 save

echo "-----------------------------------------------------"
echo "✅ HOÀN TẤT TRIỂN KHAI!"
echo "Ứng dụng '$APP_NAME' đang chạy trên cổng $PORT."
echo "Bạn có thể xem trạng thái bằng lệnh: pm2 status"
echo "Để xem logs, sử dụng lệnh: pm2 logs $APP_NAME"
echo "-----------------------------------------------------"
