
import Link from "next/link";
import { PlusCircle, MoreHorizontal, User, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getJobs, deleteJob, getUserById } from "@/app/actions";
import { getServerSideUser } from "@/lib/firebase-admin";
import DeleteButton from "@/components/admin/DeleteButton";


export default async function AdminJobsPage() {
  const serverUser = await getServerSideUser();
  const appUser = serverUser ? await getUserById(serverUser.uid) : null;
  const jobs = await getJobs(true);

  const canManageJob = (jobUserId: string) => {
    if (!appUser) return false;
    if (appUser.role === 'admin') return true;
    return appUser.uid === jobUserId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Việc làm</CardTitle>
            <CardDescription>Quản lý các tin tuyển dụng trên hệ thống.</CardDescription>
          </div>
          <Button asChild size="sm" className="gap-1">
            <Link href="/admin/jobs/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Đăng tin mới
              </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chức danh</TableHead>
              <TableHead>Công ty</TableHead>
              <TableHead className="hidden md:table-cell">Địa điểm</TableHead>
              <TableHead>Ứng viên</TableHead>
              <TableHead>
                <span className="sr-only">Hành động</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                 <TableCell>
                  <Badge variant={job.application_count && job.application_count > 0 ? "default" : "secondary"}>
                    <User className="mr-1 h-3 w-3" />
                    {job.application_count || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  {canManageJob(job.user_id) && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/jobs/${job.id}/applicants`}>Xem ứng viên</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/jobs/edit/${job.id}`}>Sửa</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteButton itemId={job.id} action={deleteJob} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    