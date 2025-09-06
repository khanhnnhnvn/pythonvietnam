
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createEmployerApplication } from "@/app/actions";
import { employerApplicationFormSchema, type EmployerApplicationFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EmployerRegistrationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmployerApplicationFormData>({
    resolver: zodResolver(employerApplicationFormSchema),
    defaultValues: {
      user_id: user?.uid ?? '',
      company_name: "",
      website: "",
      company_introduction: "",
      contact_info: "",
    },
  });

  useEffect(() => {
    if (user && !form.getValues('user_id')) {
      form.setValue('user_id', user.uid);
    }
     if (!isAuthLoading && !user) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: "Bạn cần đăng nhập để thực hiện chức năng này.",
      });
      router.push('/');
    }
  }, [user, form, isAuthLoading, router, toast]);

  const onSubmit = async (data: EmployerApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createEmployerApplication(data);
      if (result.success) {
        toast({
          title: "Gửi đơn thành công!",
          description: "Yêu cầu của bạn đã được gửi đi. Chúng tôi sẽ xem xét và phản hồi sớm.",
        });
        router.push('/');
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
  
  if (isAuthLoading) {
      return (
         <div className="flex h-64 items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>
      )
  }
  
  if (user && user.role !== 'user') {
      return (
          <Alert>
              <AlertTitle>Thông báo</AlertTitle>
              <AlertDescription>
                  Tài khoản của bạn đã được cấp quyền {user.role === 'admin' ? 'Quản trị viên' : 'Nhà tuyển dụng'}. Bạn không cần thực hiện thao tác này.
              </AlertDescription>
          </Alert>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên công ty</FormLabel>
              <FormControl>
                <Input placeholder="Công ty Cổ phần Công nghệ ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Tùy chọn)</FormLabel>
              <FormControl>
                <Input placeholder="https://abctech.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thông tin liên hệ</FormLabel>
              <FormControl>
                <Input placeholder="Email hoặc số điện thoại của phòng nhân sự" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu công ty</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[150px]"
                  placeholder="Giới thiệu về lĩnh vực hoạt động, văn hóa và các dự án nổi bật của công ty..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => <Input type="hidden" {...field} />}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" />
            Gửi đơn đăng ký
          </Button>
        </div>
      </form>
    </Form>
  );
}
