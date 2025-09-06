import { z } from "zod";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  created_at: string;
}

export type JobCategory = 'Frontend' | 'Backend' | 'Full-stack' | 'DevOps' | 'Data Science' | 'Machine Learning';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Toàn thời gian' | 'Bán thời gian' | 'Hợp đồng';
  category: JobCategory;
  description: string;
  companyLogoUrl: string;
  companyLogoHint: string;
}

export const postFormSchema = z.object({
  title: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự." }),
  slug: z.string().min(5, { message: "Slug phải có ít nhất 5 ký tự." }).regex(/^[a-z0-9-]+$/, { message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang." }),
  author: z.string().min(1, { message: "Tên tác giả là bắt buộc." }),
  category: z.string().min(1, { message: "Vui lòng nhập danh mục." }),
  description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự." }),
  content: z.string().min(50, { message: "Nội dung phải có ít nhất 50 ký tự." }),
  imageUrl: z.string().url({ message: "URL hình ảnh không hợp lệ." }).min(1, { message: "Vui lòng tải lên một hình ảnh." }),
  imageHint: z.string().max(40, { message: "Gợi ý ảnh không được quá 40 ký tự."}).optional(),
});

export type PostFormData = z.infer<typeof postFormSchema>;
