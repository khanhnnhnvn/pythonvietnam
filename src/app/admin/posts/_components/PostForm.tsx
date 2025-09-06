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
import { generateBlogPost } from "@/ai/flows/generate-blog-post-flow";
import { fileTypeFromBuffer } from 'file-type';


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { LoaderCircle, Upload, Sparkles } from "lucide-react";


interface PostFormProps {
  post?: BlogPost | null;
  authorName?: string | null;
}

export default function PostForm({ post, authorName }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiKeywords, setAiKeywords] = useState("");
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

  const handleGenerateWithAI = async () => {
    if (!aiKeywords) {
        toast({
            variant: "destructive",
            title: "Thiếu từ khóa",
            description: "Vui lòng nhập từ khóa để AI có thể sáng tạo.",
        });
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generateBlogPost({ keywords: aiKeywords });

        const { blogPost, imageDataUri, imageGenerated } = result;

        // Populate text fields
        form.setValue("title", blogPost.title, { shouldValidate: true });
        form.setValue("description", blogPost.description, { shouldValidate: true });
        form.setValue("category", blogPost.category, { shouldValidate: true });
        form.setValue("content", blogPost.content, { shouldValidate: true });
        form.setValue("imageHint", aiKeywords.split(' ').slice(0, 2).join(' '), { shouldValidate: true });

        // Handle image
        if (imageGenerated) {
            // Handle image upload from data URI
            const imageBuffer = Buffer.from(imageDataUri.split(',')[1], 'base64');
            const type = await fileTypeFromBuffer(imageBuffer);
            if (!type) {
                throw new Error('Không thể xác định loại tệp ảnh.');
            }
            const blob = new Blob([imageBuffer], { type: type.mime });
            const imageFile = new File([blob], `ai-generated-${Date.now()}.${type.ext}`, { type: type.mime });

            const formData = new FormData();
            formData.append('file', imageFile);

            const uploadResult = await uploadFile(formData);
            if (uploadResult.success && uploadResult.url) {
                form.setValue('imageUrl', uploadResult.url, { shouldValidate: true });
            } else {
                throw new Error(uploadResult.error || 'Lỗi không xác định khi tải ảnh AI lên.');
            }
            toast({
                title: "Hoàn tất!",
                description: "AI đã tạo xong bài viết và hình ảnh cho bạn.",
            });
        } else {
            // Use placeholder URL directly
            form.setValue('imageUrl', imageDataUri, { shouldValidate: true });
             toast({
                title: "Đã tạo nội dung thành công!",
                description: "Không thể tạo ảnh bằng AI. Đã sử dụng ảnh placeholder.",
                variant: "default",
                duration: 5000,
            });
        }


    } catch (error: any) {
        console.error("AI Generation Error:", error);
        toast({
            variant: "destructive",
            title: "Lỗi tạo bài viết bằng AI",
            description: error.message,
        });
    } finally {
        setIsGenerating(false);
        // Close the dialog by finding its close button
        document.getElementById('ai-dialog-close')?.click();
    }
  };


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
      // If the image is a placeholder, upload it to our server first
      if (data.imageUrl.startsWith('https://picsum.photos')) {
        const response = await fetch(data.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `placeholder-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('file', file);
        const uploadResult = await uploadFile(formData);
        if (uploadResult.success && uploadResult.url) {
          data.imageUrl = uploadResult.url;
        } else {
          throw new Error('Failed to upload placeholder image to server.');
        }
      }

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
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>{isEditMode ? "Sửa bài viết" : "Tạo bài viết mới"}</CardTitle>
                <CardDescription>Điền thông tin chi tiết cho bài viết của bạn.</CardDescription>
            </div>
            {!isEditMode && (
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Viết bài bằng AI
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo bài viết với AI</DialogTitle>
                            <DialogDescription>
                                Nhập một vài từ khóa về chủ đề bạn muốn viết. AI sẽ tự động tạo tiêu đề, nội dung và cả hình ảnh đại diện cho bạn.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Label htmlFor="ai-keywords">Từ khóa</Label>
                            <Input 
                                id="ai-keywords" 
                                placeholder="Ví dụ: python data science, fastAPI tutorial..." 
                                value={aiKeywords}
                                onChange={(e) => setAiKeywords(e.target.value)}
                                disabled={isGenerating}
                            />
                        </div>
                        <DialogFooter>
                             <DialogClose asChild>
                                <Button type="button" variant="secondary" id="ai-dialog-close">Hủy</Button>
                             </DialogClose>
                            <Button onClick={handleGenerateWithAI} disabled={isGenerating}>
                                {isGenerating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {isGenerating ? "Đang tạo..." : "Tạo bài viết"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
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
