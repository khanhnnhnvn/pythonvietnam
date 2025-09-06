import type { BlogPost, Job, JobCategory } from './types';

export const blogCategories = [
  'Hướng dẫn',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Tin tức',
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'getting-started-with-django',
    title: 'Bắt đầu với Django: Xây dựng ứng dụng web đầu tiên',
    author: 'Trần Văn An',
    date: '2024-07-20',
    category: 'Web Development',
    description: 'Hướng dẫn chi tiết từng bước để xây dựng một ứng dụng web hoàn chỉnh sử dụng Django framework, từ cài đặt đến triển khai.',
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'code editor',
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
  {
    slug: 'data-visualization-matplotlib',
    title: 'Trực quan hóa dữ liệu với Matplotlib và Seaborn',
    author: 'Lê Thị Bình',
    date: '2024-07-18',
    category: 'Data Science',
    description: 'Khám phá sức mạnh của Matplotlib và Seaborn, hai thư viện Python hàng đầu để tạo ra các biểu đồ đẹp mắt và đầy thông tin.',
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'data chart',
    content: `
      <h2>Tại sao cần trực quan hóa dữ liệu?</h2>
      <p>Trực quan hóa dữ liệu là một phần không thể thiếu trong quá trình phân tích dữ liệu. Nó giúp chúng ta phát hiện các mẫu, xu hướng và các điểm bất thường một cách nhanh chóng và hiệu quả, điều mà chỉ nhìn vào các con số thô sẽ rất khó thực hiện.</p>
      <h2>Sử dụng Matplotlib</h2>
      <p>Matplotlib là thư viện nền tảng cho việc vẽ biểu đồ trong Python. Nó cung cấp một loạt các API để tạo ra các biểu đồ tĩnh, động và tương tác.</p>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.title('Biểu đồ hình Sin')
plt.xlabel('Trục x')
plt.ylabel('Trục y')
plt.show()</code></pre>
      <h2>Nâng cao với Seaborn</h2>
      <p>Seaborn được xây dựng dựa trên Matplotlib và cung cấp một giao diện cấp cao hơn để vẽ các biểu đồ thống kê hấp dẫn. Nó tích hợp tốt với pandas DataFrames.</p>
      <p>Với Seaborn, bạn có thể dễ dàng tạo ra các biểu đồ phức tạp như heatmap, pairplot, và violin plot chỉ với vài dòng code.</p>
    `,
  },
  {
    slug: 'python-for-machine-learning',
    title: 'Python cho Machine Learning: Các thư viện cần biết',
    author: 'Phạm Hùng Cường',
    date: '2024-07-15',
    category: 'Machine Learning',
    description: 'Tổng quan về các thư viện Python thiết yếu cho bất kỳ ai muốn bắt đầu với Machine Learning, bao gồm Scikit-learn, TensorFlow và PyTorch.',
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'robot brain',
    content: `
      <h2>Hệ sinh thái Machine Learning của Python</h2>
      <p>Python đã trở thành ngôn ngữ thống trị trong lĩnh vực Machine Learning nhờ vào hệ sinh thái thư viện phong phú và cộng đồng người dùng đông đảo. Dưới đây là những thư viện bạn không thể bỏ qua.</p>
      <h3>1. Scikit-learn</h3>
      <p>Scikit-learn là điểm khởi đầu tuyệt vời. Nó cung cấp các công cụ đơn giản và hiệu quả cho việc khai phá và phân tích dữ liệu, bao gồm các thuật toán phân loại, hồi quy, phân cụm và giảm chiều dữ liệu.</p>
      <h3>2. TensorFlow và Keras</h3>
      <p>Được phát triển bởi Google, TensorFlow là một nền tảng mã nguồn mở toàn diện cho Machine Learning. Keras, hoạt động như một API cấp cao cho TensorFlow, giúp việc xây dựng và huấn luyện các mô hình deep learning trở nên dễ dàng và nhanh chóng hơn.</p>
      <h3>3. PyTorch</h3>
      <p>PyTorch, được phát triển bởi Facebook's AI Research lab, nổi tiếng với sự linh hoạt và tốc độ. Nó được ưa chuộng trong giới nghiên cứu nhờ vào tính năng "dynamic computational graph", cho phép thay đổi mô hình một cách linh hoạt trong quá trình chạy.</p>
    `,
  },
  {
    slug: 'fastapi-guide',
    title: 'Xây dựng API hiệu năng cao với FastAPI',
    author: 'Vũ Ngọc Dũng',
    date: '2024-07-12',
    category: 'Web Development',
    description: 'Hướng dẫn xây dựng RESTful API nhanh, hiện đại và dễ bảo trì với FastAPI, tận dụng các tính năng mạnh mẽ như type hints và validation tự động.',
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'api interface',
    content: `
      <h2>FastAPI là gì?</h2>
      <p>FastAPI là một web framework hiện đại, hiệu năng cao để xây dựng các API với Python 3.7+ dựa trên các gợi ý kiểu (type hints) tiêu chuẩn của Python.</p>
      <h2>Các tính năng chính</h2>
      <ul>
        <li><strong>Nhanh:</strong> Hiệu năng rất cao, ngang ngửa với NodeJS và Go (nhờ Starlette và Pydantic).</li>
        <li><strong>Nhanh để code:</strong> Tăng tốc độ phát triển lên khoảng 200% đến 300%.</li>
        <li><strong>Ít lỗi hơn:</strong> Giảm khoảng 40% lỗi do con người gây ra.</li>
        <li><strong>Tài liệu tự động:</strong> Tự động sinh tài liệu API tương tác (sử dụng Swagger UI và ReDoc).</li>
      </ul>
      <h2>Ví dụ cơ bản</h2>
      <pre><code>from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}</code></pre>
      <p>Với FastAPI, việc khai báo, xác thực và tuần tự hóa dữ liệu trở nên cực kỳ đơn giản nhờ Pydantic, giúp bạn tập trung vào logic nghiệp vụ của ứng dụng.</p>
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

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Python Developer (Django)',
    company: 'TechCorp Vietnam',
    location: 'Hồ Chí Minh',
    type: 'Toàn thời gian',
    category: 'Backend',
    description: 'Phát triển và bảo trì các hệ thống backend sử dụng Django. Yêu cầu kinh nghiệm làm việc với REST APIs, PostgreSQL và Docker.',
    companyLogoUrl: 'https://picsum.photos/100/100',
    companyLogoHint: 'T logo',
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'Data Insights Inc.',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    category: 'Data Science',
    description: 'Phân tích dữ liệu lớn để tìm ra các insight kinh doanh. Xây dựng các mô hình dự đoán. Kinh nghiệm với Pandas, Scikit-learn, và các công cụ BI là một lợi thế.',
    companyLogoUrl: 'https://picsum.photos/100/100',
    companyLogoHint: 'D I logo',
  },
  {
    id: '3',
    title: 'Full-stack Developer (React + FastAPI)',
    company: 'Agile Solutions',
    location: 'Đà Nẵng (Remote)',
    type: 'Hợp đồng',
    category: 'Full-stack',
    description: 'Tham gia xây dựng sản phẩm từ đầu đến cuối sử dụng React cho frontend và FastAPI cho backend. Có cơ hội làm việc từ xa.',
    companyLogoUrl: 'https://picsum.photos/100/100',
    companyLogoHint: 'A S logo',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Cloudify Ltd.',
    location: 'Hồ Chí Minh',
    type: 'Toàn thời gian',
    category: 'DevOps',
    description: 'Thiết lập và quản lý hệ thống CI/CD, tự động hóa hạ tầng trên AWS/GCP. Kinh nghiệm với Kubernetes, Terraform và Ansible là bắt buộc.',
    companyLogoUrl: 'https://picsum.photos/100/100',
    companyLogoHint: 'C logo cloud',
  },
];
