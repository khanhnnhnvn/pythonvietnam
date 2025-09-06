
'use client'

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEmployerApplications, approveEmployerApplication, rejectEmployerApplication } from "@/app/actions";
import type { EmployerApplication } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, CheckCircle, XCircle, Eye } from "lucide-react";
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

export default function AdminEmployerApplicationsPage() {
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchApplications = async () => {
    setIsLoading(true);
    const data = await getEmployerApplications();
    setApplications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);
  
  const handleApprove = async (appId: number, userId: string) => {
      setIsProcessing(appId);
      const result = await approveEmployerApplication(appId, userId);
      if (result.success) {
          toast({ title: "Phê duyệt thành công!", description: "Người dùng đã được cấp quyền nhà tuyển dụng."});
          fetchApplications();
      } else {
          toast({ variant: "destructive", title: "Lỗi", description: result.error});
      }
      setIsProcessing(null);
  }
  
  const handleReject = async (appId: number) => {
      setIsProcessing(appId);
      const result = await rejectEmployerApplication(appId);
      if (result.success) {
          toast({ title: "Từ chối thành công!", description: "Đơn đăng ký đã được chuyển sang trạng thái từ chối."});
          fetchApplications();
      } else {
          toast({ variant: "destructive", title: "Lỗi", description: result.error});
      }
      setIsProcessing(null);
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Đã từ chối</Badge>;
      default:
        return <Badge variant="secondary">Đang chờ</Badge>;
    }
  };
  
  const ActionDialog = ({ application }: { application: EmployerApplication}) => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Xem chi tiết</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{application.company_name}</AlertDialogTitle>
            <AlertDialogDescription>
              Đơn đăng ký được gửi bởi <strong>{application.user_name}</strong> ({application.user_email})
              vào ngày {new Date(application.created_at).toLocaleDateString('vi-VN')}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-6 text-sm">
            <div>
              <h4 className="font-semibold">Website</h4>
              <a href={application.website || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {application.website || 'Không cung cấp'}
              </a>
            </div>
            <div>
              <h4 className="font-semibold">Thông tin liên hệ</h4>
              <p className="text-muted-foreground">{application.contact_info}</p>
            </div>
            <div>
              <h4 className="font-semibold">Giới thiệu công ty</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{application.company_introduction}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
             {application.status === 'pending' && (
                <>
                 <Button variant="destructive" onClick={() => handleReject(application.id)} disabled={isProcessing === application.id}>
                    {isProcessing === application.id ? <LoaderCircle className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4"/>}
                    <span className="ml-2">Từ chối</span>
                </Button>
                 <Button onClick={() => handleApprove(application.id, application.user_id)} disabled={isProcessing === application.id}>
                    {isProcessing === application.id ? <LoaderCircle className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4"/>}
                    <span className="ml-2">Duyệt</span>
                </Button>
                </>
             )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )

  if (isLoading) {
      return (
          <div className="flex items-center justify-center p-8">
              <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duyệt đơn đăng ký tuyển dụng</CardTitle>
        <CardDescription>Xem xét và phê duyệt các yêu cầu để trở thành nhà tuyển dụng.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Công ty</TableHead>
              <TableHead>Người đăng ký</TableHead>
              <TableHead>Ngày gửi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <div>{app.company_name}</div>
                    <a href={app.website || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline">
                        {app.website}
                    </a>
                  </TableCell>
                  <TableCell>
                     <div>{app.user_name}</div>
                     <div className="text-xs text-muted-foreground">{app.user_email}</div>
                  </TableCell>
                  <TableCell>{new Date(app.created_at).toLocaleDateString('vi-VN')}</TableCell>
                   <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <ActionDialog application={app} />
                         {app.status === 'pending' && (
                             <>
                                <Button variant="outline" size="sm" onClick={() => handleApprove(app.id, app.user_id)} disabled={isProcessing === app.id} className="hidden sm:flex">
                                    {isProcessing === app.id ? <LoaderCircle className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4"/>}
                                    <span className="ml-2">Duyệt</span>
                                </Button>
                                 <Button variant="destructive" size="sm" onClick={() => handleReject(app.id)} disabled={isProcessing === app.id} className="hidden sm:flex">
                                    {isProcessing === app.id ? <LoaderCircle className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4"/>}
                                    <span className="ml-2">Từ chối</span>
                                </Button>
                             </>
                         )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Không có đơn đăng ký nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
