
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createJob, updateJob, uploadFile } from "@/app/actions";
import { jobFormSchema, type JobFormData, type Job } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import RichTextEditor from "../common/RichTextEditor";

interface JobFormProps {
  job?: Job;
}

export default function JobForm({ job }: JobFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(job?.companyLogoUrl ?? null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      user_id: job?.user_id ?? user?.uid ?? '',
      title: job?.title ?? "",
      slug: job?.slug ?? "",
      company: job?.company ?? "",
      location: job?.location ?? "",
      type: job?.type ?? "Toàn thời gian",
      category: job?.category ?? "",
      description: job?.description ?? "",
      companyLogoUrl: job?.companyLogoUrl ?? "",
      companyLogoHint: job?.companyLogoHint ?? "",
    },
  });
  
  useEffect(() => {
    if (user && !form.getValues('user_id')) {
        form.setValue('user_id', user.uid);
    }
  }, [user, form]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    const slug = generateSlug(title);
    form.setValue("slug", slug);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };
  
  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);

    if (!data.user_id) {
        toast({ variant: "destructive", title: "Lỗi", description: "Không tìm thấy thông tin người dùng." });
        setIsSubmitting(false);
        return;
    }

    try {
      let companyLogoUrl = data.companyLogoUrl ?? job?.companyLogoUrl ?? "";

      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const uploadResult = await uploadFile(formData);
        if (uploadResult.success && uploadResult.url) {
          companyLogoUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || "Tải logo lên thất bại.");
        }
      }
      
      const finalData = { ...data, companyLogoUrl };

      const result = job
        ? await updateJob(job.id, finalData)
        : await createJob(finalData);

      if (result.success) {
        toast({
          title: job ? "Cập nhật thành công!" : "Tạo thành công!",
          description: "Tin tuyển dụng của bạn đã được lưu.",
        });
        router.push("/admin/jobs");
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Đã có lỗi xảy ra",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chức danh</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Senior Python Developer"
                  {...field}
                  onChange={handleTitleChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="e.g. senior-python-developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên công ty</FormLabel>
              <FormControl>
                <Input placeholder="e.g. TechCorp Vietnam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa điểm</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Hồ Chí Minh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại hình</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại hình công việc" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Toàn thời gian">Toàn thời gian</SelectItem>
                        <SelectItem value="Bán thời gian">Bán thời gian</SelectItem>
                        <SelectItem value="Hợp đồng">Hợp đồng</SelectItem>
                    </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lĩnh vực</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Backend Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả công việc</FormLabel>
              <FormControl>
                 <RichTextEditor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyLogoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo công ty</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleLogoChange} />
              </FormControl>
              {logoPreview && (
                <div className="mt-4">
                  <Image
                    src={logoPreview}
                    alt="Xem trước logo"
                    width={100}
                    height={100}
                    className="rounded-md object-contain border p-2"
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyLogoHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gợi ý logo (AI Hint)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. T logo" {...field} />
              </FormControl>
              <FormDescription>
                Từ khóa ngắn gọn (1-2 từ) để mô tả logo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {job ? "Cập nhật" : "Đăng tin"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
