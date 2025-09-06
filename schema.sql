-- Bảng users để lưu thông tin người dùng
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY, -- Firebase UID
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    photo_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- Thêm cột role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME
);

-- Tạo bảng posts để lưu trữ bài viết
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    imageUrl VARCHAR(255),
    imageHint VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng jobs để lưu trữ việc làm
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    type ENUM('Toàn thời gian', 'Bán thời gian', 'Hợp đồng'),
    category VARCHAR(100),
    description TEXT,
    companyLogoUrl VARCHAR(255),
    companyLogoHint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Chèn dữ liệu mẫu vào bảng posts
INSERT INTO posts (slug, title, author, category, description, imageUrl, imageHint, content) VALUES
('getting-started-with-django', 'Bắt đầu với Django: Xây dựng ứng dụng web đầu tiên', 'Trần Văn An', 'Web Development', 'Hướng dẫn chi tiết từng bước để xây dựng một ứng dụng web hoàn chỉnh sử dụng Django framework, từ cài đặt đến triển khai.', 'https://picsum.photos/600/400', 'code editor', '<h2>Giới thiệu về Django</h2><p>Django là một web framework bậc cao của Python...</p>'),
('data-visualization-matplotlib', 'Trực quan hóa dữ liệu với Matplotlib và Seaborn', 'Lê Thị Bình', 'Data Science', 'Khám phá sức mạnh của Matplotlib và Seaborn, hai thư viện Python hàng đầu để tạo ra các biểu đồ đẹp mắt và đầy thông tin.', 'https://picsum.photos/600/400', 'data chart', '<h2>Tại sao cần trực quan hóa dữ liệu?</h2><p>Trực quan hóa dữ liệu là một phần không thể thiếu...</p>');

-- Chèn dữ liệu mẫu vào bảng jobs
INSERT INTO jobs (title, company, location, type, category, description, companyLogoUrl, companyLogoHint) VALUES
('Senior Python Developer (Django)', 'TechCorp Vietnam', 'Hồ Chí Minh', 'Toàn thời gian', 'Backend', 'Phát triển và bảo trì các hệ thống backend sử dụng Django...', 'https://picsum.photos/100/100', 'T logo'),
('Data Scientist', 'Data Insights Inc.', 'Hà Nội', 'Toàn thời gian', 'Data Science', 'Phân tích dữ liệu lớn để tìm ra các insight kinh doanh...', 'https://picsum.photos/100/100', 'D I logo');

-- Gán quyền admin cho một người dùng cụ thể (thay email của bạn vào)
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
