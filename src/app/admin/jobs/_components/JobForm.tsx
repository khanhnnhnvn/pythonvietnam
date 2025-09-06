
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { jobFormSchema, type JobFormData, type Job } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { createJob, updateJob, uploadFile } from "@/app/actions";
import { generateSlug } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle, Upload } from "lucide-react";


interface JobFormProps {
  job?: Job | null;
  userId?: string;
}

export default function JobForm({ job, userId }: JobFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!job;

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job?.title ?? "",
      slug: job?.slug ?? "",
      company: job?.company ?? "",
      location: job?.location ?? "",
      type: job?.type ?? 'Toàn thời gian',
      category: job?.category ?? "",
      description: job?.description ?? "",
      companyLogoUrl: job?.companyLogoUrl ?? "",
      companyLogoHint: job?.companyLogoHint ?? "",
      user_id: job?.user_id ?? userId ?? "",
    },
  });

  const titleValue = form.watch("title");
  const logoUrlValue = form.watch("companyLogoUrl");

  useEffect(() => {
    if (!isEditMode && titleValue) {
      const slug = generateSlug(titleValue);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, isEditMode, form]);

  useEffect(() => {
    if (userId && !form.getValues('user_id')) {
        form.setValue('user_id', userId);
    }
  }, [userId, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadFile(formData);
      if (result.success && result.url) {
        form.setValue('companyLogoUrl', result.url, { shouldValidate: true });
        toast({
          title: "Thành công!",
          description: "Đã tải logo lên thành công.",
        });
      } else {
        throw new Error(result.error || 'Lỗi không xác định khi tải logo lên.');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Tải logo lên thất bại",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data: JobFormData) {
    if (!data.user_id) {
        toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
      const result = isEditMode
        ? await updateJob(job.id, data)
        : await createJob(data);

      if (result.success) {
        toast({
          title: "Thành công!",
          description: `Đã ${isEditMode ? 'cập nhật' : 'tạo'} tin tuyển dụng thành công.`,
        });
        router.push("/admin/jobs");
        router.refresh();
      } else {
        toast({
            variant: "destructive",
            title: "Đã có lỗi xảy ra",
            description: result.error || "Thao tác thất bại. Vui lòng thử lại."
        });
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Sửa tin tuyển dụng" : "Tạo tin tuyển dụng mới"}</CardTitle>
        <CardDescription>Điền thông tin chi tiết cho tin tuyển dụng.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Chức danh</FormLabel>
                    <FormControl>
                        <Input placeholder="Ví dụ: Senior Python Developer" {...field} />
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
                        <Input placeholder="Ví dụ: TechCorp Vietnam" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField control={form.control} name="slug" render={({ field }) => <Input type="hidden" {...field} />} />
            <FormField control={form.control} name="user_id" render={({ field }) => <Input type="hidden" {...field} />} />


             <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Địa điểm</FormLabel>
                        <FormControl>
                            <Input placeholder="Ví dụ: Hồ Chí Minh" {...field} />
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
                                    <SelectValue placeholder="Chọn loại hình làm việc" />
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
                                <Input placeholder="Ví dụ: Backend, Data Science" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="companyLogoUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Logo công ty</FormLabel>
                   <FormControl>
                    <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={isUploading} />
                  </FormControl>
                  <div className="flex items-center gap-4">
                     <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      {isUploading ? "Đang tải lên..." : "Tải logo lên"}
                    </Button>
                    {logoUrlValue && (
                        <div className="relative h-20 w-20 rounded-md border p-1">
                            <Image src={logoUrlValue} alt="Preview" fill className="rounded-md object-contain"/>
                        </div>
                    )}
                  </div>
                  <FormDescription>URL logo sẽ được tự động cập nhật sau khi tải lên.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogoHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gợi ý tìm logo (AI Hint)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: blue bird logo" {...field} />
                  </FormControl>
                    <FormDescription>Mô tả ngắn gọn về logo để AI nhận diện (tối đa 2 từ).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết về công việc, yêu cầu..." className="resize-y min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Lưu thay đổi" : "Tạo việc làm"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
