
"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { parseCV } from '@/ai/flows/parse-cv-flow';
import { uploadFile, createApplication } from '@/app/actions';
import { applicationFormSchema, type ApplicationFormData, type Job } from '@/lib/types';
import { fileToDataUri } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Upload, Paperclip, Send } from 'lucide-react';

interface ApplicationDialogProps {
  job: Job;
}

export default function ApplicationDialog({ job }: ApplicationDialogProps) {
  const { toast } = useToast();
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      jobId: job.id,
      name: '',
      email: '',
      phone: '',
      cvUrl: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCvFile(file);
    setIsParsing(true);
    form.setValue('cvUrl', ''); // Clear previous URL

    try {
      // 1. Upload the file to get a URL
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const uploadResult = await uploadFile(uploadFormData);
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || 'Lỗi tải tệp lên.');
      }
      form.setValue('cvUrl', uploadResult.url, { shouldValidate: true });

      // 2. Parse the CV using the data URI
      const dataUri = await fileToDataUri(file);
      const parseResult = await parseCV({ cvDataUri: dataUri });

      if (parseResult) {
        if (parseResult.name) form.setValue('name', parseResult.name, { shouldValidate: true });
        if (parseResult.email) form.setValue('email', parseResult.email, { shouldValidate: true });
        if (parseResult.phone) form.setValue('phone', parseResult.phone, { shouldValidate: true });
        toast({
          title: 'Phân tích CV thành công!',
          description: 'Hệ thống đã tự động điền thông tin từ CV của bạn.',
        });
      } else {
         throw new Error('Không thể phân tích CV.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Đã có lỗi xảy ra',
        description: 'Không thể xử lý CV. Vui lòng điền thông tin thủ công.',
      });
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createApplication(data);
      if (result.success) {
        toast({
          title: 'Nộp đơn thành công!',
          description: 'Hồ sơ của bạn đã được gửi đến nhà tuyển dụng.',
        });
        setIsOpen(false);
        form.reset();
        setCvFile(null);
      } else {
        throw new Error(result.error || 'Lỗi không xác định.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Nộp đơn thất bại',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 md:w-auto">
          Ứng tuyển
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Ứng tuyển vị trí {job.title}</DialogTitle>
          <DialogDescription>
            Tải lên CV của bạn để hệ thống tự động điền thông tin, hoặc bạn có thể nhập thủ công.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel>Tải lên CV</FormLabel>
              <div className="mt-2 flex items-center gap-4">
                 <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsing}
                >
                    {isParsing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {isParsing ? "Đang xử lý..." : "Chọn tệp CV"}
                </Button>
                 {cvFile && !isParsing && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        <span>{cvFile.name}</span>
                    </div>
                )}
              </div>
               <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nguyenvana@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="0987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="cvUrl" render={({ field }) => <Input type="hidden" {...field} />} />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isParsing || isSubmitting}>
                {(isParsing || isSubmitting) && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Gửi hồ sơ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
