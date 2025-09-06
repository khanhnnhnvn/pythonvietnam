"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { generateBlogPost } from "@/ai/flows/generate-blog-post-flow";
import { createPost, updatePost, uploadFile } from "@/app/actions";
import { postFormSchema, type PostFormData, type BlogPost } from "@/lib/types";
import { generateSlug, fileToDataUri } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Wand2 } from "lucide-react";
import Image from "next/image";

interface PostFormProps {
  post?: BlogPost;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: post
      ? {
          ...post,
          imageHint: post.imageHint ?? "",
        }
      : {
          title: "",
          slug: "",
          author: "Python Vietnam",
          category: "",
          description: "",
          content: "",
          imageUrl: "",
          imageHint: "",
        },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    const slug = generateSlug(title);
    form.setValue("slug", slug);
  };
  
  const handleGeneratePost = async () => {
      const keywords = form.getValues("title");
      if (!keywords) {
          toast({
              variant: "destructive",
              title: "Vui lòng nhập tiêu đề",
              description: "Tiêu đề sẽ được dùng làm từ khóa để tạo bài viết.",
          });
          return;
      }
      setIsGenerating(true);
      try {
          const result = await generateBlogPost({ keywords });
          const { blogPost, imageDataUri } = result;

          form.setValue("title", blogPost.title);
          form.setValue("slug", generateSlug(blogPost.title));
          form.setValue("description", blogPost.description);
          form.setValue("category", blogPost.category);
          form.setValue("content", blogPost.content, { shouldValidate: true });
          form.setValue("imageUrl", imageDataUri);

          // Set preview for the generated image
          setImagePreview(imageDataUri);
          setImageFile(null); // Clear any previously selected file

          toast({
              title: "Tạo bài viết thành công!",
              description: "Nội dung và hình ảnh đã được tạo bằng AI.",
          });

      } catch (error) {
          console.error("Failed to generate blog post:", error);
          toast({
              variant: "destructive",
              title: "Lỗi tạo bài viết",
              description: "Đã có lỗi xảy ra khi tạo bài viết bằng AI.",
          });
      } finally {
          setIsGenerating(false);
      }
  };


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);

    try {
      let imageUrl = data.imageUrl ?? post?.imageUrl ?? "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadResult = await uploadFile(formData);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || "Tải ảnh lên thất bại.");
        }
      } else if (imagePreview && imagePreview.startsWith('data:')) {
          // Handle AI-generated image that hasn't been uploaded
          imageUrl = imagePreview;
      }

      if (!imageUrl) {
          toast({
            variant: "destructive",
            title: "Thiếu hình ảnh",
            description: "Vui lòng cung cấp hình ảnh cho bài viết.",
          });
          setIsSubmitting(false);
          return;
      }
      
      const finalData = { ...data, imageUrl };

      const result = post
        ? await updatePost(post.id, finalData)
        : await createPost(finalData);

      if (result.success) {
        toast({
          title: post ? "Cập nhật thành công!" : "Tạo thành công!",
          description: "Bài viết của bạn đã được lưu.",
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-end">
            <Button type="button" onClick={handleGeneratePost} disabled={isGenerating}>
                {isGenerating ? <LoaderCircle className="animate-spin" /> : <Wand2 />}
                <span className="ml-2">Tạo nội dung với AI</span>
            </Button>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Hướng dẫn sử dụng Next.js 14"
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
                <Input placeholder="e.g. huong-dan-su-dung-nextjs-14" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tác giả</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Web Development" {...field} />
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
              <FormLabel>Mô tả ngắn</FormLabel>
              <FormControl>
                <Textarea placeholder="Một mô tả ngắn gọn, hấp dẫn cho bài viết..." {...field} />
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
                 <Textarea className="min-h-[250px]" placeholder="Nội dung chi tiết của bài viết..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh đại diện</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </FormControl>
              {imagePreview && (
                <div className="mt-4">
                  <Image
                    src={imagePreview}
                    alt="Xem trước ảnh"
                    width={200}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gợi ý ảnh (AI Hint)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. abstract code" {...field} />
              </FormControl>
              <FormDescription>
                Từ khóa ngắn gọn (1-2 từ) để mô tả ảnh, giúp AI tìm ảnh thay thế nếu cần.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || isGenerating}>
                {(isSubmitting || isGenerating) && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {post ? "Cập nhật" : "Tạo bài viết"}
            </Button>
        </div>
      </form>
    </Form>
  );
}