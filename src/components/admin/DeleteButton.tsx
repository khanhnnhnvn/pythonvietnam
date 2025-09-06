
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LoaderCircle } from 'lucide-react';


interface DeleteButtonProps {
  itemId: number;
  action: (id: number) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  triggerText?: string;
  className?: string;
}

export default function DeleteButton({
  itemId,
  action,
  onSuccess,
  triggerText = "Xóa",
  className
}: DeleteButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await action(itemId);
      if (result.success) {
        toast({
          title: 'Xóa thành công!',
          description: `Mục đã được xóa khỏi hệ thống.`,
        });
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
        setIsOpen(false);
      } else {
        throw new Error(result.error || 'Lỗi không xác định.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Xóa thất bại',
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className={className || "w-full text-left text-destructive"}>
            {triggerText}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể được hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi máy chủ.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Tiếp tục xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    