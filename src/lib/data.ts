import type { BlogPost, Job, JobCategory } from './types';

export const blogCategories = [
  'Hướng dẫn',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Tin tức',
];

// Dữ liệu này sẽ không còn được sử dụng ở trang chủ và trang blog, 
// nhưng chúng ta giữ lại để tham khảo hoặc dùng cho các mục đích khác.
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'getting-started-with-django',
    title: 'Bắt đầu với Django: Xây dựng ứng dụng web đầu tiên',
    author: 'Trần Văn An',
    date: '2024-07-20',
    category: 'Web Development',
    description: 'Hướng dẫn chi tiết từng bước để xây dựng một ứng dụng web hoàn chỉnh sử dụng Django framework, từ cài đặt đến triển khai.',
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'code editor',
    created_at: '2024-07-20T10:00:00.000Z',
    content: `
      <h2>Giới thiệu về Django</h2>
      <p>Django là một web framework bậc cao của Python, cho phép phát triển các trang web an toàn và có thể bảo trì một cách nhanh chóng. Với Django, bạn có thể xây dựng các ứng dụng web phức tạp, dựa trên dữ liệu mà không cần phải phát minh lại bánh xe.</p>
      <h2>Cài đặt môi trường</h2>
      <p>Trước tiên, bạn cần cài đặt Python và pip. Sau đó, tạo một môi trường ảo và cài đặt Django:</p>
      <pre><code>python -m venv myenv
source myenv/bin/activate
pip install Django</code></pre>
      <h2>Tạo dự án Django</h2>
      <p>Sử dụng công cụ dòng lệnh của Django để tạo dự án mới:</p>
      <pre><code>django-admin startproject myproject</code></pre>
      <p>Lệnh này sẽ tạo một thư mục <code>myproject</code> chứa cấu trúc cơ bản của một dự án Django. Bạn có thể bắt đầu phát triển ứng dụng của mình từ đây.</p>
      <h3>Kết luận</h3>
      <p>Bằng cách làm theo các bước trên, bạn đã có một nền tảng vững chắc để bắt đầu khám phá thế giới phát triển web với Django. Hãy tiếp tục tìm hiểu về models, views, templates và admin site để xây dựng các ứng dụng mạnh mẽ hơn.</p>
    `,
  },
];

export const jobCategories: JobCategory[] = [
  'Backend',
  'Frontend',
  'Full-stack',
  'DevOps',
  'Data Science',
  'Machine Learning',
];

// Dữ liệu này sẽ không còn được sử dụng ở trang việc làm và trang chủ,
// nhưng chúng ta giữ lại để tham khảo.
export const jobs: Job[] = [
  {
    id: 1,
    title: 'Senior Python Developer (Django)',
    company: 'TechCorp Vietnam',
    location: 'Hồ Chí Minh',
    type: 'Toàn thời gian',
    category: 'Backend',
    description: 'Phát triển và bảo trì các hệ thống backend sử dụng Django. Yêu cầu kinh nghiệm làm việc với REST APIs, PostgreSQL và Docker.',
    companyLogoUrl: 'https://picsum.photos/100/100',
    companyLogoHint: 'T logo',
    created_at: '2024-07-25T10:00:00.000Z',
  },
];

export const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
