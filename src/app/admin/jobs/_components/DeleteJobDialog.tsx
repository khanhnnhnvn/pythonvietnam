'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteJob } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LoaderCircle } from "lucide-react";


interface DeleteJobDialogProps {
    jobId: number;
}

export default function DeleteJobDialog({ jobId }: DeleteJobDialogProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteJob(jobId);
            if (result.success) {
                toast({
                    title: "Thành công!",
                    description: "Đã xóa tin tuyển dụng thành công.",
                });
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
            setIsDeleting(false);
            setIsOpen(false);
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                    Xóa
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn tin tuyển dụng khỏi cơ sở dữ liệu.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
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
    )
}
