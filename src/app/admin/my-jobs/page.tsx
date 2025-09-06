
'use client'
import Link from "next/link";
import { PlusCircle, MoreHorizontal, User } from "lucide-react";
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
import { getJobs, deleteJob } from "@/app/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Job } from "@/lib/types";
import { LoaderCircle } from "lucide-react";

export default function MyJobsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      getJobs({ userId: user.uid })
        .then(setJobs)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Việc làm đã đăng</CardTitle>
            <CardDescription>Quản lý các tin tuyển dụng bạn đã đăng.</CardDescription>
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
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                  <TableCell>
                    <Link href={`/admin/jobs/${job.id}/applicants`} className="flex items-center gap-2">
                       <Badge variant={job.application_count && job.application_count > 0 ? "default" : "secondary"}>
                        <User className="mr-1 h-3 w-3" />
                        {job.application_count || 0}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Bạn chưa đăng tin tuyển dụng nào.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

