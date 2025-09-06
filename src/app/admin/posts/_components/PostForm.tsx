"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { postFormSchema, type PostFormData, type BlogPost } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { createPost, updatePost, uploadFile } from "@/app/actions";
import { generateSlug } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Upload } from "lucide-react";

interface PostFormProps {
  post?: BlogPost | null;
  authorName?: string | null;
}

export default function PostForm({ post, authorName }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!post;

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      author: post?.author ?? authorName ?? "",
      category: post?.category ?? "",
      description: post?.description ?? "",
      content: post?.content ?? "",
      imageUrl: post?.imageUrl ?? "",
      imageHint: post?.imageHint ?? "",
    },
  });

  const titleValue = form.watch("title");
  const imageUrlValue = form.watch("imageUrl");

  useEffect(() => {
    if (!isEditMode && titleValue) {
      const slug = generateSlug(titleValue);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, isEditMode, form]);

  useEffect(() => {
    if (authorName) {
      form.setValue("author", authorName);
    }
  }, [authorName, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadFile(formData);
      if (result.success && result.url) {
        form.setValue('imageUrl', result.url, { shouldValidate: true });
        toast({
          title: "Thành công!",
          description: "Đã tải ảnh lên thành công.",
        });
      } else {
        throw new Error(result.error || 'Lỗi không xác định khi tải ảnh lên.');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Tải ảnh lên thất bại",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data: PostFormData) {
    setIsSubmitting(true);
    try {
      const result = isEditMode
        ? await updatePost(post.id, data)
        : await createPost(data);

      if (result.success) {
        toast({
          title: "Thành công!",
          description: `Đã ${isEditMode ? 'cập nhật' : 'tạo'} bài viết thành công.`,
        });
        router.push("/admin/posts");
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Sửa bài viết" : "Tạo bài viết mới"}</CardTitle>
        <CardDescription>Điền thông tin chi tiết cho bài viết của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề bài viết" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden fields for slug and author */}
            <FormField control={form.control} name="slug" render={({ field }) => <Input type="hidden" {...field} />} />
            <FormField control={form.control} name="author" render={({ field }) => <Input type="hidden" {...field} />} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Web Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gợi ý tìm ảnh (AI Hint)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: code editor" {...field} />
                    </FormControl>
                     <FormDescription>Mô tả ngắn gọn về ảnh để AI nhận diện (tối đa 2 từ).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
             <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Hình ảnh đại diện</FormLabel>
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
                      {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
                    </Button>
                    {imageUrlValue && (
                        <div className="relative h-20 w-32 rounded-md border">
                            <Image src={imageUrlValue} alt="Preview" fill className="rounded-md object-cover"/>
                        </div>
                    )}
                  </div>
                  <FormDescription>URL ảnh sẽ được tự động cập nhật sau khi tải lên.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngắn</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Một mô tả ngắn gọn về bài viết..." className="resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nội dung chi tiết của bài viết (hỗ trợ HTML)" className="resize-y min-h-[250px]" {...field} />
                  </FormControl>
                  <FormDescription>Bạn có thể sử dụng các thẻ HTML để định dạng.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Lưu thay đổi" : "Tạo bài viết"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
