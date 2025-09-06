import Link from "next/link";
import { getJobs, getUserById } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Users, Shield, Lock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import DeleteJobDialog from "./_components/DeleteJobDialog";
import { getServerSideUser } from "@/lib/firebase-admin";
import type { Job } from "@/lib/types";

export default async function AdminJobsPage() {
  const allJobs = await getJobs();
  const user = await getServerSideUser();
  const appUser = user ? await getUserById(user.uid) : null;
  
  const jobsToDisplay = appUser?.role === 'admin' 
    ? allJobs
    : allJobs.filter(job => job.user_id === user?.uid);

  const canEditOrDelete = (job: Job) => {
    if (!appUser) return false;
    if (appUser.role === 'admin') return true;
    return job.user_id === appUser.uid;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý Việc làm</CardTitle>
            <CardDescription>
              {appUser?.role === 'admin'
                ? 'Thêm, sửa, hoặc xóa tất cả tin tuyển dụng.'
                : 'Quản lý các tin tuyển dụng bạn đã đăng.'
              }
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/jobs/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm việc làm
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chức danh</TableHead>
              <TableHead className="hidden md:table-cell">Công ty</TableHead>
              <TableHead className="hidden sm:table-cell">Địa điểm</TableHead>
              <TableHead className="text-center">Ứng viên</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobsToDisplay.length > 0 ? (
              jobsToDisplay.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {job.company}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{job.location}</TableCell>
                   <TableCell className="text-center">
                    {canEditOrDelete(job) ? (
                        <Link href={`/admin/jobs/${job.id}/applicants`}>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">
                                {job.application_count ?? 0}
                            </Badge>
                        </Link>
                    ) : (
                        <Badge variant="outline" className="cursor-not-allowed">
                            <Lock className="h-3 w-3"/>
                        </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!canEditOrDelete(job)}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                         <DropdownMenuItem asChild>
                           <Link href={`/admin/jobs/${job.id}/applicants`} className="flex items-center gap-2">
                            <Users /> Xem ứng viên
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/jobs/${job.id}/edit`}>Sửa</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteJobDialog jobId={job.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Chưa có tin tuyển dụng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    