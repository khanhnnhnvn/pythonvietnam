import Link from "next/link";
import { getJobs } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteJobDialog from "./_components/DeleteJobDialog";

export default async function AdminJobsPage() {
  const jobs = await getJobs();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý Việc làm</CardTitle>
            <CardDescription>Thêm, sửa, hoặc xóa tin tuyển dụng trên trang của bạn.</CardDescription>
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
              <TableHead className="hidden md:table-cell">Địa điểm</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {job.company}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{job.location}</TableCell>
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
                          <Link href={`/admin/jobs/${job.id}/edit`}>Sửa</Link>
                        </DropdownMenuItem>
                        <DeleteJobDialog jobId={job.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
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
