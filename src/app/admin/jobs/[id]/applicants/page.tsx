
import { getApplicationsByJobId, getJobById } from "@/app/actions";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function JobApplicantsPage({ params }: { params: { id: string } }) {
  const jobId = parseInt(params.id, 10);
  if (isNaN(jobId)) {
    notFound();
  }

  const job = await getJobById(jobId);
  const applications = await getApplicationsByJobId(jobId);

  if (!job) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ứng viên cho vị trí: {job.title}</CardTitle>
        <CardDescription>
          Tổng cộng có <Badge variant="secondary">{applications.length}</Badge> hồ sơ ứng tuyển.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên ứng viên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Số điện thoại</TableHead>
              <TableHead className="hidden md:table-cell">Ngày nộp</TableHead>
              <TableHead className="text-right">CV</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{app.phone || 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(app.created_at).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={app.cv_url} target="_blank" download>
                        <Download className="mr-2 h-4 w-4" />
                        Tải xuống
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Chưa có ứng viên nào cho vị trí này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    