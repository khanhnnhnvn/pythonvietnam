
import Link from "next/link";
import { getJobs } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Users, Pencil } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import DeleteJobDialog from "./_components/DeleteJobDialog";
import type { Job } from "@/lib/types";

// Define AppUser type for the props, passed from layout
type AppUser = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
  role?: string;
};

interface AdminJobsPageProps {
  user?: AppUser;
}

export default async function AdminJobsPage({ user }: AdminJobsPageProps) {
  // Pass true to getJobs to enable permission checks on the server.
  // The server will return all jobs for admins, and only user-specific jobs for others.
  const jobsToDisplay = await getJobs(true);
  
  const appUser = user;

  // This client-side check determines if the action buttons should be enabled.
  // The ultimate security check is still on the server-side actions.
  const canManageJob = (job: Job) => {
    if (!appUser) return false;
    // Admin can manage any job
    if (appUser.role === 'admin') return true;
    // Non-admin users can only manage their own jobs
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
                    {canManageJob(job) ? (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/jobs/${job.id}/applicants`}>
                                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">
                                    {job.application_count ?? 0}
                                </Badge>
                            </Link>
                        </Button>
                    ) : (
                         <Badge variant="outline" className="cursor-not-allowed">
                            {job.application_count ?? 0}
                        </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!canManageJob(job)}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                         <DropdownMenuItem asChild>
                           <Link href={`/admin/jobs/${job.id}/applicants`} className="flex items-center gap-2 cursor-pointer">
                            <Users className="w-4 h-4" /> Xem ứng viên
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/jobs/${job.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                            <Pencil className="w-4 h-4" /> Sửa
                          </Link>
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
