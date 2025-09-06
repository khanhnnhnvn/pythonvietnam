
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
  id: number;
  slug: string;
  title: string;
  company: string;
  location: string;
  type: 'Toàn thời gian' | 'Bán thời gian' | 'Hợp đồng';
  category: string;
  description: string;
  companyLogoUrl: string;
  companyLogoHint: string;
  created_at: string;
  application_count?: number;
  user_id: string;
}

export interface Application {
    id: number;
    job_id: number;
    name: string;
    email: string;
    phone: string | null;
    cv_url: string;
    created_at: string;
}

export const postFormSchema = z.object({
  title: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự." }),
  slug: z.string().min(5, { message: "Slug phải có ít nhất 5 ký tự." }).regex(/^[a-z0-9-]+$/, { message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang." }),
  author: z.string().min(1, { message: "Tên tác giả là bắt buộc." }),
  category: z.string().min(1, { message: "Vui lòng nhập danh mục." }),
  description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự." }),
  content: z.string().min(50, { message: "Nội dung phải có ít nhất 50 ký tự." }),
  imageUrl: z.string().min(1, "Vui lòng tải lên một hình ảnh."),
  imageHint: z.string().max(40, { message: "Gợi ý ảnh không được quá 40 ký tự."}).optional(),
});

export type PostFormData = z.infer<typeof postFormSchema>;

export const jobFormSchema = z.object({
  user_id: z.string().min(1, { message: "User ID is required." }),
  title: z.string().min(5, { message: "Chức danh phải có ít nhất 5 ký tự." }),
  slug: z.string().min(1, { message: "Slug không được để trống." }),
  company: z.string().min(2, { message: "Tên công ty là bắt buộc." }),
  location: z.string().min(2, { message: "Địa điểm là bắt buộc." }),
  type: z.enum(['Toàn thời gian', 'Bán thời gian', 'Hợp đồng']),
  category: z.string().min(2, { message: "Lĩnh vực là bắt buộc." }),
  description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự." }),
  companyLogoUrl: z.string().optional(),
  companyLogoHint: z.string().max(40, { message: "Gợi ý ảnh không được quá 40 ký tự."}).optional(),
});

export type JobFormData = z.infer<typeof jobFormSchema>;


export const applicationFormSchema = z.object({
  jobId: z.number(),
  name: z.string().min(2, { message: "Họ và tên là bắt buộc." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  phone: z.string().optional(),
  cvUrl: z.string().min(1, { message: "Vui lòng tải lên CV của bạn." }),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

export const employerApplicationFormSchema = z.object({
    user_id: z.string().min(1, { message: "User ID is required." }),
    company_name: z.string().min(2, { message: "Tên công ty là bắt buộc." }),
    website: z.string().url({ message: "Vui lòng nhập một URL hợp lệ." }).optional().or(z.literal('')),
    company_introduction: z.string().min(20, { message: "Giới thiệu công ty phải có ít nhất 20 ký tự." }),
    contact_info: z.string().min(5, { message: "Thông tin liên hệ là bắt buộc." }),
});

export type EmployerApplicationFormData = z.infer<typeof employerApplicationFormSchema>;

export interface EmployerApplication {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  company_name: string;
  website: string | null;
  company_introduction: string;
  contact_info: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
